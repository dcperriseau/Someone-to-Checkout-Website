import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

import Heart from '../components/Heart';

const PersonalProfile = ({ setSelectedListing }) => {
  const [savedListings, setSavedListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '', profilePhoto: '' });
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchListings = async () => {
      if (!currentUser) return;

      try {
        const listings = [];
        const querySnapshot = await getDocs(collection(db, 'property_listings'));
        querySnapshot.forEach((doc) => {
          if (doc.data().userId === currentUser.uid) {
            listings.push(doc.data());
          }
        });
        setSavedListings(listings);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      }
    };

    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const orders = [];
        const querySnapshot = await getDocs(collection(db, 'orders'));
        querySnapshot.forEach((doc) => {
          if (doc.data().userId === currentUser.uid) {
            orders.push(doc.data());
          }
        });
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    if (currentUser) {
      fetchUserProfile();
      fetchListings();
      fetchOrders();
    }
  }, [currentUser]);

  const handleProfilePhotoUpload = async (e) => {
    if (!currentUser) return;

    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    await updateDoc(doc(db, 'users', currentUser.uid), {
      profilePhoto: photoURL
    });

    setUser((prevUser) => ({ ...prevUser, profilePhoto: photoURL }));
  };

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
            <label htmlFor="profile-photo-upload">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="object-cover w-full h-full rounded-full cursor-pointer"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-full cursor-pointer"></div>
              )}
              <input
                type="file"
                id="profile-photo-upload"
                className="hidden"
                onChange={handleProfilePhotoUpload}
              />
            </label>
          </div>
          <div className="flex flex-col items-start w-full mt-4 md:mt-0 md:ml-8 md:w-auto">
            <h1 className="text-3xl font-bold md:text-5xl text-textTeritary" style={{ fontSize: '46px' }}>
              {user.firstName} {user.lastName}
            </h1>
            {/* <p className="text-xl md:text-2xl text-textTeritary" style={{ fontSize: '16px' }}>Los Angeles, CA</p> */}
          </div>
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
                <span className="flex items-center space-x-2 text-textPrimary">
                  <Heart color="text-pinkHeartColor" size={20} className="ml-2" />
                </span>
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
