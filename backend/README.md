# AI Chat Backend

Simple Flask proxy for HuggingFace API to avoid CORS issues.

## Setup

```bash
# Install Python dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configure

Add your HuggingFace API token to `.env` file in project root:

```
HF_TOKEN=hf_your_actual_token_here
```

## Run

```bash
python app.py
```

Server will start on http://localhost:5000

## Test

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","model":"HuggingFaceTB/SmolLM3-3B"}`

## API Endpoints

### POST /api/chat

Request:
```json
{
  "message": "Hello, how are you?"
}
```

Response:
```json
{
  "response": "I'm doing well, thank you!"
}
```

## Notes

- This backend proxies requests to HuggingFace Inference API
- Adds CORS headers to allow browser access
- Handles errors gracefully
- 30 second timeout for API requests
