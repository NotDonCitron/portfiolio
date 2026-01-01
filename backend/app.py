from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Configuration
HF_API_URL = "https://router.huggingface.co"
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HF_API_TOKEN") or os.getenv("VITE_HF_API_TOKEN") or ""
MODEL_NAME = os.getenv("HF_MODEL", "HuggingFaceTB/SmolLM3-3B")


@app.route("/api/chat", methods=["POST"])
def chat():
    """Proxy chat requests to HuggingFace API"""
    try:
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Call HuggingFace Router API (OpenAI-compatible)
        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json",
        }

        system_prompt = (
            "Du bist der professionelle KI-Assistent von Pascal Hintermaier. "
            "Antworte immer auf Deutsch. Gib NIEMALS deine internen Gedankengänge (wie <think>...</think>) in deiner Antwort aus. "
            "Deine Aufgabe ist es, Fragen zu Pascals Projekten, Fähigkeiten und seinem Hintergrund als IT-Experte zu beantworten. "
            f"Kontaktdaten: E-Mail: {os.getenv('CONTACT_EMAIL', 'pascal.hintermaier@example.com')}, "
            f"GitHub: {os.getenv('CONTACT_GITHUB', 'Kein GitHub')}, "
            f"LinkedIn: {os.getenv('CONTACT_LINKEDIN', 'Kein LinkedIn')}."
        )

        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 500,
            "temperature": 0.7,
            "stream": False,
        }

        response = requests.post(
            f"{HF_API_URL}/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30,
        )

        if response.status_code == 200:
            result = response.json()
            generated_text = result.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Strip <think> tags and their content
            import re
            generated_text = re.sub(r'<think>[\s\S]*?<\/think>', '', generated_text).strip()

            return jsonify({"response": generated_text})
        else:
            return jsonify(
                {
                    "error": f"API error: {response.status_code}",
                    "details": response.text,
                }
            ), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timeout"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "model": MODEL_NAME})


if __name__ == "__main__":
    print(f"🚀 Starting AI Chat Proxy Server...")
    print(f"📊 Model: {MODEL_NAME}")
    print(f"🔗 API URL: {HF_API_URL}")
    app.run(host="0.0.0.0", port=5000, debug=True)
