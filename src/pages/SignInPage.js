import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [verificationError, setVerificationError] = useState(null); // New state for verification error
  const { setIdToken, redirectPath } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setVerificationError('Email not verified. Please check your inbox.');
        throw new Error('Email not verified');
      }
      const idToken = await userCredential.user.getIdToken();
      console.log('Obtained ID Token:', idToken); // Log the ID token
      setIdToken(idToken);
      return idToken;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const submitLogin = async (email, password) => {
    try {
      const idToken = await loginUser(email, password);
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
  
      const responseText = await response.text(); // Get the raw response text
      try {
        const data = JSON.parse(responseText); // Try to parse as JSON
        console.log('Login successful:', data);
        navigate(redirectPath || '/');
      } catch (e) {
        throw new Error('Server returned non-JSON response: ' + responseText);
      }
    } catch (error) {
      console.error('Error submitting login:', error);
      if (error.message !== 'Email not verified') {
        setError(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setVerificationError(null); // Reset verification error
    await submitLogin(email, password);
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center w-full py-8 bg-white shadow-md md:w-1/2 md:py-0 md:px-10">
        <form className="w-full max-w-md px-4 space-y-6 md:px-0" onSubmit={handleSubmit}>
          <div className="text-4xl text-gray-900 font-abril-fatface">Login</div>
          {error && <div className="text-red-500">{error}</div>}
          {verificationError && <div className="text-red-500">{verificationError}</div>}
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">EMAIL</div>
            <input
              className="w-full h-12 px-4 text-gray-500 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-sm"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">PASSWORD</div>
            <input
              type="password"
              className="w-full h-12 px-4 text-gray-500 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full h-12 font-medium text-white bg-gray-900 rounded-full">
            Login
          </button>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center w-full py-8 bg-teal-400 md:w-1/2 md:py-0 md:px-10">
        <div className="px-4 space-y-6 text-center text-white md:px-0">
          <div className="text-2xl leading-tight md:text-4xl font-abril-fatface">Welcome to Someone To Check Out</div>
          <div className="text-base md:text-lg">Don't have an account with us?</div>
          <button
            className="w-48 h-12 mt-4 text-white border border-white rounded-full"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
