# Bamboo calculator → amoCRM (Cloudflare Worker)

The GitHub Pages site remains hosted on GitHub. The Worker receives the calculator form and creates a contact, lead with tag **Бамбук**, budget, and a full-specification note.

## Deploy

1. Create a Cloudflare account and deploy this Worker using the `worker/` directory (Wrangler: `npx wrangler deploy`). Alternatively connect this GitHub repository to Cloudflare Workers Builds and use `worker` as the root directory.
2. Find the actual **Объекты** pipeline ID, target status ID, and responsible user ID in amoCRM. Set `AMO_PIPELINE_ID`, `AMO_STATUS_ID`, `AMO_RESPONSIBLE_USER_ID` in `wrangler.toml`. Do not guess them.
3. Configure Worker secrets: `AMO_SUBDOMAIN=nimtech` (if accurate), `AMO_ACCESS_TOKEN` from an authorized amoCRM integration. Never commit credentials.
4. For automatic token refresh configure `AMO_CLIENT_ID`, `AMO_CLIENT_SECRET`, `AMO_REFRESH_TOKEN`, `AMO_REDIRECT_URI`, and create a Cloudflare KV namespace bound as `TOKENS`. Otherwise the integration stops when the access token expires.
5. Deploy and copy the resulting HTTPS `*.workers.dev` endpoint. In the website `index.html`, set `window.NIMTECH_AMO_LEAD_ENDPOINT` to that URL **before** the calculator handler runs. This endpoint URL is public; credentials remain private in Worker secrets.
6. Submit a test lead with consent, verify the contact, deal budget, tag, and note in amoCRM.

The Worker rejects origins other than `https://bamboo.nimtech.ru`. Origin checks are not authentication or spam protection; add Cloudflare Turnstile and rate limiting before sustained production use. A partial CRM failure may leave a contact or lead; add idempotency and retry reconciliation for production reliability. Do not submit live customer data until privacy documents and the integration are verified.
