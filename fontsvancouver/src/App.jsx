import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';

// Create a wrapper component to handle refresh
function RefreshHandler({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRefresh = () => {
      if (performance.navigation.type === 1) { // 1 indicates page refresh
        navigate('/');
      }
    };

    handleRefresh(); // Check immediately
  }, [navigate]);

  return children;
}

function App() {
  return (
    <Router>
      <RefreshHandler>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </RefreshHandler>
    </Router>
  );
}

export default App;