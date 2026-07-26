# havy5 — Kimi K3 via OpenRouter

Setup for chatting with **Kimi K3** (Moonshot AI's flagship model, 1M-token context).
Two providers are supported, selectable via `KIMI_PROVIDER` in `.env`:

- **openrouter** (default) — routes through [OpenRouter](https://openrouter.ai),
  model ID `moonshotai/kimi-k3`. One key for many models, pay-as-you-go.
- **moonshot** — calls Moonshot's API directly (`https://api.moonshot.cn/v1`),
  model ID `kimi-k3`. New accounts at [platform.kimi.ai](https://platform.kimi.ai)
  usually get free trial credits.

## Setup

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Get an API key:
   - OpenRouter: [openrouter.ai/keys](https://openrouter.ai/keys) (add credits to your account), or
   - Moonshot direct: [platform.kimi.ai](https://platform.kimi.ai) (free trial credits for new accounts).

3. Create your `.env` file:

   ```bash
   cp .env.example .env
   # then edit .env: pick KIMI_PROVIDER and paste the matching API key
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

- Both providers are OpenAI-API-compatible, so the standard `openai` SDK is used —
  only the `base_url` and model slug differ.
- To route to a different model, set `KIMI_MODEL_ID` in `.env`
  (e.g. `moonshotai/kimi-k2` on OpenRouter).
- Pricing for Kimi K3 is $3 input / $15 output per 1M tokens on both routes.
  Free chat (no API) is available at [kimi.com](https://kimi.com).
