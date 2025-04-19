
import './App.css'


import Login from './components/auth/login/Login';



function App() {
 
  return (

      <Router>
        <Routes>
          
          <Route path="/login" element={<Login/>}/>
          
        </Routes>
      </Router>
        
  )
}

export default App