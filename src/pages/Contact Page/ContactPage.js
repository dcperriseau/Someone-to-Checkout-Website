import React from 'react';

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-40px font-abril-fatface text-textPrimary text-center mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg p-8 mx-auto max-w-4xl" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.16)' }}>
          <h2 className="text-20px font-abril-fatface font-bold text-textPrimary mb-4">Get in Touch with our Founder</h2>
          <div className="space-y-4">
            <div className="block w-full p-4 border border-gray-300 rounded-full text-base text-black font-red-hat-display">
              Email: dylanwain@localviewers.com
            </div>
            <div className="block w-full p-4 border border-gray-300 rounded-full text-base text-black font-red-hat-display">
              Call or Text: +1 (859) 519-8911
            </div>
            <div className="block w-full p-4 border border-gray-300 rounded-lg">
              <div style={{ color: '#212121', fontSize: '20px', fontFamily: 'Abril Fatface', fontWeight: 700, lineHeight: '28px' }}>
                Our Information
              </div>
              <div style={{ color: '#030303', fontSize: '16px', fontFamily: 'Red Hat Display', lineHeight: '24px' }} className="mt-2">
                At "Someone to Check Out", we aim to make the renting process stress-free and easy by providing detailed reports on properties you're interested in. Reach out to us for more information or to request a viewing. Our founder and CEO, Dylan, would love to hear from you.
              </div>
            </div>
            <button
              className="block w-full p-4 bg-gray-900 text-white rounded-full text-base font-semibold font-red-hat-display"
              type="submit"
            >
              Click here to Request a Viewing
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
