/**
 * VTracer Local Web App - Frontend Logic
 * Auto-convert on parameter change, real-time preview, copy SVG
 * Multi-language & theme support
 */

// ============================================================
// i18n
// ============================================================

const I18N = {
    zh: {
        copy_svg: 'SVG', download_svg: 'SVG',
        status_ready: '就绪', status_converting: '转换中...', status_error: '错误',
        badge_offline: '本地离线版',
        upload_title: '上传图片', upload_drag_hint: '拖拽图片到此处，或', upload_click: '点击选择',
        upload_formats: '支持 PNG、JPG、GIF、BMP、WebP · Ctrl+V 粘贴', remove_tooltip: '移除',
        settings_title: '参数设置',
        colormode_label: '色彩模式', colormode_bw: '黑白线稿', colormode_color: '彩色矢量',
        mode_label: '曲线模式', mode_spline: '平滑', mode_polygon: '多边形', mode_pixel: '像素',
        hierarchical_label: '堆叠模式', hierarchical_stacked: '堆叠', hierarchical_cutout: '镂空',
        color_precision_label: '色彩精度', corner_threshold_label: '角点阈值',
        filter_speckle_label: '噪点过滤', gradient_step_label: '梯度步长',
        segment_length_label: '分段长度', splice_threshold_label: '拼接阈值', path_precision_label: '路径精度',
        tooltip_colormode: '选择输出为黑白线稿或彩色矢量图',
        tooltip_mode: '控制路径的平滑程度：平滑适合曲线，多边形适合直线，像素保留锯齿',
        tooltip_hierarchical: '彩色模式下图层的组合方式：堆叠为正常叠加，镂空为挖空效果',
        tooltip_color_precision: '颜色量化级别，数值越高保留的颜色层次越丰富（仅彩色模式有效）',
        tooltip_corner_threshold: '小于此角度的拐角会被平滑为曲线，越大则保留越多尖角',
        tooltip_filter_speckle: '过滤小于此像素尺寸的孤立噪点斑点',
        tooltip_gradient_step: '颜色渐变分层的步长，0表示自动计算，越大则分层越明显',
        tooltip_segment_length: '贝塞尔曲线的最小分段长度，越小越精细但节点越多',
        tooltip_splice_threshold: '允许将两段路径拼接成一个的最大角度差',
        tooltip_path_precision: 'SVG路径数据的小数位数精度，越高越精确但文件越大',
        preview_settings_title: '预览设置', bg_color_label: '背景色', stroke_color_label: '线条色',
        preset_white_black: '白底黑线', preset_black_white: '黑底白线',
        empty_title: '等待上传', empty_desc: '上传图片后自动开始转换，调整参数实时生效',
        loading_text: '正在转换中...', long_hint: '长按鼠标查看原图', floating_original: '原图',
        toast_unsupported: '不支持的图片格式', toast_convert_failed: '转换失败',
        toast_copied: 'SVG 已复制', toast_downloaded: 'SVG 已下载',
        theme_dark: '暗色', theme_light: '亮色',
    },
    en: {
        copy_svg: 'SVG', download_svg: 'SVG',
        status_ready: 'Ready', status_converting: 'Converting...', status_error: 'Error',
        badge_offline: 'Local Offline',
        upload_title: 'Upload Image', upload_drag_hint: 'Drag image here, or', upload_click: 'click to select',
        upload_formats: 'Supports PNG, JPG, GIF, BMP, WebP · Ctrl+V paste', remove_tooltip: 'Remove',
        settings_title: 'Settings',
        colormode_label: 'Color Mode', colormode_bw: 'B&W Line', colormode_color: 'Color Vector',
        mode_label: 'Curve Mode', mode_spline: 'Smooth', mode_polygon: 'Polygon', mode_pixel: 'Pixel',
        hierarchical_label: 'Stack Mode', hierarchical_stacked: 'Stacked', hierarchical_cutout: 'Cutout',
        color_precision_label: 'Color Precision', corner_threshold_label: 'Corner Threshold',
        filter_speckle_label: 'Noise Filter', gradient_step_label: 'Gradient Step',
        segment_length_label: 'Segment Length', splice_threshold_label: 'Splice Threshold', path_precision_label: 'Path Precision',
        tooltip_colormode: 'Choose B&W line art or color vector output',
        tooltip_mode: 'Control curve smoothness: Smooth for curves, Polygon for straight lines, Pixel for jagged edges',
        tooltip_hierarchical: 'Layer blending in color mode: Stacked for normal overlay, Cutout for knockout effect',
        tooltip_color_precision: 'Color quantization level, higher means richer colors (color mode only)',
        tooltip_corner_threshold: 'Corners smaller than this angle are smoothed into curves, larger preserves more sharp angles',
        tooltip_filter_speckle: 'Filter isolated noise spots smaller than this pixel size',
        tooltip_gradient_step: 'Color gradient step size, 0 means auto-calculate, larger means more distinct layers',
        tooltip_segment_length: 'Minimum Bezier curve segment length, smaller is more precise but more nodes',
        tooltip_splice_threshold: 'Maximum angle difference allowed to splice two paths together',
        tooltip_path_precision: 'Decimal precision of SVG path data, higher is more accurate but larger file',
        preview_settings_title: 'Preview Settings', bg_color_label: 'Background', stroke_color_label: 'Stroke',
        preset_white_black: 'White BG', preset_black_white: 'Black BG',
        empty_title: 'Waiting', empty_desc: 'Upload an image to auto-convert, parameter changes apply in real-time',
        loading_text: 'Converting...', long_hint: 'Long press to view original', floating_original: 'Original',
        toast_unsupported: 'Unsupported image format', toast_convert_failed: 'Conversion failed',
        toast_copied: 'SVG copied', toast_downloaded: 'SVG downloaded',
        theme_dark: 'Dark', theme_light: 'Light',
    },
    fr: {
        copy_svg: 'SVG', download_svg: 'SVG',
        status_ready: 'Prêt', status_converting: 'Conversion...', status_error: 'Erreur',
        badge_offline: 'Version locale',
        upload_title: 'Télécharger', upload_drag_hint: 'Glissez une image ici, ou', upload_click: 'cliquez pour sélectionner',
        upload_formats: 'PNG, JPG, GIF, BMP, WebP · Ctrl+V', remove_tooltip: 'Retirer',
        settings_title: 'Paramètres',
        colormode_label: 'Mode couleur', colormode_bw: 'Noir et blanc', colormode_color: 'Couleur',
        mode_label: 'Mode courbe', mode_spline: 'Lissé', mode_polygon: 'Polygone', mode_pixel: 'Pixel',
        hierarchical_label: 'Empilement', hierarchical_stacked: 'Empilé', hierarchical_cutout: 'Découpé',
        color_precision_label: 'Précision couleur', corner_threshold_label: 'Seuil d\'angle',
        filter_speckle_label: 'Filtre bruit', gradient_step_label: 'Pas dégradé',
        segment_length_label: 'Longueur segment', splice_threshold_label: 'Seuil jonction', path_precision_label: 'Précision chemin',
        tooltip_colormode: 'Choisir la sortie en noir et blanc ou en couleur',
        tooltip_mode: 'Contrôle la fluidité des courbes',
        tooltip_hierarchical: 'Mode de combinaison des calques en mode couleur',
        tooltip_color_precision: 'Niveau de quantification des couleurs',
        tooltip_corner_threshold: 'Les angles inférieurs sont lissés en courbes',
        tooltip_filter_speckle: 'Filtre les taches de bruit isolées',
        tooltip_gradient_step: 'Pas de dégradé de couleur, 0 = auto',
        tooltip_segment_length: 'Longueur minimale des segments Bézier',
        tooltip_splice_threshold: 'Angle maximal pour joindre deux segments',
        tooltip_path_precision: 'Précision décimale des données SVG',
        preview_settings_title: 'Paramètres aperçu', bg_color_label: 'Arrière-plan', stroke_color_label: 'Couleur trait',
        preset_white_black: 'Fond blanc', preset_black_white: 'Fond noir',
        empty_title: 'En attente', empty_desc: 'L\'image se convertit automatiquement après le téléchargement',
        loading_text: 'Conversion en cours...', long_hint: 'Appui long pour l\'original', floating_original: 'Original',
        toast_unsupported: 'Format d\'image non supporté', toast_convert_failed: 'Échec de la conversion',
        toast_copied: 'SVG copié', toast_downloaded: 'SVG téléchargé',
        theme_dark: 'Sombre', theme_light: 'Clair',
    },
    ru: {
        copy_svg: 'SVG', download_svg: 'SVG',
        status_ready: 'Готов', status_converting: 'Конвертация...', status_error: 'Ошибка',
        badge_offline: 'Локальная версия',
        upload_title: 'Загрузить', upload_drag_hint: 'Перетащите изображение сюда или', upload_click: 'нажмите для выбора',
        upload_formats: 'PNG, JPG, GIF, BMP, WebP · Ctrl+V', remove_tooltip: 'Удалить',
        settings_title: 'Параметры',
        colormode_label: 'Цветовой режим', colormode_bw: 'Чёрно-белый', colormode_color: 'Цветной',
        mode_label: 'Режим кривой', mode_spline: 'Гладкий', mode_polygon: 'Многоугольник', mode_pixel: 'Пиксель',
        hierarchical_label: 'Режим наложения', hierarchical_stacked: 'Наложение', hierarchical_cutout: 'Вырезка',
        color_precision_label: 'Точность цвета', corner_threshold_label: 'Порог угла',
        filter_speckle_label: 'Фильтр шума', gradient_step_label: 'Шаг градиента',
        segment_length_label: 'Длина сегмента', splice_threshold_label: 'Порог соединения', path_precision_label: 'Точность пути',
        tooltip_colormode: 'Выбор вывода: чёрно-белый или цветной вектор',
        tooltip_mode: 'Управление плавностью путей',
        tooltip_hierarchical: 'Режим наложения слоёв в цветном режиме',
        tooltip_color_precision: 'Уровень квантования цвета',
        tooltip_corner_threshold: 'Углы меньше порога сглаживаются в кривые',
        tooltip_filter_speckle: 'Фильтрация изолированных шумовых пятен',
        tooltip_gradient_step: 'Шаг цветового градиента, 0 = авто',
        tooltip_segment_length: 'Минимальная длина сегмента Безье',
        tooltip_splice_threshold: 'Максимальный угол для соединения путей',
        tooltip_path_precision: 'Десятичная точность данных SVG',
        preview_settings_title: 'Настройки предпросмотра', bg_color_label: 'Фон', stroke_color_label: 'Цвет линии',
        preset_white_black: 'Белый фон', preset_black_white: 'Чёрный фон',
        empty_title: 'Ожидание', empty_desc: 'Изображение автоматически конвертируется после загрузки',
        loading_text: 'Идёт конвертация...', long_hint: 'Долгое нажатие для оригинала', floating_original: 'Оригинал',
        toast_unsupported: 'Неподдерживаемый формат изображения', toast_convert_failed: 'Ошибка конвертации',
        toast_copied: 'SVG скопирован', toast_downloaded: 'SVG скачан',
        theme_dark: 'Тёмная', theme_light: 'Светлая',
    },
    ar: {
        copy_svg: 'SVG', download_svg: 'SVG',
        status_ready: 'جاهز', status_converting: 'جاري التحويل...', status_error: 'خطأ',
        badge_offline: 'نسخة محلية',
        upload_title: 'رفع صورة', upload_drag_hint: 'اسحب الصورة هنا، أو', upload_click: 'انقر للاختيار',
        upload_formats: 'PNG، JPG، GIF، BMP، WebP · Ctrl+V', remove_tooltip: 'إزالة',
        settings_title: 'إعدادات',
        colormode_label: 'وضع اللون', colormode_bw: 'أبيض وأسود', colormode_color: 'ملون',
        mode_label: 'وضع المنحنى', mode_spline: 'ناعم', mode_polygon: 'مضلع', mode_pixel: 'بكسل',
        hierarchical_label: 'وضع التكديس', hierarchical_stacked: 'مكدس', hierarchical_cutout: 'مجوف',
        color_precision_label: 'دقة اللون', corner_threshold_label: 'عتبة الزاوية',
        filter_speckle_label: 'تصفية الضوضاء', gradient_step_label: 'خطوة التدرج',
        segment_length_label: 'طول القطعة', splice_threshold_label: 'عتبة الوصل', path_precision_label: 'دقة المسار',
        tooltip_colormode: 'اختيار الإخراج أبيض وأسود أو متجه ملون',
        tooltip_mode: 'التحكم في درجة نعومة المسارات',
        tooltip_hierarchical: 'طريقة دمج الطبقات في الوضع الملون',
        tooltip_color_precision: 'مستوى كمية الألوان',
        tooltip_corner_threshold: 'الزوايا الأصغر من العتبة تُحوّل إلى منحنيات',
        tooltip_filter_speckle: 'تصفية البقع الضوضائية الصغيرة',
        tooltip_gradient_step: 'خطوة التدرج اللوني، 0 = تلقائي',
        tooltip_segment_length: 'الحد الأدنى لطول قطعة بيزيه',
        tooltip_splice_threshold: 'الزاوية القصوى لربط مسارين',
        tooltip_path_precision: 'دقة الكسور العشرية لبيانات SVG',
        preview_settings_title: 'إعدادات المعاينة', bg_color_label: 'لون الخلفية', stroke_color_label: 'لون الخط',
        preset_white_black: 'خلفية بيضاء', preset_black_white: 'خلفية سوداء',
        empty_title: 'في الانتظار', empty_desc: 'يتم التحويل تلقائيًا بعد رفع الصورة',
        loading_text: 'جاري التحويل...', long_hint: 'اضغط مطولاً لعرض الأصلي', floating_original: 'الأصلي',
        toast_unsupported: 'تنسيق الصورة غير مدعوم', toast_convert_failed: 'فشل التحويل',
        toast_copied: 'تم نسخ SVG', toast_downloaded: 'تم تنزيل SVG',
        theme_dark: 'داكن', theme_light: 'فاتح',
    },
};

