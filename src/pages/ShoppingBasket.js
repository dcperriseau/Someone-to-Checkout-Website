import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Test Mode Publishable Key
const stripePromise = loadStripe('pk_test_51PKNI2GDWcOLiYf2jKY1gkCudeZCUSiPVQFMno0rYR7eZzdtbCWRaMKkKFcRKwRkR3x5vpciTQyAyvxswHauk70g00tOcFkqmP');

const ShoppingBasket = () => {
  const [items, setItems] = useState([]);
  const { idToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const response = await fetch('/api/cart/getCart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch basket items');
        }

        const data = await response.json();
        const formattedItems = data.items.map(item => ({
          id: item.id,
          name: item.title,
          image: item.main_image_url,
          address: `${item.location.street_address}, ${item.location.city}, ${item.location.state_code}`,
          time: item.selectedTime,
          price: 20
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error('Error fetching basket items:', error);
      }
    };

    if (idToken) {
      fetchBasketItems();
    }
  }, [idToken]);

  const handleDelete = async (listingId) => {
    if (!idToken) {
      console.error('User is not authenticated');
      return;
    }

    try {
      console.log('Deleting item with ID:', listingId);
      const response = await fetch('/api/cart/deletefromcart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete item from cart');
      }

      console.log('Item deleted successfully');
      const updatedItems = items.filter(item => item.id !== listingId);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (!idToken) {
      console.error('User is not authenticated');
      return;
    }

    const stripe = await stripePromise;
    console.log('in the handle checkout front end');

    const filteredItems = items.map(item => {
      const newItem = { ...item };
      if (newItem.sellerUid === undefined) {
        delete newItem.sellerUid;
      }
      if (newItem.sellerEmail === undefined) {
        delete newItem.sellerEmail;
      }
      return newItem;
    });

    const response = await fetch('/api/stripe/createcheckoutsession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ items: filteredItems }),
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
      // If the checkout process succeeds, navigate to the success page
      navigate('/success');
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col min-h-screen mx-auto md:flex-row">
        <div className="w-full md:w-[60%] p-4 md:p-10 md:pr-16">
          <button className="flex items-center text-slate-400 mb-4 mt-[-25px]">
            <span className="text-xl">&lt; </span> Back
          </button>
          <h1 className="mb-5 text-3xl font-bold">Items overview</h1>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 md:p-4 border border-gray-200 rounded-[25px] shadow-sm h-full">
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
                  <strong>${item.price}</strong>
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
                  <span>${item.price}</span>
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
