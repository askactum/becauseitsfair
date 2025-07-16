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
import { FaRegHeart, FaHeart } from 'react-icons/fa';

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

export default function Laboratory() {
  const [categories, setCategories] = useState<{ id: number, label: string, icon: string, color: string, description?: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ username: string, country_flag: string, is_admin?: boolean } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newPostCategoryId, setNewPostCategoryId] = useState<number | null>(categories[0]?.id ?? null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [modalPage, setModalPage] = useState(1);
  const COMMENTS_PER_PAGE = 10;
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [userPostVotes, setUserPostVotes] = useState<number[]>([]); // post ids user has voted
  const [userCommentVotes, setUserCommentVotes] = useState<number[]>([]); // comment ids user has voted

  // Monthly prompt state
  const [monthlyPrompt, setMonthlyPrompt] = useState<any>(null);
  const [monthlyPromptComments, setMonthlyPromptComments] = useState<any[]>([]);
  const [monthlyPromptComment, setMonthlyPromptComment] = useState('');
  const [monthlyPromptCommentLoading, setMonthlyPromptCommentLoading] = useState(false);
  const [monthlyPromptCommentError, setMonthlyPromptCommentError] = useState<string | null>(null);
  const [userPromptCommentVotes, setUserPromptCommentVotes] = useState<number[]>([]);

  const [newPrompt, setNewPrompt] = useState('');
  const [newPromptLoading, setNewPromptLoading] = useState(false);
  const [newPromptError, setNewPromptError] = useState<string | null>(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // NEW: mobile sidebar state

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

  // Auth state
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

  // Fetch profile when user changes
  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      supabase
        .from('profiles')
        .select('username, country_flag, is_admin')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) setProfile(data);
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

  // Upvote post (toggle)
  async function handleUpvotePost(postId: number) {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (userPostVotes.includes(postId)) {
      // Remove vote
      await supabase.from('post_votes').delete().eq('user_id', user.id).eq('post_id', postId);
      await supabase.rpc('decrement_post_votes', { postid: postId });
      supabase.from('posts').select('*').then(({ data }) => { if (data) setPosts(data); });
      setUserPostVotes(userPostVotes.filter(id => id !== postId));
    } else {
      // Add vote
      const { error } = await supabase.from('post_votes').insert({ user_id: user.id, post_id: postId });
      if (!error) {
        await supabase.rpc('increment_post_votes', { postid: postId });
        supabase.from('posts').select('*').then(({ data }) => { if (data) setPosts(data); });
        setUserPostVotes([...userPostVotes, postId]);
      }
    }
  }

  // Upvote comment (toggle)
  async function handleUpvoteComment(commentId: number) {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (userCommentVotes.includes(commentId)) {
      // Remove vote
      await supabase.from('comment_votes').delete().eq('user_id', user.id).eq('comment_id', commentId);
      await supabase.rpc('decrement_comment_votes', { commentid: commentId });
      supabase.from('comments').select('*').then(({ data }) => { if (data) setComments(data); });
      setUserCommentVotes(userCommentVotes.filter(id => id !== commentId));
    } else {
      // Add vote
      const { error } = await supabase.from('comment_votes').insert({ user_id: user.id, comment_id: commentId });
      if (!error) {
        await supabase.rpc('increment_comment_votes', { commentid: commentId });
        supabase.from('comments').select('*').then(({ data }) => { if (data) setComments(data); });
        setUserCommentVotes([...userCommentVotes, commentId]);
      }
    }
  }

  // Add delete handlers
  async function handleDeletePost(postId: number) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await supabase.from('posts').delete().eq('id', postId);
    // Also delete comments for this post
    await supabase.from('comments').delete().eq('post_id', postId);
    // Refresh posts and comments
    const [{ data: newPosts }, { data: newComments }] = await Promise.all([
      supabase.from('posts').select('*'),
      supabase.from('comments').select('*'),
    ]);
    if (newPosts) setPosts(newPosts);
    if (newComments) setComments(newComments);
  }
  async function handleDeleteComment(commentId: number) {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    // First, delete all votes for this comment
    await supabase.from('comment_votes').delete().eq('comment_id', commentId);
    // Then, delete the comment itself
    await supabase.from('comments').delete().eq('id', commentId);
    // Refresh comments
    const { data: newComments } = await supabase.from('comments').select('*');
    if (newComments) setComments(newComments);
  }

  // Set default category after categories load
  useEffect(() => {
    if (categories.length > 0 && newPostCategoryId == null) {
      setNewPostCategoryId(categories[0].id);
    }
  }, [categories]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  // Sort posts by votes descending
  const sortedPosts = [...posts].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  // Fetch monthly prompt for the current month
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-based
    const year = now.getFullYear();
    // Format as YYYY-MM (assuming displayDate is stored as 'YYYY-MM' or a date string)
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    console.log(monthStr);
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
  useEffect(() => {
    if (!monthlyPrompt) return;
    supabase.from('monthly_prompt_comments').select('*').eq('prompt_id', monthlyPrompt.id).then(({ data, error }) => {
      if (!error && data) setMonthlyPromptComments(data);
    });
    if (user) {
      supabase.from('monthly_prompt_comment_votes').select('comment_id').eq('user_id', user.id).then(({ data, error }) => {
        if (!error && data) setUserPromptCommentVotes(data.map(v => v.comment_id));
      });
    } else {
      setUserPromptCommentVotes([]);
    }
  }, [monthlyPrompt, user]);

  // Upvote prompt comment (toggle)
  async function handleUpvotePromptComment(commentId: number) {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (userPromptCommentVotes.includes(commentId)) {
      await supabase.from('monthly_prompt_comment_votes').delete().eq('user_id', user.id).eq('comment_id', commentId);
      await supabase.rpc('decrement_monthly_prompt_comment_votes', { commentid: commentId });
      // Refresh votes and comments
      supabase.from('monthly_prompt_comment_votes').select('comment_id').eq('user_id', user.id).then(({ data, error }) => {
        if (!error && data) setUserPromptCommentVotes(data.map(v => v.comment_id));
      });
      supabase.from('monthly_prompt_comments').select('*').eq('prompt_id', monthlyPrompt.id).then(({ data }) => { if (data) setMonthlyPromptComments(data); });
    } else {
      const { error } = await supabase.from('monthly_prompt_comment_votes').insert({ user_id: user.id, comment_id: commentId });
      if (!error) {
        await supabase.rpc('increment_monthly_prompt_comment_votes', { commentid: commentId });
        // Refresh votes and comments
        supabase.from('monthly_prompt_comment_votes').select('comment_id').eq('user_id', user.id).then(({ data, error }) => {
          if (!error && data) setUserPromptCommentVotes(data.map(v => v.comment_id));
        });
        supabase.from('monthly_prompt_comments').select('*').eq('prompt_id', monthlyPrompt.id).then(({ data }) => { if (data) setMonthlyPromptComments(data); });
      }
    }
  }

  // Add prompt comment
  async function handleAddPromptComment(e: React.FormEvent) {
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
    const { error } = await supabase.from('monthly_prompt_comments').insert({
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
    supabase.from('monthly_prompt_comments').select('*').eq('prompt_id', monthlyPrompt.id).then(({ data }) => { if (data) setMonthlyPromptComments(data); });
    setMonthlyPromptCommentLoading(false);
  }

  // Add delete handler for monthly prompt comments
  async function handleDeleteMonthlyPromptComment(commentId: number) {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    // First, delete all votes for this comment
    await supabase.from('monthly_prompt_comment_votes').delete().eq('comment_id', commentId);
    // Then, delete the comment itself
    await supabase.from('monthly_prompt_comments').delete().eq('id', commentId);
    // Refresh comments
    if (monthlyPrompt) {
      const { data } = await supabase.from('monthly_prompt_comments').select('*').eq('prompt_id', monthlyPrompt.id);
      if (data) setMonthlyPromptComments(data);
    }
  }

  return (
    <>
      <LabAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <div className="lab-main-layout">
        {/* Hamburger for mobile */}
        <button
          className="lab-hamburger"
          aria-label="Open sidebar"
          style={{
            position: 'fixed',
            top: 18,
            left: 18,
            zIndex: 11000,
            background: 'rgba(0,0,0,0.85)',
            border: 'none',
            borderRadius: 8,
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            display: 'none', // default hidden
          }}
          onClick={() => setMobileSidebarOpen(true)}
        >
          <span style={{ display: 'block', width: 28, height: 4, background: '#fff', borderRadius: 2, margin: '4px 0' }} />
          <span style={{ display: 'block', width: 28, height: 4, background: '#fff', borderRadius: 2, margin: '4px 0' }} />
          <span style={{ display: 'block', width: 28, height: 4, background: '#fff', borderRadius: 2, margin: '4px 0' }} />
        </button>
        {/* Sidebar (desktop) */}
        <aside className="lab-sidebar lab-sidebar-desktop">
          <Link to="/" className="logo-link" tabIndex={-1}>
            <img src={ActumOfficialLogo} alt="ACTUM Logo" className="logo-img-official" />
          </Link>
          <div className="lab-sidebar-content">
            <nav>
              {loading ? (
                <div style={{ color: '#aaa', fontSize: 18, marginTop: 40 }}>Loading...</div>
              ) : (
                categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`category-item${selectedCategory === cat.label ? ' selected' : ''}`}
                    onClick={() => { setSelectedCategory(cat.label); setMobileSidebarOpen(false); }}
                  >
                    {categoryLogos[cat.label.toLowerCase()] ? (
                      <img src={categoryLogos[cat.label.toLowerCase()]} alt={cat.label} />
                    ) : (
                      <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    )}
                    {cat.label}
                  </div>
                ))
              )}
            </nav>
          </div>
          <div className="lab-sidebar-footer">
            {authLoading || profileLoading ? (
              <div style={{ color: '#aaa', fontSize: 18, margin: '2.5rem 0 1.5rem 0' }}>Loading...</div>
            ) : user && profile ? (
              <>
                <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 22, margin: '2.5rem 0 0.5rem 0', textAlign: 'center', wordBreak: 'break-all', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                    {profile.country_flag === 'ACTUM' ? (
                      <img src={actumLogo} alt="Actum Logo" style={{ width: 40, height: 40 }} />
                    ) : (
                      <CountryFlag countryCode={profile.country_flag} svg style={{ width: 40, height: 40 }} title={profile.country_flag} />
                    )}
                  </span>
                  <span>{profile.username}</span>
                </div>
                <button onClick={handleLogout} className="lab-btn" style={{ margin: '0 0 1.5rem 0', width: '100%' }}>Log Out</button>
              </>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="lab-btn primary" style={{ margin: '2.5rem 0 1.5rem 0', width: '100%' }}>Log In / Sign Up</button>
            )}
          </div>
        </aside>
        {/* Sidebar (mobile overlay) */}
        {mobileSidebarOpen && (
          <div className="lab-mobile-sidebar-overlay">
            <aside className="lab-sidebar lab-sidebar-mobile">
              <button
                aria-label="Close sidebar"
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 28,
                  cursor: 'pointer',
                  zIndex: 13000,
                }}
                onClick={() => setMobileSidebarOpen(false)}
              >×</button>
              <Link to="/" className="logo-link" tabIndex={-1}>
                <img src={ActumOfficialLogo} alt="ACTUM Logo" className="logo-img-official" />
              </Link>
              <nav>
                {loading ? (
                  <div style={{ color: '#aaa', fontSize: 18, marginTop: 40 }}>Loading...</div>
                ) : (
                  categories.map(cat => (
                    <div key={cat.id} className={`category-item${selectedCategory === cat.label ? ' selected' : ''}`} onClick={() => { setSelectedCategory(cat.label); setMobileSidebarOpen(false); }}>
                      {categoryLogos[cat.label.toLowerCase()] ? (
                        <img src={categoryLogos[cat.label.toLowerCase()]} alt={cat.label} />
                      ) : (
                        <span style={{ fontSize: 22 }}>{cat.icon}</span>
                      )}
                      {cat.label}
                    </div>
                  ))
                )}
              </nav>
              {/* Auth UI (copy from sidebar) */}
              <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {authLoading || profileLoading ? (
                  <div style={{ color: '#aaa', fontSize: 18, margin: '2.5rem 0 1.5rem 0' }}>Loading...</div>
                ) : user && profile ? (
                  <>
                    <div style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 22, margin: '2.5rem 0 0.5rem 0', textAlign: 'center', wordBreak: 'break-all', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                        {profile.country_flag === 'ACTUM' ? (
                          <img src={actumLogo} alt="Actum Logo" style={{ width: 40, height: 40 }} />
                        ) : (
                          <CountryFlag countryCode={profile.country_flag} svg style={{ width: 40, height: 40 }} title={profile.country_flag} />
                        )}
                      </span>
                      <span>{profile.username}</span>
                    </div>
                    <button onClick={handleLogout} className="lab-btn" style={{ margin: '0 0 1.5rem 0', width: '100%' }}>Log Out</button>
                  </>
                ) : (
                  <button onClick={() => setAuthModalOpen(true)} className="lab-btn primary" style={{ margin: '2.5rem 0 1.5rem 0', width: '100%' }}>Log In / Sign Up</button>
                )}
              </div>
            </aside>
          </div>
        )}
        {/* Main Content */}
        <main className="lab-main-content">
          <div className="lab-card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              {categories.length > 0 && (() => {
                const cat = categories.find(c => c.label === selectedCategory);
                return cat ? (
                  categoryLogos[cat.label.toLowerCase()] ? (
                    <img src={categoryLogos[cat.label.toLowerCase()]} alt={cat.label} style={{ width: 60, height: 60, objectFit: 'contain', marginRight: 18, borderRadius: '100%' }} />
                  ) : (
                    <span style={{ fontSize: 32, color: '#fff', marginRight: 18 }}>{cat.icon || ''}</span>
                  )
                ) : null;
              })()}
              <h1 style={{ fontSize: '2.2rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '0.01em' }}>{selectedCategory}</h1>
            </div>
            {categories.length > 0 && (
              <div style={{ fontSize: '1.18rem', color: '#bdbdbd', marginBottom: 24, maxWidth: 1200 }}>
                {categories.find(c => c.label === selectedCategory)?.description || ''}
              </div>
            )}
            <button
              className="lab-btn primary"
              style={{ marginBottom: 18, alignSelf: 'flex-start' }}
              onClick={() => {
                if (!user) {
                  setAuthModalOpen(true);
                  return;
                }
                setCreateModalOpen(true);
                setCreateError(null);
                setNewPostCategoryId(categories.find(c => c.label === selectedCategory)?.id ?? null);
              }}
            >
              + Create Post
            </button>
            {createError && <div style={{ color: '#ff6b6b', marginBottom: 12 }}>{createError}</div>}
            <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <Dialog.Portal>
                <Dialog.Overlay style={{ background: 'rgba(0,0,0,0.55)', position: 'fixed', inset: 0, zIndex: 10001 }} />
                <Dialog.Content style={{
                  background: '#23222a',
                  color: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  padding: '3.5rem 3rem 3rem 3rem',
                  width: 700,
                  maxWidth: '98vw',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10002,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflow: 'visible',
                }}>
                  <Dialog.Title style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 18 }}>Create Post</Dialog.Title>
                  <div style={{ display: 'flex', gap: 32, marginBottom: 18, width: '100%' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 20,
                      borderBottom: '3px solid #a98fff',
                      paddingBottom: 4,
                      color: '#fff',
                      cursor: 'pointer',
                      marginRight: 18,
                    }}>Text</div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 20,
                      borderBottom: '3px solid transparent',
                      paddingBottom: 4,
                      color: '#aaa',
                      cursor: 'not-allowed',
                      opacity: 0.5,
                    }}>Images</div>
                  </div>
                  <form
                    onSubmit={async e => {
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
                      setPostsLoading(true);
                      supabase
                        .from('posts')
                        .select('*')
                        .then(({ data, error }) => {
                          if (!error && data) setPosts(data);
                          setPostsLoading(false);
                        });
                      setCreateLoading(false);
                    }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}
                  >
                    <div style={{ position: 'relative', marginBottom: 8, width: 320 }}>
                      <select
                        value={newPostCategoryId !== null ? newPostCategoryId : ''}
                        onChange={e => setNewPostCategoryId(Number(e.target.value))}
                        required
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          borderRadius: 32,
                          border: '2px solid #28273a',
                          background: '#18171c',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 18,
                          boxShadow: '0 0 0 1.5px #28273a',
                          outline: 'none',
                          display: 'block',
                          appearance: 'none',
                        }}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} style={{ borderRadius: 16 }}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="text"
                        placeholder="Title*"
                        value={newPostTitle}
                        onChange={e => {
                          if (e.target.value.length <= 300) setNewPostTitle(e.target.value);
                        }}
                        required
                        style={{
                          width: '100%',
                          padding: '1.2rem 1.2rem 1.2rem 1.2rem',
                          borderRadius: 18,
                          border: 'none',
                          background: '#23232b',
                          color: '#fff',
                          fontSize: 22,
                          fontWeight: 600,
                          boxShadow: '0 0 0 2px #28273a',
                          outline: 'none',
                        }}
                      />
                      <span style={{ position: 'absolute', right: 18, bottom: 10, color: '#aaa', fontSize: 16 }}>{newPostTitle.length}/300</span>
                    </div>
                    <textarea
                      placeholder="Body text*"
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        minHeight: 160,
                        background: '#23232b',
                        color: '#fff',
                        borderRadius: 18,
                        border: 'none',
                        boxShadow: '0 0 0 2px #28273a',
                        fontSize: 18,
                        fontWeight: 500,
                        padding: '1.2rem',
                        marginTop: 8,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                    <div style={{ color: '#aaa', fontSize: 15, marginTop: 2 }}>Category: <b>{categories.find(c => c.id === newPostCategoryId)?.label || ''}</b></div>
                    {createError && <div style={{ color: '#ff6b6b', fontSize: 15 }}>{createError}</div>}
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="lab-btn primary"
                      style={{ marginTop: 8 }}
                    >
                      {createLoading ? 'Posting...' : 'Post'}
                    </button>
                  </form>
                  <Dialog.Close asChild>
                    <button style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }} aria-label="Close">×</button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            {postsLoading ? (
              <div style={{ color: '#aaa', fontSize: 18 }}>Loading posts...</div>
            ) : (
              sortedPosts.filter(post => {
                const cat = categories.find(c => c.label === selectedCategory);
                return cat && post.category_id === cat.id;
              }).map(post => {
                const author = profiles.find(p => p.id === post.user_id);
                return (
                  <div key={post.id} className="lab-thread-card">
                    <div className="lab-thread-header">
                      {author?.country_flag === 'ACTUM' ? (
                        <img src={actumLogo} alt="Actum Logo" className="lab-thread-flag" />
                      ) : (
                        <CountryFlag countryCode={author?.country_flag} svg className="lab-thread-flag" title={author?.country_flag} />
                      )}
                      <span className="lab-thread-username">{author?.username || 'Anon'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                        <span title="Votes" style={{ fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span role="img" aria-label="Upvotes">▲</span> {post.votes?.toLocaleString?.() || 0}
                        </span>
                        <button
                          onClick={() => handleUpvotePost(post.id)}
                          disabled={!user}
                          className={`lab-heart-btn${userPostVotes.includes(post.id) ? ' liked' : ''}`}
                          title={userPostVotes.includes(post.id) ? 'Unlike' : 'Like'}
                        >
                          {userPostVotes.includes(post.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                    </div>
                    <h2
                      className="lab-thread-title"
                      onClick={() => {
                        setActivePost(post);
                        setPostModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {post.title}
                    </h2>
                    <div
                      className="lab-thread-content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      onClick={() => {
                        setActivePost(post);
                        setPostModalOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ marginTop: 10 }}>
                      {comments
                        .filter(c => c.post_id === post.id)
                        .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                        .slice(0, 3)
                        .map(c => {
                          const commenter = profiles.find(p => p.id === c.user_id);
                          if (!commenter) return null;
                          return (
                            <div key={c.id} className="lab-comment-card" style={{ marginBottom: 8 }}>
                              <div className="lab-comment-header">
                                {commenter.country_flag === 'ACTUM' ? (
                                  <img src={actumLogo} alt="Actum Logo" className="lab-comment-flag" />
                                ) : (
                                  <CountryFlag countryCode={commenter.country_flag} svg className="lab-comment-flag" title={commenter.country_flag} />
                                )}
                                <span className="lab-comment-username">{commenter.username || 'Anon'}</span>
                                <span style={{ marginLeft: 8, color: '#bdbdbd' }}>{c.content}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                                  <span title="Votes" style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <span role="img" aria-label="Upvotes">▲</span> {c.votes?.toLocaleString?.() || 0}
                                  </span>
                                  <button
                                    onClick={() => handleUpvoteComment(c.id)}
                                    disabled={!user}
                                    className={`lab-heart-btn${userCommentVotes.includes(c.id) ? ' liked' : ''}`}
                                    title={userCommentVotes.includes(c.id) ? 'Unlike' : 'Like'}
                                  >
                                    {userCommentVotes.includes(c.id) ? <FaHeart /> : <FaRegHeart />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <button
                      className="lab-btn primary"
                      style={{ marginTop: 10, fontSize: 17, borderRadius: 999, padding: '0.8rem 2rem' }}
                      onClick={() => {
                        if (!user) {
                          setAuthModalOpen(true);
                          return;
                        }
                        setActivePost(post);
                        setPostModalOpen(true);
                      }}
                    >
                      <span role="img" aria-label="Add Comment">💬</span> Add Comment
                    </button>
                    {author?.id === user?.id && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="lab-btn"
                        style={{ marginLeft: 12, background: '#ff6b6b', color: '#fff' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
        {/* Right Sidebar: Monthly Prompt */}
        <aside className="lab-right-sidebar">
          <div className="lab-right-sidebar-inner">
            {/* Monthly Prompt */}
            {monthlyPrompt && (
              <div className="monthly-prompt-card">
                <div>
                  <span style={{ fontSize: 32, marginRight: 10 }}>💡</span>
                  <span className="monthly-prompt-title">monthly prompt</span>
                </div>
                <div className="monthly-prompt-question">{monthlyPrompt.question}</div>
                <form onSubmit={handleAddPromptComment}>
                  <input
                    type="text"
                    placeholder="Share your idea..."
                    value={monthlyPromptComment}
                    onChange={e => setMonthlyPromptComment(e.target.value)}
                    required
                    className="monthly-prompt-input"
                    disabled={monthlyPromptCommentLoading}
                  />
                  <button type="submit" disabled={monthlyPromptCommentLoading} className="monthly-prompt-submit">Submit</button>
                </form>
                {monthlyPromptCommentError && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{monthlyPromptCommentError}</div>}
                <div className="monthly-prompt-comments">
                  {monthlyPromptComments
                    .slice()
                    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                    .map(c => {
                      const commenter = profiles.find(p => p.id === c.user_id);
                      if (!commenter) return null;
                      return (
                        <div key={c.id} className="lab-comment-card" style={{ marginBottom: 12 }}>
                          <div className="lab-comment-header">
                            {commenter.country_flag === 'ACTUM' ? (
                              <img src={actumLogo} alt="Actum Logo" className="lab-comment-flag" />
                            ) : (
                              <CountryFlag countryCode={commenter.country_flag} svg className="lab-comment-flag" title={commenter.country_flag} />
                            )}
                            <span className="lab-comment-username">{commenter.username || 'Anon'}</span>
                            <span style={{ marginLeft: 8, color: '#bdbdbd' }}>{c.content}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 24, marginLeft: 'auto' }}>
                              <span title="Votes" style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <span role="img" aria-label="Upvotes">▲</span> {c.votes?.toLocaleString?.() || 0}
                              </span>
                              <button
                                onClick={() => handleUpvotePromptComment(c.id)}
                                disabled={!user}
                                className={`lab-heart-btn${userPromptCommentVotes.includes(c.id) ? ' liked' : ''}`}
                                title={userPromptCommentVotes.includes(c.id) ? 'Unlike' : 'Like'}
                              >
                                {userPromptCommentVotes.includes(c.id) ? <FaHeart /> : <FaRegHeart />}
                              </button>
                            </div>
                            {(commenter.id === user?.id || profile?.is_admin) && (
                              <button
                                onClick={() => handleDeleteMonthlyPromptComment(c.id)}
                                className="lab-btn"
                                style={{ marginLeft: 8, background: '#ff6b6b', color: '#fff', padding: '0.2rem 0.7rem', fontSize: 13 }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {/* Centered lab logo under monthly prompt */}
            <div className="lab-logo-sidebar">
              <img src={labImg} alt="Lab" />
            </div>
            {profile?.is_admin && (
              <form onSubmit={async e => {
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
              }} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Set new monthly prompt..."
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  className="monthly-prompt-input"
                />
                <button type="submit" disabled={newPromptLoading} className="lab-btn primary">
                  {newPromptLoading ? 'Saving...' : 'Set Prompt'}
                </button>
                {newPromptError && <div style={{ color: '#ff6b6b' }}>{newPromptError}</div>}
              </form>
            )}
          </div>
        </aside>
        {/* Post Modal (unchanged for now, can be refactored similarly) */}
        <Dialog.Root open={postModalOpen} onOpenChange={open => { setPostModalOpen(open); if (!open) { setActivePost(null); setModalPage(1); setNewComment(''); setCommentError(null); } }}>
          <Dialog.Portal>
            <Dialog.Overlay style={{ background: 'rgba(0,0,0,0.55)', position: 'fixed', inset: 0, zIndex: 10001 }} />
            <Dialog.Content style={{
              background: '#18171c',
              color: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              padding: '2.5rem 2.2rem 2.2rem 2.2rem',
              width: 700,
              maxWidth: '98vw',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10002,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {activePost && (() => {
                const cat = categories.find(c => c.id === activePost.category_id);
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 10 }}>
                      {(() => {
                        const author = profiles.find(p => p.id === activePost.user_id);
                        return author?.country_flag === 'ACTUM' ? (
                          <img src={actumLogo} alt="Actum Logo" style={{ width: 40, height: 40 }} />
                        ) : (
                          <CountryFlag countryCode={author?.country_flag} svg style={{ width: 40, height: 40 }} title={author?.country_flag} />
                        );
                      })()}
                      <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{profiles.find(p => p.id === activePost.user_id)?.username || 'Anon'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                        <span style={{ fontWeight: 700, fontSize: 20 }}>{activePost.votes?.toLocaleString?.() || 0}</span>
                        <button
                          onClick={() => handleUpvotePost(activePost.id)}
                          disabled={!user}
                          style={{
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            cursor: !user ? 'not-allowed' : 'pointer',
                            color: userPostVotes.includes(activePost.id) ? '#ffd700' : '#fff',
                            fontSize: 28,
                            marginLeft: 8,
                            transition: 'color 0.15s',
                            padding: 0,
                            lineHeight: 1,
                          }}
                          title={userPostVotes.includes(activePost.id) ? 'Remove upvote' : 'Upvote'}
                        >
                          ▲
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      {cat && categoryLogos[cat.label.toLowerCase()] ? (
                        <img src={categoryLogos[cat.label.toLowerCase()]} alt={cat.label} style={{ width: 32, height: 32, marginRight: 10, objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: 28, marginRight: 10 }}>{cat?.icon || ''}</span>
                      )}
                      <span style={{ color: cat?.color || '#aaa', fontSize: 16 }}>{cat?.label || ''}</span>
                    </div>
                    <h2 style={{ fontWeight: 700, fontSize: '2rem', margin: '0 0 0.7rem 0', color: '#fff' }}>{activePost.title}</h2>
                    <div style={{ fontSize: '1.15rem', color: '#ccc', marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: activePost.content }} />
                    <div style={{ fontWeight: 700, color: '#fff', margin: '1.2rem 0 0.7rem 0', fontSize: 18 }}>Comments</div>
                    {/* Comment Form */}
                    {user && profile ? (
                      <form onSubmit={async e => {
                        e.preventDefault();
                        setCommentLoading(true);
                        setCommentError(null);
                        if (!newComment.trim()) {
                          setCommentError('Comment cannot be empty.');
                          setCommentLoading(false);
                          return;
                        }
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
                        // Refresh comments
                        const { data: newComments, error: fetchError } = await supabase.from('comments').select('*');
                        if (!fetchError && newComments) setComments(newComments);
                        setNewComment('');
                        setCommentLoading(false);
                      }} style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 18 }}>
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          required
                          style={{
                            flex: 1,
                            padding: '0.7rem 1rem',
                            borderRadius: 8,
                            border: '1.5px solid #444',
                            fontSize: 16,
                            background: '#222',
                            color: '#fff',
                          }}
                        />
                        <button type="submit" disabled={commentLoading} style={{ background: '#fff', color: '#18171c', border: 'none', borderRadius: 8, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: 16, cursor: commentLoading ? 'not-allowed' : 'pointer' }}>
                          {commentLoading ? 'Posting...' : 'Post'}
                        </button>
                      </form>
                    ) : (
                      <div style={{ color: '#aaa', marginBottom: 18 }}>Log in to comment.</div>
                    )}
                    {commentError && <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{commentError}</div>}
                    {/* Paginated Comments */}
                    <div style={{ width: '100%', maxHeight: 400, overflowY: 'auto', marginBottom: 18 }}>
                      {comments
                        .filter(c => c.post_id === activePost.id)
                        .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                        .slice((modalPage - 1) * COMMENTS_PER_PAGE, modalPage * COMMENTS_PER_PAGE)
                        .map(c => {
                          const commenter = profiles.find(p => p.id === c.user_id);
                          return (
                            <div key={c.id} style={{ color: '#fff', marginBottom: 8, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {commenter?.country_flag === 'ACTUM' ? (
                                  <img src={actumLogo} alt="Actum Logo" style={{ width: 24, height: 24 }} />
                                ) : (
                                  <CountryFlag countryCode={commenter?.country_flag} svg style={{ width: 24, height: 24 }} title={commenter?.country_flag} />
                                )}
                                <span style={{ fontWeight: 700 }}>{commenter?.username || 'Anon'}</span>:
                                <span>{c.content}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{c.votes?.toLocaleString?.() || 0}</span>
                                <button
                                  onClick={() => handleUpvoteComment(c.id)}
                                  disabled={!user}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    cursor: !user ? 'not-allowed' : 'pointer',
                                    color: userCommentVotes.includes(c.id) ? '#ffd700' : '#fff',
                                    fontSize: 22,
                                    marginLeft: 4,
                                    transition: 'color 0.15s',
                                    padding: 0,
                                    lineHeight: 1,
                                  }}
                                  title={userCommentVotes.includes(c.id) ? 'Remove upvote' : 'Upvote'}
                                >
                                  ▲
                                </button>
                              </div>
                              {commenter?.id === user?.id || profile?.is_admin ? (
                                <button
                                  onClick={() => handleDeleteComment(c.id)}
                                  style={{ marginLeft: 8, background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.2rem 0.7rem', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                      <button
                        onClick={() => setModalPage(p => Math.max(1, p - 1))}
                        disabled={modalPage === 1}
                        style={{ background: '#fff', color: '#18171c', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: modalPage === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setModalPage(p => p + 1)}
                        disabled={comments.filter(c => c.post_id === activePost.id).length <= modalPage * COMMENTS_PER_PAGE}
                        style={{ background: '#fff', color: '#18171c', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: comments.filter(c => c.post_id === activePost.id).length <= modalPage * COMMENTS_PER_PAGE ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  </>
                );
              })()}
              <Dialog.Close asChild>
                <button style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }} aria-label="Close">×</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}