let currentLang = localStorage.getItem('vtracer-lang') || 'zh';
let currentTheme = localStorage.getItem('vtracer-theme') || 'dark';

function t(key) {
    return I18N[currentLang]?.[key] || I18N['en']?.[key] || key;
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.dataset.i18nTooltip;
        if (key) el.setAttribute('data-tooltip', t(key));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (key) el.setAttribute('title', t(key));
    });
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('vtracer-lang', lang);
    applyI18n();
    if (!isConverting && !currentSvg) setStatus('idle');
    else if (isConverting) setStatus('converting');
    else setStatus('idle');

    // Update dropdown current text
    const langCurrent = document.getElementById('langCurrent');
    const labels = { zh: '中文', en: 'English', fr: 'Français', ru: 'Русский', ar: 'العربية' };
    if (langCurrent) langCurrent.textContent = labels[lang] || lang;

    // Update active state in dropdown
    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
    });

    // Close dropdown
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('open');
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('vtracer-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.classList.toggle('dark-active', theme === 'dark');
        btn.classList.toggle('light-active', theme === 'light');
    }
    // Update default preview colors based on theme
    const isDark = theme === 'dark';
    const defaultBg = isDark ? '#0a0a0f' : '#ffffff';
    const defaultStroke = isDark ? '#ffffff' : '#000000';
    if (bgColorPicker) {
        bgColorPicker.value = defaultBg;
        bgColorHex.textContent = defaultBg;
    }
    if (strokeColorPicker && !userSetStrokeColor) {
        strokeColorPicker.value = defaultStroke;
        strokeColorHex.textContent = defaultStroke;
    }
    // Update active preset button
    document.querySelectorAll('.color-preset-btn').forEach(btn => {
        const btnBg = btn.dataset.bg;
        const btnStroke = btn.dataset.stroke;
        btn.classList.toggle('active', btnBg === defaultBg && btnStroke === defaultStroke);
    });
    if (originalSvgContent) {
        reRenderOriginal();
        applyPreviewColors();
    }
}

