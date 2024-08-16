import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (email, password, firstName, lastName) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's profile with first name and last name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      console.log('Sign up successful:', userCredential.user);
      setSuccess(true);
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    await registerUser(email, password, firstName, lastName);
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex flex-col items-center justify-center w-full py-8 bg-white shadow-md md:w-1/2 md:py-0 md:px-10">
        <form className="w-full max-w-md px-4 space-y-6 md:px-0" onSubmit={handleSubmit}>
          <div className="text-4xl text-gray-900 font-abril-fatface">Sign Up</div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">Sign up successful! Please check your email to verify your account.</div>}
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">EMAIL</div>
            <input
              className="w-full h-12 px-4 text-gray-500 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">FIRST NAME</div>
            <input
              className="w-full h-12 px-4 text-gray-500 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-sm"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">LAST NAME</div>
            <input
              className="w-full h-12 px-4 text-gray-500 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-full shadow-sm"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            Sign Up
          </button>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center w-full py-8 bg-teal-400 md:w-1/2 md:py-0 md:px-10">
        <div className="px-4 space-y-6 text-center text-white md:px-0">
          <div className="text-2xl leading-tight md:text-4xl font-abril-fatface">Welcome to Someone To Check Out</div>
          <div className="text-base md:text-lg">Already have an account with us?</div>
          <button
            className="w-48 h-12 mt-4 text-white border border-white rounded-full"
            onClick={() => navigate('/signin')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
