/**
 * Image Compare Tool
 * A powerful image comparison utility with multiple view modes
 * 
 * Author: Kevin Hintermaier
 */

// ========================================
// Configuration
// ========================================
const API_BASE = 'http://localhost:5000/api';

// ========================================
// State Management
// ========================================
const state = {
    image1: null,
    image2: null,
    currentMode: 'side-by-side',
    sliderPosition: 50,
    diffThreshold: 30,
    diffColor: '#ff0000',
    backendOnline: false,
    opencvResults: null
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Upload zones
    uploadZone1: document.getElementById('upload-zone-1'),
    uploadZone2: document.getElementById('upload-zone-2'),
    fileInput1: document.getElementById('file-input-1'),
    fileInput2: document.getElementById('file-input-2'),
    preview1: document.getElementById('preview-1'),
    preview2: document.getElementById('preview-2'),
    clear1: document.getElementById('clear-1'),
    clear2: document.getElementById('clear-2'),

    // Mode selection
    modeSection: document.getElementById('mode-section'),
    modeButtons: document.querySelectorAll('.mode-btn'),

    // Comparison section
    comparisonSection: document.getElementById('comparison-section'),

    // Views
    sideBySideView: document.getElementById('side-by-side-view'),
    sliderView: document.getElementById('slider-view'),
    diffView: document.getElementById('diff-view'),

    // Side by side images
    compareImg1: document.getElementById('compare-img-1'),
    compareImg2: document.getElementById('compare-img-2'),

    // Slider elements
    sliderImg1: document.getElementById('slider-img-1'),
    sliderImg2: document.getElementById('slider-img-2'),
    sliderOverlay: document.getElementById('slider-overlay'),
    sliderHandle: document.getElementById('slider-handle'),

    // Diff elements
    diffCanvas: document.getElementById('diff-canvas'),
    diffThreshold: document.getElementById('diff-threshold'),
    diffThresholdValue: document.getElementById('diff-threshold-value'),
    diffColor: document.getElementById('diff-color'),
    diffPercentage: document.getElementById('diff-percentage'),
    diffPixels: document.getElementById('diff-pixels'),

    // Action buttons
    downloadBtn: document.getElementById('download-btn'),
    swapBtn: document.getElementById('swap-btn'),

    // OpenCV elements
    opencvView: document.getElementById('opencv-view'),
    backendStatus: document.getElementById('backend-status'),
    statusIndicator: document.querySelector('.status-indicator'),
    analyzeBtn: document.getElementById('analyze-btn'),
    opencvLoading: document.getElementById('opencv-loading'),
    opencvResults: document.getElementById('opencv-results'),

    // OpenCV result elements
    ssimScore: document.getElementById('ssim-score'),
    ssimLabel: document.getElementById('ssim-label'),
    ssimDiffImg: document.getElementById('ssim-diff-img'),
    featuresImg1: document.getElementById('features-img1'),
    featuresImg2: document.getElementById('features-img2'),
    featuresMatches: document.getElementById('features-matches'),
    featureMatchImg: document.getElementById('feature-match-img'),
    edgeSimilarity: document.getElementById('edge-similarity'),
    edgeDiffImg: document.getElementById('edge-diff-img'),
    histCorrelation: document.getElementById('hist-correlation'),
    histBhattacharyya: document.getElementById('hist-bhattacharyya'),
    pixelDiffPercent: document.getElementById('pixel-diff-percent'),
    pixelDiffCount: document.getElementById('pixel-diff-count'),
    pixelHeatmapImg: document.getElementById('pixel-heatmap-img'),

    // Template Matching elements
    templateView: document.getElementById('template-view'),
    templateLoading: document.getElementById('template-loading'),
    templateResults: document.getElementById('template-results'),
    templateConfidence: document.getElementById('template-confidence'),
    templateResultImg: document.getElementById('template-result-img'),
    runTemplateBtn: document.getElementById('run-template-btn')
};

// ========================================
// Utility Functions
// ========================================
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve({ src: e.target.result, img });
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// ========================================
// Upload Handling
// ========================================
function setupUploadZone(zone, input, preview, clearBtn, slot) {
    // Click to upload
    zone.addEventListener('click', (e) => {
        if (e.target !== clearBtn && !clearBtn.contains(e.target)) {
            input.click();
        }
    });

    // File input change
    input.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            await handleFileUpload(e.target.files[0], slot);
        }
    });

    // Drag and drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', async (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            await handleFileUpload(files[0], slot);
        }
    });

    // Clear button
    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearImage(slot);
    });
}

