# Technical Requirements Document (TRD)

## 1. Architecture

**Frontend:** Custom-coded React application, preferably Next.js with TypeScript.  
**CMS/backend:** WordPress, managed separately, exposing approved content through the WordPress REST API.  
**Hosting:** Frontend on a managed platform/CDN. WordPress on managed WordPress hosting with HTTPS, backups and security updates.  
**Media:** WordPress Media Library, with image optimisation and responsive variants.

The frontend and WordPress may use separate subdomains, for example:
- Public site: `https://www.katha...`
- CMS: `https://cms.katha...` or a secured WordPress installation on the chosen domain.

Use the final owner-approved domain names. Do not hard-code sample domains.

## 2. Frontend responsibilities

- Render public pages and navigation.
- Fetch public menu, blog and gallery content.
- Display loading, empty and error states.
- Generate page metadata and canonical URLs.
- Render menu categories from CMS data.
- Render blog index and article pages.
- Submit contact enquiries to a server-side handler.
- Provide a Google Maps link and review access.

Use server-side fetching for WordPress data where possible. This reduces browser CORS complexity and keeps private integrations off the client.

## 3. WordPress responsibilities

WordPress is the content source for:
- Blog posts and categories.
- Menu categories and menu items.
- Selected gallery/media content.
- Site-level editable details if owner requests it.

Use WordPress posts/pages for editorial content. Add custom post types for menu categories and menu items if the menu needs structured control. Register custom post types with `show_in_rest => true`. Use ACF or native custom fields only where needed and expose approved fields through REST.

## 4. REST API endpoints

Examples (actual slugs depend on implementation):
- `GET /wp-json/wp/v2/posts`
- `GET /wp-json/wp/v2/posts?slug={slug}`
- `GET /wp-json/wp/v2/categories`
- `GET /wp-json/wp/v2/menu_category`
- `GET /wp-json/wp/v2/menu_item`
- `GET /wp-json/wp/v2/media`

Use `_embed` when featured media is needed. Prefer explicit field selection where possible. Do not expose private drafts, admin data or user records through custom public endpoints.

## 5. Publishing and cache refresh

- Cache menu and blog requests on the frontend.
- Use Next.js cache tags or path revalidation for menu/blog data.
- Add a WordPress publish/update webhook to a protected Next.js route.
- Verify the webhook secret before invalidating cached data.
- Revalidate only the affected page/data group.
- Keep the website usable with cached public pages if WordPress is temporarily unavailable.

Official Next.js references:
- `revalidatePath`: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- `revalidateTag`: https://nextjs.org/docs/app/api-reference/functions/revalidateTag

## 6. Authentication

- Public GET requests for approved public content can be unauthenticated.
- WordPress admin accounts are for editors/owners only.
- If the frontend needs privileged CMS access, use a server-only credential and least-privilege account.
- Never put WordPress Application Passwords, admin passwords, private tokens or SMTP keys in client-side JavaScript.
- Do not use authenticated WordPress requests from the public browser unless a specific feature requires it and has been threat-modelled.

## 7. Menu data model

Suggested fields for `menu_item`:
- `name`
- `slug`
- `description`
- `category` (relationship)
- `price` (number/string, owner-maintained)
- `currency` (INR)
- `is_vegetarian` (true/false/unknown)
- `dietary_labels` (owner-approved)
- `image`
- `is_available`
- `is_featured`
- `sort_order`
- `last_verified_at`

Suggested fields for `menu_category`:
- `name`
- `slug`
- `intro`
- `sort_order`
- `is_visible`

Do not infer allergen-free, vegan, gluten-free, Jain, halal or similar claims from item names. These require kitchen confirmation.

## 8. Blog data model

Use WordPress Posts with:
- Title
- Slug
- Excerpt
- Body
- Featured image
- Categories
- Tags
- Author
- Publish date
- SEO title
- Meta description
- Canonical URL where required
- Open Graph image
- Draft/published status

Avoid exposing private editorial notes or draft metadata.

## 9. Contact form

Recommended flow:
1. Browser sends the enquiry to a Next.js server route.
2. Server validates fields and body size.
3. Apply rate limiting, bot checks and duplicate protection.
4. Send to the owner-approved recipient using a transactional email provider.
5. Log request ID and delivery status only.
6. Return a safe success/error state.

Collect only name, phone/email, enquiry type, date/time if relevant and message. No payment details or identity documents.

## 10. Google Maps reviews

Option A: link users to the exact Maps listing. This is simplest and has no Places API key to expose.

Option B: server-side Places API integration for rating, user rating count and a limited number of review records. Keep the API key server-side, restrict it by API/IP as appropriate, cache responses and follow Google's branding, attribution, storage and display requirements. Places API rating and userRatingCount are billable fields; requesting reviews can incur a higher SKU. Confirm current pricing before implementation.

Google reference: https://developers.google.com/maps/documentation/places/web-service/place-details

## 11. Deployment

- Separate dev, preview and production environments.
- Use separate environment variables and API credentials.
- Protect WordPress admin and hosting accounts with MFA.
- Configure backups and test restore.
- Use CI checks for lint, typecheck, build, link check, dependency scan and secret scan.
- Use a preview deployment for owner review.
- Document rollback and DNS ownership.
