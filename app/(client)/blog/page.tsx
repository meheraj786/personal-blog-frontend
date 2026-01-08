import Link from 'next/link';
import Logo from '@/components/logo/Logo';
import Blog from './Blog';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex gap-4 items-center">
              <Link href="/" className="text-sm font-medium hover:text-primary transition">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition">
                About
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Header Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-bold mb-4">All Stories</h1>
          <p className="text-muted-foreground">
            A collection of my thoughts, reflections, and daily life moments
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
        <Blog />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
            <div>
              <Logo />
              <p className="text-sm text-muted-foreground">
                A personal space for sharing life moments and reflections.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
