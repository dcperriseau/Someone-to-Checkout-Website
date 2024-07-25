// BasketContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth for authentication state

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basketCount, setBasketCount] = useState(0);
  const { idToken } = useAuth();

  useEffect(() => {
    const fetchBasketCount = async () => {
      if (!idToken) return;
      // console.log('Fetching basket count...');
      try {
        const response = await fetch('/api/cart/getCart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch basket count');
        }

        const data = await response.json();
        setBasketCount(data.items.length); // Assuming the API returns an array of items
      } catch (error) {
        console.error('Error fetching basket count:', error);
      }
    };

    fetchBasketCount();
  }, [idToken]);

  return (
    <BasketContext.Provider value={{ basketCount, setBasketCount }}>
      {children}
    </BasketContext.Provider>
  );
};
