"""
Image Compare API - OpenCV Backend
Author: Kevin Hintermaier

A Flask REST API demonstrating OpenCV image processing skills:
- Structural Similarity Index (SSIM)
- Feature Detection (ORB)
- Template Matching
- Histogram Comparison
- Edge Detection (Canny)
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
import base64
import io
from PIL import Image
import tempfile
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ========================================
# Utility Functions
# ========================================

def decode_base64_image(base64_string):
    """Decode base64 string to OpenCV image."""
    # Remove data URL prefix if present
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
    
    # Use the larger dimensions
    target_h = max(h1, h2)
    target_w = max(w1, w2)
    
    img1_resized = cv2.resize(img1, (target_w, target_h))
    img2_resized = cv2.resize(img2, (target_w, target_h))
    
    return img1_resized, img2_resized

# ========================================
# OpenCV Comparison Algorithms
# ========================================

def calculate_ssim(img1, img2):
    """
    Calculate Structural Similarity Index (SSIM).
    SSIM measures perceived quality and structural information.
    Returns a score from -1 to 1, where 1 means identical.
    """
    img1_resized, img2_resized = resize_to_match(img1, img2)
    
    # Convert to grayscale
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    
    # Calculate SSIM
    score, diff = ssim(gray1, gray2, full=True)
    
    # Convert diff to displayable image
    diff = (diff * 255).astype("uint8")
    
    # Create a colored diff visualization
    diff_colored = cv2.applyColorMap(255 - diff, cv2.COLORMAP_JET)
    
    return score, diff_colored

def feature_matching(img1, img2):
    """
    Feature detection and matching using ORB (Oriented FAST and Rotated BRIEF).
    ORB is a fast and efficient alternative to SIFT/SURF.
    """
    img1_resized, img2_resized = resize_to_match(img1, img2)
    
    # Convert to grayscale
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    
    # Initialize ORB detector
    orb = cv2.ORB_create(nfeatures=500)
    
    # Find keypoints and descriptors
    kp1, des1 = orb.detectAndCompute(gray1, None)
    kp2, des2 = orb.detectAndCompute(gray2, None)
    
    # Handle case where no features found
    if des1 is None or des2 is None:
        return 0, img1_resized, []
    
    # Create BFMatcher
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    
    # Match descriptors
    matches = bf.match(des1, des2)
    
    # Sort by distance
    matches = sorted(matches, key=lambda x: x.distance)
    
    # Calculate match score (percentage of good matches)
    good_matches = [m for m in matches if m.distance < 50]
    match_score = len(good_matches) / max(len(kp1), len(kp2)) * 100 if kp1 and kp2 else 0
    
    # Draw matches
    result = cv2.drawMatches(
        img1_resized, kp1, 
        img2_resized, kp2, 
        matches[:30],  # Show top 30 matches
        None, 
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )
    
    return match_score, result, {
        'image1_keypoints': len(kp1),
        'image2_keypoints': len(kp2),
        'total_matches': len(matches),
        'good_matches': len(good_matches)
    }

def histogram_comparison(img1, img2):
    """
    Compare images using color histogram correlation.
    Uses HSV color space for better color representation.
    """
    img1_resized, img2_resized = resize_to_match(img1, img2)
    
    # Convert to HSV
    hsv1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2HSV)
    hsv2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2HSV)
    
    # Calculate histograms
    hist1 = cv2.calcHist([hsv1], [0, 1], None, [50, 60], [0, 180, 0, 256])
    hist2 = cv2.calcHist([hsv2], [0, 1], None, [50, 60], [0, 180, 0, 256])
    
    # Normalize histograms
    cv2.normalize(hist1, hist1, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist2, hist2, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    
    # Compare using different methods
    correlation = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
    chi_square = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CHISQR)
    intersection = cv2.compareHist(hist1, hist2, cv2.HISTCMP_INTERSECT)
    bhattacharyya = cv2.compareHist(hist1, hist2, cv2.HISTCMP_BHATTACHARYYA)
    
    return {
        'correlation': float(correlation),  # 1 = identical, -1 = opposite
        'chi_square': float(chi_square),    # 0 = identical, higher = different
        'intersection': float(intersection),
        'bhattacharyya': float(bhattacharyya)  # 0 = identical, 1 = completely different
    }

def edge_detection_compare(img1, img2, low_threshold=50, high_threshold=150):
    """
    Compare images using Canny edge detection.
    Useful for detecting structural changes.
    """
    img1_resized, img2_resized = resize_to_match(img1, img2)
    
    # Convert to grayscale
    gray1 = cv2.cvtColor(img1_resized, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2_resized, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blur1 = cv2.GaussianBlur(gray1, (5, 5), 0)
    blur2 = cv2.GaussianBlur(gray2, (5, 5), 0)
    
    # Canny edge detection
    edges1 = cv2.Canny(blur1, low_threshold, high_threshold)
    edges2 = cv2.Canny(blur2, low_threshold, high_threshold)
    
    # Create difference visualization
    # Green = edges only in img1, Red = edges only in img2, White = common
    diff = np.zeros((*edges1.shape, 3), dtype=np.uint8)
    diff[edges1 > 0] = [0, 255, 0]  # Green for image 1
    diff[edges2 > 0] = [0, 0, 255]  # Red for image 2
    diff[(edges1 > 0) & (edges2 > 0)] = [255, 255, 255]  # White for both
    
    # Calculate edge similarity
    intersection = np.sum((edges1 > 0) & (edges2 > 0))
    union = np.sum((edges1 > 0) | (edges2 > 0))
    similarity = intersection / union if union > 0 else 0
    
    return similarity, edges1, edges2, diff

def absolute_difference(img1, img2, threshold=30):
    """
    Calculate absolute pixel difference between images.
    Returns a heatmap showing differences.
    """
    img1_resized, img2_resized = resize_to_match(img1, img2)
    
    # Calculate absolute difference
    diff = cv2.absdiff(img1_resized, img2_resized)
    
    # Convert to grayscale for analysis
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    
    # Apply threshold to highlight significant differences
    _, thresh = cv2.threshold(diff_gray, threshold, 255, cv2.THRESH_BINARY)
    
    # Create colored heatmap
    heatmap = cv2.applyColorMap(diff_gray, cv2.COLORMAP_HOT)
    
    # Calculate statistics
    total_pixels = diff_gray.shape[0] * diff_gray.shape[1]
    changed_pixels = np.sum(thresh > 0)
    difference_percentage = (changed_pixels / total_pixels) * 100
    
    return {
        'difference_percentage': float(difference_percentage),
        'changed_pixels': int(changed_pixels),
        'total_pixels': int(total_pixels),
        'mean_difference': float(np.mean(diff_gray)),
        'max_difference': int(np.max(diff_gray))
    }, heatmap, thresh

def template_matching(source_img, template_img):
    """
    Find the location of template_img within source_img.
    Returns the location, confidence, and visualization.
    """
    # Convert to grayscale
    if len(source_img.shape) == 3:
        gray_source = cv2.cvtColor(source_img, cv2.COLOR_BGR2GRAY)
    else:
        gray_source = source_img
        
    if len(template_img.shape) == 3:
        gray_template = cv2.cvtColor(template_img, cv2.COLOR_BGR2GRAY)
    else:
        gray_template = template_img
        
    # Check dimensions
    sh, sw = gray_source.shape
    th, tw = gray_template.shape
    
    if th > sh or tw > sw:
        # Check if swapping allows a match (i.e. if the "template" is actually the scene)
        if sh <= th and sw <= tw:
            print(f"DEBUG: Swapping images. Treating image2 as Source ({tw}x{th}) and image1 as Template ({sw}x{sh})")
            source_img, template_img = template_img, source_img
            # Swap grayscale versions too
            gray_source, gray_template = gray_template, gray_source
            # Update dimensions
            sh, sw = th, tw
            th, tw = gray_template.shape
        else:
            print(f"DEBUG: Size mismatch! Source: {sw}x{sh}, Template: {tw}x{th}")
            return None, None, f"Template ({tw}x{th}) is larger than source image ({sw}x{sh})"
        
    # Match template
    # TM_CCOEFF_NORMED returns 1 for perfect match, -1 for inverse
    res = cv2.matchTemplate(gray_source, gray_template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    
    # Get coordinates
    top_left = max_loc
    bottom_right = (top_left[0] + tw, top_left[1] + th)
    
    # Draw rectangle on source image copy
    result_img = source_img.copy()
    
    # Color based on confidence (Green > 0.8, Yellow > 0.5, Red < 0.5)
    color = (0, 255, 0)
    if max_val < 0.8:
        color = (0, 255, 255)
    if max_val < 0.5:
        color = (0, 0, 255)
        
    cv2.rectangle(result_img, top_left, bottom_right, color, 3)
    
    # Add confidence text
    text = f"Match: {max_val*100:.1f}%"
    cv2.putText(result_img, text, (top_left[0], top_left[1] - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
                
    return {
        'confidence': float(max_val),
        'location': {
            'x': int(top_left[0]),
            'y': int(top_left[1]),
            'width': int(tw),
            'height': int(th)
        }
    }, result_img, None

# ========================================
# API Routes
# ========================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'opencv_version': cv2.__version__
    })

@app.route('/api/compare', methods=['POST'])
def compare_images():
    """
    Main comparison endpoint.
    Accepts two base64 encoded images and returns all comparison metrics.
    """
    try:
        data = request.json
        
        if 'image1' not in data or 'image2' not in data:
            return jsonify({'error': 'Both image1 and image2 are required'}), 400
        
        # Decode images
        img1 = decode_base64_image(data['image1'])
        img2 = decode_base64_image(data['image2'])
        
        if img1 is None or img2 is None:
            return jsonify({'error': 'Failed to decode images'}), 400
        
        # Calculate SSIM
        ssim_score, ssim_diff = calculate_ssim(img1, img2)
        
        # Feature matching
        feature_score, feature_img, feature_stats = feature_matching(img1, img2)
        
        # Histogram comparison
        histogram_scores = histogram_comparison(img1, img2)
        
        # Edge detection
        edge_similarity, edges1, edges2, edge_diff = edge_detection_compare(img1, img2)
        
        # Absolute difference
        abs_diff_stats, heatmap, diff_thresh = absolute_difference(img1, img2)
        
        return jsonify({
            'success': True,
            'results': {
                'ssim': {
                    'score': float(ssim_score),
                    'interpretation': 'identical' if ssim_score > 0.95 else 'similar' if ssim_score > 0.8 else 'different',
                    'diff_image': encode_image_base64(ssim_diff)
                },
                'features': {
                    'match_score': float(feature_score),
                    'stats': feature_stats,
                    'visualization': encode_image_base64(feature_img)
                },
                'histogram': histogram_scores,
                'edges': {
                    'similarity': float(edge_similarity),
                    'diff_image': encode_image_base64(edge_diff)
                },
                'pixel_diff': {
                    **abs_diff_stats,
                    'heatmap': encode_image_base64(heatmap),
                    'threshold_mask': encode_image_base64(diff_thresh)
                }
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ssim', methods=['POST'])
def ssim_endpoint():
    """Calculate SSIM only."""
    try:
        data = request.json
        img1 = decode_base64_image(data['image1'])
        img2 = decode_base64_image(data['image2'])
        
        score, diff = calculate_ssim(img1, img2)
        
        return jsonify({
            'score': float(score),
            'diff_image': encode_image_base64(diff)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/features', methods=['POST'])
def features_endpoint():
    """Feature matching only."""
    try:
        data = request.json
        img1 = decode_base64_image(data['image1'])
        img2 = decode_base64_image(data['image2'])
        
        score, result, stats = feature_matching(img1, img2)
        
        return jsonify({
            'match_score': float(score),
            'stats': stats,
            'visualization': encode_image_base64(result)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/edges', methods=['POST'])
def edges_endpoint():
    """Edge detection comparison."""
    try:
        data = request.json
        img1 = decode_base64_image(data['image1'])
        img2 = decode_base64_image(data['image2'])
        
        low = data.get('low_threshold', 50)
        high = data.get('high_threshold', 150)
        
        similarity, edges1, edges2, diff = edge_detection_compare(img1, img2, low, high)
        
        return jsonify({
            'similarity': float(similarity),
            'edges1': encode_image_base64(edges1),
            'edges2': encode_image_base64(edges2),
            'diff_image': encode_image_base64(diff)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/template-match', methods=['POST'])
def template_match_endpoint():
    """Template matching endpoint."""
    try:
        data = request.json
        if 'image1' not in data or 'image2' not in data:
            return jsonify({'error': 'Both image1 (Source) and image2 (Template) are required'}), 400
            
        source = decode_base64_image(data['image1'])
        template = decode_base64_image(data['image2'])
        
        stats, result_img, error = template_matching(source, template)
        
        if error:
            return jsonify({'success': False, 'error': error}), 400
            
        return jsonify({
            'success': True,
            'results': {
                'match': stats,
                'visualization': encode_image_base64(result_img)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================================
# Main Entry Point
# ========================================

if __name__ == '__main__':
    print("🔍 Image Compare API - OpenCV Backend")
    print(f"   OpenCV Version: {cv2.__version__}")
    print("   Starting server on http://localhost:5000")
    app.run(debug=True, port=5000)
