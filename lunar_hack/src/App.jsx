import './App.css'
import  { Toaster } from 'react-hot-toast';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SmartBot from './pages/SmartBot';
import LostXFound from './pages/LostXFound';
import Login from './pages/login';


function App() {
  return (

      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/smart-bot" element={<SmartBot/>}/>
          <Route path="/lost-found" element={<LostXFound/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
        
  )
}

export default App;