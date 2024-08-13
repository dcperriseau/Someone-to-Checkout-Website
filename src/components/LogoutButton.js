import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // Adjust the path as necessary

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/personalprofile');
  };

  return (
    <div className="flex space-x-4">
      <button
        className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer font-red-hat-display"
        onClick={handleProfileClick}
      >
        Profile
      </button>
      <button
        className="px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded-full cursor-pointer font-red-hat-display"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default LogoutButton;
