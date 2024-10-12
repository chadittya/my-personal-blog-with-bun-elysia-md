import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { BlogController } from "./controllers/BlogController";

const app = new Elysia()
  .use(staticPlugin())
  .get("/", async () => {
    const content = await BlogController.getHome();
    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  })
  .get("/blog/:slug", async ({ params: { slug } }) => {
    const content = await BlogController.getBlogPost(slug);
    if (content instanceof Response) {
      return content; // This is likely the 404 response
    }
    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  })
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
