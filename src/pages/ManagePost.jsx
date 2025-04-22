import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './ManagePost.css';
import { Cloud } from "lucide-react";

function ManagePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
    cloudType: isEditMode ? "other" : "cumulus"
  });

  // Preview state
  const [previewError, setPreviewError] = useState(false);

  // Cloud type options
  const cloudTypeOptions = [
    { value: "cumulus", label: "Cumulus - Fluffy cotton-like clouds" },
    { value: "stratus", label: "Stratus - Flat, layered clouds" },
    { value: "cirrus", label: "Cirrus - Thin, wispy clouds" },
    { value: "nimbus", label: "Nimbus - Rain clouds" },
    { value: "cumulonimbus", label: "Cumulonimbus - Thunderstorm clouds" },
    { value: "other", label: "Other cloud formation" }
  ];

  useEffect(() => {
    if (!isEditMode) return;
    
    const foundPost = getPostById(id);
    if (foundPost) {
      setPost({
        title: foundPost.title,
        content: foundPost.content || "",
        imageUrl: foundPost.imageUrl || "",
        cloudType: foundPost.cloudType || "other",
      });
      setIsLoading(false);
    } else {
      navigate("/not-found");
    }
  }, [id, navigate, isEditMode]);

  // Data functions
  function getPostById(postId) {
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      return posts.find(post => post.id === postId) || null;
    } catch (error) {
      console.error("Failed to get post:", error);
      return null;
    }
  }

  function updatePost(postId, updatedData) {
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, ...updatedData, updatedAt: new Date().toISOString() } : post
      );
      
      localStorage.setItem('cloudPosts', JSON.stringify(updatedPosts));
      return updatedPosts.find(post => post.id === postId) || null;
    } catch (error) {
      console.error("Failed to update post:", error);
      return null;
    }
  }

  function createPost(postData) {
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      
      const newPost = {
        id: `post-${Date.now()}`,
        ...postData,
        upvotes: 0,
        timestamp: new Date().toISOString(),
        comments: []
      };
      
      const updatedPosts = [...posts, newPost];
      localStorage.setItem('cloudPosts', JSON.stringify(updatedPosts));
      
      return newPost;
    } catch (error) {
      console.error("Failed to create post:", error);
      return null;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    
    // Reset preview error when changing image URL
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!post.title.trim()) {
      alert("Please enter a title for your cloud spotting");
      return;
    }
    
    if (!post.imageUrl.trim()) {
      alert("Please enter an image URL for your cloud spotting");
      return;
    }
    
    if (isEditMode) {
      const updatedPost = updatePost(id, post);
      if (updatedPost) {
        navigate(`/post/${id}`);
      }
    } else {
      const newPost = createPost(post);
      if (newPost) {
        navigate(`/post/${newPost.id}`);
      }
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  if (isLoading) {
    return (
      <div className="manage-post-container">
        <header className="manage-post-header">
          <div className="logo-container">
            <img src={CloudIcon} alt="Cloud Watchers Logo" className="logo" />
            <h1>Cloud Watchers</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className="back-button">
              <i className="fas fa-arrow-left"></i> Back to Home
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

  return (
    <div className="manage-post-container">
      <header className="manage-post-header">
        <div className="logo-container">
          <Cloud />
          <h1>Cloud Watchers</h1>
        </div>
        <div className="nav-links">
          <Link to="/" className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </header>
      
      <main className="form-container">
        <h2 className="form-title">
          {isEditMode ? "Edit Your Cloud Spotting" : "Share Your Cloud Spotting"}
        </h2>
        
        <form onSubmit={handleSubmit} className="cloud-form">
          <div className="form-grid">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="title">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  placeholder="What does this cloud resemble?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cloudType">Cloud Type</label>
                <select
                  id="cloudType"
                  name="cloudType"
                  value={post.cloudType}
                  onChange={handleChange}
                >
                  {cloudTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">
                  Image URL <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={post.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/your-cloud-image.jpg"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Description</label>
                <textarea
                  id="content"
                  name="content"
                  value={post.content}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about your cloud spotting experience..."
                ></textarea>
              </div>
            </div>
            
            <div className="form-right">
              <div className="image-preview-container">
                <h3>Preview</h3>
                {post.imageUrl ? (
                  <div className="image-preview">
                    <img 
                      src={post.imageUrl} 
                      alt="Cloud Preview" 
                      onError={handleImageError}
                      className={previewError ? "preview-error" : ""}
                    />
                    {previewError && (
                      <div className="error-overlay">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>Invalid image URL</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-preview">
                    <i className="fas fa-cloud"></i>
                    <p>Enter an image URL to see a preview</p>
                  </div>
                )}
                
                <div className="preview-card">
                  <h4>{post.title || "Your Cloud Title"}</h4>
                  <p className="cloud-type">
                    <i className="fas fa-cloud"></i> 
                    {cloudTypeOptions.find(option => option.value === post.cloudType)?.label || "Cloud Type"}
                  </p>
                  <p className="preview-content">
                    {post.content || "Your description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(isEditMode ? `/post/${id}` : "/")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? "Update Cloud" : "Share Cloud"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ManagePost;