function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function toggleLangDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

// Close lang dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

document.documentElement.setAttribute('data-theme', currentTheme);

// DOM
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadContent = uploadZone.querySelector('.upload-content');
const uploadPreview = document.getElementById('uploadPreview');
const previewImg = document.getElementById('previewImg');
const removeBtn = document.getElementById('removeBtn');

const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultView = document.getElementById('resultView');
const svgWrapper = document.getElementById('svgWrapper');
const resultContent = document.getElementById('resultContent');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const copySvgBtn = document.getElementById('copySvgBtn');
const svgSizeDisplay = document.getElementById('svgSizeDisplay');
const floatingTooltip = document.getElementById('floatingTooltip');
const settingsSection = document.getElementById('settingsSection');
const previewSettingsSection = document.getElementById('previewSettingsSection');
const toast = document.getElementById('toast');

const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');

const bgColorPicker = document.getElementById('bgColor');
const bgColorHex = document.getElementById('bgColorHex');
const strokeColorPicker = document.getElementById('strokeColor');
const strokeColorHex = document.getElementById('strokeColorHex');

// State
let currentFile = null;
let currentSvg = null;
let originalSvgContent = null;
let originalDataUrl = null;
let isConverting = false;
let convertVersion = 0;
let debounceTimer = null;
const DEBOUNCE_MS = 400;
let userSetStrokeColor = false;

