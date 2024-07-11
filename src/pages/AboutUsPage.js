import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="p-8 relative"> {/* Ensure the container is relatively positioned */}
      <div className="absolute top-[121px] left-[756px] w-[209px] h-[251px]">
        <svg className="text-bubbleIconColor fill-current w-full h-full" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path d="M7.2 11.2a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 1 0 0-6.4zM14.8 16a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM15.2 4a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 1 0 0-9.6z"></path>
        </svg>
      </div>
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="md:w-2/3 md:pr-8">
          <div className="text-gray-700 text-16px font-red-hat-display leading-22px mb-4">
            ABOUT US
          </div>
          <div className="text-gray-900 text-24px font-red-hat-display font-bold leading-31px mb-4">
            Find your dream property without the hassle. Let us verify the properties in person, ensuring what you see online matches reality.
          </div>
          <div className="text-gray-700 text-18px font-red-hat-display leading-23px mb-4">
            At 'Someone to Check Out,' we believe finding your dream property should be a stress-free and exciting journey. Our innovative platform allows you to browse and select properties that pique your interest, while our trusted gig workers visit these locations to verify their authenticity. Say goodbye to misleading photos and potential scams—our dedicated team ensures that what you see online is exactly what you'll find in person. With 'Someone to Check Out,' you can move forward with confidence, knowing your future place has been thoroughly vetted for you.
          </div>
          <div className="flex justify-center md:justify-start mb-4">
            <svg className="text-bubbleIconColor fill-current w-52 h-64" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7.2 11.2a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 1 0 0-6.4zM14.8 16a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM15.2 4a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 1 0 0-9.6z"></path>
            </svg>
          </div>
          <div className="flex justify-center md:justify-start mt-4">
            <button className="cursor-pointer px-8 py-3 border-0 box-border rounded-full bg-twitterIcon text-white text-lg font-red-hat-display font-medium leading-6">
              Sign Up
            </button>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end mt-8 md:mt-0">
          <img
            src='/AboutUsPic.jpeg'
            alt="Placeholder"
            className="object-cover w-[400px] h-[485px] rounded-[8px] shadow-custom-light"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
