import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';
import { useEffect } from 'react'; // Add this import

function App() {
  useEffect(() => {
    const handleRefresh = () => {
      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
    };

    // Listen for page loads (including refreshes)
    window.addEventListener('load', handleRefresh);

    // Cleanup
    return () => window.removeEventListener('load', handleRefresh);
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