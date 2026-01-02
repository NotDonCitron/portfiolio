import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
import base64
import io
import re
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
HF_API_URL = "https://router.huggingface.co"
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HF_API_TOKEN") or os.getenv("VITE_HF_API_TOKEN") or ""
MODEL_NAME = os.getenv("HF_MODEL", "HuggingFaceTB/SmolLM3-3B")


# ========================================
# OpenCV Utility Functions
# ========================================

def decode_base64_image(base64_string):
    """Decode base64 string to OpenCV image."""
    if 'base64,' in base64_string:
        base64_string = base64_string.split('base64,')[1]
    
    img_bytes = base64.b64decode(base64_string)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img

def encode_image_base64(img):
    """Encode OpenCV image to base64 string."""
    _, buffer = cv2.imencode('.png', img)
    return base64.b64encode(buffer).decode('utf-8')

def resize_to_match(img1, img2):
    """Resize images to the same dimensions for comparison."""
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    target_h = max(h1, h2)
    target_w = max(w1, w2)
    img1_resized = cv2.resize(img1, (target_w, target_h))
    img2_resized = cv2.resize(img2, (target_w, target_h))
    return img1_resized, img2_resized


# ========================================
# OpenCV Comparison Algorithms
# ========================================

def calculate_ssim(img1, img2):
    img1_resized, img2_resized = resize_to_match(img1, img2)
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    score, diff = ssim(gray1, gray2, full=True)
    diff = (diff * 255).astype("uint8")
    diff_colored = cv2.applyColorMap(255 - diff, cv2.COLORMAP_JET)
    return score, diff_colored

