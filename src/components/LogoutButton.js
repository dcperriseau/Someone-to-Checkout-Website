import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button
      className="px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded-full cursor-pointer font-red-hat-display"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
