import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBasket } from "../context/BasketContext";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

import Heart from "../components/Heart";
import Icon from "../components/ThreeDots";
import BackButton from "../components/BackButton";
import SlideshowModal from "../components/SlideshowModal";
import DetailsModal from "../components/DetailsModel";
import EmailModal from "../components/EmailModal";

// Utility function to detect iOS Safari
const isIosSafari = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return (
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    (/Safari/.test(userAgent) &&
      !/Chrome/.test(userAgent) &&
      !/CriOS/.test(userAgent))
  );
};

const PropertyDetails = ({ selectedListing }) => {
  const [isHearted, setIsHearted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [persistedListing, setPersistedListing] = useState(selectedListing);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  const { user, idToken } = useAuth();
  const { setBasketCount } = useBasket();
  const navigate = useNavigate();

  useEffect(() => {
    // Set the isSafari state once on component mount
    setIsSafari(isIosSafari());

    const savedListing = JSON.parse(localStorage.getItem("selectedListing"));
    if (savedListing) {
      setPersistedListing(savedListing);
    }
  }, []);

  useEffect(() => {
    if (persistedListing) {
      localStorage.setItem("selectedListing", JSON.stringify(persistedListing));
    }
  }, [persistedListing]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (persistedListing && persistedListing.userId) {
        const userDoc = await getDoc(doc(db, "users", persistedListing.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email || "No email available");
          const name =
            userData.username ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
          setFullName(name || "No name available");
        } else {
          setEmail("No email available");
          setFullName("No name available");
        }
      }
    };
    fetchUserDetails();
  }, [persistedListing]);

  const handleSendToCheckout = async () => {
    try {
      if (!persistedListing.title) {
        throw new Error("Persisted listing title is not defined.");
      }

      if (!user) {
        console.error("User is not authenticated");
        localStorage.setItem(
          "selectedListing",
          JSON.stringify(persistedListing)
        );
        localStorage.setItem("previousPage", window.location.pathname);
        navigate("/signin");
        return;
      }

      if (
        !selectedTime ||
        !selectedTime.trim() ||
        selectedTime.toLowerCase().includes("none")
      ) {
        alert("Please select a valid available time before proceeding.");
        return;
      }

      const basketQuery = query(
        collection(db, "user_baskets", user.uid, "items"),
        where("propertyListing.title", "==", persistedListing.title)
      );

      const basketSnapshot = await getDocs(basketQuery);
      const isItemInBasket = !basketSnapshot.empty;

      if (isItemInBasket) {
        alert("This item is already in your basket.");
        return;
      }

      const newItemRef = doc(collection(db, "user_baskets", user.uid, "items"));
      await setDoc(newItemRef, {
        propertyListing: {
          ...persistedListing,
          selectedTime,
        },
      });

      fetchBasketCount();

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding listing to cart:", error);
      localStorage.setItem("selectedListing", JSON.stringify(persistedListing));
      localStorage.setItem("previousPage", window.location.pathname);
      navigate("/signin");
    }
  };

  const fetchBasketCount = async () => {
    if (!user) {
      setBasketCount(0);
      return;
    }

    try {
      const basketSnapshot = await getDocs(
        collection(db, "user_baskets", user.uid, "items")
      );
      setBasketCount(basketSnapshot.size);
    } catch (error) {
      console.error("Error fetching basket count:", error);
      setBasketCount(0);
    }
  };

  if (!persistedListing) {
    return <div>No listing selected</div>;
  }

  const {
    title,
    price,
    description,
    main_image_url,
    image_urls = [],
    location = {},
    bathroom_count,
    bedroom_count,
    available_times = {},
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
      if (typeof time === "string" && time.trim()) {
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
              {time.map(
                (slot, index) =>
                  slot.start.trim() &&
                  slot.end.trim() && (
                    <li key={index}>
                      <label>
                        <input
                          type="radio"
                          name="availableTime"
                          value={`${day}: ${slot.start} - ${slot.end}`}
                          checked={
                            selectedTime ===
                            `${day}: ${slot.start} - ${slot.end}`
                          }
                          onChange={() =>
                            setSelectedTime(
                              `${day}: ${slot.start} - ${slot.end}`
                            )
                          }
                        />
                        {slot.start} - {slot.end}
                      </label>
                    </li>
                  )
              )}
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

  const descriptionPreviewLength = 300;
  const displayedMainImage =
    main_image_url || (image_urls.length > 0 ? image_urls[0] : "");
  const remainingImages = main_image_url ? image_urls : image_urls.slice(1);

  return (
    <div className="w-full px-6 pb-4 font-red-hat-display">
      {showPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded">
          Property added to cart
        </div>
      )}
      <div className="mt-2">
        <BackButton onClick={() => navigate(-1)} />
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-[20px] pt-8">
        {/* Image Container */}
        <div
          className={`flex h-[250px] sm:h-[300px] md:h-[400px] md:flex-[0_0_auto] ${isSafari ? "ios-flex-1" : ""}`}
          style={{ width: isSafari ? "80%" : "auto" }}
        >
          <div
            className={`flex flex-col h-full space-y-2 ${isSafari ? "ios-flex-col" : ""}`}
          >
            {remainingImages.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index + 1)}
                className={`rounded-md h-[calc(33.3333%-8px)] ${isSafari ? "ios-rounded-md" : ""}`}
                style={{ width: isSafari ? "80%" : "100%" }} // styling
              >
                <img
                  src={image}
                  alt={`${index + 2}`}
                  className={`object-cover w-full h-full rounded-2xl ${isSafari ? "ios-object-cover ios-rounded-2xl" : ""}`}
                  style={{ width: isSafari ? "80%" : "100%" }} // styling
                />
              </button>
            ))}
          </div>
          <div
            className={`relative flex-1 ml-2 sm:ml-3 md:ml-4 ${isSafari ? "ios-flex-1" : ""}`}
          >
            <button
              onClick={() => handleImageClick(0)}
              className={`w-full h-full rounded-2xl ${isSafari ? "ios-rounded-2xl" : ""}`}
            >
              <img
                src={displayedMainImage}
                alt="Main property"
                className={`flex-1 object-cover w-full h-full rounded-2xl ${isSafari ? "ios-flex-1 ios-object-cover ios-rounded-2xl" : ""}`}
                style={{ width: isSafari ? "80%" : "100%" }} // styling
              />
              <button
                onClick={toggleHeart}
                className="absolute flex items-center justify-center w-12 h-12 text-gray-400 bg-gray-200 rounded-full top-2 right-2"
              >
                <Heart
                  color={isHearted ? "text-pink-500" : "text-gray-400"}
                  size={18}
                />
              </button>
            </button>
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col flex-1">
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
                <img
                  src={displayedMainImage}
                  alt={fullName}
                  className="w-8 h-8 rounded-full md:w-10 md:h-10"
                />
                <div className="ml-2">
                  <p className="font-semibold">{fullName}</p>
                  <p className="text-xs text-gray-500 md:text-sm">
                    Listed on:{" "}
                    {date_created
                      ? new Date(date_created).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                  <p className="text-xs text-gray-500 md:text-sm">
                    Updated on:{" "}
                    {last_updated
                      ? new Date(last_updated).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 md:text-base">
                {isDescriptionExpanded
                  ? description
                  : `${description.slice(0, descriptionPreviewLength)}...`}
                {description.length > descriptionPreviewLength && (
                  <button
                    onClick={toggleDescription}
                    className="ml-2 text-blue-500"
                  >
                    {isDescriptionExpanded ? "See less" : "See more"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4 md:flex-row">
            <div className="flex flex-col flex-1">
              <button
                className="mb-4 px-2 w-full md:w-[172px] h-8 md:h-[28px] bg-gray-200 text-black text-xs md:text-sm font-medium rounded-full flex items-center justify-center"
                onClick={openModal}
              >
                Message Seller
              </button>
              <div className="mt-4 md:-scroll-mt-3.5">
                <h2 className="text-sm font-semibold md:text-base">
                  Available Times
                </h2>
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
              <h2 className="text-base font-semibold md:text-xl">
                Unit Details
              </h2>
              <ul className="mt-4">
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>Bedrooms: {bedroom_count}</span>
                </li>
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>Bathrooms: {bathroom_count}</span>
                </li>
                <li className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                  <span>
                    Address: {location.address}, {location.city},{" "}
                    {location.state} {location.zipCode}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <DetailsModal isOpen={isModalOpen} onClose={closeModal} />
      <SlideshowModal
        isOpen={isSlideshowOpen}
        onClose={closeSlideshow}
        images={image_urls}
        currentIndex={currentImageIndex}
      />
      <EmailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        email={email}
        fullName={fullName}
      />
    </div>
  );
};

export default PropertyDetails;
