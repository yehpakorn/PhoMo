# PhoMo
PhoMo is an AI-powered idea generator built with n8n and Google Gemini.
This guide shows you how to install, run, and keep workflows saved.

## 1. Install n8n

### Option A: Node.js (quick start)
Requires Node.js >=18.
```bash
npm install -g n8n
n8n
```

### Option B: Docker (recommended, saves workflows)
```bash
docker run -it   --name n8n   -p 5678:5678   -v ~/.n8n:/home/node/.n8n   n8nio/n8n
```
- n8n UI: http://localhost:5678
- The -v ~/.n8n:/home/node/.n8n ensures workflows and credentials are saved.

## 2. Get a Google Gemini API Key
1. Open https://aistudio.google.com/
2. Create a new API key
3. Copy it (looks like AIza...)

## 3. Add Credentials in n8n
1. Go to http://localhost:5678
2. Click Credentials → New
3. Choose Google PaLM / Gemini API
4. Paste your API key and save

## 4. Import PhoMo Workflows
1. Download from repo’s N8N folder:
   - PhoMo_context-N8N.json
   - PhoMo_image-N8N.json
2. In n8n: Import → From File → choose each file
3. Link your Gemini credential when asked

Now you have 2 workflows:
- Text idea generator
- Image generator

## 5. Run the Workflow
1. In the workflow editor, click the Webhook node → copy the test URL (example: http://localhost:5678/webhook-test/idea-request)
2. Send a request:
```bash
curl -X POST http://localhost:5678/webhook-test/idea-request   -H "Content-Type: application/json"   -d '{
        "action": "choose",
        "query": {
          "scope": "การศึกษา",
          "purpose": "พัฒนาหลักสูตร",
          "addition": "ใช้เทคโนโลยี AI"
        }
      }'
```

You will get an AI-generated JSON response.  
Run the image workflow the same way for images.

## 6. Make Workflows Live
- Toggle workflow Active (top right)
- Use the production webhook (example: http://localhost:5678/webhook/idea-request)

## 7. Run the PhoMo Website
1. Download the repo files and replace your_webhook with your webhook url
   ```
   my-site/
   ├─ index.html
   ├─ service.html
   ├─ contact.html
   ├─ css/
   ├─ js/
   ├─ img/
   ├─ N8N/
   ```
2. Run the site locally:

### Python (comes pre-installed on macOS/Linux/Windows):
```bash
cd my-site
python3 -m http.server 8000
```
Open: http://localhost:8000

### Node.js:
```bash
npm install -g serve
serve .
```
Open the given URL (usually http://localhost:5000)

### VS Code (if installed):
- Install Live Server extension
- Right-click index.html → Open with Live Server

## 8. Share Your Site (Optional)

### ngrok:
```bash
ngrok http 8000
```

### Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:8000
```
