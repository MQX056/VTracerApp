#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VTracer Local Web App - Fully Offline
A modern dark-themed local web application for bitmap-to-vector conversion.
Uses only Python standard library - no external dependencies.
No deprecated/removed modules (cgi removed in Python 3.13).
"""

import os
import re
import json
import shutil
import subprocess
import sys
import urllib.parse

# Disable __pycache__ generation
sys.dont_write_bytecode = True
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Configuration
APP_DIR = Path(__file__).parent.resolve()
UPLOAD_DIR = APP_DIR / "uploads"
STATIC_DIR = APP_DIR / "static"
TEMPLATES_DIR = APP_DIR
VTRACER_EXE = APP_DIR / "vtracer.exe"
HOST = "127.0.0.1"
PORT = 8765

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".ico": "image/x-icon",
}

ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}


def parse_multipart(body: bytes, boundary: str):
    """Parse multipart/form-data body without using the deprecated cgi module.
    
    Returns a dict: {field_name: { 'value': str (for text fields) or 'filename': str, 'data': bytes (for file fields) }}
    Also returns the 'image' file data and text fields separately.
    """
    boundary_bytes = boundary.encode("utf-8") if isinstance(boundary, str) else boundary
    delimiter = b"--" + boundary_bytes
    delimiter_end = delimiter + b"--"

    file_data = None
    file_name = None
    text_values = {}

    parts = body.split(delimiter)
    for part in parts:
        part = part.strip(b"\r\n")
        if not part or part == b"--":
            continue
        if part.startswith(b"--"):
            continue

        # Split headers and body
        header_end = part.find(b"\r\n\r\n")
        if header_end == -1:
            continue

        header_section = part[:header_end].decode("utf-8", errors="replace")
        data_bytes = part[header_end + 4:]

        # Remove trailing \r\n
        if data_bytes.endswith(b"\r\n"):
            data_bytes = data_bytes[:-2]

        # Parse Content-Disposition header
        name_match = re.search(r'name="([^"]*)"', header_section)
        filename_match = re.search(r'filename="([^"]*)"', header_section)

        field_name = name_match.group(1) if name_match else None
        if not field_name:
            continue

        if filename_match:
            fn = filename_match.group(1)
            if fn:
                file_name = fn
                file_data = data_bytes
        else:
            try:
                text_values[field_name] = data_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text_values[field_name] = data_bytes.decode("utf-8", errors="replace")

    return text_values, file_data, file_name


class VTracerHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def send_file_response(self, file_path, status=200):
        file_path = Path(file_path)
        if not file_path.exists():
            self.send_error(404, "File not found")
            return

        suffix = file_path.suffix.lower()
        content_type = MIME_TYPES.get(suffix, "application/octet-stream")

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        if suffix == ".html":
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        else:
            self.send_header("Cache-Control", "public, max-age=3600")
        self.end_headers()

        with open(file_path, "rb") as f:
            shutil.copyfileobj(f, self.wfile)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self.send_file_response(TEMPLATES_DIR / "index.html")
        elif path == "/favicon.ico":
            self._send_favicon()
        elif path.startswith("/static/"):
            file_path = STATIC_DIR / path[8:]
            try:
                file_path.resolve().relative_to(STATIC_DIR.resolve())
                self.send_file_response(file_path)
            except ValueError:
                self.send_error(403, "Forbidden")
        else:
            self.send_error(404, "Not found")

    def _send_favicon(self):
        svg = (b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
               b'<rect width="32" height="32" rx="6" fill="#0a0a0f"/>'
               b'<path d="M16 4L4 11l12 6 12-6-12-6z" fill="#60a5fa"/>'
               b'<path d="M4 22l12 6 12-6" fill="#a78bfa"/>'
               b'<path d="M4 16l12 6 12-6" fill="#818cf8"/>'
               b'</svg>')
        self.send_response(200)
        self.send_header("Content-Type", "image/svg+xml")
        self.send_header("Cache-Control", "public, max-age=86400")
        self.end_headers()
        self.wfile.write(svg)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/convert":
            self.handle_convert()
        else:
            self.send_error(404, "Not found")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def handle_convert(self):
        try:
            content_type = self.headers.get("Content-Type", "")
            if not content_type.startswith("multipart/form-data"):
                self.send_json_response({"success": False, "error": "Invalid content type"}, 400)
                return

            # Extract boundary
            boundary_match = re.search(r'boundary=([^;\s]+)', content_type)
            if not boundary_match:
                self.send_json_response({"success": False, "error": "No boundary found"}, 400)
                return

            boundary = boundary_match.group(1)
            # boundary may be quoted
            if boundary.startswith('"') and boundary.endswith('"'):
                boundary = boundary[1:-1]

            # Read body
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)

            # Parse multipart
            try:
                text_values, file_data, file_name = parse_multipart(body_bytes, boundary)
            except Exception as parse_err:
                print(f"[ERROR] Multipart parse failed: {parse_err}")
                self.send_json_response({"success": False, "error": f"Parse error: {parse_err}"}, 400)
                return

            if file_data is None:
                self.send_json_response({"success": False, "error": "No image uploaded"}, 400)
                return

            if not file_name:
                self.send_json_response({"success": False, "error": "Empty filename"}, 400)
                return

            # Get options
            colormode = text_values.get("colormode", "bw")
            color_precision = text_values.get("color_precision", "6")
            corner_threshold = text_values.get("corner_threshold", "60")
            filter_speckle = text_values.get("filter_speckle", "4")
            gradient_step = text_values.get("gradient_step", "0")
            mode = text_values.get("mode", "spline")
            hierarchical = text_values.get("hierarchical", "stacked")
            segment_length = text_values.get("segment_length", "4")
            splice_threshold = text_values.get("splice_threshold", "45")
            path_precision = text_values.get("path_precision", "8")

            # Validate extension
            input_ext = Path(file_name).suffix.lower()
            if input_ext not in ALLOWED_EXT:
                self.send_json_response({"success": False, "error": "Unsupported image format"}, 400)
                return

            UPLOAD_DIR.mkdir(exist_ok=True)
            input_path = UPLOAD_DIR / f"input_{os.urandom(4).hex()}{input_ext}"
            output_path = UPLOAD_DIR / f"output_{os.urandom(4).hex()}.svg"

            with open(input_path, "wb") as f:
                f.write(file_data)

            # Build vtracer command
            cmd = [
                str(VTRACER_EXE),
                "--input", str(input_path),
                "--output", str(output_path),
                "--colormode", colormode,
                "--color_precision", color_precision,
                "--corner_threshold", corner_threshold,
                "--filter_speckle", filter_speckle,
                "--gradient_step", gradient_step,
                "--mode", mode,
                "--hierarchical", hierarchical,
                "--segment_length", segment_length,
                "--splice_threshold", splice_threshold,
                "--path_precision", path_precision,
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60,
            )

            if result.returncode != 0:
                error_msg = result.stderr.strip() or result.stdout.strip() or "Unknown error"
                self.send_json_response({"success": False, "error": error_msg}, 500)
                input_path.unlink(missing_ok=True)
                output_path.unlink(missing_ok=True)
                return

            if not output_path.exists():
                self.send_json_response({"success": False, "error": "Output file not generated"}, 500)
                input_path.unlink(missing_ok=True)
                return

            svg_content = output_path.read_text(encoding="utf-8")

            input_path.unlink(missing_ok=True)
            output_path.unlink(missing_ok=True)

            self.send_json_response({
                "success": True,
                "svg": svg_content,
            })

        except subprocess.TimeoutExpired:
            self.send_json_response({"success": False, "error": "Conversion timed out"}, 500)
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, 500)


def run_server():
    server = ThreadingHTTPServer((HOST, PORT), VTracerHandler)
    print("=" * 60)
    print("  VTracer Local Web App")
    print(f"  Server running at http://{HOST}:{PORT}")
    print("  Press Ctrl+C to stop")
    print("=" * 60)

    try:
        import webbrowser
        webbrowser.open(f"http://{HOST}:{PORT}")
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.shutdown()


if __name__ == "__main__":
    run_server()