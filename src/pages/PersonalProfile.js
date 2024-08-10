import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heart from '../components/Heart';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext to get the user token

const PersonalProfile = ({ setSelectedListing }) => {
  const [savedListings, setSavedListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const { idToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
        });
        const data = await response.json();

        setUser(data.user || { firstName: '', lastName: '' });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings/getuserlistings', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        const data = await response.json();
        setSavedListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching user listings:', error);
        setSavedListings([]);
      }
    };
  
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/getorder', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setOrders([]);
      }
    };
  
    if (idToken) {
      fetchUserProfile();
      fetchListings();
      fetchOrders();
    }
  }, [idToken]);
  
  const getListingImage = (listing) => {
    if (listing.main_image_url) {
      return listing.main_image_url;
    } else if (listing.image_urls && listing.image_urls.length > 0) {
      return listing.image_urls[0];
    } else {
      return process.env.PUBLIC_URL + "/placeholder-image.png"; // Fallback placeholder image
    }
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    navigate('/propertydetails');
  };

  return (
    <div className="w-full overflow-hidden font-red-hat-display">
      <div className="relative w-full p-3 md:ml-4">
        <button className="absolute z-10 p-2 font-light text-gray-500 top-5 left-5" onClick={() => navigate('/')}>
          &lt;&nbsp;&nbsp;Back
        </button>
        <div className="flex flex-col items-start mt-12 md:flex-row md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Profile Picture Placeholder */}
          </div>
          {user && (
            <div className="flex flex-col items-start w-full mt-4 md:mt-0 md:ml-8 md:w-auto">
              <h1 className="text-3xl font-bold md:text-5xl text-textTeritary" style={{ fontSize: '46px' }}>
                {user.firstName} {user.lastName}
              </h1>
            </div>
          )}
        </div>
        <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:ml-4 md:space-x-2">
          <button className="flex items-center justify-center min-w-[160px] max-w-[200px] px-8 py-2 text-white bg-[#47CAD2] rounded-full">Request a Viewing</button>
          <button className="flex items-center justify-center min-w-[160px] max-w-[200px] px-8 py-2 text-textTeritary border border-black rounded-full">Edit Profile</button>
        </div>
      </div>
      <div className="w-full px-5 py-5 md:px-10">
        <h2 className="mb-5 text-2xl font-semibold text-textTeritary">Your Listings</h2>
        <div className="flex flex-wrap justify-start -mx-2">
          {savedListings.map((item, index) => (
            <div key={index} className="w-1/2 px-2 mb-5 md:w-1/3 lg:w-1/5">
              <button className="w-full focus:outline-none" onClick={() => handleListingClick(item)}>
                <img src={getListingImage(item)} alt={item.title} className="object-cover w-full h-48 mb-2 rounded-md md:h-64" />
              </button>
              <div className="flex items-center justify-between mb-1">
                <p className="text-lg font-thin text-textPrimary">{item.title}</p>
              </div>
              <p className="mb-1 font-thin text-textSecondary">
                {item.location.street_address}, {item.location.city}, {item.location.state_name}, {item.location.zip_code}
              </p>
              <p className="mb-1 text-xl font-bold text-textTeritary">${item.price}</p>
            </div>
          ))}
          {[...Array(5 - savedListings.length)].map((_, index) => (
            <div key={`placeholder-${index}`} className="invisible w-1/2 px-2 mb-5 md:w-1/3 lg:w-1/5">
              Placeholder
            </div>
          ))}
        </div>
        <h2 className="mt-10 mb-5 text-2xl font-semibold text-textTeritary">Orders</h2>
        <div className="flex flex-wrap justify-start -mx-2">
          {orders.map((order, index) => (
            <div key={index} className="w-full px-2 mb-5 md:w-1/2 lg:w-1/3">
              <div className="p-4 border rounded-md">
                <h3 className="mb-2 text-lg font-bold">Order ID: {order.id}</h3>
                <p className="mb-1">Total: {order.total}</p>
                <p className="mb-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                {/* Add other order details as needed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;
