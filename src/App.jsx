import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from "../src/components/Header";
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import ManagePost from './pages/ManagePost';
import './App.css'

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/create" element={<ManagePost />} />
        <Route path="/edit/:id" element={<ManagePost />} />
        <Route path="/not-found" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
              <p className="mb-6">The cloud post you're looking for doesn't exist.</p>
              <a 
                href="/" 
                className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
              >
                Back to Home
              </a>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;