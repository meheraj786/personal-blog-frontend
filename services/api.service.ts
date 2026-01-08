// services/api.service.ts
import { axiosInstance } from '@/lib/axios';

// ============= Types =============
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateEmailData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface Profile {
  _id: string;
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Site {
  _id: string;
  title: string;
  description: string;
  logo?: string;
  metadata?: {
    keywords?: string[];
    author?: string;
  };
}

export interface UpdateSiteData {
  title?: string;
  description?: string;
  logo?: string;
  metadata?: {
    keywords?: string[];
    author?: string;
  };
}

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

// ============= Auth Service =============
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },

  updateEmail: async (data: UpdateEmailData) => {
    const response = await axiosInstance.patch('/auth/email', data);
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordData) => {
    const response = await axiosInstance.patch('/auth/password', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data.user as User;
  },
};

// ============= Profile Service =============
export const profileService = {
  getProfile: async () => {
    const response = await axiosInstance.get('/profile/get');
    return response.data.data as Profile;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await axiosInstance.patch('/profile/update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as Profile;
  },
};

// ============= Site Service =============
export const siteService = {
  getSite: async () => {
    const response = await axiosInstance.get('/site/get');
    return response.data.data as Site;
  },

  updateSite: async (data: UpdateSiteData) => {
    const response = await axiosInstance.patch('/site/update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as Site;
  },
};

// ============= Post Service =============
export const postService = {
  getAllPosts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/post/get?page=${page}&limit=${limit}`);
    return response.data.data as PostsResponse;
  },

  getPostBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/post/get/${slug}`);
    return response.data.data as Post;
  },

  getPostsByCategory: async (category: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/post/get-by-category/${category}?page=${page}&limit=${limit}`
    );
    return response.data.data as PostsResponse;
  },

  createPost: async (data: CreatePostData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt);
    formData.append('fullStory', data.fullStory);
    formData.append('category', data.category);

    if (data.image) {
      formData.append('image', data.image);
    }

    console.log('FormData: apiService', formData);
    console.log('FormData: apiService data', data);

    const response = await axiosInstance.post('/post/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as Post;
  },

  updatePost: async (slug: string, data: UpdatePostData) => {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.excerpt) formData.append('excerpt', data.excerpt);
    if (data.fullStory) formData.append('fullStory', data.fullStory);
    if (data.category) formData.append('category', data.category);
    if (data.newSlug) formData.append('newSlug', data.newSlug);
    if (data.image) formData.append('image', data.image);

    const response = await axiosInstance.patch(`/post/update/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as Post;
  },

  deletePost: async (slug: string) => {
    const response = await axiosInstance.delete(`/post/delete/${slug}`);
    return response.data;
  },
};
