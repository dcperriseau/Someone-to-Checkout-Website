import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth for authentication state
import { useBasket } from '../context/BasketContext'; // Import useBasket for basket count
import LogoutButton from './LogoutButton'; // Import LogoutButton component

const Header = () => {
  const navigate = useNavigate();
  const { idToken } = useAuth(); // Access the idToken from AuthContext
  const { basketCount } = useBasket(); // Access the basketCount from BasketContext

  const handleCartClick = () => {
    if (idToken) {
      navigate('/shoppingbasket');
    } else {
      navigate('/signin');
    }
  };

  return (
    <header className="relative w-full bg-white border-l-[10px] border-r-[10px] border-t-[10px] border-borderGrey px-4">
      {/* Main header content */}
      <div className="flex flex-wrap items-center justify-between h-24">
        <div
          className="text-2xl cursor-pointer font-abril-fatface text-primary"
          onClick={() => navigate('/')}
        >
          Someone to Check Out
        </div>
        <div className="flex mt-2 space-x-4 sm:mt-0">
          {idToken ? (
            <LogoutButton />
          ) : (
            <>
              <Button label="Log In" customStyle="border border-gray-900 bg-white text-gray-900" onClick={() => navigate('/signin')} />
              <Button label="Sign Up" customStyle="bg-gray-900 text-white" onClick={() => navigate('/signup')} />
            </>
          )}
        </div>
      </div>

      {/* Horizontal divider above sub-header content */}
      <div className="border-t border-gray-300" />

      {/* Sub-header content */}
      <div className="flex flex-col items-center justify-between mt-2 space-y-2 sm:flex-row sm:space-y-0">
        <div className="flex flex-wrap justify-center space-x-4 text-red-hat-display">
          <button onClick={() => navigate('/')} className="text-black">Properties</button>
          <button onClick={() => navigate('/aboutus')} className="text-black">About</button>
          <button onClick={() => navigate('/contactus')} className="text-black">Contact Us</button>
          <button onClick={() => navigate('/suggestlisting')} className="text-black">Request Viewing</button>
        </div>
        <div className="relative flex justify-center mt-2 space-x-4 sm:mt-0">
          <Button label="Post Listing" customStyle="border border-teal-400 bg-teal-100 text-gray-900" onClick={() => navigate('/postlistings')} />
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <Icon />
            {basketCount > 0 && (
              <span className="absolute top-1 left-0 transform -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                {basketCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal divider below sub-header content */}
      <div className="mt-2 border-t border-gray-300" />
    </header>
  );
};

const Text = ({ text }) => (
  <div className="text-sm font-medium text-gray-900 font-red-hat-display">
    {text}
  </div>
);

const Button = ({ label, customStyle, onClick }) => (
  <button
    className={`cursor-pointer px-2 py-1 rounded-full text-sm font-red-hat-display font-medium ${customStyle}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const Icon = () => (
  <svg className="w-6 h-6 text-gray-900 fill-current" viewBox="0 0 576 512">
    <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
  </svg>
);

export default Header;
