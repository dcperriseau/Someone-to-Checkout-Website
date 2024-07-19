import React from 'react';

const SignInPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center bg-white w-full md:w-1/2 py-8 md:py-0 md:px-10 shadow-md">
        <div className="w-full max-w-md space-y-6 px-4 md:px-0">
          <div className="text-4xl font-abril-fatface text-gray-900">Login</div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">EMAIL</div>
            <input
              className="w-full h-12 px-4 border border-gray-300 rounded-full shadow-sm bg-gray-100 text-gray-500 placeholder-gray-500"
              placeholder="Username or Email"
            />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-gray-900">PASSWORD</div>
            <input
              className="w-full h-12 px-4 border border-gray-300 rounded-full shadow-sm bg-gray-100 text-gray-500 placeholder-gray-500"
              placeholder="Password"
            />
          </div>
          <button className="w-full h-12 bg-gray-900 text-white rounded-full font-medium">Login</button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center bg-teal-400 w-full md:w-1/2 py-8 md:py-0 md:px-10">
        <div className="text-white text-center space-y-6 px-4 md:px-0">
          <div className="text-2xl md:text-4xl font-abril-fatface leading-tight">Welcome to Someone To Check Out</div>
          <div className="text-base md:text-lg">Don't have an account with us?</div>
          <button className="mt-4 w-48 h-12 border border-white text-white rounded-full">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