async function handleFileUpload(file, slot) {
    try {
        const { src, img } = await loadImage(file);

        if (slot === 1) {
            state.image1 = { src, width: img.width, height: img.height };
            elements.preview1.src = src;
            elements.uploadZone1.classList.add('has-image');
        } else {
            state.image2 = { src, width: img.width, height: img.height };
            elements.preview2.src = src;
            elements.uploadZone2.classList.add('has-image');
        }

        updateUI();
    } catch (error) {
        console.error('Error loading image:', error);
        alert('Bild konnte nicht geladen werden. Bitte versuchen Sie eine andere Datei.');
    }
}

function clearImage(slot) {
    if (slot === 1) {
        state.image1 = null;
        elements.preview1.src = '';
        elements.uploadZone1.classList.remove('has-image');
        elements.fileInput1.value = '';
    } else {
        state.image2 = null;
        elements.preview2.src = '';
        elements.uploadZone2.classList.remove('has-image');
        elements.fileInput2.value = '';
    }

    updateUI();
}

// ========================================
// UI Updates
// ========================================
function updateUI() {
    const bothImagesLoaded = state.image1 && state.image2;

    // Show/hide mode section
    if (bothImagesLoaded) {
        elements.modeSection.classList.add('visible');
        elements.comparisonSection.classList.add('visible');
        updateComparisonView();
    } else {
        elements.modeSection.classList.remove('visible');
        elements.comparisonSection.classList.remove('visible');
    }
}

function updateComparisonView() {
    if (!state.image1 || !state.image2) return;

    // Update side by side
    elements.compareImg1.src = state.image1.src;
    elements.compareImg2.src = state.image2.src;

    // Update slider
    elements.sliderImg1.src = state.image1.src;
    elements.sliderImg2.src = state.image2.src;
    updateSliderPosition(state.sliderPosition);

    // Update diff if in diff mode
    if (state.currentMode === 'diff') {
        calculateDiff();
    }
}

// ========================================
// Mode Switching
// ========================================
function setMode(mode) {
    state.currentMode = mode;

    // Update button states
    elements.modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Switch views
    elements.sideBySideView.classList.toggle('active', mode === 'side-by-side');
    elements.sliderView.classList.toggle('active', mode === 'slider');
    elements.diffView.classList.toggle('active', mode === 'diff');
    elements.diffView.classList.toggle('active', mode === 'diff');
    elements.opencvView.classList.toggle('active', mode === 'opencv');
    elements.templateView.classList.toggle('active', mode === 'template');

    // Calculate diff if switching to diff mode
    if (mode === 'diff' && state.image1 && state.image2) {
        calculateDiff();
    }

    // Check backend status when switching to OpenCV or Template mode
    if (mode === 'opencv' || mode === 'template') {
        checkBackendStatus();
    }
}

// ========================================
// Slider Functionality
// ========================================
function updateSliderPosition(percent) {
    state.sliderPosition = percent;

    const wrapper = elements.sliderOverlay.parentElement;
    if (!wrapper) return;

    elements.sliderOverlay.style.width = `${percent}%`;
    elements.sliderHandle.style.left = `${percent}%`;

    // Adjust the image inside overlay to show correct portion
    const overlayImg = elements.sliderImg2;
    overlayImg.style.width = `${10000 / percent}%`;
}

function setupSlider() {
    let isDragging = false;

    const startDrag = (e) => {
        isDragging = true;
        e.preventDefault();
    };

    const endDrag = () => {
        isDragging = false;
    };

    const doDrag = (e) => {
        if (!isDragging) return;

        const wrapper = elements.sliderOverlay.parentElement;
        const rect = wrapper.getBoundingClientRect();

        let clientX;
        if (e.type.startsWith('touch')) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));

        updateSliderPosition(percent);
    };

    // Mouse events
    elements.sliderHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mousemove', doDrag);

    // Touch events
    elements.sliderHandle.addEventListener('touchstart', startDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchmove', doDrag);

    // Click on wrapper to jump
    elements.sliderOverlay.parentElement?.addEventListener('click', (e) => {
        if (e.target === elements.sliderHandle || elements.sliderHandle.contains(e.target)) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        updateSliderPosition(percent);
    });
}

