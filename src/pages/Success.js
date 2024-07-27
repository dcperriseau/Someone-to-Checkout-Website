import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Success = () => {
  const { idToken, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idToken) {
      const deleteItemsFromCart = async () => {
        console.log('Deleting items from cart after successful checkout');
        try {
          const response = await fetch('/api/cart/deleteAllFromCart', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete items from cart');
          }

          console.log('Items deleted from cart after successful checkout');
        } catch (error) {
          console.error('Error deleting items from cart after checkout:', error);
        } finally {
          setLoading(false);
        }
      };

      deleteItemsFromCart();
    } else if (currentUser === null) {
      navigate('/signin');
    }
  }, [idToken, currentUser, navigate]);

  if (loading || !idToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Processing...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Checkout Successful!</h1>
      <p className="mt-4 text-lg">Thank you for your purchase.</p>
      <button
        className="px-4 py-2 mt-6 text-white bg-blue-500 rounded"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Success;
