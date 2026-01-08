'use client';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';

interface ProfileData {
  avatar?: string;
  authorName?: string;
  authorTitle?: string;
  authorSlogan?: string;
  authorBio?: string;
  authorStory?: string;
  email?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  portfolio?: string;
  social?: {
    facebook?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const AvatarAbout = () => {
  const { data } = useProfile();
  const about = data as ProfileData;

  if (!about) return null;

  return (
    <div>
      <Image
        src={about.avatar ?? '/portrait-of-a-girl-with-warm-smile.jpg'}
        alt={about.authorName ?? 'Profile Avatar'}
        width={500}
        height={500}
        className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
      />
    </div>
  );
};

const About = () => {
  const { data } = useProfile();
  const about = data as ProfileData;

  if (!about) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-5xl font-bold tracking-tight mb-2">{about?.authorName}</h1>
        <p className="text-xl text-primary font-medium">{about?.authorTitle}</p>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {about?.authorBio}
      </p>
    </div>
  );
};

const MyStory = () => {
  const { data } = useProfile();
  const about = data as ProfileData;

  if (!about) return <div>Loading...</div>;

  return <p className="text-muted-foreground leading-relaxed mb-4">{about?.authorStory}</p>;
};

const SocialLinks = () => {
  const { data } = useProfile();
  const about = data as ProfileData;

  if (!about) return <div>Loading...</div>;

  return (
    <>
      <Link href={about.facebook || about.social?.facebook || '#'}>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Facebook className="h-5 w-5" />
          Facebook
        </Button>
      </Link>
      <Link href={about.x || about.social?.x || '#'}>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Twitter className="h-5 w-5" />
          Twitter
        </Button>
      </Link>
      <Link href={about.instagram || about.social?.instagram || '#'}>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Instagram className="h-5 w-5" />
          Instagram
        </Button>
      </Link>
      <Link href={about.portfolio || about.social?.linkedin || '#'}>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Linkedin className="h-5 w-5" />
          LinkedIn
        </Button>
      </Link>
    </>
  );
};

export { About, AvatarAbout, MyStory, SocialLinks };
