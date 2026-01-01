
import requests
import base64
import cv2
import os

API_URL = "http://localhost:5000/api/template-match"

def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

try:
    # Use absolute paths
    scene_path = os.path.abspath("example-fishing-scene.png")
    template_path = os.path.abspath("example-fishing-template.png")

    print(f"Loading scene from: {scene_path}")
    print(f"Loading template from: {template_path}")

    img1 = encode_image(scene_path)
    img2 = encode_image(template_path)

    payload = {
        "image1": img1,
        "image2": img2
    }

    print("Sending request...")
    response = requests.post(API_URL, json=payload)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Response Error: {response.text[:200]}") # Only print first 200 chars
    else:
        print("Success!")

except Exception as e:
    print(f"Error: {e}")
