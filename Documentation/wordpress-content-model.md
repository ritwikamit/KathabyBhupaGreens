# WordPress Content Model – Headless Katha Website

WordPress should be used by restaurant staff to update content. The public frontend is custom coded and reads approved public data through the REST API.

## 1. Core content

### Pages
Use WordPress Pages for editorial pages such as About and Contact if the owner needs to edit them. Static layout elements can remain in the frontend.

### Posts
Use standard WordPress Posts for the Journal/Blog.

Suggested categories:
- Menu Notes
- Food & Ingredients
- Restaurant Updates
- Seasonal Picks
- Visit Katha

## 2. Custom Post Type: Menu Category

Suggested fields:
- Name
- Slug
- Short intro
- Sort order
- Visible / hidden

Register with `show_in_rest => true`.

## 3. Custom Post Type: Menu Item

Suggested fields:
- Item name
- Slug
- Menu category relationship
- Description
- Price
- Currency (INR)
- Vegetarian status: yes / no / not confirmed
- Dietary labels: owner-approved only
- Food image
- Featured item flag
- Available / unavailable
- Sort order
- Last verified date

Do not infer allergens or dietary suitability. Only the kitchen can confirm those labels.

## 4. Optional: Gallery Item

Fields:
- Title
- Image
- Alt text
- Gallery category
- Sort order
- Approval status

## 5. REST API

Typical endpoints:
- `/wp-json/wp/v2/posts`
- `/wp-json/wp/v2/categories`
- `/wp-json/wp/v2/menu_category`
- `/wp-json/wp/v2/menu_item`
- `/wp-json/wp/v2/media`

Actual custom post type slugs depend on implementation. Use `_embed` for featured media or add a small approved endpoint to return a clean menu payload.

## 6. WordPress editor experience

- Create simple editor instructions.
- Provide preview links where practical.
- Require image alt text for meaningful content images.
- Keep published menu items current.
- Use Draft/Review/Publish status for blog posts.
- Only trusted editors can change sitewide contact information.

## 7. Cache updates

When an editor publishes a menu item or blog post:
1. WordPress sends a protected webhook.
2. Frontend verifies the shared secret.
3. Frontend revalidates the appropriate menu/blog cache tags or page paths.
4. The next visitor receives the updated content.

Do not let webhook payloads choose arbitrary paths to revalidate.
