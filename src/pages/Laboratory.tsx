// Helper to format time ago (Reddit style)
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (isNaN(seconds)) return '';
  if (seconds < 60) return `· just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `· ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `· ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `· ${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `· ${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `· ${years} year${years === 1 ? '' : 's'} ago`;
}
import React, { useState, useEffect } from 'react';
import { BiUpvote } from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { FaRegComments } from 'react-icons/fa';
import { IoArrowBackOutline } from "react-icons/io5";
import { FiLogOut } from 'react-icons/fi';
import './Laboratory.css';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LabAuthModal from './LabAuthModal';
import labImg from '../assets/lab_w.png';
import labBg from '../assets/lab-bg.png';
import * as Dialog from '@radix-ui/react-dialog';
import actumLogo from '../assets/ACTUM_white.png';
import strategylogo from '../assets/lab_logos/strategylogo.png';
import designlogo from '../assets/lab_logos/designlogo.png';
import constructionlogo from '../assets/lab_logos/constructionlogo.png';
import financelogo from '../assets/lab_logos/financelogo.png';
import partnershipslogo from '../assets/lab_logos/partnershipslogo.png';
import technologylogo from '../assets/lab_logos/technologylogo.png';
import legallogo from '../assets/lab_logos/legallogo.png';
import volunteerslogo from '../assets/lab_logos/volunteerslogo.png';
import medialogo from '../assets/lab_logos/medialogo.png';
import ethicslogo from '../assets/lab_logos/ethicslogo.png';
import storieslogo from '../assets/lab_logos/storieslogo.png';
import homelogo from '../assets/lab_logos/homelogo.png';
import ActumOfficialLogo from '../assets/ACTUM_white.png';
import { CircleFlag } from 'react-circle-flags';

// Category logos mapping
const categoryLogos: Record<string, string> = {
  strategy: strategylogo,
  design: designlogo,
  construction: constructionlogo,
  finance: financelogo,
  partnerships: partnershipslogo,
  technology: technologylogo,
  legal: legallogo,
  volunteers: volunteerslogo,
  media: medialogo,
  ethics: ethicslogo,
  stories: storieslogo,
  home: homelogo,
};

// Types for better type safety
interface Category {
  id: number;
  label: string;
  icon: string;
  color: string;
  description?: string;
}

interface Profile {
  id: string;
  username: string;
  country_flag: string;
  is_admin?: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
  user_id: string;
  votes: number;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  votes: number;
  created_at: string;
}

interface MonthlyPrompt {
  id: number;
  question: string;
  displaydate: string;
  created_at: string;
}

interface MonthlyPromptComment {
  id: number;
  prompt_id: number;
  user_id: string;
  content: string;
  votes: number;
  created_at: string;
}

export default function Laboratory() {
  const [hasLoaded, setHasLoaded] = useState(false);

  // Reddit-style collapsed state for comment threads (must be top-level for hooks)
  const [collapsedThreads, setCollapsedThreads] = useState<{[id: number]: boolean}>({});
  // ...existing code...

  // Threaded comment reply handler
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyLoading(true);
    setReplyError(null);
    if (!user || !profile) {
      setReplyError('You must be logged in to reply.');
      setReplyLoading(false);
      setAuthModalOpen(true);
      return;
    }
    if (!replyContent.trim()) {
      setReplyError('Reply cannot be empty.');
      setReplyLoading(false);
      return;
    }
    if (!activePost || !replyToCommentId) {
      setReplyLoading(false);
      return;
    }
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: activePost.id,
        user_id: user.id,
        content: replyContent.trim(),
        created_at: new Date().toISOString(),
        parent_comment_id: replyToCommentId
      });
    if (error) {
      setReplyError('Failed to add reply.');
      setReplyLoading(false);
      return;
    }
    setReplyContent('');
    setReplyToCommentId(null);
    refreshComments();
    setReplyLoading(false);
  };
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Post creation modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newPostCategoryId, setNewPostCategoryId] = useState<number | null>(null);
  
  // Post detail view (in place)
  const [activePost, setActivePost] = useState<Post | null>(null);
  // const [detailPage, setDetailPage] = useState(1); // Removed unused state
  // Comment pagination state
  const INITIAL_COMMENTS_COUNT = 5;
  const LOAD_MORE_COMMENTS_COUNT = 20;
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(INITIAL_COMMENTS_COUNT);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  // Threaded comments state
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  
  // Voting state
  const [userPostVotes, setUserPostVotes] = useState<number[]>([]);
  // Track loading state for post upvotes to prevent double clicks
  const [postVoteLoading, setPostVoteLoading] = useState<{ [postId: number]: boolean }>({});
  // Track loading state for comment upvotes to prevent double clicks
  const [commentVoteLoading, setCommentVoteLoading] = useState<{ [commentId: number]: boolean }>({});
  const [userCommentVotes, setUserCommentVotes] = useState<number[]>([]);
  const [userPromptCommentVotes, setUserPromptCommentVotes] = useState<number[]>([]);

  // Comment sort option for post detail view
  const [commentSortOption, setCommentSortOption] = useState<'mostVoted' | 'newest'>('mostVoted');

  // Monthly prompt state
  const [monthlyPrompt, setMonthlyPrompt] = useState<MonthlyPrompt | null>(null);
  const [monthlyPromptComments, setMonthlyPromptComments] = useState<MonthlyPromptComment[]>([]);
  const [monthlyPromptComment, setMonthlyPromptComment] = useState('');
  const [monthlyPromptCommentLoading, setMonthlyPromptCommentLoading] = useState(false);
  const [monthlyPromptCommentError, setMonthlyPromptCommentError] = useState<string | null>(null);

  // Admin functionality
  const [newPrompt, setNewPrompt] = useState('');
  const [newPromptLoading, setNewPromptLoading] = useState(false);
  const [newPromptError, setNewPromptError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching categories:', error);
        } else if (data) {
          setCategories(data);
          if (data.length > 0) setSelectedCategory(data[0].label);
        }
        setLoading(false);
      });
  }, []);

  // Authentication state management
  useEffect(() => {
    setAuthLoading(true);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    
    // Get current user on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setAuthLoading(false);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      supabase
        .from('profiles')
        .select('username, country_flag, is_admin')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) setProfile(data as Profile);
          setProfileLoading(false);
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  // Fetch posts, profiles, and comments
  useEffect(() => {
    setPostsLoading(true);
    Promise.all([
      supabase.from('posts').select('*'),
      supabase.from('profiles').select('id, username, country_flag, is_admin'),
      supabase.from('comments').select('*'),
    ]).then(([postsRes, profilesRes, commentsRes]) => {
      if (postsRes.error) {
        console.error('Error fetching posts:', postsRes.error);
        setPostsLoading(false);
        return;
      }
      if (profilesRes.error) {
        console.error('Error fetching profiles:', profilesRes.error);
        setPostsLoading(false);
        return;
      }
      if (commentsRes.error) {
        console.error('Error fetching comments:', commentsRes.error);
        setPostsLoading(false);
        return;
      }
      
      setPosts(postsRes.data || []);
      setProfiles(profilesRes.data || []);
      setComments(commentsRes.data || []);
      setPostsLoading(false);
    });
  }, []);

  // Fetch user votes when user or posts/comments change
  useEffect(() => {
    if (!user) {
      setUserPostVotes([]);
      setUserCommentVotes([]);
      return;
    }
    
    // Fetch post votes
    supabase
      .from('post_votes')
      .select('post_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setUserPostVotes(data.map(v => v.post_id));
      });
      
    // Fetch comment votes
    supabase
      .from('comment_votes')
      .select('comment_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setUserCommentVotes(data.map(v => v.comment_id));
      });
  }, [user, posts, comments]);

  // Set default category after categories load
  useEffect(() => {
    if (categories.length > 0 && newPostCategoryId == null) {
      setNewPostCategoryId(categories[0].id);
    }
  }, [categories]);

  // Fetch monthly prompt for the current month
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    
    supabase
      .from('monthly_prompt')
      .select('*')
      .like('displaydate', `${monthStr}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setMonthlyPrompt(data[0]);
        else setMonthlyPrompt(null);
      });
  }, []);

  // Fetch monthly prompt comments and user votes
  useEffect(() => {
    if (!monthlyPrompt) return;
    
    supabase
      .from('monthly_prompt_comments')
      .select('*')
      .eq('prompt_id', monthlyPrompt.id)
      .then(({ data, error }) => {
        if (!error && data) setMonthlyPromptComments(data);
      });
      
    if (user) {
      supabase
        .from('monthly_prompt_comment_votes')
        .select('comment_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) setUserPromptCommentVotes(data.map(v => v.comment_id));
        });
    } else {
      setUserPromptCommentVotes([]);
    }
  }, [monthlyPrompt, user]);

  // Helper functions
  const refreshPosts = async () => {
    const { data } = await supabase.from('posts').select('*');
    if (data) setPosts(data);
  };

  const refreshComments = async () => {
    const { data } = await supabase.from('comments').select('*');
    if (data) setComments(data);
  };

  const refreshMonthlyPromptComments = async () => {
    if (!monthlyPrompt) return;
    const { data } = await supabase
      .from('monthly_prompt_comments')
      .select('*')
      .eq('prompt_id', monthlyPrompt.id);
    if (data) setMonthlyPromptComments(data);
  };

  // Event handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const handleCreatePost = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setCreateModalOpen(true);
    setCreateError(null);
    setNewPostCategoryId(categories.find(c => c.label === selectedCategory)?.id ?? null);
  };

  const handleOpenPost = (post: Post) => {
    setActivePost(post);
    setNewComment('');
    setCommentError(null);
    setVisibleCommentsCount(INITIAL_COMMENTS_COUNT);
  };

  const handleCommentOnPost = (post: Post) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setActivePost(post);
  };

  // Voting handlers
  const handleUpvotePost = async (postId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // Prevent double click
    if (postVoteLoading[postId]) return;
    setPostVoteLoading(prev => ({ ...prev, [postId]: true }));
    try {
      // Optimistically update local vote count for instant UI feedback
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        if (userPostVotes.includes(postId)) {
          // Remove vote locally
          return { ...post, votes: (post.votes || 0) - 1 };
        } else {
          // Add vote locally
          return { ...post, votes: (post.votes || 0) + 1 };
        }
      }));
      if (userPostVotes.includes(postId)) {
        // Remove vote
        await supabase.from('post_votes').delete().eq('user_id', user.id).eq('post_id', postId);
        await supabase.rpc('decrement_post_votes', { postid: postId });
        setUserPostVotes(userPostVotes.filter(id => id !== postId));
      } else {
        // Add vote
        const { error } = await supabase.from('post_votes').insert({ user_id: user.id, post_id: postId });
        if (!error) {
          await supabase.rpc('increment_post_votes', { postid: postId });
          setUserPostVotes([...userPostVotes, postId]);
        }
      }
      // Optionally, you can still refresh posts from backend for consistency
      // await refreshPosts();
    } finally {
      setPostVoteLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleUpvoteComment = async (commentId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (commentVoteLoading[commentId]) return;
    setCommentVoteLoading(prev => ({ ...prev, [commentId]: true }));
    try {
      if (userCommentVotes.includes(commentId)) {
        // Remove vote
        await supabase.from('comment_votes').delete().eq('user_id', user.id).eq('comment_id', commentId);
        await supabase.rpc('decrement_comment_votes', { commentid: commentId });
        setUserCommentVotes(userCommentVotes.filter(id => id !== commentId));
      } else {
        // Add vote
        const { error } = await supabase.from('comment_votes').insert({ user_id: user.id, comment_id: commentId });
        if (!error) {
          await supabase.rpc('increment_comment_votes', { commentid: commentId });
          setUserCommentVotes([...userCommentVotes, commentId]);
        }
      }
      refreshComments();
    } finally {
      setCommentVoteLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleUpvotePromptComment = async (commentId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (userPromptCommentVotes.includes(commentId)) {
      await supabase.from('monthly_prompt_comment_votes').delete().eq('user_id', user.id).eq('comment_id', commentId);
      await supabase.rpc('decrement_monthly_prompt_comment_votes', { commentid: commentId });
      setUserPromptCommentVotes(userPromptCommentVotes.filter(id => id !== commentId));
    } else {
      const { error } = await supabase.from('monthly_prompt_comment_votes').insert({ user_id: user.id, comment_id: commentId });
      if (!error) {
        await supabase.rpc('increment_monthly_prompt_comment_votes', { commentid: commentId });
        setUserPromptCommentVotes([...userPromptCommentVotes, commentId]);
      }
    }
    refreshMonthlyPromptComments();
  };

  // Delete handlers
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    await supabase.from('posts').delete().eq('id', postId);
    await supabase.from('comments').delete().eq('post_id', postId);
    
    refreshPosts();
    refreshComments();
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    await supabase.from('comment_votes').delete().eq('comment_id', commentId);
    await supabase.from('comments').delete().eq('id', commentId);
    
    refreshComments();
  };

  const handleDeleteMonthlyPromptComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    await supabase.from('monthly_prompt_comment_votes').delete().eq('comment_id', commentId);
    await supabase.from('monthly_prompt_comments').delete().eq('id', commentId);
    
    refreshMonthlyPromptComments();
  };

  // Form submission handlers
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    
    if (!user || !profile) {
      setCreateError('You must be logged in to create a post.');
      setCreateLoading(false);
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setCreateError('Title and content are required.');
      setCreateLoading(false);
      return;
    }
    
    const { error } = await supabase
      .from('posts')
      .insert({
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category_id: newPostCategoryId,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });
      
    if (error) {
      setCreateError('Failed to create post.');
      setCreateLoading(false);
      return;
    }
    
    setCreateModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    refreshPosts();
    setCreateLoading(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    if (!user || !profile) {
      setCommentError('You must be logged in to comment.');
      setCommentLoading(false);
      setAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      setCommentLoading(false);
      return;
    }
    if (!activePost) return;
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: activePost.id,
        user_id: user.id,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        parent_comment_id: null // top-level comment
      });
    if (error) {
      setCommentError('Failed to add comment.');
      setCommentLoading(false);
      return;
    }
    setNewComment('');
    refreshComments();
    setCommentLoading(false);
  };

  const handleAddPromptComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMonthlyPromptCommentLoading(true);
    setMonthlyPromptCommentError(null);
    
    if (!user || !profile) {
      setMonthlyPromptCommentError('You must be logged in to comment.');
      setMonthlyPromptCommentLoading(false);
      setAuthModalOpen(true);
      return;
    }
    
    if (!monthlyPromptComment.trim()) {
      setMonthlyPromptCommentError('Comment cannot be empty.');
      setMonthlyPromptCommentLoading(false);
      return;
    }
    
    if (!monthlyPrompt) return;
    
    const { error } = await supabase
      .from('monthly_prompt_comments')
      .insert({
        prompt_id: monthlyPrompt.id,
        user_id: user.id,
        content: monthlyPromptComment.trim(),
        created_at: new Date().toISOString(),
      });
      
    if (error) {
      setMonthlyPromptCommentError('Failed to add comment.');
      setMonthlyPromptCommentLoading(false);
      return;
    }
    
    setMonthlyPromptComment('');
    refreshMonthlyPromptComments();
    setMonthlyPromptCommentLoading(false);
  };

  const handleSetPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPromptLoading(true);
    setNewPromptError(null);
    
    if (!newPrompt.trim()) {
      setNewPromptError('Prompt cannot be empty.');
      setNewPromptLoading(false);
      return;
    }
    
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    
    const { error: updateError } = await supabase
      .from('monthly_prompt')
      .update({ question: newPrompt })
      .like('displaydate', `${monthStr}%`);
      
    if (updateError) {
      setNewPromptError('Failed to update prompt.');
      setNewPromptLoading(false);
      return;
    }
    
    setNewPrompt('');
    
    // Refresh prompt
    supabase
      .from('monthly_prompt')
      .select('*')
      .like('displaydate', `${monthStr}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setMonthlyPrompt(data[0]);
      });
      
    setNewPromptLoading(false);
  };

  // Helper component to render user flag
  const UserFlag = ({ profile }: { profile?: Profile }) => {
    if (!profile) return null;
    if (profile.country_flag === 'ACTUM') {
      return <img src={actumLogo} alt="Actum Logo" className="lab-post-author-flag" />;
    }
    // Use react-circle-flags for country flag
    return (
      <CircleFlag countryCode={profile.country_flag?.toLowerCase()} height={24} width={24} style={{ borderRadius: '50%' }} />
    );
  };

  // Helper component to render category icon
  const CategoryIcon = ({ category }: { category?: Category }) => {
    if (!category) return null;
    
    return categoryLogos[category.label.toLowerCase()] ? (
      <img 
        src={categoryLogos[category.label.toLowerCase()]} 
        alt={category.label} 
        className="lab-header-icon"
      />
    ) : (
      <span className="lab-header-icon">{category.icon}</span>
    );
  };


  // Search/filter state
  const [searchTerm, setSearchTerm] = useState('');
  // Global search bar state
  const [globalSearch, setGlobalSearch] = useState('');
  // Track previous category for reverting when search is cleared
  const [prevCategory, setPrevCategory] = useState<string | null>(null);

  // Sort option state
  const [sortOption, setSortOption] = useState<'mostVoted' | 'newest' | 'mostComments'>('mostVoted');

  // Filter posts by global search or selected category, search term, and user
  // Find the Home category (was 'Search')
  const homeCategory = categories.find(c => c.label.toLowerCase() === 'home');

  // Auto-switch to Home tab when global search is typed in
  useEffect(() => {
    if (!homeCategory) return;
    if (globalSearch.trim() !== '' && selectedCategory !== homeCategory.label) {
      setPrevCategory(selectedCategory);
      setSelectedCategory(homeCategory.label);
    } else if (globalSearch.trim() === '' && selectedCategory === homeCategory.label && prevCategory) {
      setSelectedCategory(prevCategory);
      setPrevCategory(null);
    }
  }, [globalSearch, homeCategory, selectedCategory, prevCategory]);

  let filteredPosts = posts.filter(post => {
    // If 'Home' category is selected, show all posts (optionally filter by global search)
    if (selectedCategory && homeCategory && selectedCategory === homeCategory.label) {
      if (globalSearch.trim() !== '') {
        const author = profiles.find(p => p.id === post.user_id);
        const cat = categories.find(c => c.id === post.category_id);
        const matchesTitle = post.title.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesContent = (post.content || '').toLowerCase().includes(globalSearch.toLowerCase());
        const matchesUser = author && author.username.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesCategory = cat && cat.label.toLowerCase().includes(globalSearch.toLowerCase());
        return matchesTitle || matchesContent || matchesUser || matchesCategory;
      }
      return true; // Show all posts if no search
    }
    // If global search is active, search all posts in all communities
    if (globalSearch.trim() !== '') {
      const author = profiles.find(p => p.id === post.user_id);
      const cat = categories.find(c => c.id === post.category_id);
      const matchesTitle = post.title.toLowerCase().includes(globalSearch.toLowerCase());
      const matchesContent = (post.content || '').toLowerCase().includes(globalSearch.toLowerCase());
      const matchesUser = author && author.username.toLowerCase().includes(globalSearch.toLowerCase());
      const matchesCategory = cat && cat.label.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesTitle || matchesContent || matchesUser || matchesCategory;
    } else {
      const cat = categories.find(c => c.label === selectedCategory);
      if (!cat || post.category_id !== cat.id) return false;
      const matchesTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContent = (post.content || '').toLowerCase().includes(searchTerm.toLowerCase());
      return searchTerm.trim() === '' || matchesTitle || matchesContent;
    }
  });

  // Sort posts by selected sort option
  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'mostVoted') {
      return (b.votes || 0) - (a.votes || 0);
    } else if (sortOption === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === 'mostComments') {
      // Sort by number of comments (descending)
      const aComments = comments.filter(c => c.post_id === a.id).length;
      const bComments = comments.filter(c => c.post_id === b.id).length;
      return bComments - aComments;
    }
    return 0;
  });

  // Get current category
  const currentCategory = categories.find(c => c.label === selectedCategory);

  // Set Home as default selected category on load
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === '' && homeCategory) {
      setSelectedCategory(homeCategory.label);
    }
  }, [categories, selectedCategory, homeCategory]);

  useEffect(() => {
    // Apply fade-in class on initial load
    if (!hasLoaded) {
      const mainContent = document.querySelector('.lab-main-content-area');
      if (mainContent) {mainContent.classList.add('fade-in');}
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  return (
    <div 
      className="lab-layout lab-layout-with-bg"
      style={{ background: `url(${labBg}) center center / cover, #18171c` }}
    >
      {/* Auth Modal */}
      <LabAuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        onAuthSuccess={() => {
          if (user) {
            setProfileLoading(true);
            supabase
              .from('profiles')
              .select('username, country_flag, is_admin')
              .eq('id', user.id)
              .maybeSingle()
              .then(({ data, error }) => {
                if (!error && data) setProfile(data as Profile);
                setProfileLoading(false);
              });
          }
        }} 
      />

      {/* Left Sidebar */}
      <aside className="lab-main-sidebar">
        <Link to="/" className="lab-logo-container">
          <img 
            src={ActumOfficialLogo} 
            alt="ACTUM Logo" 
            className="lab-logo-official" 
          />
        </Link>
        
        <nav className="lab-nav">
          {loading ? (
            <div className="lab-loading lab-loading-nav">Loading...</div>
          ) : (
            (() => {
              // Put Home category first, then the rest
              const homeCat = categories.find(c => c.label.toLowerCase() === 'home');
              const otherCats = categories.filter(c => c.label.toLowerCase() !== 'home');
              const orderedCats = homeCat ? [homeCat, ...otherCats] : categories;
              return orderedCats.map(cat => (
                <div
                  key={cat.id}
                  className={`lab-nav-item reddit-style-nav ${selectedCategory === cat.label ? 'selected' : ''}`}
                  style={{
                  color: selectedCategory === cat.label ? cat.color : '#fff',
                  borderRadius: '1rem',
                  marginBottom: 4,
                  cursor: 'pointer',
                  padding: '0.25rem 0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 400,
                  fontSize: 14, // Increased font size
                  transition: 'color 0.15s, border-bottom 0.2s',
                  outlineOffset: -1,
                  border: 'none',
                  borderBottom: selectedCategory === cat.label ? `3px solid ${cat.color}` : '3px solid transparent',
                  minHeight: 44,
                  boxShadow: 'none',
                  background: 'transparent',
                  filter: 'none',
                  fontFamily: "'IBM Plex Sans', 'Arial', 'Helvetica Neue', Arial, sans-serif", // Reddit font
                  }}
                  onClick={() => {
                  setSelectedCategory(cat.label);
                  if (activePost) setActivePost(null);
                  }}
                  tabIndex={0}
                >
                  <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100%',
                  marginRight: 0,
                  flexShrink: 0,
                  overflow: 'hidden',
                  }}>
                  {categoryLogos[cat.label.toLowerCase()] ? (
                    <img
                    src={categoryLogos[cat.label.toLowerCase()]}
                    alt={cat.label}
                    style={{ width: '3rem', height: '3rem', objectFit: 'contain', borderRadius: '100%' }}
                    />
                  ) : (
                    <span style={{ fontSize: 28, color: cat.color }}>{cat.icon}</span>
                  )}
                  </span>
                  <span style={{
                  fontSize: 18, // Increased font size for label
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginLeft: 0,
                  fontFamily: "'IBM Plex Sans', 'Arial', 'Helvetica Neue', Arial, sans-serif", // Reddit font
                  }}>{cat.label}</span>
                </div>
              ));
            })()
          )}
        </nav>

        {/* Auth Section */}
        <div className="lab-auth-section">
          {authLoading || profileLoading ? (
            <div className="lab-loading lab-loading-auth">Loading...</div>
          ) : user && profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem 0', minHeight: 32, maxWidth: '100%' }}>
              {/* Flag or user photo - size 26px, vertically centered */}
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 26, width: 26, flexShrink: 0 }}>
                <UserFlag profile={profile} />
              </span>
              {/* Username - bigger font, vertically centered, truncate if too long */}
              <span style={{
                fontWeight: 700,
                color: '#fff',
                fontSize: 21,
                lineHeight: '26px',
                marginLeft: 8,
                marginRight: 8,
                display: 'flex',
                alignItems: 'center',
                height: 26,
                minWidth: 0,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1
              }}>{profile.username}</span>
              {/* Logout icon button - red color, size 26px, moved slightly down */}
              <button 
                onClick={handleLogout} 
                className="lab-auth-button lab-logout-button"
                style={{ background: 'none', border: 'none', padding: 0, marginLeft: 0, marginBottom: 0, cursor: 'pointer', color: '#e53935', fontSize: 26, display: 'flex', alignItems: 'flex-end', height: 32, width: 32, justifyContent: 'center', flexShrink: 0 }}
                title="Log Out"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)} 
              className="lab-auth-button lab-login-button"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </aside>


      {/* Main Content */}
      <main className="lab-main-content-area">
        {/* Global Search Bar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2.2rem 0 1.2rem 0' }}>
          <input
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder="Search all posts and communities..."
            style={{
              width: 'min(600px, 90vw)',
              fontSize: 22,
              padding: '1.1rem 2.2rem',
              borderRadius: 18,
              border: '1.5px solid #333',
              background: '#19191f',
              color: '#fff',
              fontWeight: 500,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
              outline: 'none',
              margin: 0,
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.border = '2px solid #5e5eff')}
            onBlur={e => (e.currentTarget.style.border = '1.5px solid #333')}
            aria-label="Global search posts"
          />
        </div>

        <div className="lab-header">
          {homeCategory && selectedCategory === homeCategory.label ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={labImg} alt="Lab" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 12 }} />
              <h1 className="lab-header-title" style={{ letterSpacing: '0.01em', fontWeight: 700, fontSize: 32, color: '#fff', margin: 0 }}>THE LAB</h1>
            </div>
          ) : (
            <>
              <CategoryIcon category={currentCategory} />
              <h1 className="lab-header-title">{selectedCategory}</h1>
            </>
          )}
        </div>

        {/* Show description always on Home, and on other categories as before */}
        {((homeCategory && selectedCategory === homeCategory.label) || (currentCategory && (!homeCategory || selectedCategory !== homeCategory.label))) && (
          <div className="labratory-description">
            {homeCategory && selectedCategory === homeCategory.label
              ? (homeCategory.description || '')
              : (currentCategory?.description || '')}
          </div>
        )}

        {/* Top Bar: Search/Filter, Sort, and Create Post (only for non-Home categories) */}
        {currentCategory && (!homeCategory || selectedCategory !== homeCategory.label) && (
          <div className="lab-top-bar" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            {/* Community-limited search bar (styled like global, but only searches this community) */}
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search ${selectedCategory}...`}
              style={{
                width: 'min(400px, 90vw)',
                fontSize: 18,
                padding: '0.7rem 1.5rem',
                borderRadius: 14,
                border: '1.5px solid #333',
                background: '#19191f',
                color: '#fff',
                fontWeight: 500,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
                outline: 'none',
                margin: 0,
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.border = '2px solid #5e5eff')}
              onBlur={e => (e.currentTarget.style.border = '1.5px solid #333')}
              aria-label={`Search ${selectedCategory}`}
            />
            <div style={{ position: 'relative' }}>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as 'mostVoted' | 'newest' | 'mostComments')}
                className="custom-select"
                style={{
                  padding: '6px 28px 6px 12px',
                  fontSize: 14,
                  color: '#fff',
                  backgroundColor: '#1A1A1A',
                  border: 'none',
                  borderRadius: 16,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
                aria-label="Sort posts"
              >
                <option value="mostVoted">Most Voted</option>
                <option value="mostComments">Most Comments</option>
                <option value="newest">Recent</option>
              </select>
              {/* Dropdown arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#ccc"
                viewBox="0 0 24 24"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
            <button
              className="lab-create-button lab-create-button-top"
              onClick={handleCreatePost}
            >
              + Create Post
            </button>
          </div>
        )}

        {/* Show sort bar on Home page (like comment sort) */}
        {homeCategory && selectedCategory === homeCategory.label && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 18px 0' }}>
            <span style={{ color: '#b3b3b3', fontSize: 14, fontWeight: 500 }}>Sort by:</span>
            <div style={{ position: 'relative' }}>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as 'mostVoted' | 'newest' | 'mostComments')}
                className="custom-select"
                style={{
                  padding: '6px 28px 6px 12px',
                  fontSize: 14,
                  color: '#fff',
                  backgroundColor: '#1A1A1A',
                  border: 'none',
                  borderRadius: 16,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
                aria-label="Sort posts"
              >
                <option value="mostVoted">Most Voted</option>
                <option value="newest">Recent</option>
                <option value="mostComments">Most Comments</option>
              </select>
              {/* Dropdown arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#ccc"
                viewBox="0 0 24 24"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>
        )}

        {createError && (
          <div className="lab-error lab-error-margin">{createError}</div>
        )}

        {/* Create Post Modal */}
        <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="lab-modal-overlay" />
            <Dialog.Content className="lab-modal-content">
              <Dialog.Title className="lab-modal-title">Create Post</Dialog.Title>
              
              {/* Tabs */}
              <div className="lab-tabs">
                <div className="lab-tab active">Text</div>
                <div className="lab-tab disabled">Images</div>
              </div>
              
              <form onSubmit={handleSubmitPost} className="lab-form">
                {/* Category Selector */}
                <select
                  value={newPostCategoryId || ''}
                  onChange={e => setNewPostCategoryId(Number(e.target.value))}
                  required
                  className="lab-select"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                
                {/* Title Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Title*"
                    value={newPostTitle}
                    onChange={e => {
                      if (e.target.value.length <= 300) setNewPostTitle(e.target.value);
                    }}
                    required
                    className="lab-input lab-input-title"
                  />
                  <span className="lab-char-counter">
                    {newPostTitle.length}/300
                  </span>
                </div>
                
                {/* Content Textarea */}
                <textarea
                  placeholder="Body text*"
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  required
                  className="lab-textarea"
                />
                
                <div className="lab-category-info">
                  Category: <b>{categories.find(c => c.id === newPostCategoryId)?.label || ''}</b>
                </div>
                
                {createError && (
                  <div className="lab-error">{createError}</div>
                )}
                
                <button
                  type="submit"
                  disabled={createLoading}
                  className="lab-primary-button lab-button-large"
                >
                  {createLoading ? 'Posting...' : 'Post'}
                </button>
              </form>
              
              <Dialog.Close asChild>
                <button className="lab-modal-close" aria-label="Close">×</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Post Feed or Post Detail */}
        {activePost ? (
          (() => {
            // Always use the latest post object from posts state for up-to-date votes
            const post = posts.find(p => p.id === activePost.id) || activePost;
            const author = profiles.find(p => p.id === post.user_id);
            const cat = categories.find(c => c.id === post.category_id);

            // Get and sort comments for this post
            let postCommentsRaw = comments.filter(c => c.post_id === post.id);
            postCommentsRaw = [...postCommentsRaw].sort((a, b) => {
              if (commentSortOption === 'mostVoted') {
                return (b.votes || 0) - (a.votes || 0);
              } else if (commentSortOption === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              }
              return 0;
            });
            // const postComments = postCommentsRaw.slice(0, visibleCommentsCount); // unused after recursion
            const hasMoreComments = visibleCommentsCount < postCommentsRaw.length;
            return (
              <div className="lab-post-card lab-post-detail">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setActivePost(null)}
                    className="lab-button-small"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <IoArrowBackOutline style={{ marginRight: 6 }} /> Back to Posts
                  </button>
                  {/* Category tag styled like post card */}
                  {cat && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: cat.color,
                        borderRadius: '999px',
                        padding: '2px 16px',
                        fontWeight: 500,
                        fontSize: 15,
                        color: '#fff',
                        maxWidth: 120,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: 16,
                      }}
                    >
                      {cat.label}
                    </div>
                  )}
                </div>
                <div className="lab-post-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div className="lab-post-author" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserFlag profile={author} />
                    <span className="lab-post-author-name">
                      {author?.username || 'Anon'}
                    </span>
                    <span style={{ color: '#aaa', fontSize: 13, marginLeft: 2 }}>
                      {timeAgo(post.created_at)}
                    </span>
                  </div>
                </div>
                <h2 className="lab-post-title" style={{ textDecoration: 'none', cursor: 'default' }}>
                  {post.title}
                </h2>
                <div 
                  className="lab-post-content" 
                  style={{ cursor: 'default', whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: (post.content || '').replace(/\n/g, '<br />') }} 
                />
                {/* Upvote and Comment controls under post content */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 18, marginBottom: 18, gap: 12 }}>
                  {/* Upvote/Downvote */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6f7', borderRadius: 20, padding: '2px 10px', gap: 2 }}>
                    <button
                      onClick={() => handleUpvotePost(post.id)}
                      disabled={!user || postVoteLoading[post.id]}
                      className={`lab-vote-button ${userPostVotes.includes(post.id) ? 'voted' : ''}`}
                      title={userPostVotes.includes(post.id) ? 'Remove upvote' : 'Upvote'}
                      style={{ color: userPostVotes.includes(post.id) ? '#ff4500' : '#878a8c', background: 'none', border: 'none', fontSize: 22, padding: 0, margin: 0, cursor: postVoteLoading[post.id] ? 'not-allowed' : 'pointer', opacity: postVoteLoading[post.id] ? 0.6 : 1 }}
                    >
                      <BiUpvote />
                    </button>
                    <span style={{ color: '#222', fontWeight: 700, fontSize: 15, minWidth: 18, textAlign: 'center' }}>
                      {post.votes?.toLocaleString?.() || 0}
                    </span>
                  </div>
                  {/* Comment Button (icon only, not clickable in detail view) */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6f7', border: 'none', borderRadius: 20, padding: '2px 14px', color: '#222', fontWeight: 600, fontSize: 15, gap: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', color: '#878a8c', fontSize: 18, marginRight: 2 }}>
                      <FaRegComments />
                    </span>
                    <span>{comments.filter(c => c.post_id === activePost.id).length}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '1.2rem 0 0.7rem 0' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>Comments</span>
                </div>
                {/* Comment Form */}
                {user && profile ? (
                  <form onSubmit={handleSubmitComment} className="lab-form-row" style={{
                    marginBottom: 8,
                    alignItems: 'flex-end',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                    <div style={{
                      flex: 1,
                      background: '#101214',
                      borderRadius: 14,
                      border: '1.5px solid #23232a',
                      padding: '0',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      minHeight: 56,
                    }}>
                      <textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => {
                          setNewComment(e.target.value);
                          // Auto expand logic handled by rows and style
                        }}
                        required
                        className="lab-input lab-input-regular"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#fff',
                          fontWeight: 400,
                          fontSize: 15,
                          minHeight: 44,
                          maxHeight: 320, // 10 lines at ~32px/line
                          resize: 'vertical',
                          padding: '16px 18px 44px 18px', // extra bottom for buttons
                          borderRadius: 14,
                          fontFamily: 'inherit',
                          overflowY: 'auto',
                          boxSizing: 'border-box',
                          transition: 'max-height 0.2s',
                        }}
                        rows={Math.min(10, Math.max(2, newComment.split('\n').length))}
                      />
                      {/* Buttons inside the box, bottom right */}
                      <div style={{
                        position: 'absolute',
                        right: 14,
                        bottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <button
                          type="button"
                          onClick={() => { setNewComment(''); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ccc',
                            fontSize: 15,
                            borderRadius: 0,
                            padding: 0,
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'color 0.15s',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={commentLoading}
                          className="lab-primary-button lab-button-medium"
                          style={{
                          background: '#000000ff',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 15,
                          borderRadius: 8,
                          padding: '7px 18px',
                          border: 'none',
                          cursor: commentLoading ? 'not-allowed' : 'pointer',
                          opacity: commentLoading ? 0.7 : 1,
                          transition: 'background 0.15s',
                          }}
                          onMouseOver={e => { if (!commentLoading) e.currentTarget.style.background = '#444'; }}
                          onMouseOut={e => { if (!commentLoading) e.currentTarget.style.background = '#000000ff'; }}
                        >
                          {commentLoading ? 'Posting...' : 'Comment'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div style={{ color: '#aaa', marginBottom: 8 }}>
                    Log in to comment.
                  </div>
                )}
                {/* Comment Sort Dropdown - Reddit style, left-aligned, inline label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 10px 0' }}>
                  <span style={{ color: '#b3b3b3', fontSize: 14, fontWeight: 500 }}>Sort by:</span>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={commentSortOption}
                      onChange={e => setCommentSortOption(e.target.value as 'mostVoted' | 'newest')}
                      className="custom-select"
                      style={{
                        padding: '6px 28px 6px 12px',
                        fontSize: 14,
                        color: '#fff',
                        backgroundColor: '#1A1A1A',
                        border: 'none',
                        borderRadius: 16,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                      aria-label="Sort comments"
                    >
                      <option value="mostVoted">Best</option>
                      <option value="newest">Newest</option>
                    </select>
                    {/* Dropdown arrow icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#ccc"
                      viewBox="0 0 24 24"
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
                {commentError && (
                  <div className="lab-error" style={{ marginBottom: 8 }}>
                    {commentError}
                  </div>
                )}
                {/* Comments List */}
                <div style={{ width: '100%', maxHeight: 400, overflowY: 'auto', marginBottom: 18 }}>
                  {/* Threaded comments rendering - recursive */}
                  {(() => {
                    // Add type for Comment (should match your actual Comment type)
                    type ThreadedComment = Comment & { parent_comment_id?: number | null };
                    // Helper to toggle collapse
                    const toggleCollapse = (id: number) => setCollapsedThreads(prev => ({ ...prev, [id]: !prev[id] }));
                    function renderComments(commentList: ThreadedComment[], parentId: number | null = null, depth = 0): React.ReactNode[] {
                      return commentList
                        .filter((c: ThreadedComment) => c.parent_comment_id === parentId)
                        .map((c: ThreadedComment) => {
                          const commenter = profiles.find(p => p.id === c.user_id);
                          // Find if this comment has replies
                          const hasReplies = commentList.some(child => child.parent_comment_id === c.id);
                          const isCollapsed = collapsedThreads[c.id];
                          return (
                            <div key={c.id} className="lab-comment-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: 'column', marginBottom: 10, marginTop: 10, marginLeft: depth > 0 ? 24 : 0, borderLeft: depth > 0 ? '2px solid #23232a' : 'none', paddingLeft: depth > 0 ? 12 : 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                {/* Chevron expand/collapse button, inline before upvote */}
                                
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                  <div className="lab-comment-author" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <UserFlag profile={commenter} />
                                    <span className="lab-comment-author-name">
                                      {commenter?.username || 'Anon'}
                                    </span>
                                    <span style={{ color: '#aaa', fontSize: 13, marginLeft: 2 }}>{timeAgo(c.created_at)}</span>
                                  </div>
                                  <div className="lab-comment-text" style={{ margin: '2px 0 0 0', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{c.content}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, marginBottom: 2 }}>
                                    <button
                                      onClick={() => handleUpvoteComment(c.id)}
                                      disabled={!user || commentVoteLoading?.[c.id]}
                                      className={`lab-vote-button ${userCommentVotes.includes(c.id) ? 'voted' : ''}`}
                                      title={userCommentVotes.includes(c.id) ? 'Remove upvote' : 'Upvote'}
                                      style={{ color: userCommentVotes.includes(c.id) ? '#ff4500' : '#878a8c', background: 'none', border: 'none', fontSize: 20, padding: 0, margin: 0, cursor: commentVoteLoading?.[c.id] ? 'not-allowed' : 'pointer', opacity: commentVoteLoading?.[c.id] ? 0.6 : 1, lineHeight: 1 }}
                                    >
                                      <BiUpvote />
                                    </button>
                                    <span style={{ color: '#fefefe', fontWeight: 700, fontSize: 12, minWidth: 18, textAlign: 'center', lineHeight: 1, marginLeft: 2, marginRight: 14 }}>
                                      {c.votes?.toLocaleString?.() || 0}
                                    </span>
                                    <button
                                      onClick={() => {
                                        // Auto-expand if collapsed and has replies
                                        if (hasReplies && isCollapsed) toggleCollapse(c.id);
                                        setReplyToCommentId(c.id);
                                        setReplyContent('');
                                      }}
                                      className="lab-reply-icon-btn"
                                      style={{ marginLeft: 0, marginRight: 14, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#ffffffff', fontSize: 16, display: 'flex', alignItems: 'center' }}
                                      title="Reply"
                                      type="button"
                                    >
                                      <FaRegComments style={{ fontSize: 16, marginRight: 3, verticalAlign: 'middle' }} />
                                    </button>
                                    {(commenter?.id === user?.id || profile?.is_admin) && (
                                      <button
                                        onClick={() => handleDeleteComment(c.id)}
                                        className="lab-delete-icon-btn"
                                        style={{
                                          marginLeft: 0,
                                          background: 'none',
                                          border: 'none',
                                          padding: 0,
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          color: '#b0b0b0',
                                          fontSize: 20,
                                          transition: 'color 0.15s',
                                          outline: 'none',
                                        }}
                                        title="Delete comment"
                                        type="button"
                                        onMouseOver={e => (e.currentTarget.style.color = '#e53935')}
                                        onMouseOut={e => (e.currentTarget.style.color = '#b0b0b0')}
                                        onFocus={e => (e.currentTarget.style.outline = 'none')}
                                      >
                                        <MdOutlineDelete />
                                      </button>
                                    )}
                                    {/* Chevron expand/collapse button at end of action row */}
                                    {hasReplies && (
                                      <button
                                        onClick={() => toggleCollapse(c.id)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#888',
                                          fontSize: 18,
                                          cursor: 'pointer',
                                          marginLeft: 10,
                                          padding: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          transition: 'color 0.15s, transform 0.15s',
                                          transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                                          outline: 'none',
                                        }}
                                        title={isCollapsed ? 'Expand thread' : 'Collapse thread'}
                                        tabIndex={0}
                                        onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                                        onMouseOut={e => (e.currentTarget.style.color = '#888')}
                                      >
                                        <FaChevronRight />
                                      </button>
                                    )}
                                  </div>
                                  {/* Reply form for this comment */}
                                  {replyToCommentId === c.id && (
                                    <div style={{ position: 'relative', width: '100%' }}>
                                      <form onSubmit={handleSubmitReply} style={{
                                        marginTop: 10,
                                        marginBottom: 8,
                                        background: '#181c1f',
                                        borderRadius: 16,
                                        border: '1.5px solid #333',
                                        boxShadow: '0 2px 8px 0 #00000033',
                                        padding: '18px 18px 12px 18px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        gap: 0,
                                        width: 'auto',
                                        maxWidth: 'min(100vw, 800px)',
                                        minWidth: 320,
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        zIndex: 10,
                                        alignSelf: 'unset',
                                      }}>
                                      <textarea
                                        placeholder="Add a reply..."
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        required
                                        className="lab-input lab-input-regular"
                                        style={{
                                          minHeight: 64,
                                          maxHeight: 180,
                                          resize: 'vertical',
                                          fontSize: 15,
                                          padding: '12px 14px',
                                          borderRadius: 10,
                                          border: 'none',
                                          background: '#23232a',
                                          color: '#fff',
                                          fontWeight: 400,
                                          marginBottom: 16,
                                        }}
                                        rows={3}
                                        autoFocus
                                      />
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                        <button
                                          type="button"
                                          onClick={() => { setReplyToCommentId(null); setReplyContent(''); }}
                                          style={{
                                            background: '#23232a',
                                            border: 'none',
                                            color: '#ccc',
                                            fontSize: 15,
                                            borderRadius: 8,
                                            padding: '7px 18px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            transition: 'background 0.15s',
                                          }}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={replyLoading}
                                          className="lab-primary-button lab-button-medium"
                                          style={{
                                            background: '#0064e0',
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: 18,
                                            borderRadius: 8,
                                            padding: '7px 18px',
                                            border: 'none',
                                            cursor: replyLoading ? 'not-allowed' : 'pointer',
                                            opacity: replyLoading ? 0.7 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          title={replyLoading ? 'Replying...' : 'Reply'}
                                        >
                                          {replyLoading ? (
                                            <span style={{ fontSize: 15 }}>Replying...</span>
                                          ) : (
                                            <FaRegComments style={{ fontSize: 20, marginRight: 0, verticalAlign: 'middle' }} />
                                          )}
                                        </button>
                                      </div>
                                    </form>
                                    </div>
                                  )}
                                  {replyError && replyToCommentId === c.id && (
                                    <div className="lab-error" style={{ marginTop: 4 }}>{replyError}</div>
                                  )}
                                  {/* Render nested replies recursively, only if not collapsed */}
                                  {!isCollapsed && renderComments(commentList, c.id, depth + 1)}
                                </div>
                              </div>
                            </div>
                          );
                        });
                    }
                    // Only show up to visibleCommentsCount top-level comments
                    // const topLevelComments = postCommentsRaw.filter(c => !c.parent_comment_id).slice(0, visibleCommentsCount); // unused after recursion
                    return renderComments(postCommentsRaw as ThreadedComment[], null, 0);
                  })()}
                  {hasMoreComments && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                      <button
                        onClick={() => setVisibleCommentsCount(c => c + LOAD_MORE_COMMENTS_COUNT)}
                        className="lab-secondary-button"
                        style={{ padding: '0.5rem 1.2rem', borderRadius: 8, fontSize: 15, fontWeight: 500 }}
                      >
                        Load more comments
                      </button>
                    </div>
                  )}
                </div>
                {/* Pagination removed, replaced by Load More */}
              </div>
            );
          })()
        ) : postsLoading ? (
          <div className="lab-loading">Loading posts...</div>
        ) : (
          filteredPosts.map(post => {
            const author = profiles.find(p => p.id === post.user_id);
            // const postComments = comments
            //   .filter(c => c.post_id === post.id)
            //   .sort((a, b) => (b.votes || 0) - (a.votes || 0))
            //   .slice(0, 3); // Removed unused variable
            // Show community on right if in Home category
            const showCommunity = homeCategory && selectedCategory === homeCategory.label;
            const postCat = categories.find(c => c.id === post.category_id);
            return (
              <div key={post.id} className="lab-post-card">
                <div className="lab-post-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: showCommunity ? 'space-between' : 'flex-start', width: '100%' }}>
                    <div className="lab-post-author" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserFlag profile={author} />
                      <span className="lab-post-author-name">
                        {author?.username || 'Anon'}
                      </span>
                      <span style={{ color: '#aaa', fontSize: 13, marginLeft: 2 }}>{timeAgo(post.created_at)}</span>
                    </div>
                    {showCommunity && postCat && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: postCat.color,
                          borderRadius: '999px',
                          padding: '2px 16px',
                          fontWeight: 500,
                          fontSize: 15,
                          color: '#fff',
                          maxWidth: 120,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {postCat.label}
                      </div>
                    )}
                  </div>
                </div>
                <h2 
                  className="lab-post-title"
                  onClick={() => handleOpenPost(post)}
                >
                  {post.title}
                </h2>
                <div
                  className="lab-post-content"
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: (post.content || '').replace(/\n/g, '<br />') }}
                  onClick={() => handleOpenPost(post)}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, gap: 12 }}>
                  {/* Upvote/Downvote */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6f7', borderRadius: 20, padding: '2px 10px', gap: 2 }}>
                    <button
                      onClick={() => handleUpvotePost(post.id)}
                      disabled={!user || postVoteLoading[post.id]}
                      className={`lab-vote-button ${userPostVotes.includes(post.id) ? 'voted' : ''}`}
                      title={userPostVotes.includes(post.id) ? 'Remove upvote' : 'Upvote'}
                      style={{ color: userPostVotes.includes(post.id) ? '#ff4500' : '#878a8c', background: 'none', border: 'none', fontSize: 22, padding: 0, margin: 0, cursor: postVoteLoading[post.id] ? 'not-allowed' : 'pointer', opacity: postVoteLoading[post.id] ? 0.6 : 1 }}
                    >
                      <BiUpvote />
                    </button>
                    <span style={{ color: '#222', fontWeight: 700, fontSize: 15, minWidth: 18, textAlign: 'center' }}>
                      {post.votes?.toLocaleString?.() || 0}
                    </span>
                  </div>
                  {/* Comment Button (icon only clickable, hover for filled icon) */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6f7', border: 'none', borderRadius: 20, padding: '2px 14px', color: '#222', fontWeight: 600, fontSize: 15, gap: 6 }}>
                    <button
                      onClick={() => handleCommentOnPost(post)}
                      className="lab-comment-icon-btn"
                      style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, margin: 0, color: 'inherit', cursor: 'pointer' }}
                      title="Comment"
                      type="button"
                      onFocus={e => (e.currentTarget.style.outline = 'none')} 
                    >
                      <FaRegComments className="lab-comment-icon" 
                      style={
                        { fontSize: 18, marginRight: 2, position: 'absolute', pointerEvents: 'none' }} 
                        onFocus={e => (e.currentTarget.style.outline = 'none')} />
                      <span style={{ opacity: 0, width: 18, height: 18, display: 'inline-block' }}></span>
                    </button>
                    <span>{comments.filter(c => c.post_id === post.id).length}</span>
                  </div>
                  {/* Delete Button (if author) */}
                  {author?.id === user?.id && (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          handleDeletePost(post.id);
                        }}
                        className="lab-delete-icon-btn"
                        style={{
                          marginLeft: 12,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#b0b0b0',
                          fontSize: 22,
                          transition: 'color 0.15s',
                          outline: 'none',
                        }}
                        title="Delete post"
                        type="button"
                        onMouseOver={e => (e.currentTarget.style.color = '#e53935')}
                        onMouseOut={e => (e.currentTarget.style.color = '#b0b0b0')}
                        onFocus={e => (e.currentTarget.style.outline = 'none')}
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="lab-right-sidebar">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
          {/* Monthly Prompt */}
          {monthlyPrompt && (
            <div className="lab-monthly-prompt">
              <div className="lab-prompt-header">
                <span className="lab-prompt-icon">💡</span>
                <span className="lab-prompt-title">monthly prompt</span>
              </div>
              
              <div className="lab-prompt-question">
                {monthlyPrompt.question}
              </div>
              
              {/* Prompt Comment Form */}
              <form onSubmit={handleAddPromptComment} className="lab-form-row">
                <input
                  type="text"
                  placeholder="Share your idea..."
                  value={monthlyPromptComment}
                  onChange={e => setMonthlyPromptComment(e.target.value)}
                  required
                  className="lab-input-small"
                  disabled={monthlyPromptCommentLoading}
                />
                <button 
                  type="submit" 
                  disabled={monthlyPromptCommentLoading}
                  className="lab-primary-button lab-button-medium"
                >
                  Submit
                </button>
              </form>
              
              {monthlyPromptCommentError && (
                <div className="lab-error">{monthlyPromptCommentError}</div>
              )}
              
              {/* Prompt Comments List */}
              <div className="lab-prompt-comments">
                {monthlyPromptComments
                  .slice()
                  .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                  .map(c => {
                    const commenter = profiles.find(p => p.id === c.user_id);
                    return (
                      <div key={c.id} className="lab-prompt-comment-item">
                        <div className="lab-prompt-comment-author">
                          <div className="lab-prompt-comment-header">
                            <UserFlag profile={commenter} />
                            <span className="lab-prompt-comment-name">
                              {commenter?.username || 'Anon'}
                            </span>
                          </div>
                          <span className="lab-prompt-comment-text">
                            {c.content}
                          </span>
                        </div>
                        
                        <div className="lab-prompt-comment-votes">
                          <span className="lab-comment-vote-count">
                            {c.votes?.toLocaleString?.() || 0}
                          </span>
                          <button
                            onClick={() => handleUpvotePromptComment(c.id)}
                            disabled={!user}
                            className={`lab-comment-vote-button ${userPromptCommentVotes.includes(c.id) ? 'voted' : ''}`}
                            title={userPromptCommentVotes.includes(c.id) ? 'Remove upvote' : 'Upvote'}
                          >
                            ▲
                          </button>
                        </div>
                        
                        {(commenter?.id === user?.id || profile?.is_admin) && (
                          <button
                            onClick={() => handleDeleteMonthlyPromptComment(c.id)}
                            className="lab-secondary-button"
                            style={{ 
                              marginLeft: 8, 
                              padding: '0.2rem 0.7rem', 
                              fontSize: 13 
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Admin Section */}
          {profile?.is_admin && (
            <form onSubmit={handleSetPrompt} className="lab-admin-form">
              <input
                type="text"
                placeholder="Set new monthly prompt..."
                value={newPrompt}
                onChange={e => setNewPrompt(e.target.value)}
                className="lab-admin-input"
              />
              <button 
                type="submit" 
                disabled={newPromptLoading}
                className="lab-admin-button"
              >
                {newPromptLoading ? 'Saving...' : 'Set Prompt'}
              </button>
              {newPromptError && (
                <div className="lab-error">{newPromptError}</div>
              )}
            </form>
          )}

          {/* Sidebar Image */}
          <div className="lab-sidebar-image-container">
            <img className="lab-img" src={labImg} alt="Lab" />
          </div>
        </div>
      </aside>

      {/* Post Detail Modal removed, now handled in main content */}
    </div>
  );
}
