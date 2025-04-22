import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react'
import { supabase } from '../supabaseClient';
import './ManagePost.css';

export default function ManagePost() {
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

  const [previewError, setPreviewError] = useState(false);

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

    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error("Post not found or error:", error);
      } else {
        setPost({
          title: data.title,
          content: data.content || "",
          imageUrl: data.imageUrl || "",
          cloudType: data.cloudType || "other",
        });
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!post.title.trim()) return alert("Please enter a title.");
    if (!post.imageUrl.trim()) return alert("Please enter an image URL.");
  
    const payload = {
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      comments: []
    };
  
    if (isEditMode) {
      const { error } = await supabase
        .from("posts")
        .update({
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id);
  
      if (!error) navigate(`/post/${id}`);
      else console.error("Failed to update post:", error);
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert([payload])
        .select()
        .single();
  
      if (!error) navigate(`/post/${data.id}`);
      else console.error("Failed to create post:", error);
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <header className='content-header'>
          <div className='logo-container'><h1>Cloud Canvas</h1></div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cloud formation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <header className='content-header'>
        <div className='logo-container'>
          <Link to='/' className='home-btn'><h1>Cloud Canvas</h1></Link>
        </div>
      </header>

      <main className="form-container">
        <h2 className="form-title">
          {isEditMode ? "Edit Your Post" : "Share Your Unique Cloud!"}
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
              {isEditMode ? "Update Post" : "Share Post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}