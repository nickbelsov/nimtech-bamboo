# NimTech Bamboo → Google Sheets → amoCRM

The site submits its homepage and /calculator/ forms to the Cloudflare Worker at `https://nimtech-bamboo.nick-belsov.workers.dev`.

The Worker now forwards valid lead payloads to the Google Apps Script web app and requires an explicit `{ok:true}` acknowledgment before confirming success to the visitor. The Google Sheet is the durable inbox; the amoCRM synchronization is a separate next step.

## Deploy Worker

1. In Cloudflare dashboard open Workers & Pages → `nimtech-bamboo` (verify the existing `workers.dev` hostname), and deploy `worker/src/index.js` from repository `nickbelsov/nimtech-bamboo` branch `main`. If Git integration is configured, select **Deploy latest commit**; otherwise use Wrangler in the repository's `worker/` folder: `npx wrangler deploy` with your authenticated Cloudflare account.
2. Keep `ALLOWED_ORIGIN=https://bamboo.nimtech.ru`.
3. Verify the Worker responds to a browser CORS preflight, then send a consented test lead from the website and confirm one new row in the Google Sheet `! заявки с babmoo.nimtech.ru`.
4. Check the row includes name, phone, budget and full calculator specification. Confirm duplicate IDs do not create duplicate rows.
5. Only then implement the separate Apps Script automation to create amoCRM deals and update the CRM status fields.

**Do not replace the existing Worker in production without a rollback path.** The prior Worker creates amoCRM deals directly, whereas the new version stores leads in Sheets and does not create deals until the separate synchronization script is deployed. Deploying it before CRM synchronization would interrupt the current CRM flow.

Apps Script intake source: `integrations/google-sheets/Code.gs`. Deployed web-app URL is configured in `worker/src/index.js`.