// ========================================
// Diff Calculation
// ========================================
function calculateDiff() {
    if (!state.image1 || !state.image2) return;

    const canvas = elements.diffCanvas;
    const ctx = canvas.getContext('2d');

    // Create temporary canvases for both images
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    // Load images
    const img1 = new Image();
    const img2 = new Image();

    img1.onload = () => {
        img2.onload = () => {
            // Use the larger dimensions
            const width = Math.max(img1.width, img2.width);
            const height = Math.max(img1.height, img2.height);

            // Set canvas sizes
            canvas1.width = canvas2.width = canvas.width = width;
            canvas1.height = canvas2.height = canvas.height = height;

            // Draw images centered
            ctx1.fillStyle = '#000';
            ctx1.fillRect(0, 0, width, height);
            ctx1.drawImage(img1, (width - img1.width) / 2, (height - img1.height) / 2);

            ctx2.fillStyle = '#000';
            ctx2.fillRect(0, 0, width, height);
            ctx2.drawImage(img2, (width - img2.width) / 2, (height - img2.height) / 2);

            // Get image data
            const data1 = ctx1.getImageData(0, 0, width, height);
            const data2 = ctx2.getImageData(0, 0, width, height);
            const diffData = ctx.createImageData(width, height);

            const highlightColor = hexToRgb(state.diffColor);
            const threshold = state.diffThreshold * 2.55; // Convert 0-100 to 0-255

            let diffPixelCount = 0;
            const totalPixels = width * height;

            // Compare pixels
            for (let i = 0; i < data1.data.length; i += 4) {
                const r1 = data1.data[i];
                const g1 = data1.data[i + 1];
                const b1 = data1.data[i + 2];

                const r2 = data2.data[i];
                const g2 = data2.data[i + 1];
                const b2 = data2.data[i + 2];

                const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

                if (diff > threshold) {
                    // Highlight difference
                    diffData.data[i] = highlightColor.r;
                    diffData.data[i + 1] = highlightColor.g;
                    diffData.data[i + 2] = highlightColor.b;
                    diffData.data[i + 3] = 255;
                    diffPixelCount++;
                } else {
                    // Show original (grayscale)
                    const gray = (r1 + g1 + b1) / 3;
                    diffData.data[i] = gray;
                    diffData.data[i + 1] = gray;
                    diffData.data[i + 2] = gray;
                    diffData.data[i + 3] = 255;
                }
            }

            // Draw diff result
            ctx.putImageData(diffData, 0, 0);

            // Update stats
            const percentage = ((diffPixelCount / totalPixels) * 100).toFixed(2);
            elements.diffPercentage.textContent = `${percentage}%`;
            elements.diffPixels.textContent = diffPixelCount.toLocaleString();
        };
        img2.src = state.image2.src;
    };
    img1.src = state.image1.src;
}

// ========================================
// Actions
// ========================================
function swapImages() {
    const temp = state.image1;
    state.image1 = state.image2;
    state.image2 = temp;

    // Update previews
    if (state.image1) {
        elements.preview1.src = state.image1.src;
        elements.uploadZone1.classList.add('has-image');
    } else {
        elements.preview1.src = '';
        elements.uploadZone1.classList.remove('has-image');
    }

    if (state.image2) {
        elements.preview2.src = state.image2.src;
        elements.uploadZone2.classList.add('has-image');
    } else {
        elements.preview2.src = '';
        elements.uploadZone2.classList.remove('has-image');
    }

    updateComparisonView();
}

