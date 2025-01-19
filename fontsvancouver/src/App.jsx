import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';
import { useEffect } from 'react';

function App() {
  // Add this effect to handle page refreshes
  useEffect(() => {
    // Check if we're not on the homepage
    if (window.location.pathname !== '/') {
      // Redirect to homepage
      window.location.href = '/';
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
}

export default App;