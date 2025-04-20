import './App.css'
import  { Toaster } from 'react-hot-toast';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SmartBot from './pages/SmartBot';
import LostXFound from './pages/LostXFound';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
  <Router>
      <Toaster />
      <Routes>
        <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        <Route path="/smart-bot" element={<ProtectedRoute><SmartBot /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostXFound /></ProtectedRoute>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
        
  )
}

export default App;