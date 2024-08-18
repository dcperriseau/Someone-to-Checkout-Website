import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';
import { useBasket } from '../context/BasketContext.js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51PKNI2GDWcOLiYf2JXRspBmODIUpsTVcRez14ZzJy0sJYHqU78eLYybiZmClaQXea0tRlfiP99HRCJy9xzy7YcDQ00LGExfvhF');

const ShoppingBasket = () => {
  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuth();
  const { idToken } = useAuth();
  const { setBasketCount } = useBasket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      if (!user) {
        return;
      }

      try {
        const basketItems = [];
        const querySnapshot = await getDocs(collection(db, 'user_baskets', user.uid, 'items'));
        querySnapshot.forEach((doc) => {
          basketItems.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const formattedItems = basketItems.map(item => ({
          id: item.id,
          name: item.propertyListing.title,
          image: item.propertyListing.main_image_url || (item.propertyListing.image_urls && item.propertyListing.image_urls[0]) || '',
          address: `${item.propertyListing.location.street_address}, ${item.propertyListing.location.city}, ${item.propertyListing.location.state_name}`,
          time: item.propertyListing.selectedTime,
          price: 3000, // Price in cents
        }));
        setItems(formattedItems);
        setBasketCount(formattedItems.length);
      } catch (error) {
        console.error('Error fetching basket items:', error);
      }
    };

    fetchBasketItems();
  }, [user, setBasketCount]);

  const handleDelete = async (listingId) => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    try {
      console.log('Deleting item with ID:', listingId);
      await deleteDoc(doc(db, 'user_baskets', user.uid, 'items', listingId));

      console.log('Item deleted successfully');
      const updatedItems = items.filter(item => item.id !== listingId);
      setItems(updatedItems);
      setBasketCount(updatedItems.length);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const stripe = await stripePromise;

    try {
      const response = await fetch('/api/stripe/createcheckoutsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to create checkout session:', error.error);
        return;
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handleItemClick = (title) => {
    navigate(`/property-details/${encodeURIComponent(title)}`);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price / 100, 0); // Convert price back to dollars
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col min-h-screen mx-auto md:flex-row">
        {showPopup && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
            Property removed from basket
          </div>
        )}
        <div className="w-full md:w-[60%] p-4 md:p-10 md:pr-16">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 mb-4 mt-[-25px]">
            <span className="text-xl">&lt; </span> Back
          </button>
          <h1 className="mb-5 text-3xl font-bold">Items overview</h1>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-2 md:p-4 border border-gray-200 rounded-[25px] shadow-sm h-full cursor-pointer"
                onClick={() => handleItemClick(item.name)}
              >
                <div className="flex items-start min-h-[7rem]">
                  <img src={item.image} alt={item.name} className="mr-3 md:mr-4 w-[148px] h-[112px] rounded-2xl" />
                  <div>
                    <h2 className="mb-2 text-lg font-semibold md:text-xl">{item.name}</h2>
                    {item.address && <p className="mb-2 text-sm text-gray-600 md:text-base md:mb-0">Address: {item.address}</p>}
                    {item.time && <p className="mb-2 text-sm text-gray-600 md:text-base md:mb-0">Available Time: {item.time}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-24 mx-2 md:mx-0">
                  <div className="flex items-center md:mr-0">
                    <img src='/ellipses-icon.png' alt="Ellipses" className="mr-2 cursor-pointer" style={{ width: '14px', height: '14px' }} />
                    <img 
                      src='/trash-icon.png' 
                      alt="Trash" 
                      className="cursor-pointer" 
                      style={{ width: '16px', height: '16px' }} 
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                  <strong>${item.price / 100}</strong> {/* Convert price back to dollars */}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-gray-200 rounded-[25px] shadow-sm mt-4 pb-10 px-5">
            <h2 className="mt-1 mb-4 text-lg font-semibold md:text-xl">Have a specific request for your Viewer?</h2>
            <p className="mb-2 text-gray-600">Your Request</p>
            <textarea className="w-full p-2 border border-gray-200 rounded-[6px] min-h-[10rem] text-start align-top" />
          </div>
        </div>

        <div className="w-full md:w-[40%] bg-[#F9F9F9] flex flex-col min-h-screen p-4 md:p-10 md:pl-16">
          <div className="mb-4">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>
            <div className="mb-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between my-3">
                  <span>{item.name}</span>
                  <span>${item.price / 100}</span> {/* Convert price back to dollars */}
                </div>
              ))}
            </div>
            <hr className="mt-10 mb-1" />
            <div className="flex justify-between mb-4 text-lg font-semibold">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          <button 
            className="font-bold w-full bg-[#47CAD2] text-white rounded-[50px] px-6 py-3 text-[1.2rem] font-red-hat-display"
            onClick={handleCheckout}
          >
            Confirm Booking and Pay
          </button>
        </div>
      </div>
    </Elements>
  );
};

export default ShoppingBasket;
