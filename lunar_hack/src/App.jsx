import './App.css'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmartCampusAssistant from './pages/SmartCampusAssistant';
import LandingPage from './pages/LandingPage';

function App() {
 
  return (

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/smart" element={<SmartCampusAssistant/>}/>
          
        </Routes>
      </Router>
        
  )
}

export default App