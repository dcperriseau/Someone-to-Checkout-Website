import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // Adjust the path as necessary
import LogoutButton from './LogoutButton.js'; // Adjust the path as necessary

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex mt-2 space-x-4 sm:mt-0">
      {user ? (
        <LogoutButton />
      ) : (
        <>
          <Button label="Log In" customStyle="border border-gray-900 bg-white text-gray-900" onClick={() => navigate('/signin')} />
          <Button label="Sign Up" customStyle="bg-gray-900 text-white" onClick={() => navigate('/signin')} />
        </>
      )}
    </div>
  );
};

const Button = ({ label, customStyle, onClick }) => (
  <button
    className={`cursor-pointer px-2 py-1 rounded-full text-sm font-red-hat-display font-medium ${customStyle}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default AuthButtons;
