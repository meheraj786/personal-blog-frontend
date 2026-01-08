'use client';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePosts } from '@/hooks/use-posts';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: blogs, isLoading } = usePosts(currentPage, limit);

  const totalPages = blogs?.pagination?.totalPages || 1;
  const hasPrevPage = blogs?.pagination?.hasPrevPage || false;
  const hasNextPage = blogs?.pagination?.hasNextPage || false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ✅ Posts list */}
      {blogs?.posts?.map((blog) => (
        <Link key={blog._id} href={`/blog/${blog.slug}`}>
          <article className="group mb-8 border-b border-border pb-8 transition hover:opacity-70">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {blog.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition">
              {blog.title}
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">{blog.excerpt}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {blog.createdAt.slice(0, 10).split('-').reverse().join('-')}
            </div>
          </article>
        </Link>
      ))}

      {/* ✅ shadcn Pagination - only show if >1 page */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={`cursor-pointer ${!hasPrevPage ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {/* Page Numbers (simple: show 1-5 or up to totalPages) */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Ellipsis if more pages */}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last Page (if >5) */}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    className="cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={`cursor-pointer ${!hasNextPage ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Blog;
