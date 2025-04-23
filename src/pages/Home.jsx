import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Cloud, MessageCircle } from 'lucide-react'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortOption, setSortOption] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch posts from Supabase when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      
      try {
        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')

        if (postsError) {
          console.error('Error fetching posts:', postsError)
          setIsLoading(false)
          return
        }

        // For each post, fetch its comments
        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            try {
              const { data: comments, error: commentsError, count } = await supabase
                .from('comments')
                .select('*', { count: 'exact' })
                .eq('post_id', post.id)

              if (commentsError) {
                console.warn(`Error fetching comments for post ${post.id}:`, commentsError)
                return {
                  ...post,
                  commentCount: 0
                }
              }

              return {
                ...post,
                commentCount: count || 0
              }
            } catch (err) {
              console.warn(`Error processing comments for post ${post.id}:`, err)
              return {
                ...post,
                commentCount: 0
              }
            }
          })
        )

        const sortedData = postsWithComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        setPosts(sortedData)
        setFilteredPosts(sortedData)
      } catch (error) {
        console.error('Error in fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter and sort posts based on search term and sort option
  useEffect(() => {
    let result = [...posts]

    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    } else if (sortOption === 'popular') {
      result.sort((a, b) => b.upvotes - a.upvotes)
    }

    setFilteredPosts(result)
  }, [posts, searchTerm, sortOption])

  // Helper function to format timestamp into a readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    else if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    else return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  return (
    <div className='main-content'>
      {/* Header with logo, search bar, and create post button */}
      <header className='content-header'>
        <Link to='/' className='logo-container'><h1>Cloud Canvas</h1></Link>

        <div className='search-container'>
          <input 
            type='text' 
            placeholder='Search cloud formations...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>
        <Link to='/create' className='create-button'>Create Post</Link>
      </header>

      {/* Sort and filter controls */}
      <div className='filter-sort-container'>
        <div className='sort-controls'>
          <label>Sort by:</label>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className='sort-select'
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='popular'>Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Loading state or posts display */}
      {isLoading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading cloud formations...</p>
        </div>
      ) : (
        <div className='home-posts-grid'>
          {filteredPosts.length > 0 ? (
            // Display the filtered posts in a grid
            filteredPosts.map(post => (
              <Link to={`/post/${post.id}`} className='home-post-card' key={post.id}>
                <div className='home-post-image-container'>
                  <img src={post.imageUrl} alt={post.title} className='home-post-image' />
                </div>
                <div className='home-post-info'>
                  <h3 className='home-post-title'>{post.title}</h3>
                  <div className='post-meta'>
                    <span className='post-meta-time'>{formatTimestamp(post.timestamp)}</span>
                    <span className='post-meta-data'>
                      <MessageCircle className='post-meta-comments'/> {post.commentCount || 0}
                      <Cloud className='post-meta-likes'/> {post.upvotes || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className='no-posts-message'>
              <h3>No cloud formations match your search</h3>
              <p>Try a different search term or create a new post!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}