// Slider defaults map
const SLIDER_DEFAULTS = {
    color_precision: 6,
    corner_threshold: 60,
    filter_speckle: 4,
    gradient_step: 0,
    segment_length: 4,
    splice_threshold: 45,
    path_precision: 8,
};

// ============================================================
// Upload
// ============================================================

uploadZone.addEventListener('click', (e) => {
    if (e.target !== removeBtn && !removeBtn.contains(e.target)) fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault(); uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

removeBtn.addEventListener('click', (e) => { e.stopPropagation(); clearFile(); });

function handleFile(file) {
    const valid = ['image/png','image/jpeg','image/jpg','image/gif','image/bmp','image/webp'];
    if (!valid.includes(file.type)) { showToast(t('toast_unsupported'), 'error'); return; }

    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        originalDataUrl = e.target.result;
        previewImg.src = originalDataUrl;
        uploadContent.classList.add('hidden');
        uploadPreview.classList.remove('hidden');
        // Expand settings on upload
        settingsSection.classList.remove('collapsed');
        previewSettingsSection.classList.remove('collapsed');
        resultView.classList.remove('no-animate');
        triggerConvert();
    };
    reader.readAsDataURL(file);
}

function clearFile() {
    currentFile = null; originalDataUrl = null; originalSvgContent = null; currentSvg = null;
    fileInput.value = '';
    uploadContent.classList.remove('hidden');
    uploadPreview.classList.add('hidden');
    resultView.classList.add('hidden');
    loadingState.classList.add('hidden');
    emptyState.classList.remove('hidden');
    downloadSvgBtn.disabled = true;
    copySvgBtn.disabled = true;
    svgSizeDisplay.textContent = '';
    svgSizeDisplay.classList.remove('show');
    // Collapse settings when no image
    settingsSection.classList.add('collapsed');
    previewSettingsSection.classList.add('collapsed');
    setStatus('idle');
}

// ============================================================
// Clipboard paste
// ============================================================

document.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            if (blob) handleFile(blob);
            break;
        }
    }
});

