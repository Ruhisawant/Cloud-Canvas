import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowUp, Edit, Trash2, Cloud, Calendar, MessageSquare, ArrowLeft, Send, Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './PostDetails.css';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const cloudTypeOptions = [
    { value: 'cumulus', label: 'Cumulus - Fluffy cotton-like clouds' },
    { value: 'stratus', label: 'Stratus - Flat, layered clouds' },
    { value: 'cirrus', label: 'Cirrus - Thin, wispy clouds' },
    { value: 'nimbus', label: 'Nimbus - Rain clouds' },
    { value: 'cumulonimbus', label: 'Cumulonimbus - Thunderstorm clouds' },
    { value: 'other', label: 'Other cloud formation' }
  ];

  useEffect(() => {
    if (!id) return;
    
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  async function fetchPost() {
    try {
      setIsLoading(true);
      
      const { data, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      if (!data) {
        throw new Error('Post not found');
      }
      
      setPost({
        ...data,
        comments: []
      });
      
      try {
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', data.id)
          .order('created_at', { ascending: false });
        
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        } else {
          setPost(prevPost => ({
            ...prevPost,
            comments: comments || []
          }));
        }
      } catch (commentsError) {
        console.error('Error in comments fetch:', commentsError);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpvote = async () => {
    if (!id) return;
    
    try {
      const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newUpvotes = ((currentPost.upvotes || 0) + 1);
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ upvotes: newUpvotes })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      setPost(prev => ({
        ...prev,
        upvotes: newUpvotes
      }));
    } catch (error) {
      console.error('Failed to upvote post:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        try {
          const { error: commentsError } = await supabase
            .from('comments')
            .delete()
            .eq('post_id', id);
          
          if (commentsError) {
            console.warn('No comments table or no comments to delete', commentsError);
          }
        } catch (err) {
          console.warn('Comments table might not exist yet');
        }
        
        const { error: postError } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);
        
        if (postError) throw postError;
        
        navigate('/');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;
    
    try {
      try {
        const { count, error: checkError } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true });
        
        if (checkError) {
          alert("The comments feature isn't set up yet. Please create a 'comments' table in your Supabase database with columns: id, post_id, content, created_at");
          return;
        }
      } catch (error) {
        alert("The comments feature isn't set up yet. Please create a 'comments' table in your Supabase database with columns: id, post_id, content, created_at");
        return;
      }
      
      const newComment = {
        post_id: post.id,
        content: commentText,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select();
      
      if (error) throw error;
      
      setPost(prevPost => ({
        ...prevPost,
        comments: [data[0], ...(prevPost.comments || [])]
      }));
      
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <header className='content-header'>
          <div className='logo-container'><h1>Cloud Canvas</h1></div>
          <div className='nav-links'>
            <Link to='/create' className='create-button'>
              <Plus />Create Post
            </Link>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cloud formation...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="main-content">
        <header className='content-header'>
          <div className='logo-container'>
            <Link to='/' className='home-btn'><h1>Cloud Canvas</h1></Link>
          </div>
          <div className='nav-links'>
            <Link to='/create' className='create-button'><Plus />Create Post</Link>
          </div>
        </header>
        <div className="error-container">
          <p className="error-message">Error loading post: Post not found</p>
          <Link to="/" className="button button-secondary">Return to home</Link>
        </div>
      </div>
    );
  }

  const cloudType = post.cloudType || post.cloud_type || 'other';
  const cloudTypeLabel = cloudTypeOptions.find(option => option.value === cloudType)?.label || 'Other cloud formation';

  return (
    <div className="main-content">
      <header className='content-header'>
        <div className='logo-container'>
          <Link to='/' className='home-btn'><h1>Cloud Canvas</h1></Link>
        </div>
        <div className='nav-links'>
          <Link to='/create' className='create-button'><Plus />Create Post</Link>
        </div>
      </header>

      <div className="back-navigation">
          <Link to="/" className="back-button">
            <ArrowLeft className="icon-small" /> Back to all posts
          </Link>
        </div>

      <main className="post-details-container">
        <div className="post-card">
          {(post.imageUrl || post.image_url) && (
            <div className="post-image-container">
              <img 
                src={post.imageUrl || post.image_url} 
                alt={post.title}
                className="post-image" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                }}
              />
            </div>
          )}
          
          <div className="post-content-wrapper">
            <div className="post-header">
              <div className="post-meta">
                <div className="post-tags">
                  <span className="cloud-type-badge">
                    <Cloud className="icon-tiny" />
                    {cloudTypeLabel}
                  </span>
                  <span className="post-date">
                    <Calendar className="icon-tiny" />
                    {formatDate(post.timestamp || post.created_at || post.createdAt)}
                  </span>
                </div>
                <h1 className="post-title">{post.title}</h1>
              </div>
              
              <div className="upvote-wrapper">
                <button 
                  className="upvote-button"
                  onClick={handleUpvote}
                  aria-label="Upvote this post"
                >
                  <ArrowUp className="icon-medium" />
                </button>
                <span className="upvote-count">{post.upvotes || 0}</span>
              </div>
            </div>
            
            {post.content && (
              <div className="post-body">
                <p>{post.content}</p>
              </div>
            )}
            
            <div className="post-footer">
              <span className="comments-indicator">
                <MessageSquare className="icon-small" />
                {post.comments?.length || 0} comments
              </span>
              
              <div className="post-actions">
                <button 
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="button button-outline"
                >
                  <Edit className="icon-small" />
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="button button-danger"
                >
                  <Trash2 className="icon-small" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="comment-form-card">
          <div className="card-content">
            <h2 className="section-heading">Add a Comment</h2>
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-input"
                required
              />
              <button 
                type="submit" 
                className="button button-primary"
              >
                <Send className="icon-small" />
                Post
              </button>
            </form>
          </div>
        </div>
        
        <div className="comments-card">
          <div className="card-content">
            <h2 className="section-heading">
              Comments ({post.comments?.length || 0})
            </h2>
            
            {post.comments && post.comments.length > 0 ? (
              <div className="comments-list">
                {post.comments.map((comment, index) => (
                  <div key={comment.id || index} className="comment-item">
                    <p className="comment-text">{comment.content}</p>
                    <p className="comment-timestamp">
                      Posted on {formatDate(comment.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state-message">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}