# 🔍 Image Compare Tool

A powerful image comparison tool demonstrating **Full-Stack Development** and **Computer Vision** skills.

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
![OpenCV](https://img.shields.io/badge/OpenCV-4.8+-green?logo=opencv)
![Flask](https://img.shields.io/badge/Flask-2.3+-red?logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)

## 🎯 Features

### Frontend (JavaScript/Canvas)
- Drag & Drop image upload
- Side-by-Side comparison view
- Interactive slider overlay
- Real-time pixel difference visualization
- Responsive dark-mode UI

### Backend (Python/OpenCV)
- **SSIM (Structural Similarity Index)** - Measures perceived quality
- **ORB Feature Matching** - Detects and matches keypoints
- **Histogram Comparison** - Color distribution analysis
- **Canny Edge Detection** - Structural difference visualization
- **Pixel-level Difference** - Heatmap generation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Python 3.8+, Flask |
| Image Processing | OpenCV, scikit-image, NumPy |
| API | RESTful JSON API |

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js (for development server, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/image-compare.git
   cd image-compare
   ```

2. **Set up Python backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Start the backend server**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

4. **Open the frontend**
   - Simply open `index.html` in your browser, or
   - Use a local server: `python -m http.server 8000`

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check, returns OpenCV version |
| `/api/compare` | POST | Full comparison with all algorithms |
| `/api/ssim` | POST | SSIM comparison only |
| `/api/features` | POST | ORB feature matching only |
| `/api/edges` | POST | Canny edge detection comparison |

### Example Request
```bash
curl -X POST http://localhost:5000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"image1": "base64...", "image2": "base64..."}'
```

## 🧠 OpenCV Algorithms Used

### 1. Structural Similarity Index (SSIM)
```python
from skimage.metrics import structural_similarity as ssim
score, diff = ssim(gray1, gray2, full=True)
```
Measures perceived image quality based on luminance, contrast, and structure.

### 2. ORB Feature Detection
```python
orb = cv2.ORB_create(nfeatures=500)
kp1, des1 = orb.detectAndCompute(gray1, None)
matches = cv2.BFMatcher(cv2.NORM_HAMMING).match(des1, des2)
```
Detects keypoints and creates binary feature descriptors for matching.

### 3. Histogram Comparison
```python
hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
correlation = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
```
Compares color distributions using correlation, chi-square, and Bhattacharyya methods.

### 4. Canny Edge Detection
```python
edges = cv2.Canny(blurred, low_threshold, high_threshold)
```
Detects edges to compare structural differences between images.

## 📁 Project Structure

```
image-compare/
├── index.html          # Main HTML page
├── style.css           # Styling with dark theme
├── script.js           # Frontend JavaScript
├── backend/
│   ├── app.py          # Flask API server
│   └── requirements.txt
├── test-image-1.png    # Sample test image
├── test-image-2.png    # Sample test image
└── README.md           # This file
```

## 📸 Screenshots

*Coming soon*

## 👤 Author

**Kevin Hintermaier**
- Portfolio: [your-portfolio-url]
- GitHub: [@yourusername](https://github.com/yourusername)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using Python, OpenCV, and JavaScript*
