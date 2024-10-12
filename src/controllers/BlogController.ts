import { BlogPost } from "../services/BlogPost";
import { BlogPostView, HomeView } from "../views/BlogViews";

export class BlogController {
  static async getHome() {
    const posts = await BlogPost.getAll();
    const recentPosts = posts.slice(0.1);
    return HomeView.render(recentPosts);
  }

  static async getBlogPost(slug: string) {
    const posts = await BlogPost.getAll();
    const post = posts.find((p) => p.meta.slug === slug);

    if (!post) {
      return new Response("Blog post not found", { status: 404 });
    }
    return BlogPostView.render(post);
  }
}