// ============================================================
// Auto-convert with debounce
// ============================================================

function triggerConvert() {
    if (!currentFile) return;
    clearTimeout(debounceTimer);
    setStatus('converting');
    debounceTimer = setTimeout(() => doConvert(), DEBOUNCE_MS);
}

async function doConvert() {
    if (!currentFile || isConverting) return;
    isConverting = true;
    const thisVersion = ++convertVersion;

    emptyState.classList.add('hidden');
    resultView.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        const formData = new FormData();
        formData.append('image', currentFile);

        document.querySelectorAll('[data-param]').forEach(el => {
            const param = el.dataset.param;
            if (el.classList.contains('segment-control')) {
                const active = el.querySelector('.segment-btn.active');
                if (active) formData.append(param, active.dataset.value);
            } else if (el.classList.contains('range-slider')) {
                formData.append(param, el.value);
            }
        });

        const response = await fetch('/api/convert', { method: 'POST', body: formData });
        const result = await response.json();

        if (convertVersion !== thisVersion) return;

        if (!result.success) throw new Error(result.error || t('toast_convert_failed'));

        originalSvgContent = result.svg;
        currentSvg = result.svg;

        emptyState.classList.add('hidden');
        loadingState.classList.add('hidden');
        resultView.classList.add('no-animate');
        resultView.classList.remove('hidden');
        displaySvg(currentSvg);
        downloadSvgBtn.disabled = false;
        copySvgBtn.disabled = false;

        const svgSize = new Blob([currentSvg]).size;
        svgSizeDisplay.textContent = `SVG ${formatBytes(svgSize)}`;
        svgSizeDisplay.classList.add('show');

        setStatus('idle');

    } catch (err) {
        if (convertVersion !== thisVersion) return;
        showToast(t('toast_convert_failed') + ': ' + err.message, 'error');
        setStatus('error');
        loadingState.classList.add('hidden');
        if (!currentSvg) emptyState.classList.remove('hidden');
    } finally {
        isConverting = false;
    }
}

