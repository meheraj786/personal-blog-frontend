import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { About, AvatarAbout, MyStory, SocialLinks } from './Components/About';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4 sm:px-8 lg:px-10 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition">
              Stories
            </Link>
            <Link href="/about" className="text-sm font-medium text-primary">
              About
            </Link>
            <Link href="/admin/login" className="text-sm font-medium hover:text-primary transition">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* About Section */}
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <AvatarAbout />
          <About />
        </div>

        {/* About Content */}
        <div className="grid gap-12 md:grid-cols-2 mb-16">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">My Story</h2>

              <MyStory />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">What You&#8217;ll Find</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">
                    <strong>Personal Stories</strong> - Daily reflections and life experiences
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">
                    <strong>Travel Tales</strong> - Adventures and discoveries from around the world
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">
                    <strong>Thoughts & Ideas</strong> - Philosophy, creativity, and growth mindset
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">
                    <strong>Life Lessons</strong> - What I&#8217;m learning and why it matters
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-border bg-card p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Connect With Me</h2>
            <p className="text-muted-foreground">
              Let&#8217;s stay connected across different platforms
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <SocialLinks />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground text-lg">Ready to read some stories?</p>
          <Link href="/blog">
            <Button size="lg" className="gap-2">
              <ChevronLeft className="h-5 w-5 rotate-180" />
              Explore Stories
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
