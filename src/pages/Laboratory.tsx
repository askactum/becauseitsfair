import { useState, useEffect } from 'react';
import './Laboratory.css';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LabAuthModal from './LabAuthModal';
import CountryFlag from 'react-country-flag';
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
import ActumOfficialLogo from '../assets/ACTUM_white.png';

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
  
  // Post detail modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [modalPage, setModalPage] = useState(1);
  const COMMENTS_PER_PAGE = 10;
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  
  // Voting state
  const [userPostVotes, setUserPostVotes] = useState<number[]>([]);
  const [userCommentVotes, setUserCommentVotes] = useState<number[]>([]);
  const [userPromptCommentVotes, setUserPromptCommentVotes] = useState<number[]>([]);

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
    setPostModalOpen(true);
  };

  const handleCommentOnPost = (post: Post) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setActivePost(post);
    setPostModalOpen(true);
  };

  // Voting handlers
  const handleUpvotePost = async (postId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
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
    refreshPosts();
  };

  const handleUpvoteComment = async (commentId: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
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
    
    return profile.country_flag === 'ACTUM' ? (
      <img src={actumLogo} alt="Actum Logo" className="lab-post-author-flag" />
    ) : (
      <CountryFlag 
        countryCode={profile.country_flag} 
        svg 
        className="lab-post-author-flag"
        title={profile.country_flag} 
      />
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
  const [searchUser, setSearchUser] = useState('');

  // Sort posts by votes descending
  const sortedPosts = [...posts].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  // Filter posts by selected category, search term, and user
  const filteredPosts = sortedPosts.filter(post => {
    const cat = categories.find(c => c.label === selectedCategory);
    if (!cat || post.category_id !== cat.id) return false;
    const author = profiles.find(p => p.id === post.user_id);
    const matchesTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !searchUser || (author && author.username.toLowerCase().includes(searchUser.toLowerCase()));
    return matchesTitle && matchesUser;
  });

  // Get current category
  const currentCategory = categories.find(c => c.label === selectedCategory);

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
            categories.map(cat => (
              <div 
                key={cat.id} 
                className={`lab-nav-item ${selectedCategory === cat.label ? 'selected' : ''}`}
                style={{ color: selectedCategory === cat.label ? cat.color : '#fff' }}
                onClick={() => setSelectedCategory(cat.label)}
              >
                {categoryLogos[cat.label.toLowerCase()] ? (
                  <img 
                    src={categoryLogos[cat.label.toLowerCase()]} 
                    alt={cat.label} 
                    className="lab-nav-icon"
                  />
                ) : (
                  <span className="lab-nav-icon">{cat.icon}</span>
                )}
                {cat.label}
              </div>
            ))
          )}
        </nav>

        {/* Auth Section */}
        <div className="lab-auth-section">
          {authLoading || profileLoading ? (
            <div className="lab-loading lab-loading-auth">Loading...</div>
          ) : user && profile ? (
            <>
              <div className="lab-profile-info">
                <UserFlag profile={profile} />
                <span>{profile.username}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="lab-auth-button lab-logout-button"
              >
                Log Out
              </button>
            </>
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
        <div className="lab-header">
          <CategoryIcon category={currentCategory} />
          <h1 className="lab-header-title">{selectedCategory}</h1>
        </div>

        {currentCategory && (
          <div className="labratory-description">
            {currentCategory.description || ''}
          </div>
        )}

        {/* Top Bar: Search/Filter and Create Post */}
        <div className="lab-top-bar">
          <div className="lab-search-group">
            <input
              type="text"
              className="lab-search-input"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              className="lab-search-input"
              placeholder="Filter by user..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <button
            className="lab-create-button lab-create-button-top"
            onClick={handleCreatePost}
          >
            + Create Post
          </button>
        </div>

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

        {/* Post Feed */}
        {postsLoading ? (
          <div className="lab-loading">Loading posts...</div>
        ) : (
          filteredPosts.map(post => {
            const author = profiles.find(p => p.id === post.user_id);
            const postComments = comments
              .filter(c => c.post_id === post.id)
              .sort((a, b) => (b.votes || 0) - (a.votes || 0))
              .slice(0, 3);
            
            return (
              <div key={post.id} className="lab-post-card">
                <div className="lab-post-header">
                  <div className="lab-post-author">
                    <UserFlag profile={author} />
                    <span className="lab-post-author-name">
                      {author?.username || 'Anon'}
                    </span>
                  </div>
                  <div className="lab-post-votes">
                    <span className="lab-post-vote-count">
                      {post.votes?.toLocaleString?.() || 0}
                    </span>
                    <button
                      onClick={() => handleUpvotePost(post.id)}
                      disabled={!user}
                      className={`lab-vote-button ${userPostVotes.includes(post.id) ? 'voted' : ''}`}
                      title={userPostVotes.includes(post.id) ? 'Remove upvote' : 'Upvote'}
                    >
                      ▲
                    </button>
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
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  onClick={() => handleOpenPost(post)}
                />
                
                {/* Comments Preview */}
                <div className="lab-post-comments-preview">
                  {postComments.map(c => {
                    const commenter = profiles.find(p => p.id === c.user_id);
                    return (
                      <div key={c.id} className="lab-comment-item">
                        <div className="lab-comment-author">
                          <UserFlag profile={commenter} />
                          <span className="lab-comment-author-name">
                            {commenter?.username || 'Anon'}
                          </span>:
                          <span>{c.content}</span>
                        </div>
                        <div className="lab-comment-votes">
                          <span className="lab-comment-vote-count">
                            {c.votes?.toLocaleString?.() || 0}
                          </span>
                          <button
                            onClick={() => handleUpvoteComment(c.id)}
                            disabled={!user}
                            className={`lab-comment-vote-button ${userCommentVotes.includes(c.id) ? 'voted' : ''}`}
                            title={userCommentVotes.includes(c.id) ? 'Remove upvote' : 'Upvote'}
                          >
                            ▲
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <button
                  className="lab-primary-button lab-button-medium"
                  onClick={() => handleCommentOnPost(post)}
                  style={{ marginTop: 10 }}
                >
                  Add Comment
                </button>
                
                {author?.id === user?.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="lab-secondary-button lab-button-small"
                    style={{ marginLeft: 12 }}
                  >
                    Delete
                  </button>
                )}
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

      {/* Post Detail Modal */}
      <Dialog.Root 
        open={postModalOpen} 
        onOpenChange={open => { 
          setPostModalOpen(open); 
          if (!open) { 
            setActivePost(null); 
            setModalPage(1); 
            setNewComment(''); 
            setCommentError(null); 
          } 
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="lab-modal-overlay" />
          <Dialog.Content className="lab-modal-content">
            {activePost && (() => {
              const author = profiles.find(p => p.id === activePost.user_id);
              const cat = categories.find(c => c.id === activePost.category_id);
              const postComments = comments
                .filter(c => c.post_id === activePost.id)
                .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                .slice((modalPage - 1) * COMMENTS_PER_PAGE, modalPage * COMMENTS_PER_PAGE);
              
              return (
                <>
                  {/* Post Header */}
                  <div className="lab-post-header">
                    <div className="lab-post-author">
                      <UserFlag profile={author} />
                      <span className="lab-post-author-name">
                        {author?.username || 'Anon'}
                      </span>
                    </div>
                    <div className="lab-post-votes">
                      <span className="lab-post-vote-count">
                        {activePost.votes?.toLocaleString?.() || 0}
                      </span>
                      <button
                        onClick={() => handleUpvotePost(activePost.id)}
                        disabled={!user}
                        className={`lab-vote-button ${userPostVotes.includes(activePost.id) ? 'voted' : ''}`}
                        title={userPostVotes.includes(activePost.id) ? 'Remove upvote' : 'Upvote'}
                      >
                        ▲
                      </button>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    {cat && categoryLogos[cat.label.toLowerCase()] ? (
                      <img 
                        src={categoryLogos[cat.label.toLowerCase()]} 
                        alt={cat.label} 
                        style={{ width: 32, height: 32, marginRight: 10, objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ fontSize: 28, marginRight: 10 }}>{cat?.icon || ''}</span>
                    )}
                    <span style={{ color: cat?.color || '#aaa', fontSize: 16 }}>
                      {cat?.label || ''}
                    </span>
                  </div>

                  {/* Post Content */}
                  <h2 className="lab-post-title" style={{ textDecoration: 'none', cursor: 'default' }}>
                    {activePost.title}
                  </h2>
                  
                  <div 
                    className="lab-post-content" 
                    style={{ cursor: 'default' }}
                    dangerouslySetInnerHTML={{ __html: activePost.content }} 
                  />

                  <div style={{ fontWeight: 700, color: '#fff', margin: '1.2rem 0 0.7rem 0', fontSize: 18 }}>
                    Comments
                  </div>

                  {/* Comment Form */}
                  {user && profile ? (
                    <form onSubmit={handleSubmitComment} className="lab-form-row" style={{ marginBottom: 18 }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        required
                        className="lab-input lab-input-regular"
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="submit" 
                        disabled={commentLoading}
                        className="lab-primary-button lab-button-medium"
                      >
                        {commentLoading ? 'Posting...' : 'Post'}
                      </button>
                    </form>
                  ) : (
                    <div style={{ color: '#aaa', marginBottom: 18 }}>
                      Log in to comment.
                    </div>
                  )}

                  {commentError && (
                    <div className="lab-error" style={{ marginBottom: 8 }}>
                      {commentError}
                    </div>
                  )}

                  {/* Comments List */}
                  <div style={{ width: '100%', maxHeight: 400, overflowY: 'auto', marginBottom: 18 }}>
                    {postComments.map(c => {
                      const commenter = profiles.find(p => p.id === c.user_id);
                      return (
                        <div key={c.id} className="lab-comment-item">
                          <div className="lab-comment-author">
                            <UserFlag profile={commenter} />
                            <span className="lab-comment-author-name">
                              {commenter?.username || 'Anon'}
                            </span>:
                            <span>{c.content}</span>
                          </div>
                          <div className="lab-comment-votes">
                            <span className="lab-comment-vote-count">
                              {c.votes?.toLocaleString?.() || 0}
                            </span>
                            <button
                              onClick={() => handleUpvoteComment(c.id)}
                              disabled={!user}
                              className={`lab-comment-vote-button ${userCommentVotes.includes(c.id) ? 'voted' : ''}`}
                              title={userCommentVotes.includes(c.id) ? 'Remove upvote' : 'Upvote'}
                            >
                              ▲
                            </button>
                          </div>
                          {(commenter?.id === user?.id || profile?.is_admin) && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
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

                  {/* Pagination */}
                  <div className="lab-pagination">
                    <button
                      onClick={() => setModalPage(p => Math.max(1, p - 1))}
                      disabled={modalPage === 1}
                      className="lab-pagination-button"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setModalPage(p => p + 1)}
                      disabled={comments.filter(c => c.post_id === activePost.id).length <= modalPage * COMMENTS_PER_PAGE}
                      className="lab-pagination-button"
                    >
                      Next
                    </button>
                  </div>
                </>
              );
            })()}
            
            <Dialog.Close asChild>
              <button className="lab-modal-close" aria-label="Close">×</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}   