import React from 'react';

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-40px font-abril-fatface text-textPrimary text-center mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-4xl">
          <h2 className="text-20px font-abril-fatface font-bold text-gray-900 mb-4">Get in Touch with our Founder</h2>
          <form className="space-y-4">
            <input
              className="block w-full p-4 border border-gray-300 rounded-full text-base text-black"
              type="email"
              placeholder="Email: dylanwain@localviewers.com"
            />
            <input
              className="block w-full p-4 border border-gray-300 rounded-full text-base text-black"
              type="tel"
              placeholder="Call or Text: +1 (859) 519-8911"
            />
            <textarea
              className="block w-full p-4 border border-gray-300 rounded-lg text-base text-black"
              placeholder='Want more information or have a specific question? 
At "Someone to Check Out", we aim to make the renting process stress-free and easy by providing detailed reports on properties you are interested in. Reach out to us for more information or to request a viewing. Our founder and CEO, Dylan, would love to hear from you.'
              rows="5"
            ></textarea>
            <button
              className="block w-full p-4 bg-gray-900 text-white rounded-full text-base font-semibold"
              type="submit"
            >
              Click here to Request a Viewing
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
