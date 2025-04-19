import './App.css'

//import {toast,toastContainer} from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LostXFound from './pages/LostXFound';
import SmartBot from './pages/SmartBot';

function App() {
 
  return (

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/lost-found" element={<LostXFound/>}/>
          <Route path="/smart-bot" element={<SmartBot/>}/>
        </Routes>
      </Router>
        
  )
}

export default App