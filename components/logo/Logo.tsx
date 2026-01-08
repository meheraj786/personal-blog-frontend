'use client';
import Link from 'next/link';
import { useSite } from '@/hooks/use-site';

interface SiteData {
  websiteName?: string;
  bannerImage?: string;
  bannerSlogan?: string;
  bannerTitle?: string;
  bannerBio?: string;
}

const Logo = () => {
  const { data } = useSite();
  // Type assertion to treat data as SiteData
  const site = (data as SiteData) || ({} as SiteData);

  return (
    <Link href="/" className="text-2xl font-bold tracking-tight">
      {site?.websiteName || 'My Blog'}
    </Link>
  );
};

export default Logo;
