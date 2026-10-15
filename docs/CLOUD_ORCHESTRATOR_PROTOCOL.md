# HAVY5 CLOUD ORCHESTRATION — POC V1
Status: infrastructure prepared in LAB only. It is NOT running until auth and workflow activation.
Coordinator: ChatGPT; worker: Antigravity CLI in ephemeral GitHub Actions runner; independent KCS: separate GitHub Actions on pull requests. Notion: detailed operations, Drive: source documents, GitHub: code+evidence.
Flow: work order → headless agent → npm build/test → agent branch → PR into LAB → KCS → Founder Gate before production.
Requirements:
1. Founder provides GEMINI_API_KEY via GitHub Settings > Secrets and variables > Actions (never paste key in chat or source).
2. GitHub Actions workflow_dispatch requires workflow file on default branch. Review and merge workflow-only PR to main before running; do NOT merge website code nor publish.
3. Use Actions UI Run workflow, choose phase and branch main. Checkout remains LAB. Logs show Antigravity stream-json.
4. Verify the repository allows GITHUB_TOKEN create PR; configure Actions PR permissions if needed.
5. Set budget caps: Github Actions minutes and Gemini API key may incur charges. Google AI Pro subscription is not a guaranteed Gemini API allowance.
No dangerously-skip-permissions; no direct production credentials; no auto deployment or main merge. Run remains UNTESTED until first successful action.
Current baseline havy5/main only contains README.md (verified 2026-10-14). Build P06 first when activated.

Hands-free dispatch after activation: create GitHub issue (as hethongOS) with EXACT title [HAVY] P06_FOUNDATION, [HAVY] P04_CONTENT, [HAVY] P05_UX, or [HAVY] P07_FIX. Workflow issues.opened runs only for exact allowlisted titles and exact owner. The coordinator can create such issues using the connected GitHub tool, so Founder need not click a Run button. Only the stage token enters the agent prompt; issue body is NOT passed to agent to reduce prompt-injection risk. Every run generates an isolated agent/* branch and PR back to LAB, never main.
