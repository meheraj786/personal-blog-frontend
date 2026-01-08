'use client';
import Link from 'next/link';
import { useProfile } from '@/hooks/use-profile';

const SocialLinks = () => {
  const { data: profile } = useProfile();

  return (
    <div className="flex gap-6 text-sm">
      <Link
        href={profile?.social?.twitter || '#'}
        className="text-muted-foreground hover:text-primary transition"
      >
        Twitter
      </Link>
      <Link
        href={profile?.social?.instagram || '#'}
        className="text-muted-foreground hover:text-primary transition"
      >
        Instagram
      </Link>
      <Link
        href={profile?.social?.website || '#'}
        className="text-muted-foreground hover:text-primary transition"
      >
        Website
      </Link>
    </div>
  );
};

export default SocialLinks;
