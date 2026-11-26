# Security Plan – Custom Frontend + Headless WordPress

This plan covers the public website, WordPress backend, REST API, enquiry handling and integrations. It reduces risk; no setup can promise complete immunity from attack.

## 1. Protect the WordPress backend

- Keep WordPress, PHP, themes and plugins updated.
- Use a small number of trusted plugins.
- Remove unused themes, plugins and admin accounts.
- Require MFA for administrator and editor accounts.
- Use unique strong passwords and a password manager.
- Use separate named accounts; avoid shared admin logins.
- Limit administrator access to people who need it.
- Use a reputable security plugin and hosting-level firewall.
- Keep daily backups and test restoring them.
- Restrict the CMS login/admin area where practical.
- Disable XML-RPC if the site does not need it and the host/plugin setup permits it.
- Do not expose staging or backup directories to search engines or the public.

## 2. WordPress REST API

- Expose only the public content required by the frontend.
- Ensure custom post types and fields are registered intentionally for REST.
- Never return user records, private drafts, password hashes, internal notes or admin-only metadata.
- Use unauthenticated read access only for content intended to be public.
- Keep Application Passwords and any privileged CMS token server-side.
- Never put CMS credentials in React components, browser bundles or `NEXT_PUBLIC_*` variables.
- Restrict CORS to the public website origin if browser-to-WordPress calls are used. Prefer server-side fetching to avoid exposing credentials and to simplify CORS.
- Avoid custom endpoints that accept arbitrary SQL, file paths or unfiltered query arguments.
- Validate and sanitise all custom endpoint inputs and outputs.

## 3. Frontend and API secrets

- Store WordPress credentials, email provider keys, Google Places API keys and webhook secrets in server environment variables.
- Commit only a `.env.example` with placeholder values.
- Rotate any key that is accidentally exposed.
- Restrict Google API keys to the needed API and allowed server IP/referrer as applicable.
- Do not include secrets in logs, error messages, source maps or client-side code.

## 4. Contact form security

- Validate all fields on the server.
- Limit body size and field lengths.
- Allow-list enquiry types.
- Encode content before rendering or emailing it.
- Do not accept HTML uploads or arbitrary file attachments in the first release.
- Use a honeypot and bot challenge where appropriate.
- Add duplicate-submission protection.
- Return safe error messages without stack traces.
- Keep personal details out of analytics and application logs.

Suggested starting rate limits:
- 5 form attempts per IP per 10 minutes.
- 20 form attempts per IP per 24 hours.
- A global email-provider limit to prevent quota exhaustion.
- Return HTTP 429 when limited.

Tune these thresholds after observing genuine traffic. For serverless deployments, use edge/WAF controls or a distributed limiter. In-memory counters do not work reliably across multiple instances.

## 5. Heavy traffic and availability

- Put a CDN/WAF in front of the public website.
- Cache static pages, images, fonts and other public assets.
- Cache WordPress API responses that are safe to share publicly.
- Set short timeouts and bounded retries for CMS/API/email calls.
- Do not retry invalid requests or create email retry storms.
- Keep forms available even if non-critical features such as the blog or review API fail.
- Show a clear fallback phone or WhatsApp contact if form delivery is unavailable.
- Monitor traffic spikes, 4xx/5xx rates and email-provider usage.

## 6. WordPress publishing webhook

- Use a long random secret.
- Verify every webhook request before revalidating frontend caches.
- Reject unsigned or invalid requests.
- Restrict the webhook to the intended route and actions.
- Avoid accepting arbitrary paths from the webhook payload.
- Log the event ID and result, not the secret or private content.

## 7. Security headers

Configure and test:
- Content-Security-Policy, initially in report-only mode.
- Strict-Transport-Security after HTTPS is confirmed.
- X-Content-Type-Options: `nosniff`.
- Referrer-Policy.
- Permissions-Policy.
- CSP `frame-ancestors` to control embedding.

Test WordPress media, Google Maps, analytics and any approved embeds before enforcing the CSP.

## 8. Privacy

- Publish a privacy policy that explains form use, recipients and retention.
- Collect only data required to answer the enquiry.
- Do not collect payment card data or identity documents.
- Restrict WordPress and email access to authorised staff.
- Define a deletion/retention process for form messages.
- Use consent where required for non-essential analytics or cookies.

## 9. Monitoring and response

Monitor:
- CMS login failures and unusual admin actions.
- REST API error rates and unusual request volume.
- Form spam and rate-limit events.
- Google API failures and quota use.
- WordPress update/security alerts.
- Uptime and frontend error rates.

Incident steps:
1. Restrict or disable the affected endpoint.
2. Revoke exposed credentials.
3. Preserve relevant security logs.
4. Patch the source of the problem.
5. Test the fix and restore service.
6. Review whether personal data was exposed.
7. Document the incident and monitor for recurrence.