function downloadResult() {
    let canvas;

    if (state.currentMode === 'diff') {
        canvas = elements.diffCanvas;
    } else {
        // Create a combined image for other modes
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img1 = new Image();
        const img2 = new Image();

        img1.onload = () => {
            img2.onload = () => {
                if (state.currentMode === 'side-by-side') {
                    // Side by side
                    canvas.width = img1.width + img2.width + 20;
                    canvas.height = Math.max(img1.height, img2.height);
                    ctx.fillStyle = '#0a0a0f';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img1, 0, (canvas.height - img1.height) / 2);
                    ctx.drawImage(img2, img1.width + 20, (canvas.height - img2.height) / 2);
                } else {
                    // Slider - just use image 1 for now
                    canvas.width = img1.width;
                    canvas.height = img1.height;
                    ctx.drawImage(img1, 0, 0);
                }

                downloadCanvas(canvas);
            };
            img2.src = state.image2.src;
        };
        img1.src = state.image1.src;
        return;
    }

    downloadCanvas(canvas);
}

function downloadCanvas(canvas) {
    const link = document.createElement('a');
    link.download = `image-compare-${state.currentMode}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
    // Upload zones
    setupUploadZone(elements.uploadZone1, elements.fileInput1, elements.preview1, elements.clear1, 1);
    setupUploadZone(elements.uploadZone2, elements.fileInput2, elements.preview2, elements.clear2, 2);

    // Mode buttons
    elements.modeButtons.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Slider
    setupSlider();

    // Diff controls
    elements.diffThreshold.addEventListener('input', (e) => {
        state.diffThreshold = parseInt(e.target.value);
        elements.diffThresholdValue.textContent = state.diffThreshold;
        if (state.currentMode === 'diff') {
            calculateDiff();
        }
    });

    elements.diffColor.addEventListener('input', (e) => {
        state.diffColor = e.target.value;
        if (state.currentMode === 'diff') {
            calculateDiff();
        }
    });

    // Action buttons
    elements.downloadBtn.addEventListener('click', downloadResult);
    elements.swapBtn.addEventListener('click', swapImages);

    // OpenCV analyze button
    if (elements.analyzeBtn) {
        elements.analyzeBtn.addEventListener('click', runOpenCVAnalysis);
    }
    if (elements.analyzeBtn) {
        elements.analyzeBtn.addEventListener('click', runOpenCVAnalysis);
    }

    // Template run button
    if (elements.runTemplateBtn) {
        elements.runTemplateBtn.addEventListener('click', runTemplateMatching);
    }

    // ========================================
    // OpenCV Backend Integration
    // ========================================
    async function checkBackendStatus() {
        try {
            const response = await fetch(`${API_BASE}/health`, {
                method: 'GET',
                timeout: 3000
            });

            if (response.ok) {
                const data = await response.json();
                state.backendOnline = true;
                elements.backendStatus.textContent = `Online (OpenCV ${data.opencv_version})`;
                elements.statusIndicator.classList.add('online');
                elements.statusIndicator.classList.remove('offline');
                elements.analyzeBtn.disabled = false;
            } else {
                throw new Error('Backend not responding');
            }
        } catch (error) {
            state.backendOnline = false;
            elements.backendStatus.textContent = 'Offline - Backend starten mit: python backend/app.py';
            elements.statusIndicator.classList.remove('online');
            elements.statusIndicator.classList.add('offline');
            elements.analyzeBtn.disabled = true;
        }
    }

    async function runOpenCVAnalysis() {
        if (!state.image1 || !state.image2) {
            alert('Bitte laden Sie zuerst beide Bilder hoch!');
            return;
        }

        if (!state.backendOnline) {
            alert('Backend ist offline. Starten Sie es mit: python backend/app.py');
            return;
        }

        // Show loading state
        elements.opencvLoading.style.display = 'flex';
        elements.opencvResults.style.display = 'none';
        elements.analyzeBtn.disabled = true;
        elements.analyzeBtn.textContent = '⏳ Analysiere...';

        try {
            const response = await fetch(`${API_BASE}/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image1: state.image1.src,
                    image2: state.image2.src
                })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();

            if (data.success) {
                state.opencvResults = data.results;
                displayOpenCVResults(data.results);
            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error) {
            console.error('OpenCV Analysis error:', error);
            alert(`Analyse fehlgeschlagen: ${error.message}`);
        } finally {
            elements.opencvLoading.style.display = 'none';
            elements.analyzeBtn.disabled = false;
            elements.analyzeBtn.textContent = '🔬 OpenCV Analyse starten';
        }
    }

    function displayOpenCVResults(results) {
        // Show results container
        elements.opencvResults.style.display = 'grid';

        // SSIM Results
        const ssimScore = results.ssim.score.toFixed(4);
        elements.ssimScore.textContent = ssimScore;
        elements.ssimLabel.textContent = results.ssim.interpretation;
        elements.ssimDiffImg.src = `data:image/png;base64,${results.ssim.diff_image}`;

        // Feature Matching Results
        if (results.features.stats) {
            elements.featuresImg1.textContent = results.features.stats.image1_keypoints;
            elements.featuresImg2.textContent = results.features.stats.image2_keypoints;
            elements.featuresMatches.textContent = results.features.stats.total_matches;
        }
        elements.featureMatchImg.src = `data:image/png;base64,${results.features.visualization}`;

        // Edge Detection Results
        const edgeSim = (results.edges.similarity * 100).toFixed(1);
        elements.edgeSimilarity.textContent = `${edgeSim}%`;
        elements.edgeDiffImg.src = `data:image/png;base64,${results.edges.diff_image}`;

        // Histogram Results
        elements.histCorrelation.textContent = results.histogram.correlation.toFixed(4);
        elements.histBhattacharyya.textContent = results.histogram.bhattacharyya.toFixed(4);

        // Pixel Difference Results
        elements.pixelDiffPercent.textContent = `${results.pixel_diff.difference_percentage.toFixed(2)}%`;
        elements.pixelDiffCount.textContent = results.pixel_diff.changed_pixels.toLocaleString();
        elements.pixelHeatmapImg.src = `data:image/png;base64,${results.pixel_diff.heatmap}`;
    }

}
}

