'use client';
import Image from 'next/image';
import Link from 'next/link';
import { type Post, usePosts } from '@/hooks/use-posts';

const Blogs = () => {
  const { data: postsData } = usePosts();
  const posts = postsData?.posts || [];

  return (
    <>
      {posts.map((post: Post) => (
        <Link key={post._id} href={`/blog/${post.slug}`}>
          <article className="group h-full overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg hover:border-primary/30">
            <div className="overflow-hidden">
              <Image
                src={post.image || '/placeholder.svg'}
                alt={post.title}
                width={500}
                height={500}
                className="aspect-video h-48 w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground border-t border-border">
                <span>{post.createdAt.split('T')[0]}</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </>
  );
};

export default Blogs;
