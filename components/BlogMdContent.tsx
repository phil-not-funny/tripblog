import { BlogPost } from "@/types/content";

export default function BlogMdContent({ post }: { post: BlogPost }) {
  return (
    <div
      className="
            prose dark:prose-invert prose-accent-foreground

            prose-hr:my-4
            prose-hr:border-muted-foreground

            prose-headings:text-foreground
            prose-headings:font-semibold 
            prose-headings:pb-4
            prose-headings:prose-a:no-underline
            prose-headings:prose-a:hover:after:content-['_↗']

            prose-h1:pt-6
            prose-h1:uppercase
            prose-h1:tracking-wider
            prose-h1:leading-0
            prose-h1:text-3xl
            prose-h1:pb-0

            prose-h2:text-2xl
            prose-h2:mb-2
            prose-h2:uppercase

            prose-h3:text-xl

            prose-p:leading-relaxed

            prose-img:rounded-md
            
            max-w-none
            "
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  );
}
