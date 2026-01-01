
import requests
import base64
import os
import sys

API_URL = "http://localhost:5000/api/template-match"

def encode_image(path):
    # Try to find the file in the current directory or absolute path
    if not os.path.exists(path):
        # Try finding it in the project folder if running from root
        alternative_path = os.path.join("public/projects/image-compare", path)
        if os.path.exists(alternative_path):
            path = alternative_path
            
    try:
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"❌ Error: File not found: {path}")
        return None

def test_scenario(name, source_file, template_file, expected_confidence=0.8):
    print(f"\n--- Testing Scenario: {name} ---")
    
    img1 = encode_image(source_file)
    img2 = encode_image(template_file)
    
    if not img1 or not img2:
        return False

    payload = {
        "image1": img1, # Source
        "image2": img2  # Template
    }

    try:
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                confidence = data["results"]["match"]["confidence"]
                print(f"✅ Match Found!")
                print(f"   Confidence: {confidence:.2f} (Target: > {expected_confidence})")
                print(f"   Location: {data['results']['match']['location']}")
                
                if confidence >= expected_confidence:
                    print("   RESULT: PASS")
                    return True
                else:
                    print("   RESULT: FAIL (Low Confidence)")
                    return False
            else:
                print(f"❌ API Error: {data.get('error')}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text[:100]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the backend server running on port 5000?")
        return False

def main():
    print("🔍 Starting API Scenario Verification...")
    
    # Check if backend is reachable
    try:
        requests.get("http://localhost:5000/api/health")
    except:
        print("⚠️ Backend seems offline. Please start it with: python backend/app.py")
        sys.exit(1)

    passed = 0
    total = 0

    # Test Security Scenario
    total += 1
    if test_scenario("Security CCTV", "example-security-source.png", "example-security-template.png"):
        passed += 1

    # Test UI Scenario
    total += 1
    if test_scenario("UI Testing", "example-ui-source.png", "example-ui-template.png"):
        passed += 1

    print(f"\nSummary: {passed}/{total} Tests Passed")
    
    if passed == total:
        print("🎉 ALL SCENARIOS VERIFIED SUCCESSFULLY")
        sys.exit(0)
    else:
        print("🛑 SOME TESTS FAILED")
        sys.exit(1)

if __name__ == "__main__":
    main()
