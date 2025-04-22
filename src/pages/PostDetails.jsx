import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowUp, 
  Edit, 
  Trash2, 
  CloudSun,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Send
} from "lucide-react";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Cloud type options for display purposes
  const cloudTypeOptions = [
    { value: "cumulus", label: "Cumulus" },
    { value: "stratus", label: "Stratus" },
    { value: "cirrus", label: "Cirrus" },
    { value: "nimbus", label: "Nimbus" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    if (!id) return;
    
    const foundPost = getPostById(id);
    if (foundPost) {
      setPost(foundPost);
    } else {
      navigate("/not-found");
    }
  }, [id, navigate]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        post.id === postId ? { ...post, ...updatedData } : post
      );
      
      localStorage.setItem('cloudPosts', JSON.stringify(updatedPosts));
      return updatedPosts.find(post => post.id === postId) || null;
    } catch (error) {
      console.error("Failed to update post:", error);
      return null;
    }
  }

  function deletePost(postId) {
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      const updatedPosts = posts.filter(post => post.id !== postId);
      
      localStorage.setItem('cloudPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return false;
    }
  }

  function addComment(postId, content) {
    if (!content.trim()) return null;
    
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) return null;
      
      const updatedPost = { ...posts[postIndex] };
      
      // Add new comment
      const newComment = {
        id: `c${Date.now()}`,
        content,
        createdAt: new Date().toISOString()
      };
      
      updatedPost.comments = [...(updatedPost.comments || []), newComment];
      
      // Update in posts array
      posts[postIndex] = updatedPost;
      localStorage.setItem('cloudPosts', JSON.stringify(posts));
      
      return updatedPost;
    } catch (error) {
      console.error("Failed to add comment:", error);
      return null;
    }
  }

  function upvotePost(postId) {
    try {
      const posts = JSON.parse(localStorage.getItem('cloudPosts') || '[]');
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) return null;
      
      const updatedPost = { 
        ...posts[postIndex],
        upvotes: (posts[postIndex].upvotes || 0) + 1
      };
      
      posts[postIndex] = updatedPost;
      localStorage.setItem('cloudPosts', JSON.stringify(posts));
      
      return updatedPost;
    } catch (error) {
      console.error("Failed to upvote post:", error);
      return null;
    }
  }

  const handleUpvote = () => {
    if (!id) return;
    
    const updatedPost = upvotePost(id);
    if (updatedPost) {
      setPost(updatedPost);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      const deleted = deletePost(id);
      if (deleted) {
        navigate("/");
      }
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;
    
    const updatedPost = addComment(id, commentText);
    if (updatedPost) {
      setPost(updatedPost);
      setCommentText("");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-blue-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-xl text-blue-600 flex items-center">
              <CloudSun className="mr-2" />
              CloudSpotter
            </Link>
          </div>
        </header>
        <div className="container mx-auto py-20 text-center">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  const cloudTypeName = cloudTypeOptions.find(option => option.value === post.cloudType)?.label || post.cloudType;

  return (
    <div className="min-h-screen pb-10 bg-blue-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-blue-600 flex items-center">
            <CloudSun className="mr-2" />
            CloudSpotter
          </Link>
          <div>
            <Link to="/new" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
              New Post
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to all clouds
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          {post.imageUrl && (
            <div className="h-64 md:h-96 w-full overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                    <CloudSun className="h-3 w-3" />
                    {cloudTypeName}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={handleUpvote}
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg">{post.upvotes || 0}</span>
              </div>
            </div>
            
            {post.content && (
              <div className="my-6 text-lg">
                <p>{post.content}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              <span className="flex items-center text-gray-500">
                <MessageSquare className="h-4 w-4 mr-1" />
                {post.comments?.length || 0} comments
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="px-3 py-1 border border-gray-300 rounded-md flex items-center gap-1 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-3 py-1 border border-red-300 text-red-600 rounded-md flex items-center gap-1 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comment Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Add a Comment</h2>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Post
            </button>
          </form>
        </div>
        
        {/* Comments List */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Comments ({post.comments?.length || 0})</h2>
          
          {post.comments && post.comments.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment.id} className="bg-white shadow-md rounded-lg p-4">
                <p className="mb-2">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on {formatDate(comment.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </main>
    </div>
  );
}