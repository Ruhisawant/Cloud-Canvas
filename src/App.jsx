import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ManagePost from './pages/ManagePost'
import PostDetails from './pages/PostDetails'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<ManagePost />} />
        <Route path="/edit/:id" element={<ManagePost />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </Router>
  )
}