function displaySvg(svgString) {
    svgWrapper.innerHTML = svgString;
    const svgEl = svgWrapper.querySelector('svg');
    if (svgEl) {
        if (!svgEl.getAttribute('viewBox')) {
            const w = parseFloat(svgEl.getAttribute('width'));
            const h = parseFloat(svgEl.getAttribute('height'));
            if (w && h) {
                svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
            }
        }
        svgEl.removeAttribute('width');
        svgEl.removeAttribute('height');
        svgEl.style.maxWidth = '100%';
        svgEl.style.maxHeight = '100%';
        svgEl.style.display = 'block';
    }
    applyPreviewColors();
    fitSvgToContainer();
}

function fitSvgToContainer() {
    const svgEl = svgWrapper.querySelector('svg');
    if (!svgEl) return;

    const containerW = resultContent.clientWidth - 48;
    const containerH = resultContent.clientHeight - 48;

    if (containerW <= 0 || containerH <= 0) {
        setTimeout(fitSvgToContainer, 50);
        return;
    }

    let svgW = 0, svgH = 0;
    const vb = svgEl.viewBox?.baseVal;
    if (vb && vb.width > 0 && vb.height > 0) {
        svgW = vb.width;
        svgH = vb.height;
    } else {
        const w = parseFloat(svgEl.getAttribute('width'));
        const h = parseFloat(svgEl.getAttribute('height'));
        if (w && h) { svgW = w; svgH = h; }
    }

    if (svgW > 0 && svgH > 0) {
        const svgRatio = svgW / svgH;
        const containerRatio = containerW / containerH;

        if (svgRatio > containerRatio) {
            svgEl.style.width = containerW + 'px';
            svgEl.style.height = (containerW / svgRatio) + 'px';
        } else {
            svgEl.style.height = containerH + 'px';
            svgEl.style.width = (containerH * svgRatio) + 'px';
        }
    }
}

// ============================================================
// Parameter change listeners
// ============================================================

// Segment controls
document.querySelectorAll('.segment-control[data-param]').forEach(container => {
    const buttons = container.querySelectorAll('.segment-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            triggerConvert();
        });
    });
});

// Range sliders - trigger convert + double-click reset
document.querySelectorAll('.range-slider[data-param]').forEach(slider => {
    const param = slider.dataset.param;

    slider.addEventListener('input', () => {
        triggerConvert();
    });

    slider.addEventListener('dblclick', () => {
        const def = SLIDER_DEFAULTS[param];
        if (def === undefined) return;
        slider.value = def;
        triggerConvert();
    });
});

// Show/hide color-only params based on colormode
function updateColorModeParams(mode) {
    const isColor = mode === 'color';
    document.getElementById('hierarchicalGroup').classList.toggle('hidden', !isColor);
    document.getElementById('colorPrecisionGroup').classList.toggle('hidden', !isColor);
}

document.querySelectorAll('.segment-control[data-param="colormode"] .segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        updateColorModeParams(btn.dataset.value);
    });
});
// Initialize: default is bw, so hide both
updateColorModeParams('bw');

// ============================================================
// Long-press to show original image
// ============================================================

function showOriginal() {
    if (!originalDataUrl) return;
    svgWrapper.classList.add('hidden');
    resultContent.classList.add('no-grid');
    let origDiv = resultContent.querySelector('.original-wrapper');
    if (!origDiv) {
        origDiv = document.createElement('div');
        origDiv.className = 'original-wrapper';
        origDiv.innerHTML = `<img src="${originalDataUrl}" alt="原图">`;
        resultContent.appendChild(origDiv);
    }
    floatingTooltip.textContent = t('floating_original');
    floatingTooltip.classList.add('show');
}

function showVector() {
    const origDiv = resultContent.querySelector('.original-wrapper');
    if (origDiv) origDiv.remove();
    svgWrapper.classList.remove('hidden');
    resultContent.classList.remove('no-grid');
    floatingTooltip.classList.remove('show');
}

resultContent.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left click
    if (!currentSvg) return;
    showOriginal();
});

resultContent.addEventListener('mouseup', () => {
    if (!currentSvg) return;
    showVector();
});

resultContent.addEventListener('mouseleave', () => {
    if (!currentSvg) return;
    showVector();
});

// Also handle touch events for mobile
resultContent.addEventListener('touchstart', (e) => {
    if (!currentSvg) return;
    e.preventDefault();
    showOriginal();
}, { passive: false });

resultContent.addEventListener('touchend', () => {
    if (!currentSvg) return;
    showVector();
});

// ============================================================
// Preview Colors
// ============================================================

