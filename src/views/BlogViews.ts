import { BlogPost } from "../services/BlogPost";

export class HomeView {
  static render(posts: BlogPost[]): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Simple Blog</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          article { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .meta { font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <h1>My Simple Blog</h1>
        ${posts
          .map(
            (post) => `
          <article>
            <h2><a href="/blog/${post.meta.slug}">${post.meta.title}</a></h2>
            <div class="meta">By ${
              post.meta.author
            } on ${post.meta.date.toDateString()}</div>
            <div>${post.content.split("\n").slice(0, 3).join("\n")}...</div>
            <a href="/blog/${post.meta.slug}">Read more</a>
          </article>
        `
          )
          .join("")}
      </body>
      </html>
    `;
  }
}

export class BlogPostView {
  static render(post: BlogPost): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.meta.title} - My Simple Blog</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .meta { font-size: 0.9em; color: #666; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${post.meta.title}</h1>
        <div class="meta">By ${
          post.meta.author
        } on ${post.meta.date.toDateString()}</div>
        <div>${post.content}</div>
        <p><a href="/">Back to Home</a></p>
      </body>
      </html>
    `;
  }
}
