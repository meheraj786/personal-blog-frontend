'use client';

import { Facebook, Linkedin, Mail, Share2, Twitter } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
  url?: string;
}

export function ShareButtons({ title, slug, url }: ShareButtonsProps) {
  const [showShare, setShowShare] = useState(false);

  // Construct the full URL for sharing
  const shareUrl =
    url ||
    (typeof window !== 'undefined' ? window.location.href : `https://yoursite.com/blog/${slug}`);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-blue-600 hover:bg-blue-50',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'text-sky-500 hover:bg-sky-50',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-blue-700 hover:bg-blue-50',
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.969 1.523A9.9 9.9 0 003.864 11.45a9.9 9.9 0 001.524 5.078 9.868 9.868 0 004.969 3.397 9.886 9.886 0 005.74-.219 9.877 9.877 0 004.5-3.038 9.9 9.9 0 002.346-4.566 9.877 9.877 0 00-.521-5.627 9.887 9.887 0 00-2.976-4.287 9.886 9.886 0 00-5.613-1.772z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'text-green-600 hover:bg-green-50',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedTitle}:%20${encodedUrl}`,
      color: 'text-gray-600 hover:bg-gray-50',
    },
  ];

  const openShareWindow = (url: string) => {
    window.open(url, 'share', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-card"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showShare && (
        <div className="flex gap-2 animate-in fade-in-0 slide-in-from-top-2">
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => openShareWindow(link.url)}
                title={`Share on ${link.name}`}
                className={`rounded-lg p-2 transition-colors ${link.color}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