def feature_matching(img1, img2):
    img1_resized, img2_resized = resize_to_match(img1, img2)
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(nfeatures=500)
    kp1, des1 = orb.detectAndCompute(gray1, None)
    kp2, des2 = orb.detectAndCompute(gray2, None)
    if des1 is None or des2 is None:
        return 0, img1_resized, {}
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)
    good_matches = [m for m in matches if m.distance < 50]
    match_score = len(good_matches) / max(len(kp1), len(kp2)) * 100 if kp1 and kp2 else 0
    result = cv2.drawMatches(img1_resized, kp1, img2_resized, kp2, matches[:30], None, flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    return match_score, result, {'image1_keypoints': len(kp1), 'image2_keypoints': len(kp2), 'total_matches': len(matches), 'good_matches': len(good_matches)}

def histogram_comparison(img1, img2):
    img1_resized, img2_resized = resize_to_match(img1, img2)
    hsv1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2HSV)
    hsv2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2HSV)
    hist1 = cv2.calcHist([hsv1], [0, 1], None, [50, 60], [0, 180, 0, 256])
    hist2 = cv2.calcHist([hsv2], [0, 1], None, [50, 60], [0, 180, 0, 256])
    cv2.normalize(hist1, hist1, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist2, hist2, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    correlation = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
    bhattacharyya = cv2.compareHist(hist1, hist2, cv2.HISTCMP_BHATTACHARYYA)
    return {'correlation': float(correlation), 'bhattacharyya': float(bhattacharyya)}

def edge_detection_compare(img1, img2):
    img1_resized, img2_resized = resize_to_match(img1, img2)
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    blur1 = cv2.GaussianBlur(gray1, (5, 5), 0)
    blur2 = cv2.GaussianBlur(gray2, (5, 5), 0)
    edges1 = cv2.Canny(blur1, 50, 150)
    edges2 = cv2.Canny(blur2, 50, 150)
    diff = np.zeros((*edges1.shape, 3), dtype=np.uint8)
    diff[edges1 > 0] = [0, 255, 0]
    diff[edges2 > 0] = [0, 0, 255]
    diff[(edges1 > 0) & (edges2 > 0)] = [255, 255, 255]
    intersection = np.sum((edges1 > 0) & (edges2 > 0))
    union = np.sum((edges1 > 0) | (edges2 > 0))
    similarity = intersection / union if union > 0 else 0
    return similarity, diff

def absolute_difference(img1, img2):
    img1_resized, img2_resized = resize_to_match(img1, img2)
    diff = cv2.absdiff(img1_resized, img2_resized)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(diff_gray, 30, 255, cv2.THRESH_BINARY)
    heatmap = cv2.applyColorMap(diff_gray, cv2.COLORMAP_HOT)
    total_pixels = diff_gray.shape[0] * diff_gray.shape[1]
    changed_pixels = np.sum(thresh > 0)
    return {'difference_percentage': float((changed_pixels / total_pixels) * 100), 'changed_pixels': int(changed_pixels)}, heatmap

def template_matching(source_img, template_img):
    gray_source = cv2.cvtColor(source_img, cv2.COLOR_BGR2GRAY) if len(source_img.shape) == 3 else source_img
    gray_template = cv2.cvtColor(template_img, cv2.COLOR_BGR2GRAY) if len(template_img.shape) == 3 else template_img
    sh, sw = gray_source.shape
    th, tw = gray_template.shape
    if th > sh or tw > sw:
        if sh <= th and sw <= tw:
            source_img, template_img = template_img, source_img
            gray_source, gray_template = gray_template, gray_source
            sh, sw, th, tw = th, tw, sh, sw
        else:
            return None, None, f"Template ({tw}x{th}) is larger than source ({sw}x{sh})"
    res = cv2.matchTemplate(gray_source, gray_template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    top_left = max_loc
    bottom_right = (top_left[0] + tw, top_left[1] + th)
    result_img = source_img.copy()
    color = (0, 255, 0) if max_val >= 0.8 else (0, 255, 255) if max_val >= 0.5 else (0, 0, 255)
    cv2.rectangle(result_img, top_left, bottom_right, color, 3)
    return {'confidence': float(max_val), 'location': {'x': int(top_left[0]), 'y': int(top_left[1]), 'width': int(tw), 'height': int(th)}}, result_img, None


# ========================================
# AI Chat API
# ========================================

@app.route("/api/chat", methods=["POST"])
def chat():
    """Proxy chat requests to HuggingFace API"""
    try:
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json",
        }

        system_prompt = (
            "Du bist der professionelle KI-Assistent von Pascal Hintermaier. "
            "Antworte immer auf Deutsch. Gib NIEMALS deine internen Gedankengänge (wie <think>...</think>) in deiner Antwort aus. "
            "\n\n**Wichtige Hintergrundinformation (Die 'Gastro-to-IT' Story):**\n"
            "Pascal kommt ursprünglich aus der Gastronomie. Er war 6 Jahre lang im Gastro-Management tätig (u.a. Bar-Chef bei Fluidum UG, Dachgarten engelhorn). "
            "In dieser Zeit hat er seine Stressresistenz und Problemlösungskompetenz bewiesen. "
            "Seit 2023 hat er den vollen Wechsel in die IT vollzogen. Er ist also ein Quereinsteiger mit enormer Lernbereitschaft und praktischer Erfahrung in Linux, Python und Automation. "
            "Er behauptet NICHT, seit 10 Jahren in der Softwareentwicklung zu sein – sein Fokus liegt auf seinem frischen, energiegeladenen Neustart in der Systeminformatik und KI-Automation. "
            "\n\n**Expertise & Tech Stack:**\n"
            "- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion.\n"
            "- **Backend & Automation:** Python (OpenCV, Automation Scripts), Java, C#, SQL.\n"
            "- **Infrastruktur:** Linux (Pop!_OS mastered), Docker, Home-Lab Hosting, AWS.\n"
            "\n\n**Projekte:**\n"
            "- 'AI-Powered Portfolio Modernization': Diese Website!\n"
            "- 'Enhanced Image Comparison Tool': Python/OpenCV Tool zum Bildvergleich.\n"
            "- 'SmolLM3 Integration': Einbindung lokaler LLMs.\n"
            "\n\n**Ziele:**\n"
            "- Abschluss der Ausbildung/Vorbereitung zum IT-Systeminformatiker.\n"
            "- Kombination von klassischer IT-Infrastruktur mit moderner GenAI-Automation (RAG-Systeme).\n"
            "- Aufbau von autonomen Workflows und Computer Vision Projekten.\n"
            f"\n\nKontaktdaten: E-Mail: {os.getenv('CONTACT_EMAIL', 'pascal.hintermaier@example.com')}, "
            f"GitHub: {os.getenv('CONTACT_GITHUB', 'https://github.com/pascalhintermaier')}, "
            f"LinkedIn: {os.getenv('CONTACT_LINKEDIN', 'https://linkedin.com/in/pascal-hintermaier')}."
        )

        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 1000,
            "temperature": 0.7,
            "stream": False,
        }

        response = requests.post(f"{HF_API_URL}/v1/chat/completions", headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            generated_text = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            generated_text = re.sub(r'<think>[\s\S]*?(?:<\/think>|$)', '', generated_text).strip()
            return jsonify({"response": generated_text})
        else:
            return jsonify({"error": f"API error: {response.status_code}", "details": response.text}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================================
# Image Compare API
# ========================================

@app.route('/api/compare', methods=['POST'])
def compare_images():
    try:
        data = request.json
        img1 = decode_base64_image(data['image1'])
        img2 = decode_base64_image(data['image2'])
        if img1 is None or img2 is None: return jsonify({'error': 'Failed to decode images'}), 400
        
        ssim_score, ssim_diff = calculate_ssim(img1, img2)
        feature_score, feature_img, feature_stats = feature_matching(img1, img2)
        hist_scores = histogram_comparison(img1, img2)
        edge_sim, edge_diff = edge_detection_compare(img1, img2)
        abs_diff_stats, heatmap = absolute_difference(img1, img2)
        
        return jsonify({
            'success': True,
            'results': {
                'ssim': {'score': float(ssim_score), 'interpretation': 'identical' if ssim_score > 0.95 else 'similar' if ssim_score > 0.8 else 'different', 'diff_image': encode_image_base64(ssim_diff)},
                'features': {'match_score': float(feature_score), 'stats': feature_stats, 'visualization': encode_image_base64(feature_img)},
                'histogram': hist_scores,
                'edges': {'similarity': float(edge_sim), 'diff_image': encode_image_base64(edge_diff)},
                'pixel_diff': {**abs_diff_stats, 'heatmap': encode_image_base64(heatmap)}
            }
        })
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/template-match', methods=['POST'])
def template_match():
    try:
        data = request.json
        source = decode_base64_image(data['image1'])
        template = decode_base64_image(data['image2'])
        stats, result_img, error = template_matching(source, template)
        if error: return jsonify({'success': False, 'error': error}), 400
        return jsonify({'success': True, 'results': {'match': stats, 'visualization': encode_image_base64(result_img)}})
    except Exception as e: return jsonify({'error': str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_NAME, "opencv": cv2.__version__})


if __name__ == "__main__":
    print(f"🚀 Starting Unified AI & CV Backend...")
    app.run(host="0.0.0.0", port=5000, debug=True)
