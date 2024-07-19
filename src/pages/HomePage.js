import React, { useState } from 'react';

const HomePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState(new Array(9).fill(false));
  const [message, setMessage] = useState('');

  const toggleSaved = (index) => {
    const newSaved = [...saved];
    newSaved[index] = !newSaved[index];
    setSaved(newSaved);
    setMessage(newSaved[index] ? 'Added to Saved' : 'Removed from Saved');
    setTimeout(() => setMessage(''), 2000);
  };

  const images = [
    'propertyimage1.jpeg',
    'propertyimage2.jpeg',
    'propertyimage3.jpeg',
    'propertyimage4.jpeg',
    'propertyimage5.jpeg',
    'propertyimage6.jpeg',
    'propertyimage7.jpeg',
    'propertyimage8.jpeg',
    'propertyimage9.jpeg',
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <div className="absolute top-[15px] left-[10px] sm:left-[49px]" style={{ width: 'calc(100% - 20px)', maxWidth: '1430px' }}>
        <img src="/homePhoto.jpeg" alt="Background" className="w-full h-[200px] sm:h-[450px] object-cover opacity-15 mx-auto" />
      </div>

      <div className="relative w-full flex flex-col items-center bg-transparent">
        <div className="absolute top-[65px] w-full flex justify-center px-4 sm:px-0">
          <div className="flex flex-col items-center justify-center w-full max-w-xl h-[100px] bg-[#030303] rounded-[26px]">
            <div className="text-[#ffffff] text-xl sm:text-40px font-red-hat-display leading-10 sm:leading-52px text-center">
              Get a property checked out for you
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-[150px] sm:mt-[200px] space-y-10 sm:space-y-20 px-4">
          <div className="text-[#737373] text-base sm:text-32px font-red-hat-display font-bold leading-6 sm:leading-42px text-center px-4">
            We go and take photos, videos, and write a report of the properties you were <br className="hidden sm:block" />
            interested in moving to
          </div>
          <div className="flex flex-col sm:flex-row items-center mt-[50px] space-y-4 sm:space-y-0">
            <button className="cursor-pointer w-full sm:w-[428px] h-[62px] px-2 border-0 box-border rounded-full bg-[#000000] text-white text-lg font-red-hat-display font-medium leading-6 sm:mr-[150px]">
              Get Property Verified
            </button>
            <span className="text-[#737373] text-lg sm:text-32px font-red-hat-display font-bold leading-6 sm:leading-42px text-center sm:mx-[91px]">
              or
            </span>
            <button className="cursor-pointer w-full sm:w-[428px] h-[62px] px-2 border-0 box-border rounded-full bg-[#000000] text-white text-lg font-red-hat-display font-medium leading-6 sm:ml-[150px]">
              Browse Properties
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mt-10 px-4 sm:px-0">
        <div className="w-full border-t border-gray-300 my-4"></div>
        <div className="flex flex-col items-center sm:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full sm:w-auto px-4 py-2 bg-[#47cad2] text-white font-red-hat-display font-medium text-lg rounded-full">
            {showFilters ? 'Close Filters' : 'Filters'}
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-col items-center space-y-4 mt-4 sm:hidden">
            <div className="w-full flex flex-col items-center bg-white p-4 rounded-full shadow-md">
              <span className="font-bold">Where</span>
              <input className="outline-none text-gray-500" type="text" placeholder="Search cities" />
            </div>
            <div className="w-full flex flex-col items-center bg-white p-4 rounded-full shadow-md">
              <span className="font-bold">Bedroom</span>
              <input className="outline-none text-gray-500" type="text" placeholder="Add how many bedrooms" />
            </div>
            <div className="w-full flex flex-col items-center bg-white p-4 rounded-full shadow-md">
              <span className="font-bold">Bathrooms</span>
              <input className="outline-none text-gray-500" type="text" placeholder="Add how many bathrooms" />
            </div>
            <div className="w-full flex flex-col items-center bg-white p-4 rounded-full shadow-md">
              <span className="font-bold">Home Type</span>
              <input className="outline-none text-gray-500" type="text" placeholder="Specify type" />
            </div>
            <div className="w-full flex flex-col items-center bg-white p-4 rounded-full shadow-md">
              <span className="font-bold">Price</span>
              <input className="outline-none text-gray-500" type="text" placeholder="Add range" />
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-[#47cad2] text-white font-red-hat-display font-medium text-lg rounded-full mt-4">
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:flex items-center justify-between w-[1113px] h-[93px] p-4 bg-white rounded-full shadow-lg mt-10">
        <div className="flex flex-col items-center">
          <span className="font-bold">Where</span>
          <input className="outline-none text-gray-500 text-center" type="text" placeholder="Search cities" />
        </div>
        <div className="border-r border-gray-300 h-full"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Bedroom</span>
          <input className="outline-none text-gray-500 text-center" type="text" placeholder="Add bedrooms" />
        </div>
        <div className="border-r border-gray-300 h-full"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Bathrooms</span>
          <input className="outline-none text-gray-500 text-center" type="text" placeholder="Add bathrooms" />
        </div>
        <div className="border-r border-gray-300 h-full"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Home Type</span>
          <input className="outline-none text-gray-500 text-center" type="text" placeholder="Specify type" />
        </div>
        <div className="border-r border-gray-300 h-full"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Price</span>
          <input className="outline-none text-gray-500 text-center" type="text" placeholder="Add range" />
        </div>
        <div className="flex justify-center items-center ml-4">
          <svg className="text-[#47cad2] fill-current w-8 h-8" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
      </div>

      <div className="w-full mt-10 px-4 sm:px-0">
        <div className="w-full border-t border-gray-300 my-4"></div>
        {message && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-full z-50">
            {message}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative bg-cover bg-center h-48 w-full rounded-md" style={{ backgroundImage: `url(${image})` }}>
                <div className="absolute top-2 right-2 cursor-pointer" onClick={() => toggleSaved(index)}>
                  <svg
                    className={`w-8 h-8 ${saved[index] ? 'text-pink-500' : 'text-gray-700'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-2 w-full flex justify-between items-center">
                <div>
                  <div className="text-[#030303] text-16px font-red-hat-display leading-21px text-left">
                    Title
                  </div>
                  <div className="text-[#737373] text-16px font-red-hat-display leading-21px text-left">
                    City
                  </div>
                  <div className="text-[#212121] text-21px font-red-hat-display font-bold leading-27px text-left">
                    Price
                  </div>
                </div>
                <div className="cursor-pointer" onClick={() => toggleSaved(index)}>
                  <svg
                    className={`w-6 h-6 ${saved[index] ? 'text-pink-500' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