async function runTemplateMatching() {
    if (!state.image1 || !state.image2) {
        alert('Bitte laden Sie zuerst beide Bilder hoch!');
        return;
    }

    if (!state.backendOnline) {
        alert('Backend ist offline. Starten Sie es mit: python backend/app.py');
        return;
    }

    elements.templateLoading.style.display = 'flex';
    elements.templateResults.style.display = 'none';
    elements.runTemplateBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/template-match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image1: state.image1.src, // Source
                image2: state.image2.src  // Template
            })
        });

        const data = await response.json();

        if (data.success) {
            // Update UI
            elements.templateConfidence.textContent = `${(data.results.match.confidence * 100).toFixed(1)}%`;
            elements.templateResultImg.src = `data:image/png;base64,${data.results.visualization}`;
            elements.templateResults.style.display = 'block';
        } else {
            alert('Fehler: ' + data.error);
        }
    } catch (error) {
        console.error('Template match error:', error);
        alert('Fehler bei der Template-Suche: ' + error.message);
    } finally {
        elements.templateLoading.style.display = 'none';
        elements.runTemplateBtn.disabled = false;
    }
}

// Global function for Load Example buttons
// Global function for Load Example Scenario
window.loadExampleScenario = async (scenario) => {
    const assets = {
        'fishing': ['example-fishing-scene.png', 'example-fishing-template.png', 'template'],
        'pcb': ['example-pcb-1.png', 'example-pcb-2.png', 'template'],
        'doc': ['example-doc-1.png', 'example-doc-2.png', 'diff']
    };

    const config = assets[scenario];
    if (!config) return;

    // Reset current images if needed? handleFileUpload does it.

    // Load Image 1
    await loadExampleFile(config[0], 1);

    // Load Image 2
    await loadExampleFile(config[1], 2);

    // Auto-switch mode
    const targetMode = config[2];
    if (targetMode) {
        setMode(targetMode);
    }
};

async function loadExampleFile(filename, slot) {
    try {
        // Use absolute path to ensure correct loading from public directory
        const baseUrl = '/projects/image-compare/';
        const fullPath = baseUrl + filename;

        console.log(`Loading example: ${fullPath}`);
        const response = await fetch(fullPath);

        if (!response.ok) throw new Error(`Beispielbild ${filename} nicht gefunden (${response.status})`);

        const blob = await response.blob();
        const file = new File([blob], filename, { type: 'image/png' });

        await handleFileUpload(file, slot);
    } catch (error) {
        console.error(error);
        alert(`Fehler beim Laden von ${filename}: ${error.message}\n\nPfad: /projects/image-compare/${filename}`);
    }
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log('🔍 Image Compare Tool initialized');

    // Check backend status on load
    checkBackendStatus();
});
