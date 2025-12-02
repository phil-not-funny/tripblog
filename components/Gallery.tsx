import { getDictionary } from "@/app/[lang]/dictionaries";
import { getImagePaths } from "@/lib/posts";
import { BlogPost } from "@/types/content";
import { Locale } from "@/types/internationalization";
import Image from "next/image";

export default async function Gallery({
  lang,
  blog,
}: {
  lang: string;
  blog: BlogPost;
}) {
  const dict = await getDictionary(lang as Locale);
  const imagePaths = getImagePaths(blog);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold text-neutral-800">
        {dict.components.PageSwitcher.gallery.toUpperCase()}
      </h2>
      {imagePaths.map((path) => (
        <img
          key={path}
          src={path}
          alt="Gallery image"
          width={600}
          height={400}
        />
      ))}
      {imagePaths.length === 0 && (
        <p className="italic text-neutral-600">
          {dict.components.Gallery.noImages}
        </p>
      )}
    </div>
  );
}
