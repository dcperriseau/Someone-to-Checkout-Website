import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, getFirestore } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

const HomePage = ({ setSelectedListing }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState(new Array(9).fill(false));
  const [message, setMessage] = useState('');
  const [listings, setListings] = useState([]);

  const navigate = useNavigate();
  

  const toggleSaved = (index) => {
    const newSaved = [...saved];
    newSaved[index] = !newSaved[index];
    setSaved(newSaved);
    setMessage(newSaved[index] ? 'Added to Saved' : 'Removed from Saved');
    setTimeout(() => setMessage(''), 2000);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Ensure db is initialized correctly
        const listingsCollection = collection(db, 'property_listings'); // Correct usage of collection
        const listingsQuery = query(listingsCollection, orderBy('date_created', 'desc'));
        const querySnapshot = await getDocs(listingsQuery);
        const fetchedListings = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            date_created: data.date_created?.toDate ? data.date_created.toDate() : data.date_created,
            last_updated: data.last_updated?.toDate ? data.last_updated.toDate() : data.last_updated,
          };
        });
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const testFirestore = async () => {
      try {
        console.log('db type:', typeof db);
        const testCollection = await getDocs(collection(db, 'property_listings'));
        testCollection.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
        });
      } catch (error) {
        console.error('Test fetch error:', error);
      }
    };
  
    testFirestore();
  }, []);

  console.log('db instance:', db);


  const handleImageClick = (listing) => {
    setSelectedListing(listing);
    localStorage.setItem('selectedListing', JSON.stringify(listing));
    navigate('/propertydetails');
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen">
      <div className="absolute top-[15px] left-[10px] sm:left-[49px]" style={{ width: 'calc(100% - 20px)', maxWidth: '1430px' }}>
        <img src="/homePhoto.jpeg" alt="Background" className="w-full h-[200px] sm:h-[450px] object-cover opacity-85 mx-auto" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-base sm:text-32px font-red-hat-display font-bold leading-6 sm:leading-42px text-center px-4">
            We visit properties and take photos, videos, and write a report of the <br className="hidden sm:block" />
            properties you are interested in moving to
          </div>
        </div>
      </div>

      <div className="w-full mt-[220px] sm:mt-[500px] px-4 sm:px-0">
        <div className="w-full my-2 border-t border-gray-300"></div>
        <div className="flex flex-col items-center sm:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full sm:w-auto px-4 py-2 bg-[#47cad2] text-white font-red-hat-display font-medium text-lg rounded-full">
            {showFilters ? 'Close Filters' : 'Filters'}
          </button>
        </div>
        {showFilters && (
          <div className="flex flex-col items-center mt-4 space-y-4 sm:hidden">
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-full shadow-md">
              <span className="font-bold">Where</span>
              <input className="text-gray-500 outline-none" type="text" placeholder="Search cities" />
            </div>
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-full shadow-md">
              <span className="font-bold">Bedroom</span>
              <input className="text-gray-500 outline-none" type="text" placeholder="Add how many bedrooms" />
            </div>
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-full shadow-md">
              <span className="font-bold">Bathrooms</span>
              <input className="text-gray-500 outline-none" type="text" placeholder="Add how many bathrooms" />
            </div>
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-full shadow-md">
              <span className="font-bold">Home Type</span>
              <input className="text-gray-500 outline-none" type="text" placeholder="Specify type" />
            </div>
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-full shadow-md">
              <span className="font-bold">Price</span>
              <input className="text-gray-500 outline-none" type="text" placeholder="Add range" />
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
          <input className="text-center text-gray-500 outline-none" type="text" placeholder="Search cities" />
        </div>
        <div className="h-full border-r border-gray-300"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Bedroom</span>
          <input className="text-center text-gray-500 outline-none" type="text" placeholder="Add bedrooms" />
        </div>
        <div className="h-full border-r border-gray-300"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Bathrooms</span>
          <input className="text-center text-gray-500 outline-none" type="text" placeholder="Add bathrooms" />
        </div>
        <div className="h-full border-r border-gray-300"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Home Type</span>
          <input className="text-center text-gray-500 outline-none" type="text" placeholder="Specify type" />
        </div>
        <div className="h-full border-r border-gray-300"></div>
        <div className="flex flex-col items-center">
          <span className="font-bold">Price</span>
          <input className="text-center text-gray-500 outline-none" type="text" placeholder="Add range" />
        </div>
        <div className="flex items-center justify-center ml-4">
          <svg className="text-[#47cad2] fill-current w-8 h-8" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
      </div>

      <div className="w-full px-4 mt-6 sm:px-0">
        <div className="w-full my-4 border-t border-gray-300"></div>
        {message && (
          <div className="fixed z-50 px-4 py-2 text-white transform -translate-x-1/2 bg-gray-700 rounded-full top-10 left-1/2">
            {message}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-10">
          {listings.map((listing, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="relative w-full h-48 bg-center bg-cover rounded-md"
                style={{ backgroundImage: `url(${listing.main_image_url || (listing.image_urls.length > 0 ? listing.image_urls[0] : '/defaultImage.jpg')})` }}
                onClick={() => handleImageClick(listing, index)}
              >
                <div className="absolute cursor-pointer top-2 right-2" onClick={() => toggleSaved(index)}>
                  <svg
                    className={`w-8 h-8 ${saved[index] ? 'text-pink-500' : 'text-gray-700'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                <div>
                  <div className="text-[#030303] text-16px font-red-hat-display leading-21px text-left">
                    {listing.title}
                  </div>
                  <div className="text-[#737373] text-16px font-red-hat-display leading-21px text-left">
                    {listing.location.city}
                  </div>
                  <div className="text-[#212121] text-21px font-red-hat-display font-bold leading-27px text-left">
                    ${listing.price}
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

