"""Chat with Kimi K3 (Moonshot AI) through the OpenRouter router.

Usage:
    python kimi_router.py "Your question here"
    python kimi_router.py            # interactive chat mode

Requires the OPENROUTER_API_KEY environment variable (see .env.example).
"""

import os
import sys

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

ROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_ID = os.getenv("KIMI_MODEL_ID", "moonshotai/kimi-k3")


def build_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit(
            "Error: OPENROUTER_API_KEY is not set.\n"
            "Copy .env.example to .env and add your key from https://openrouter.ai/keys"
        )
    return OpenAI(base_url=ROUTER_BASE_URL, api_key=api_key)


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

    print(f"Chatting with {MODEL_ID} via OpenRouter. Type 'exit' to quit.\n")
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
