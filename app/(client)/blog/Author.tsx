'use client';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';

interface ProfileData {
  avatar?: string;
  authorName?: string;
  authorTitle?: string;
  authorBio?: string;
  authorSlogan?: string;
  authorStory?: string;
  email?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  portfolio?: string;
}

const Author = () => {
  const { data } = useProfile();
  const profile = (data as ProfileData) || ({} as ProfileData);

  return (
    <div className="mt-16 border-t border-border pt-8">
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent">
          <Image
            src={profile?.avatar || '/placeholder.svg'}
            alt={profile?.authorName || 'Author'}
            width={500}
            height={500}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{profile?.authorName || 'Author Name'}</h3>
          <h4 className="text-md text-muted-foreground">
            {profile?.authorTitle || 'Author Title'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {profile?.authorBio || 'Author bio will appear here'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Author;
