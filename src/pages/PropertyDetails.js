import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useBasket } from '../context/BasketContext'; // Import the useBasket hook
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import Heart from '../components/Heart';
import Icon from '../components/ThreeDots';
import BackButton from '../components/BackButton';
import SlideshowModal from '../components/SlideshowModal';
import DetailsModal from '../components/DetailsModel';
import EmailModal from '../components/EmailModal';

const PropertyDetails = ({ selectedListing }) => {
  const [isHearted, setIsHearted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null); // State for selected available time
  const [persistedListing, setPersistedListing] = useState(selectedListing);

  const { idToken } = useAuth(); // Access the idToken from AuthContext
  const { setBasketCount } = useBasket(); // Access the setBasketCount from BasketContext
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Retrieve the persisted listing from local storage if it exists
    const savedListing = JSON.parse(localStorage.getItem('selectedListing'));
    if (savedListing) {
      setPersistedListing(savedListing);
    }
  }, []);

  useEffect(() => {
    // Save the selected listing to local storage when it changes
    if (persistedListing) {
      localStorage.setItem('selectedListing', JSON.stringify(persistedListing));
    }
  }, [persistedListing]);

  const handleSendToCheckout = async () => {
    if (!idToken) {
      console.error('User is not authenticated');
      localStorage.setItem('selectedListing', JSON.stringify(persistedListing)); // Save the selected listing
      localStorage.setItem('previousPage', window.location.pathname); // Save current page URL
      navigate('/signin'); // Redirect to sign-in page if not authenticated
      return;
    }
    console.log('Selected time:', selectedTime);
    if (!selectedTime || !selectedTime.trim() || selectedTime.toLowerCase().includes('none')) {
      alert('Please select a valid available time before proceeding.');
      return;
    }

    try {
      // Check if the listing is already in the user's basket
      const basketResponse = await fetch('/api/cart/getCart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!basketResponse.ok) {
        throw new Error('Failed to fetch basket items');
      }

      const basketData = await basketResponse.json();
      console.log('Basket Data:', basketData); // Log the basket data to understand its structure

      const isItemInBasket = basketData.items.some(
        item => item.propertyListing && item.propertyListing.id === persistedListing.id
      );
      console.log('Is item in basket:', isItemInBasket);
      if (isItemInBasket) {
        alert('This item is already in your basket.');
        return;
      }

      const response = await fetch('/api/cart/postToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          propertyListing: {
            ...persistedListing,
            selectedTime,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send listing to cart');
      }

      const result = await response.json();
      console.log('Listing added to cart:', result);
      console.log('idToken:', idToken);
      if (result.message === 'Item already in cart') {
        alert('This item is already in your basket.');
        return;
      }

      // Fetch the updated basket count
      fetchBasketCount();
    } catch (error) {
      console.error('Error adding listing to cart:', error);
      localStorage.setItem('selectedListing', JSON.stringify(persistedListing)); // Save the selected listing
      localStorage.setItem('previousPage', window.location.pathname); // Save current page URL
      navigate('/signin'); // Redirect to sign-in page if the operation fails
    }
  };

  const fetchBasketCount = async () => {
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
      console.log('Basket count response data:', data); // Log the data for debugging

      if (data.items && Array.isArray(data.items)) {
        setBasketCount(data.items.length); // Assuming the API returns an array of items
      } else {
        console.warn('Basket count data is not in expected format', data);
        setBasketCount(0); // Set to 0 if items array is missing or not an array
      }
    } catch (error) {
      console.error('Error fetching basket count:', error);
      setBasketCount(0); // Set to 0 in case of error
    }
  };

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState(''); // State for full name
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (persistedListing && persistedListing.userId) {
        const userDoc = await getDoc(doc(db, 'users', persistedListing.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email || 'No email available');
          const name = userData.username || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
          setFullName(name || 'No name available');
        } else {
          setEmail('No email available');
          setFullName('No name available');
        }
      }
    };
    fetchUserDetails();
  }, [persistedListing]);

  if (!persistedListing) {
    return <div>No listing selected</div>;
  }

  const {
    title,
    price,
    description,
    main_image_url,
    image_urls = [], // Ensure image_urls is defined
    location = {}, // Ensure location is defined
    bathroom_count,
    bedroom_count,
    available_times = {}, // Ensure available_times is defined
    date_created,
    last_updated,
  } = persistedListing;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsSlideshowOpen(true);
  };

  const toggleHeart = () => {
    setIsHearted(!isHearted);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeSlideshow = () => {
    setIsSlideshowOpen(false);
  };

  const renderAvailableTimes = () => {
    return Object.entries(available_times).map(([day, time]) => {
      if (typeof time === 'string' && time.trim()) {
        return (
          <li key={day} className="text-xs md:text-sm">
            <label>
              <input
                type="radio"
                name="availableTime"
                value={`${day}: ${time}`}
                checked={selectedTime === `${day}: ${time}`}
                onChange={() => setSelectedTime(`${day}: ${time}`)}
              />
              {day.charAt(0).toUpperCase() + day.slice(1)}: {time}
            </label>
          </li>
        );
      } else if (Array.isArray(time)) {
        return (
          <li key={day} className="text-xs md:text-sm">
            {day.charAt(0).toUpperCase() + day.slice(1)}:
            <ul>
              {time.map((slot, index) => (
                slot.start.trim() && slot.end.trim() && (
                  <li key={index}>
                    <label>
                      <input
                        type="radio"
                        name="availableTime"
                        value={`${day}: ${slot.start} - ${slot.end}`}
                        checked={selectedTime === `${day}: ${slot.start} - ${slot.end}`}
                        onChange={() => setSelectedTime(`${day}: ${slot.start} - ${slot.end}`)}
                      />
                      {slot.start} - {slot.end}
                    </label>
                  </li>
                )
              ))}
            </ul>
          </li>
        );
      }
      return null;
    });
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const descriptionPreviewLength = 300; // Characters to show in the preview
  // If there is no main_image_url, use the first image from image_urls array as the main image
  const displayedMainImage = main_image_url || (image_urls.length > 0 ? image_urls[0] : '');
  const remainingImages = main_image_url ? image_urls : image_urls.slice(1);
  console.log(displayedMainImage);
  return (
    <div className="w-full px-6 pb-4 font-red-hat-display">
      <div className="mt-2">
        <BackButton />
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-2 md:space-x-[20px] pt-8">
        <div className="flex h-[250px] sm:h-[300px] md:h-[400px] flex-initial">
          <div className="flex flex-col h-full space-y-2">
            {remainingImages.slice(0, 3).map((image, index) => (
              <button key={index} onClick={() => handleImageClick(index + 1)} className="rounded-md h-[calc(33.3333%-8px)]">
                <img src={image} alt={`${index + 2}`} className="object-cover w-full h-full rounded-2xl" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 ml-2 sm:ml-3 md:ml-4">
            <button onClick={() => handleImageClick(0)} className="w-full h-full rounded-2xl">
              <img src={displayedMainImage} alt="Main property" className="flex-1 object-cover w-full h-full rounded-2xl" />
              <button
                onClick={toggleHeart}
                className="absolute flex items-center justify-center w-12 h-12 text-gray-400 bg-gray-200 rounded-full top-2 right-2"
              >
                <Heart color={isHearted ? "text-pink-500" : "text-gray-400"} size={18} />
              </button>
            </button>
          </div>
        </div>
        <div className="flex-col flex-initial w-full md:flex-1">
          <div className="flex flex-col items-center justify-between md:flex-row md:space-x-4">
            <div className="flex justify-between">
              <h1 className="mr-3 text-2xl font-bold md:text-3xl">{title}</h1>
              <div className="flex items-center justify-center w-32 md:w-48 h-10 md:h-12 px-2 text-xl md:text-2xl font-bold text-[#47cad2] bg-[#ebf9fa] rounded-full">
                ${price}
              </div>
            </div>
            <button onClick={openModal} className="ml-auto">
              <Icon />
            </button>
          </div>
          <div className="flex flex-col mt-4 md:flex-row">
            <div className="flex flex-col flex-1">
              <div className="flex items-center">
                <img src={displayedMainImage} alt={fullName} className="w-8 h-8 rounded-full md:w-10 md:h-10" />
                <div className="ml-2">
                  <p className="font-semibold">{fullName}</p>
                  <p className="text-xs text-gray-500 md:text-sm">Listed on: {new Date(date_created).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 md:text-sm">Updated on: {new Date(last_updated).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 md:text-base">
                {isDescriptionExpanded ? description : `${description.slice(0, descriptionPreviewLength)}...`}
                {description.length > descriptionPreviewLength && (
                  <button
                    onClick={toggleDescription}
                    className="ml-2 text-blue-500"
                  >
                    {isDescriptionExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4 md:flex-row">
            <div className="flex flex-col flex-1">
              <button className="mb-4 px-2 w-full md:w-[172px] h-8 md:h-[28px] bg-gray-200 text-black text-xs md:text-sm font-medium rounded-full flex items-center justify-center" onClick={openModal}>
                Message Seller
              </button>
              <div className="mt-4 md:-scroll-mt-3.5">
                <h2 className="text-sm font-semibold md:text-base">Available Times</h2>
                <ul className="mt-2 text-xs list-none md:text-sm">
                  {renderAvailableTimes()}
                </ul>
              </div>
              <button 
                onClick={handleSendToCheckout} 
                className="py-2 px-2 mt-4 md:mt-[27px] w-full md:w-[292px] h-12 md:h-[48px] bg-[#212121] text-white text-base md:text-lg font-medium rounded-full"
              >
                Send Someone to Check out
              </button>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-base font-semibold md:text-xl">Unit Details</h2>
              <ul className="mt-4">
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>Bedrooms: {bedroom_count}</span>
                </li>
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>Bathrooms: {bathroom_count}</span>
                </li>
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>Address: {location.address}, {location.city}, {location.state} {location.zipCode}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <DetailsModal isOpen={isModalOpen} onClose={closeModal} />
      <SlideshowModal isOpen={isSlideshowOpen} onClose={closeSlideshow} images={image_urls} currentIndex={currentImageIndex} />
      <EmailModal isOpen={isModalOpen} onClose={closeModal} email={email} />
    </div>
  );
};

export default PropertyDetails;
