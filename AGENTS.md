# Hermes Chat ⚡

A lightweight web chat app for talking to the Hermes AI model (or any OpenAI-compatible API). Backend is a single Node.js HTTP server (`server.js`) using only built-in modules; frontend is static vanilla HTML/CSS/JS in `public/`. There is no build step and no runtime dependencies.

## Cursor Cloud specific instructions

- Single service: run the app with `node server.js` (or `npm start`). It serves the UI and the `/api/*` endpoints on `http://localhost:3000` (`PORT` overrides the port).
- No build step, no lint config, and no automated tests exist in this repo. "Verifying" means running the server and exercising the endpoints.
- With no `HERMES_API_KEY` set and no local Ollama running, the server starts in **DEMO mode** and streams a canned reply — this is the normal, fully working state in the cloud VM and is enough to test the app end-to-end. Console/UI messages are in Vietnamese.
- Quick endpoint checks: `GET /api/config` returns model/demoMode/baseUrl; `POST /api/chat` with `{"messages":[{"role":"user","content":"..."}]}` streams Server-Sent Events (`event: delta` chunks then `event: done`).
- To exercise a real (non-demo) model you'd need external egress plus either a running Ollama on port 11434 or `HERMES_API_KEY` (OpenRouter); neither is required for local development/testing.
- Enabling a real local LLM (optional, not in the update script — it's a large/optional external dependency): install Ollama (`apt-get install -y zstd` first, then `curl -fsSL https://ollama.com/install.sh | sh`). systemd is not running in the VM, so start it manually with `ollama serve` (background/tmux), `ollama pull qwen2.5:0.5b` (small, fast on CPU), then **restart `node server.js`** so `detectConfig()` picks up Ollama and flips out of DEMO mode. `GET /api/config` will then report `demoMode:false`.
