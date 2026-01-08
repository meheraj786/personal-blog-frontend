'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Edit,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import Logo from '@/components/logo/Logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '@/hooks/use-posts';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';
import { useSite, useUpdateSite } from '@/hooks/use-site';

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  fullStory: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category required'),
  image: z.any().optional(),
});

const profileSchema = z.object({
  avatar: z.string().optional(),
  authorName: z.string().min(2, 'Author name must be at least 2 characters'),
  authorTitle: z.string().min(2, 'Author title must be at least 2 characters'),
  authorSlogan: z.string().min(5, 'Author slogan must be at least 5 characters'),
  authorBio: z.string().min(10, 'Author bio must be at least 10 characters'),
  authorStory: z.string().min(10, 'Author story must be at least 10 characters'),
  email: z.string().email('Please provide a valid email'),
  x: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  portfolio: z.string().optional(),
});

const siteSettingsSchema = z.object({
  bannerImage: z.string().optional(),
  bannerSlogan: z.string().min(5, 'Banner slogan must be at least 5 characters'),
  bannerTitle: z.string().min(3, 'Banner title must be at least 3 characters'),
  bannerBio: z.string().min(10, 'Banner bio must be at least 10 characters'),
  websiteName: z.string().min(3, 'Website name must be at least 3 characters'),
});

