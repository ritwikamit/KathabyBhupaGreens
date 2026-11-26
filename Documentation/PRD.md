# Product Requirements Document (PRD)

## 1. Product overview

Build a custom-coded website for **Katha by Bhupa Greens**, the restaurant located within the Bhupa Greens premises in Darbhanga, Bihar. The website will use WordPress as a headless content backend through the WordPress REST API.

Visitors should be able to understand the restaurant, browse the menu, view food and ambience photographs, read restaurant updates and blog articles, find the location and contact the restaurant.

## 2. Main goals

- Give Katha a clear online identity separate from the parent Bhupa Greens venue.
- Make the menu easy to browse on mobile and desktop.
- Help visitors find the restaurant inside the Bhupa Greens campus.
- Encourage calls, WhatsApp messages and table enquiries.
- Show genuine Google Maps review information with a clear link to the listing.
- Let staff update menu items, prices, blog posts and approved gallery images from WordPress without editing frontend code.
- Keep the site fast, secure and straightforward to maintain.

## 3. Audience

- Local residents in Darbhanga and nearby areas.
- Families and groups looking for a place to eat.
- Travellers using the NH27/NH57 highway corridor.
- People visiting Bhupa Greens for an event who want to dine at Katha.
- People searching for menu items, opening hours, directions or contact information.

## 4. Primary actions

1. Browse the menu.
2. Call the restaurant.
3. Start a WhatsApp conversation, if the owner confirms the number.
4. Open Google Maps directions.
5. View Google reviews.
6. Ask about a table or group visit.
7. Read the restaurant blog.

Online table booking or food ordering is not assumed. Add these only if the owner confirms a booking/order process and who will manage it.

## 5. Proposed sitemap

- Home
- About Katha
- Menu
- Gallery
- Blog
- Contact & Location
- Privacy Policy
- Terms / Website Disclaimer, if needed

Optional pages after owner approval:
- Table Reservations
- Group Dining / Private Events
- Food Ordering

## 6. Homepage sections

1. Header with Katha logo and menu navigation.
2. Hero area using real restaurant food/interior imagery.
3. Short introduction explaining that Katha is inside Bhupa Greens.
4. Featured menu categories and selected dishes.
5. Food gallery.
6. Restaurant experience / dining information.
7. Google Maps trust section with live or verified rating information and a link to read reviews.
8. Latest blog posts.
9. Location, hours and contact details.
10. Footer with social links, privacy link and ACCustomLabs credit/logo.

## 7. Functional requirements

### Menu
- Fetch menu categories and items from WordPress REST API.
- Support vegetarian/non-vegetarian labels only where the restaurant has verified them.
- Display current prices only when the owner maintains them in WordPress.
- Allow menu items to be marked unavailable or hidden.
- Search/filter menu items if menu size justifies it.
- Avoid placing prices inside static images; keep them editable text fields.

### Blog
- Fetch WordPress posts from the REST API.
- Support categories, featured images, excerpts, author and publish date.
- Use a dedicated article page with readable typography and related links.
- Include SEO title, meta description, canonical URL and social sharing metadata.
- Provide a WordPress webhook/revalidation flow so new posts can appear without a full redeploy.

### Contact and location
- Click-to-call and WhatsApp links using owner-confirmed details.
- Google Maps directions link to the Katha location pin.
- Contact form with server-side validation and spam controls.
- The form must clearly state that submitting an enquiry does not confirm a reservation.

### Reviews
- Link to the actual Google Maps place listing.
- Show live rating and review count only through an approved Google Places API integration or a current manual verification workflow.
- Do not invent review text or copy reviews without observing Google attribution rules.
- Do not use local-business aggregate ratings in self-serving review schema for Google's review stars.

## 8. Content requirements

- Simple everyday English.
- Short paragraphs and specific facts.
- Human-sounding copy, checked twice before publishing.
- No invented awards, offers, menu items, testimonials, health claims or facilities.
- Keep menu descriptions aligned with the current menu and kitchen.
- Make it clear that the restaurant is within Bhupa Greens.

## 9. Non-functional requirements

- Mobile-first responsive layout.
- Accessible navigation, menu controls and forms.
- Fast image loading and sensible caching.
- HTTPS on all public and admin surfaces.
- No secret keys in browser code or public Git repository.
- WordPress admin secured with MFA and least-privilege roles.
- Form and API traffic protected with rate limits.
- Routine WordPress, plugin and dependency updates.

## 10. Success measures

- Menu page visits and menu item engagement.
- Calls and WhatsApp clicks.
- Map direction clicks.
- Contact form submissions.
- Blog visits and organic search clicks.
- Mobile performance and Core Web Vitals.
- Reduced form spam and reliable WordPress publishing.

## 11. Out of scope for first release

- Payment processing.
- Full POS integration.
- Delivery/order management.
- Guest accounts.
- Loyalty points.
- Table inventory that promises real-time availability.

## 12. Acceptance criteria

- Katha and Bhupa Greens relationship is explained correctly.
- Restaurant address and pin are verified.
- The menu is served from WordPress and works on mobile.
- Blog posts can be created and updated in WordPress.
- Revalidation updates the frontend after published content changes.
- Contact actions and map link work.
- Review section links to the correct Google listing and shows only verified data.
- No WordPress credentials or API secrets are exposed in browser source.
- Core pages pass build, responsive, accessibility, SEO and security checks.
