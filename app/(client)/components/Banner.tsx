'use client';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/use-site';

interface Site {
  bannerTitle: string;
  bannerSlogan: string;
  bannerBio: string;
  bannerImage: string;
}

const Banner = () => {
  const { data: site } = useSite();
  const typedSite = site as Site | undefined;

  if (!typedSite) {
    return (
      <section className="border-b border-border bg-muted min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        backgroundImage: `url(${typedSite.bannerImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="border-b border-border bg-card"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="space-y-6 bg-white/50 backdrop-blur-xs p-10 max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">{typedSite.bannerSlogan}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{typedSite.bannerTitle}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{typedSite.bannerBio}</p>
          <Button asChild size="lg" className="w-fit">
            <Link href="/blog" className="gap-2">
              Read My Stories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
