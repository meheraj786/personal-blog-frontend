import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  fullStory: string;
  category: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreatePostData {
  title: string;
  excerpt: string;
  fullStory: string;
  category: string;
  image?: File;
}

export interface UpdatePostData {
  title?: string;
  excerpt?: string;
  fullStory?: string;
  category?: string;
  image?: File;
  newSlug?: string;
}

// Get all posts
export function usePosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(`/post/get?page=${page}&limit=${limit}`);
      return response.data.data as PostsResponse;
    },
    staleTime: 60 * 1000,
  });
}

// Get single post by slug
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/post/get/${slug}`);
      return response.data.data as Post;
    },
    enabled: !!slug,
  });
}

// Get posts by category
export function usePostsByCategory(category: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['posts', 'category', category, page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/post/get-by-category/${category}?page=${page}&limit=${limit}`
      );
      return response.data.data as PostsResponse;
    },
    enabled: !!category,
  });
}

// ✅ FIX: Create post - Build FormData and send it
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('fullStory', data.fullStory);
      formData.append('category', data.category);

      if (data.image) {
        formData.append('image', data.image); // ✅ Matches multer field name
      }

      // ✅ Send FormData (axios auto-sets Content-Type)
      const response = await axiosInstance.post('/post/create', formData);
      return response.data.data as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ✅ FIX: Update post - Build FormData and send it
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: UpdatePostData }) => {
      const formData = new FormData();

      if (data.title) formData.append('title', data.title);
      if (data.excerpt) formData.append('excerpt', data.excerpt);
      if (data.fullStory) formData.append('fullStory', data.fullStory);
      if (data.category) formData.append('category', data.category);
      if (data.newSlug) formData.append('newSlug', data.newSlug);

      if (data.image) {
        formData.append('image', data.image); // ✅ Matches multer field name
      }

      // ✅ Send FormData
      const response = await axiosInstance.patch(`/post/update/${slug}`, formData);
      return response.data.data as Post;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', data.slug] });
    },
  });
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await axiosInstance.delete(`/post/delete/${slug}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
