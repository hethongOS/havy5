# havy5 — Kimi K3 via OpenRouter

Setup for chatting with **Kimi K3** (Moonshot AI's flagship model, 1M-token context)
through the [OpenRouter](https://openrouter.ai) router. The model ID used is
`moonshotai/kimi-k3`.

## Setup

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Get an API key at [openrouter.ai/keys](https://openrouter.ai/keys) and add credits
   to your OpenRouter account.

3. Create your `.env` file:

   ```bash
   cp .env.example .env
   # then edit .env and paste your OPENROUTER_API_KEY
   ```

## Usage

Ask a single question:

```bash
python kimi_router.py "Explain how a router works"
```

Or start an interactive chat:

```bash
python kimi_router.py
```

## Notes

- OpenRouter is OpenAI-API-compatible, so the standard `openai` SDK is used with
  `base_url` set to `https://openrouter.ai/api/v1`.
- To route to a different model, set `KIMI_MODEL_ID` in `.env`
  (e.g. `moonshotai/kimi-k2` or any other OpenRouter model slug).
- Pricing for Kimi K3 on OpenRouter follows Moonshot's rates ($3 input / $15 output per 1M tokens).
