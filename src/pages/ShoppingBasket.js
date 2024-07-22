import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Test Mode Publishable Key
const stripePromise = loadStripe('pk_test_51PKNI2GDWcOLiYf2jKY1gkCudeZCUSiPVQFMno0rYR7eZzdtbCWRaMKkKFcRKwRkR3x5vpciTQyAyvxswHauk70g00tOcFkqmP');

const ShoppingBasket = () => {
  const items = [
    {
      name: "Condo for rent",
      image: '/shoppingbasket1.png',
      address: "123 Main St, Santa Monica",
      time: "Sunday 12:30 - 2:00",
      price: 20
    },
    {
      name: "Apartment for rent",
      image: '/shoppingbasket2.png',
      address: "456 Elm St, Los Angeles",
      time: "Monday 1:00 - 3:00",
      price: 20
    },
    {
      name: "Request for specific Listing",
      image: '/shoppingbasket3.png',
      link: "https://zillow.com",
      price: 20
    }
  ];

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    console.log('in the handle checkout front end')
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create checkout session:', error.error);
      return;
    }

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col md:flex-row mx-auto min-h-screen">
        <div className="w-full md:w-[60%] p-4 md:p-10 md:pr-16">
          <button className="flex items-center text-slate-400 mb-4 mt-[-25px]">
            <span className="text-xl">&lt; </span> Back
          </button>
          <h1 className="text-3xl font-bold mb-5">Items overview</h1>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 md:p-4 border border-gray-200 rounded-[25px] shadow-sm h-full">
                <div className="flex items-start min-h-[7rem]">
                  <img src={item.image} alt={item.name} className="mr-3 md:mr-4" />
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2">{item.name}</h2>
                    {item.address && <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-0">Address: {item.address}</p>}
                    {item.time && <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-0">Available Time: {item.time}</p>}
                    {item.link && <p className="text-sm md:text-base text-gray-600">Listing Link: <a href={item.link} className="text-blue-600" target="_blank" rel="noopener noreferrer">{item.link}</a></p>}
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end h-24 mx-2 md:mx-0">
                  <div className="flex items-center md:mr-0">
                    <img src='/ellipses-icon.png' alt="Ellipses" className="mr-2 cursor-pointer" />
                    <img src='/trash-icon.png' alt="Trash" className="cursor-pointer" />
                  </div>
                  <strong>${item.price}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-gray-200 rounded-[25px] shadow-sm mt-4 pb-10 px-5">
            <h2 className="md:text-xl text-lg font-semibold mb-4 mt-1">Have a specific request for your Viewer?</h2>
            <p className="text-gray-600 mb-2">Your Request</p>
            <textarea className="w-full p-2 border border-gray-200 rounded-[6px] min-h-[10rem] text-start align-top" />
          </div>
        </div>

        <div className="w-full md:w-[40%] bg-[#F9F9F9] flex flex-col min-h-screen p-4 md:p-10 md:pl-16">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="mb-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between my-3">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
            <hr className="mt-10 mb-1" />
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>$60</span>
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