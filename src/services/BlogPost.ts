import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { marked } from "marked";

export interface BlogPostMeta {
  title: string;
  author: string;
  date: Date;
  slug: string;
}

export class BlogPost {
  meta: BlogPostMeta;
  content: string;

  constructor(meta: BlogPostMeta, content: string) {
    this.meta = meta;
    this.content = content;
  }

  static async getAll(): Promise<BlogPost[]> {
    const files = await readdir(join(process.cwd(), "posts"));
    const posts = await Promise.all(files.map(BlogPost.fromFile));
    return posts.sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
  }

  static async fromFile(filename: string): Promise<BlogPost> {
    const content = await readFile(
      join(process.cwd(), "posts", filename),
      "utf-8"
    );
    const { meta, markdown } = BlogPost.parseContent(content);
    const htmlContent = await marked(markdown);
    return new BlogPost(meta, htmlContent);
  }

  static parseContent(content: string): {
    meta: BlogPostMeta;
    markdown: string;
  } {
    const metaRegex = /^={3,}\s*([\s\S]*?)\s*={3,}/;
    const match = content.match(metaRegex);
    if (!match) throw new Error("Invalid metadata format");

    const metaLines = match[1].split("\n");
    const meta: Partial<BlogPostMeta> = {};

    metaLines.forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim());
      if (key && value) {
        switch (key) {
          case "title":
          case "author":
            meta[key] = value;
            break;
          case "date":
            meta[key] = new Date(value);
            break;
          case "slug":
            meta[key] = value.toLowerCase().replace(/\s+/g, "-");
            break;
        }
      }
    });

    if (!meta.title || !meta.author || !meta.date || !meta.slug) {
      throw new Error("Missing required metadata");
    }

    const blogPostMeta: BlogPostMeta = meta as BlogPostMeta;

    const markdown = content.replace(/^={3,}[\s\S]*?={3,}\s*/, "").trim();

    return { meta: blogPostMeta, markdown };
  }
}