function applyPreviewColors() {
    const svgEl = svgWrapper.querySelector('svg');
    if (!svgEl) return;

    const bgColor = bgColorPicker.value;
    const strokeColor = strokeColorPicker.value;
    const isBw = getParamValue('colormode') === 'bw';

    svgWrapper.style.background = bgColor;
    svgWrapper.style.borderRadius = '8px';

    if (isBw) {
        svgEl.querySelectorAll('path, polygon, circle, ellipse, rect, polyline, line').forEach(el => {
            el.setAttribute('fill', strokeColor);
            if (el.getAttribute('stroke')) {
                el.setAttribute('stroke', strokeColor);
            }
        });
    }
}

function reRenderOriginal() {
    if (!originalSvgContent) return;
    currentSvg = originalSvgContent;
    displaySvg(currentSvg);
}

bgColorPicker.addEventListener('input', () => {
    bgColorHex.textContent = bgColorPicker.value;
    applyPreviewColors();
});

strokeColorPicker.addEventListener('input', () => {
    strokeColorHex.textContent = strokeColorPicker.value;
    userSetStrokeColor = true;
    reRenderOriginal();
    applyPreviewColors();
});

// Color presets
document.querySelectorAll('.color-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const bg = btn.dataset.bg;
        const stroke = btn.dataset.stroke;
        bgColorPicker.value = bg;
        bgColorHex.textContent = bg;
        strokeColorPicker.value = stroke;
        strokeColorHex.textContent = stroke;
        userSetStrokeColor = true;
        reRenderOriginal();
        applyPreviewColors();
    });
});

// ============================================================
// Collapsible Sections
// ============================================================

document.querySelectorAll('.collapsible-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.dataset.target;
        const section = document.getElementById(targetId)?.closest('.settings-section, .preview-settings-section');
        if (section) {
            section.classList.toggle('collapsed');
        }
    });
});

// ============================================================
// Copy SVG
// ============================================================

copySvgBtn.addEventListener('click', async () => {
    if (!currentSvg) return;

    const svgEl = svgWrapper.querySelector('svg');
    const svgToCopy = svgEl ? svgEl.outerHTML : currentSvg;
    const textSpan = copySvgBtn.querySelector('span[data-i18n="copy_svg"]');

    try {
        await navigator.clipboard.writeText(svgToCopy);
        copySvgBtn.classList.add('copied');
        const svgCopyIcon = copySvgBtn.querySelector('svg');
        const origHTML = svgCopyIcon.innerHTML;
        svgCopyIcon.innerHTML = '<polyline points="20 6 9 17 4 12" style="stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>';
        if (textSpan) textSpan.textContent = ' ' + t('toast_copied');
        showToast(t('toast_copied'), 'success');

        setTimeout(() => {
            copySvgBtn.classList.remove('copied');
            svgCopyIcon.innerHTML = origHTML;
            if (textSpan) textSpan.textContent = ' ' + t('copy_svg');
        }, 2000);
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = svgToCopy;
        ta.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(t('toast_copied'), 'success');
    }
});

// ============================================================
// Download
// ============================================================

downloadSvgBtn.addEventListener('click', () => {
    if (!currentSvg) return;
    const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vtracer-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast_downloaded'), 'success');
});

// ============================================================
// Helpers
// ============================================================

function getParamValue(param) {
    const segCtrl = document.querySelector(`.segment-control[data-param="${param}"]`);
    if (segCtrl) {
        const active = segCtrl.querySelector('.segment-btn.active');
        return active ? active.dataset.value : null;
    }
    const slider = document.querySelector(`.range-slider[data-param="${param}"]`);
    if (slider) return slider.value;
    return null;
}

function setStatus(status) {
    statusDot.className = 'status-dot';
    if (status === 'converting') {
        statusDot.classList.add('converting');
        statusText.textContent = t('status_converting');
    } else if (status === 'error') {
        statusDot.classList.add('error');
        statusText.textContent = t('status_error');
    } else {
        statusText.textContent = t('status_ready');
    }
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

let toastTimeout;
function showToast(message, type = 'info') {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// Keyboard & Global
// ============================================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentFile) clearFile();
});

document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
    if (e.target.closest('.upload-zone')) return;
    e.preventDefault();
});

// Resize handling for SVG fit
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (currentSvg && !resultView.classList.contains('hidden')) fitSvgToContainer();
    }, 200);
});

// Initialize on load
applyI18n();
setTheme(currentTheme);
setLanguage(currentLang);
