import React from 'react';

const PostListings = () => {
  return (
    <div className="container mx-auto px-4">
      <header className="w-full">
        <h1 className="text-[2.2rem] md:text-[3.2rem] text-center mb-8 font-abril-fatface mt-20 leading-tight">Request a listing that you would like to have checked out for you</h1>
        <h2 className="text-[1.5rem] md:text-[2.5rem] font-semibold text-center mb-16 font-red-hat-display text-[#737373] leading-tight">One of our team members will view it within 5 business days</h2>
      </header>
      <div className="mb-4 w-full flex justify-center">
        <input
          type="text"
          placeholder="Please paste the link to the listing..."
          className="md:w-[45%] w-[80%] p-5 py-8 rounded-[50px] placeholder-gray-400 text-black border-none"
          style={{ boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.1)' }}
        />
      </div>
      <div className="flex justify-center w-full mt-5 mb-20">
        <button className="md:w-[30%] w-[60%] bg-[#47CAD2] text-white rounded-[50px] px-6 py-3 md:px-10 md:py-5 text-[1rem] md:text-[1rem] font-red-hat-display">Submit Request</button>
      </div>
    </div>
  );
};

export default PostListings;
