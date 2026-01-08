'use client';
import { ArrowLeft, Calendar, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { usePost } from '@/hooks/use-posts';
import Author from '../Author';

const ShareButtons = ({ title, slug }: { title: string; slug: string }) => {
  const shareUrl = `${window.location.origin}/blog/${slug}`; // Full shareable URL
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="flex items-center gap-2">
      {/* Twitter/X */}
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-full">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </Button>

      {/* Facebook */}
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-full">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </Button>

      {/* LinkedIn */}
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-full">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </Button>

      {/* Copy Link */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-6 w-6 p-1 rounded-full"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied!');
        }}
      >
        <LinkIcon />
      </Button>
    </div>
  );
};

export default function BlogDetailPage() {
  const { slug } = useParams();

  const { data: blog, isLoading } = usePost(slug as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Link href="/blog">
            <Button variant="outline">Back to Stories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto max-w-4xl px-6 py-4 sm:px-8 lg:px-10">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stories
            </Link>
          </Button>
        </nav>
      </header>

      {/* Featured Image */}
      <div className="w-full">
        <Image
          src={blog.image || '/placeholder.svg'}
          alt={blog.title}
          width={500}
          height={500}
          className="h-96 w-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Meta */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {blog.category}
            </span>
            <ShareButtons title={blog.title} slug={slug as string} />
          </div>
          <h1 className="text-5xl font-bold leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground border-t border-border">
            <Calendar className="h-4 w-4" />
            <span>{blog.createdAt.split('T')[0]}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-sm max-w-none [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:leading-relaxed [&_p]:mb-6">
          {blog?.excerpt} <br />
          <hr className="my-8" />
          {blog?.fullStory}
        </div>

        {/* Author Card */}
        <Author />
      </article>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              <Logo />. All thoughts and stories are mine.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
