import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Cloud, MessageCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortOption, setSortOption] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')

      if (error) {
        console.error('Error fetching posts:', error)
        setIsLoading(false)
        return
      }

      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setPosts(sortedData)
      setFilteredPosts(sortedData)
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

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
      <header className='content-header'>
        <div className='logo-container'>
          <Link to='/' className='home-btn'><h1>Cloud Canvas</h1></Link>
        </div>
        <div className='search-container'>
          <input 
            type='text' 
            placeholder='Search cloud formations...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>
        <div className='nav-links'>
          <Link to='/create' className='create-button'>
            <Plus />Create Post
          </Link>
        </div>
      </header>

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

      {isLoading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading cloud formations...</p>
        </div>
      ) : (
        <div className='posts-grid'>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <Link to={`/post/${post.id}`} className='post-card' key={post.id}>
                <div className='post-image-container'>
                  <img src={post.imageUrl} alt={post.title} className='post-image' />
                </div>
                <div className='post-info'>
                  <h3 className='post-title'>{post.title}</h3>
                  <div className='post-meta'>
                    <span className='post-time'>{formatTimestamp(post.timestamp)}</span>
                    <span className='post-upvotes'>
                      <MessageCircle className='post-comments'/> {post.comments?.length || 0}
                      <Cloud className='post-likes'/> {post.upvotes}
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