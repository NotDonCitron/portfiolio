
import requests
import base64
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

    # SWAP THEM: image1 = Template, image2 = Scene
    # This simulates the error condition
    payload = {
        "image1": img2, # Template as Source
        "image2": img1  # Scene as Template
    }

    print("Sending request with SWAPPED images...")
    response = requests.post(API_URL, json=payload)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Response Error: {response.text[:200]}") 
    else:
        print("Success! Backend handled the swap.")

except Exception as e:
    print(f"Error: {e}")
