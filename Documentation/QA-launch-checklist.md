# QA and Launch Checklist

## Business facts
- [ ] Official name and parent relationship approved.
- [ ] Address, pin and postcode confirmed.
- [ ] Restaurant phone, WhatsApp and email confirmed.
- [ ] Opening hours and weekly closure confirmed.
- [ ] Table enquiry/reservation process confirmed.
- [ ] Current menu and prices approved.
- [ ] Dietary/allergen labels confirmed by kitchen.
- [ ] Google rating and review count checked against exact Maps listing.

## WordPress
- [ ] Menu categories and items can be created/edited.
- [ ] Blog posts can be drafted, previewed and published.
- [ ] REST API exposes only intended public fields.
- [ ] Custom post types have `show_in_rest` enabled.
- [ ] Preview and webhook flows work.
- [ ] Publish/update webhook securely revalidates frontend cache.
- [ ] WordPress admin MFA and role permissions checked.

## Frontend
- [ ] Logo displays at correct aspect ratio.
- [ ] Footer includes ACCustomLabs credit and transparent logo.
- [ ] Menu page works on mobile.
- [ ] Blog index and article pages work.
- [ ] Google Maps pin points to Katha.
- [ ] Call and WhatsApp links work.
- [ ] Social links open the right profiles.
- [ ] Contact form delivers to approved recipient.
- [ ] Empty/loading/error states tested.

## Security
- [ ] No secrets in source control or browser bundle.
- [ ] HTTPS active.
- [ ] Rate limiting and spam controls active.
- [ ] Request size and field limits tested.
- [ ] Security headers tested.
- [ ] Dependency and secret scans reviewed.
- [ ] Error responses do not reveal stack traces.
- [ ] Backups and restore process verified.

## SEO and accessibility
- [ ] Page titles, descriptions and canonical URLs checked.
- [ ] Sitemap and robots.txt checked.
- [ ] Structured data matches visible facts.
- [ ] Preview/staging is not indexed.
- [ ] Images have meaningful alt text.
- [ ] Keyboard navigation and focus checked.
- [ ] Colour contrast and form labels checked.
- [ ] Reduced-motion preference respected.

## Performance and release
- [ ] Responsive image sizes configured.
- [ ] Images compressed and lazy-loaded appropriately.
- [ ] Core Web Vitals measured after deployment.
- [ ] Production form delivery tested.
- [ ] Analytics excludes personal form data.
- [ ] Monitoring and rollback steps documented.
- [ ] Owner has access and content-editing instructions.
