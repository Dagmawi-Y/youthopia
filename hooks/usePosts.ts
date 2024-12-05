import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, startAfter, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../lib/types';
import { useAuth } from '../lib/context/auth-context';
import * as FirestoreService from '../lib/services/firestore';

export const usePosts = (limitCount = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPost, setLastPost] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async (lastVisible?: any) => {
    try {
      setLoading(true);
      const postsRef = collection(db, 'posts');
      let q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(
          postsRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const newPosts: Post[] = [];
      
      querySnapshot.forEach((doc) => {
        newPosts.push(doc.data() as Post);
      });

      if (!lastVisible) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setLastPost(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === limitCount);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (lastPost) {
      fetchPosts(lastPost);
    }
  };

  const createPost = async (content: string, imageURL?: string) => {
    if (!user) return;
    
    try {
      await FirestoreService.createPost({
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || undefined,
        content,
        imageURL,
      });
      
      // Refresh posts
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the post');
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;
    
    try {
      await FirestoreService.likePost(postId, user.uid);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: [...post.likes, user.uid] }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while liking the post');
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return;
    
    try {
      await FirestoreService.unlikePost(postId, user.uid);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes.filter((id) => id !== user.uid) }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while unliking the post');
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    
    try {
      const commentId = await FirestoreService.addComment(postId, {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || undefined,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: commentId,
                    authorId: user.uid,
                    authorName: user.displayName || 'Anonymous',
                    authorPhotoURL: user.photoURL || undefined,
                    content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
              }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding the comment');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    createPost,
    likePost,
    unlikePost,
    addComment,
  };
}; 