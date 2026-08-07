import { createContext, useContext, useState, type ReactNode } from 'react';

import {
  aircraft as seedAircraft,
  comments as seedComments,
  posts as seedPosts,
  users as seedUsers,
} from '@/utils/sampleData';
import { CURRENT_USER_ID, type Aircraft, type Comment, type Post, type User } from '@/utils/types';

type AppDataContextValue = {
  users: User[];
  aircraft: Aircraft[];
  posts: Post[];
  comments: Comment[];
  isPostLiked: (postId: string) => boolean;
  isCommentLiked: (commentId: string) => boolean;
  togglePostLike: (postId: string) => void;
  toggleCommentLike: (commentId: string) => void;
  addComment: (postId: string, body: string) => void;
  deleteComment: (commentId: string) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, patch: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  addAircraft: (record: Aircraft) => void;
  updateAircraft: (aircraftId: string, patch: Partial<Aircraft>) => void;
  updateUser: (userId: string, patch: Partial<User>) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [aircraft, setAircraft] = useState<Aircraft[]>(seedAircraft);
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [comments, setComments] = useState<Comment[]>(seedComments);

  // No per-user like graph in the sample data (docs/ARCHITECTURE.md) — track
  // "did the current user like this" as separate id sets and derive the
  // displayed count from the stored likeCount elsewhere.
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  function isPostLiked(postId: string) {
    return likedPostIds.has(postId);
  }

  function isCommentLiked(commentId: string) {
    return likedCommentIds.has(commentId);
  }

  function togglePostLike(postId: string) {
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }

  function toggleCommentLike(commentId: string) {
    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }

  function addComment(postId: string, body: string) {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      authorId: CURRENT_USER_ID,
      body,
      createdAt: new Date().toISOString(),
      likeCount: 0,
    };
    setComments((prev) => [...prev, comment]);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
      ),
    );
  }

  function deleteComment(commentId: string) {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPosts((prev) =>
      prev.map((post) =>
        post.id === comment.postId
          ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
          : post,
      ),
    );
  }

  function addPost(post: Post) {
    setPosts((prev) => [...prev, post]);
  }

  function updatePost(postId: string, patch: Partial<Post>) {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, ...patch } : post)));
  }

  function deletePost(postId: string) {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setComments((prev) => prev.filter((comment) => comment.postId !== postId));
  }

  function addAircraft(record: Aircraft) {
    setAircraft((prev) => [...prev, record]);
  }

  function updateAircraft(aircraftId: string, patch: Partial<Aircraft>) {
    setAircraft((prev) => prev.map((a) => (a.id === aircraftId ? { ...a, ...patch } : a)));
  }

  function updateUser(userId: string, patch: Partial<User>) {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...patch } : user)));
  }

  const value: AppDataContextValue = {
    users,
    aircraft,
    posts,
    comments,
    isPostLiked,
    isCommentLiked,
    togglePostLike,
    toggleCommentLike,
    addComment,
    deleteComment,
    addPost,
    updatePost,
    deletePost,
    addAircraft,
    updateAircraft,
    updateUser,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
}
