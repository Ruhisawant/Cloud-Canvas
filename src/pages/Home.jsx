import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Cloud, MessageCircle } from 'lucide-react'
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
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockPosts = [
        {
          id: 1,
          title: 'Elephant in the Sky',
          content: 'I spotted this cloud that looks exactly like an elephant with its trunk raised!',
          imageUrl: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          upvotes: 24,
          comments: [
            { id: 1, author: 'cloudlover', text: 'I see it! The trunk is so defined!', timestamp: new Date().toISOString() },
            { id: 2, author: 'skygazer', text: 'Amazing find! I love elephant clouds.', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 2,
          title: 'Dragon Breathing Fire',
          content: 'This sunset cloud formation looks like a dragon breathing fire across the sky!',
          imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          upvotes: 42,
          comments: [
            { id: 1, author: 'dragonspotter', text: "That's definitely a dragon! Great capture!", timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 3,
          title: 'Fluffy Sheep Herd',
          content: 'A whole field of fluffy sheep clouds floating by this afternoon.',
          imageUrl: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          upvotes: 18,
          comments: []
        },
        {
          id: 4,
          title: 'Heart-Shaped Cloud',
          content: 'Spotted this perfect heart in the sky today! Love is in the air!',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          upvotes: 56,
          comments: [
            { id: 1, author: 'loveclouds', text: 'So romantic!', timestamp: new Date().toISOString() },
            { id: 2, author: 'skyheart', text: 'Perfect shape!', timestamp: new Date().toISOString() },
            { id: 3, author: 'cloudromantic', text: 'The universe is sending love!', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 5,
          title: 'Face in the Cumulus',
          content: 'Can you see the face? It was staring down at me for almost an hour!',
          imageUrl: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          upvotes: 31,
          comments: [
            { id: 1, author: 'faceseeker', text: 'I can totally see it! Looks like an old man.', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 6,
          title: 'Whale Swimming in the Blue',
          content: 'This massive cloud reminded me of a blue whale gracefully swimming through the ocean.',
          imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          upvotes: 29,
          comments: []
        }
      ]

      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
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

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    }
  }

  return (
    <div className='main-content'>
      <header className='content-header'>
        <div className='logo-container'>
          <h1>Cloud Canvas</h1>
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
                      <MessageCircle className='post-comments'/> {post.upvotes}
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