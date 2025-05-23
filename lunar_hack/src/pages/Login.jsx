import React, { useState,useEffect } from 'react';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [error,setError]=useState(null)
  const navigate = useNavigate();
  const showError = () => {
      toast.error(error, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    };
    useEffect(() => {
      if (error) {
        showError();
        setError(null);
      }
    }, [error]);

    const handleLogin = async (e) => {
      e.preventDefault();
      const allowedDomain = "@etudiant-fst.utm.tn";
    
      if (!email.endsWith(allowedDomain)) {
        setError(`Veuillez utiliser une adresse mail se terminant par ${allowedDomain}`);
        return;
      }
    
      setIsLoading(true);
      setError(null);
    
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('User connected:', data.user_id);
          sessionStorage.setItem('userDetails', JSON.stringify(data.user_id)); // Store user details in session storage&
          navigate('/home'); // Redirect to the smart bot page
          // Do something: redirect or update state
        } else {
          setError(data.error || 'Signup failed');
        }
      } catch (err) {
        console.error('Erreur lors de la requête :', err);
        setError('Erreur serveur');
      } finally {
        setIsLoading(false);
      }
    };
    

  return (
    <div className="flex items-center justify-center w-screen h-full min-h-screen bg-gradient-to-tr from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-indigo-700">Bienvenue</h2>
            <p className="text-sm text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin} > 
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email :
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="vous@etudiant-fst.utm.tn"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe :
              </label>
              <input
                id="password"
                type={afficherMotDePasse ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Entrez votre mot de passe"
              />
              <div
                
                className="absolute  top-10 right-5 bg-white   text-gray-500 hover:text-gray-700"
                onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
              >
                {afficherMotDePasse ? <MdVisibility className="w-6 h-5" /> : <MdVisibilityOff className="w-6 h-5" />}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 !bg-indigo-500 text-white rounded-lg font-semibold shadow hover:!bg-indigo-700 transition-all duration-300"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;