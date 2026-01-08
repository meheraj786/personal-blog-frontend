import Link from 'next/link';
import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import Banner from './components/Banner';
import Blogs from './components/Blogs';
import SocialLinks from './components/SocialLinks';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex gap-4 items-center">
              <Link href="/blog" className="text-sm font-medium transition hover:text-primary">
                All Stories
              </Link>
              <Link href="/about" className="text-sm font-medium transition hover:text-primary">
                About
              </Link>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/dashboard">Admin</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <Banner />

      {/* Latest Articles Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Stories</h2>
            <p className="text-muted-foreground">Fresh thoughts and daily reflections</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Blogs />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 lg:px-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Watch My All Stories</h2>
          <p className="text-muted-foreground mb-8">
            A collection of my thoughts, reflections, and daily life moments
          </p>
          <Button asChild size="lg" className="w-fit mx-auto">
            <Link href="/blog">See All Stories</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-lg font-bold mb-2">
                <Logo />
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                A personal blog sharing daily thoughts, life experiences, and moments of
                inspiration.
              </p>
            </div>
            <SocialLinks />
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              <Logo />. All thoughts and dreams are mine.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
