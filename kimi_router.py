"""Chat with Kimi K3 (Moonshot AI) via OpenRouter or the direct Moonshot API.

Usage:
    python kimi_router.py "Your question here"
    python kimi_router.py            # interactive chat mode

Set KIMI_PROVIDER=openrouter (default) or KIMI_PROVIDER=moonshot in .env.
See .env.example for the API key variables each provider needs.
"""

import os
import sys

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

PROVIDERS = {
    "openrouter": {
        "base_url": "https://openrouter.ai/api/v1",
        "key_env": "OPENROUTER_API_KEY",
        "default_model": "moonshotai/kimi-k3",
        "key_url": "https://openrouter.ai/keys",
    },
    "moonshot": {
        "base_url": "https://api.moonshot.cn/v1",
        "key_env": "MOONSHOT_API_KEY",
        "default_model": "kimi-k3",
        "key_url": "https://platform.kimi.ai",
    },
}

PROVIDER_NAME = os.getenv("KIMI_PROVIDER", "openrouter").lower()
if PROVIDER_NAME not in PROVIDERS:
    sys.exit(
        f"Error: unknown KIMI_PROVIDER '{PROVIDER_NAME}'. "
        f"Use one of: {', '.join(PROVIDERS)}"
    )
PROVIDER = PROVIDERS[PROVIDER_NAME]
MODEL_ID = os.getenv("KIMI_MODEL_ID", PROVIDER["default_model"])


def build_client() -> OpenAI:
    api_key = os.getenv(PROVIDER["key_env"])
    if not api_key:
        sys.exit(
            f"Error: {PROVIDER['key_env']} is not set.\n"
            f"Copy .env.example to .env and add your key from {PROVIDER['key_url']}"
        )
    return OpenAI(base_url=PROVIDER["base_url"], api_key=api_key)


def ask(client: OpenAI, messages: list[dict]) -> str:
    """Send messages to Kimi K3 and stream the reply to stdout."""
    stream = client.chat.completions.create(
        model=MODEL_ID,
        messages=messages,
        stream=True,
    )
    reply_parts: list[str] = []
    for chunk in stream:
        delta = chunk.choices[0].delta.content or ""
        print(delta, end="", flush=True)
        reply_parts.append(delta)
    print()
    return "".join(reply_parts)


def main() -> None:
    client = build_client()
    messages: list[dict] = [
        {"role": "system", "content": "You are Kimi K3, a helpful assistant."}
    ]

    if len(sys.argv) > 1:
        messages.append({"role": "user", "content": " ".join(sys.argv[1:])})
        ask(client, messages)
        return

    print(f"Chatting with {MODEL_ID} via {PROVIDER_NAME}. Type 'exit' to quit.\n")
    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user_input or user_input.lower() in {"exit", "quit"}:
            break
        messages.append({"role": "user", "content": user_input})
        print("Kimi: ", end="", flush=True)
        reply = ask(client, messages)
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