type BlogFormValues = z.infer<typeof blogSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;
type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(null);

  // Queries
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts(1, 100);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: site, isLoading: siteLoading } = useSite();
  const posts = postsData?.posts || [];

  // Mutations
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const updateProfile = useUpdateProfile();
  const updateSite = useUpdateSite();

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      fullStory: '',
      category: '',
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar: '',
      authorName: '',
      authorTitle: '',
      authorSlogan: '',
      authorBio: '',
      authorStory: '',
      email: '',
      x: '',
      instagram: '',
      facebook: '',
      portfolio: '',
    },
  });

  const siteSettingsForm = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      bannerImage: '',
      bannerSlogan: '',
      bannerTitle: '',
      bannerBio: '',
      websiteName: '',
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        avatar: (profile as any).avatar || '',
        authorName: (profile as any).authorName || '',
        authorTitle: (profile as any).authorTitle || '',
        authorSlogan: (profile as any).authorSlogan || '',
        authorBio: (profile as any).authorBio || '',
        authorStory: (profile as any).authorStory || '',
        email: (profile as any).email || '',
        x: (profile as any).x || '',
        instagram: (profile as any).instagram || '',
        facebook: (profile as any).facebook || '',
        portfolio: (profile as any).portfolio || '',
      });
    }
  }, [profile, profileForm]);

  useEffect(() => {
    if (site) {
      siteSettingsForm.reset({
        bannerImage: (site as any).bannerImage || '',
        bannerSlogan: (site as any).bannerSlogan || '',
        bannerTitle: (site as any).bannerTitle || '',
        bannerBio: (site as any).bannerBio || '',
        websiteName: (site as any).websiteName || '',
      });
    }
  }, [site, siteSettingsForm]);

  // Clean up preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  async function onBlogSubmit(values: BlogFormValues) {
    try {
      if (!editingSlug && !selectedImage) {
        toast.error('Featured image is required for new posts');
        return;
      }

      const payload = {
        title: values.title,
        excerpt: values.excerpt,
        fullStory: values.fullStory,
        category: values.category,
        ...(selectedImage && { image: selectedImage }),
      };

      if (editingSlug) {
        await updatePost.mutateAsync({ slug: editingSlug, data: payload });
        setEditingSlug(null);
        toast.success('Post updated successfully');
      } else {
        await createPost.mutateAsync(payload);
        toast.success('Post created successfully');
      }

      blogForm.reset();
      setSelectedImage(null);
      setImagePreviewUrl(null);
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error saving post';
      toast.error(errorMsg);
    }
  }

  async function onProfileSubmit(values: ProfileFormValues) {
    try {
      // Build payload as object first
      const payload: any = {
        authorName: values.authorName,
        authorTitle: values.authorTitle,
        authorSlogan: values.authorSlogan,
        authorBio: values.authorBio,
        authorStory: values.authorStory,
        email: values.email,
        x: values.x || '',
        instagram: values.instagram || '',
        facebook: values.facebook || '',
        portfolio: values.portfolio || '',
      };

      // Add avatar if selected or if URL provided
      if (selectedAvatar) {
        payload.avatar = selectedAvatar;
      } else if (values.avatar) {
        payload.avatar = values.avatar;
      }

      await updateProfile.mutateAsync(payload);
      setSelectedAvatar(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  }

  async function onSiteSettingsSubmit(values: SiteSettingsFormValues) {
    try {
      // Build payload as object first
      const payload: any = {
        websiteName: values.websiteName,
        bannerTitle: values.bannerTitle,
        bannerSlogan: values.bannerSlogan,
        bannerBio: values.bannerBio,
      };

      // Add banner image if selected or if URL provided
      if (selectedBannerImage) {
        payload.bannerImage = selectedBannerImage;
      } else if (values.bannerImage) {
        payload.bannerImage = values.bannerImage;
      }

      await updateSite.mutateAsync(payload);
      setSelectedBannerImage(null);
      toast.success('Site settings updated successfully');
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error('Error updating site settings');
    }
  }

  function handleEdit(post: any) {
    setEditingSlug(post.slug);
    blogForm.setValue('title', post.title);
    blogForm.setValue('excerpt', post.excerpt || '');
    blogForm.setValue('fullStory', post.fullStory);
    blogForm.setValue('category', post.category);
    setSelectedImage(null);
    setImagePreviewUrl(post.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingSlug(null);
    blogForm.reset();
    setSelectedImage(null);
    setImagePreviewUrl(null);
  }

  async function handleDelete(slug: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(slug);
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Error deleting post');
      }
    }
  }

  const isSubmitting =
    createPost.isPending || updatePost.isPending || updateProfile.isPending || updateSite.isPending;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-sm text-muted-foreground hidden sm:inline">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="stories" className="gap-2">
              <Plus className="h-4 w-4" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          {createPost.isSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Story published successfully!
              </AlertDescription>
            </Alert>
          )}
          {updatePost.isSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Story updated successfully!
              </AlertDescription>
            </Alert>
          )}
          {deletePost.isSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Story deleted successfully!
              </AlertDescription>
            </Alert>
          )}
          {updateProfile.isSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}
          {updateSite.isSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Site settings updated successfully!
              </AlertDescription>
            </Alert>
          )}
          <TabsContent value="stories" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {editingSlug ? 'Edit Story' : 'Write New Story'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {editingSlug ? 'Update your story' : 'Share a new thought or moment'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <Form {...blogForm}>
                      <form onSubmit={blogForm.handleSubmit(onBlogSubmit)} className="space-y-4">
                        <FormField
                          control={blogForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Story title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={blogForm.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Excerpt</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Brief summary of your story"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={blogForm.control}
                          name="fullStory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Story</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write your complete story here..."
                                  className="min-h-37.5"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={blogForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Life">Life</SelectItem>
                                  <SelectItem value="Personal">Personal</SelectItem>
                                  <SelectItem value="Travel">Travel</SelectItem>
                                  <SelectItem value="Inspiration">Inspiration</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormItem>
                          <FormLabel>
                            Featured Image{' '}
                            {editingSlug ? '(Optional - will keep existing)' : '(Required)'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setSelectedImage(file);
                                if (imagePreviewUrl) {
                                  URL.revokeObjectURL(imagePreviewUrl);
                                }
                                if (file) {
                                  setImagePreviewUrl(URL.createObjectURL(file));
                                } else {
                                  setImagePreviewUrl(null);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          {imagePreviewUrl && (
                            <div className="mt-2">
                              <Image
                                width={200}
                                height={200}
                                src={imagePreviewUrl}
                                alt="Preview"
                                className="w-full max-w-xs h-32 object-cover rounded"
                              />
                            </div>
                          )}
                          {selectedImage && !imagePreviewUrl && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Selected: {selectedImage.name}
                            </p>
                          )}
                        </FormItem>
                        <div className="flex gap-2 pt-2">
                          <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : editingSlug ? (
                              'Update'
                            ) : (
                              'Publish'
                            )}
                          </Button>
                          {editingSlug && (
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Published Stories</h2>
                  <p className="text-sm text-muted-foreground">Manage your journal entries</p>
                </div>
                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : postsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load posts. Please try again.</AlertDescription>
                  </Alert>
                ) : posts.length === 0 ? (
                  <div className="rounded-lg border border-border border-dashed p-12 text-center">
                    <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No stories yet. Write your first entry!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="rounded-lg border border-border bg-card p-6 flex items-start justify-between group hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          {post.image && (
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={200}
                              height={200}
                              className="w-full h-40 object-cover rounded mb-4"
                            />
                          )}
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                              {post.category}
                            </span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.slug)}
                            disabled={deletePost.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="profile" className="space-y-8">
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
                <p className="text-muted-foreground">
                  Manage your public profile information and social links
                </p>
              </div>
              {profileLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-4">Profile Picture</h3>
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              {selectedAvatar ? (
                                <Image
                                  src={URL.createObjectURL(selectedAvatar)}
                                  alt="Selected Avatar Preview"
                                  width={96}
                                  height={96}
                                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
                                />
                              ) : profileForm.watch('avatar') || (profile as any)?.avatar ? (
                                <Image
                                  src={profileForm.watch('avatar') || (profile as any)?.avatar}
                                  alt="Profile"
                                  width={96}
                                  height={96}
                                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center ring-4 ring-primary/20">
                                  <User className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <FormField
                                control={profileForm.control}
                                name="avatar"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Avatar URL (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://example.com/avatar.jpg"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormItem>
                                <FormLabel>Avatar (Upload new image)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedAvatar(e.target.files?.[0] || null)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                              {selectedAvatar && (
                                <p className="text-xs text-muted-foreground">
                                  Selected: {selectedAvatar.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="authorName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="authorTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Writer & Explorer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="authorSlogan"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author Slogan</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Living one story at a time"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="authorBio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell your story..."
                                    className="min-h-30"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="authorStory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author Story</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Your longer backstory..."
                                    className="min-h-30"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="your@email.com" {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-4">Social Links</h3>
                        <div className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="x"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>X (Twitter)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://x.com/yourhandle" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://instagram.com/yourhandle"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://facebook.com/yourhandle" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="portfolio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Portfolio</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://yourportfolio.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="border-t border-border pt-6 flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Profile'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-8">
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Site Settings</h2>
                <p className="text-muted-foreground">
                  Customize your blog&#39;s appearance and metadata
                </p>
              </div>
              {siteLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                  <Form {...siteSettingsForm}>
                    <form
                      onSubmit={siteSettingsForm.handleSubmit(onSiteSettingsSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={siteSettingsForm.control}
                          name="websiteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Journal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={siteSettingsForm.control}
                          name="bannerTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Banner Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Welcome to my world" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={siteSettingsForm.control}
                          name="bannerSlogan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Banner Slogan</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Stories that inspire" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={siteSettingsForm.control}
                          name="bannerBio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Banner Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="A brief description of your blog..."
                                  className="min-h-25"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div>
                          <h3 className="font-semibold mb-4">Banner Image</h3>
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              {selectedBannerImage ? (
                                <Image
                                  src={URL.createObjectURL(selectedBannerImage)}
                                  alt="Selected Banner Preview"
                                  width={96}
                                  height={96}
                                  className="w-24 h-24 rounded object-cover ring-4 ring-primary/20"
                                />
                              ) : siteSettingsForm.watch('bannerImage') ||
                                (site as any)?.bannerImage ? (
                                <Image
                                  src={
                                    siteSettingsForm.watch('bannerImage') ||
                                    (site as any)?.bannerImage ||
                                    ''
                                  }
                                  alt="Banner"
                                  width={96}
                                  height={96}
                                  className="w-24 h-24 rounded object-cover ring-4 ring-primary/20"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded bg-muted flex items-center justify-center ring-4 ring-primary/20">
                                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <FormField
                                control={siteSettingsForm.control}
                                name="bannerImage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Banner Image URL (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://example.com/banner.jpg"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormItem>
                                <FormLabel>Banner Image (Upload new image)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setSelectedBannerImage(e.target.files?.[0] || null)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                              {selectedBannerImage && (
                                <p className="text-xs text-muted-foreground">
                                  Selected: {selectedBannerImage.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-4">Preview</h3>
                        <div className="rounded-lg border border-border bg-muted/50 p-6">
                          <h2 className="text-2xl font-bold mb-2">
                            {siteSettingsForm.watch('websiteName') || (site as any)?.websiteName}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {siteSettingsForm.watch('bannerBio') || (site as any)?.bannerBio}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-border pt-6 flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Settings'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
