import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const PostListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user

  const listings = [
    { heading: 'Tell us about your place', paragraph: "Share some basic info, like where it is and how many bedrooms and bathrooms it has." },
    { heading: 'Make it stand out', paragraph: "Add 5 or more photos plus a title and description—we’ll help you out." },
    { heading: 'Finish up details and post', paragraph: "Enter in more details and selling points for your property and post." },
  ];

  const handleGetStartedClick = () => {
    if (!user) {
      navigate('/signin'); // Redirect to sign-in page if not authenticated
    } else {
      navigate('/listingpage'); // Proceed to the listing page if authenticated
    }
  };

  return (
    <div className="flex flex-col w-full md:flex-row">
      <div className="flex items-center justify-center w-full md:w-2/5">
        <div className="relative w-full p-3 md:pl-5 md:py-3">
          <img
            src="/PostListingPhoto.jpeg"
            alt="Placeholder"
            className="object-cover w-full rounded-[8px] opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="font-abril-fatface text-center text-[1.8rem] md:text-[3rem]">
              It's easy to get started on<br />Someone to Check Out
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full px-10 py-5 md:w-3/5 md:p-28">
        {listings.map((item, index) => (
          <div
            key={index}
            className={`mb-5 font-red-hat-display relative ${index === 1 || index === 2 ? 'md:mt-10' : ''}`}
          >
            <span className='absolute left-0 ml-[-10px] md:ml-[-30px] text-[1.2rem] md:text-[2rem]'>{index + 1}</span>
            <div className="ml-5">
              <h2 className="text-[1.2rem] md:text-[2rem] mb-2 md:mb-3">{item.heading}</h2>
              <p className='text-[#737373] mb-8 md:mb-16 text-[0.9rem] md:text-[1.4rem]'>{item.paragraph}</p>
            </div>
            {index < listings.length - 1 && <hr className="my-2 border-t border-gray-300" />}
          </div>
        ))}
        <div className="flex justify-end pt-5">
          <button className="bg-[#47CAD2] text-white rounded-[50px] px-6 py-3 md:px-10 md:py-5 text-[1rem] md:text-[1.5rem] font-red-hat-display" onClick={handleGetStartedClick}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PostListings;
