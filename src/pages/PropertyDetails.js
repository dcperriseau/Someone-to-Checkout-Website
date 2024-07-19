import React, { useState } from 'react';
import Heart from '../components/Heart';
import Icon from '../components/ThreeDots';
import BackButton from '../components/BackButton';
import Modal from '../components/DetailsModel'; 

const PropertyDetails = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableTimes = [
    { day: 'Sunday', time: '10:30am - 3:00pm' },
    { day: 'Monday', time: '8:00am - 2:00pm' },
    { day: 'Tuesday', time: 'None' },
    { day: 'Wednesday', time: '4:00pm - 8:00pm' },
    { day: 'Thursday', time: '10:30am - 5:00pm' }
  ];

  const images = [
    { src: process.env.PUBLIC_URL + "/propertyDetails/propertypic4.png", alt: 'Bathroom' },
    { src: process.env.PUBLIC_URL + "/propertyDetails/propertypic2.png", alt: 'Bedroom' },
    { src: process.env.PUBLIC_URL + "/propertyDetails/propertypic3.png", alt: 'Living Room' },
    { src: process.env.PUBLIC_URL + "/propertyDetails/propertypic1.png", alt: 'Kitchen' }
  ];

  const listingDetails = {
    title: 'Charming sublet in Silver Lake',
    price: '$1,900/Month',
    user: {
      name: 'Eric M.',
      profilePic: process.env.PUBLIC_URL + "/propertyDetails/propic.png"
    },
    listedOn: '06/12/2024',
    updatedOn: '07/03/2024',
    description: 'I am subletting a super charming and cute apartment in Silverlake for 5 months. The unit has in-unit washing and drying as well as a dishwasher.',
    location: '123 Main Street, Silverlake',
    unitDetails: [
      { detail: 'Apartment', icon: process.env.PUBLIC_URL + '/propertyDetails/Apartment.png' },
      { detail: '1 Bed, 2 Bath', icon: process.env.PUBLIC_URL + '/propertyDetails/Bed:Bath.png' },
      { detail: 'Central AC', icon: process.env.PUBLIC_URL + '/propertyDetails/AC.png' },
      { detail: 'Natural Lighting', icon: process.env.PUBLIC_URL + '/propertyDetails/naturalLighting.png' },
      { detail: 'In-unit laundry', icon: process.env.PUBLIC_URL + '/propertyDetails/Laundry.png' },
      { detail: 'Street parking', icon: process.env.PUBLIC_URL + '/propertyDetails/StreetParking.png' },
      { detail: 'Furnished', icon: process.env.PUBLIC_URL + '/propertyDetails/Furnished.png' },
      { detail: '3 month sublet', icon: process.env.PUBLIC_URL + '/propertyDetails/Calander.png' }
    ]
  };

  const handleImageClick = (index) => {
    console.log(`Image ${index} clicked`);
    // Here you can implement the logic to open the slideshow
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

  return (
    <div className="w-full px-4 pb-4 font-red-hat-display">
      <div className="mt-2">
        <BackButton />
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-2 md:space-x-[49px] pt-8">
        <div className="flex h-[524px] aspect-w-4 aspect-h-3 flex-1">
          <div className="flex flex-col space-y-4">
            {images.slice(0, 3).map((image, index) => (
              <button key={index} onClick={() => handleImageClick(index)} className="flex-1 w-full rounded-md aspect-w-4 aspect-h-3">
                <img src={image.src} alt={image.alt} className="object-cover w-full h-full rounded-2xl"/>
              </button>
            ))}
          </div>
          <div className="relative flex-1 ml-3.5">
            <button onClick={() => handleImageClick(3)} className="w-full h-full rounded-2xl aspect-w-4 aspect-h-3">
              <img src={images[3].src} alt={images[3].alt} className="object-cover w-full h-full rounded-2xl" />
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
              <h1 className="mr-3 text-2xl font-bold md:text-3xl">{listingDetails.title}</h1>
              <div className="flex items-center justify-center w-32 md:w-48 h-10 md:h-12 px-2 text-xl md:text-2xl font-bold text-[#47cad2] bg-[#ebf9fa] rounded-full">
                {listingDetails.price}
              </div>
            </div>
            <button onClick={openModal} className="ml-auto">
              <Icon />
            </button>
          </div>
          <div className="flex flex-col mt-4 md:flex-row">
            <div className="flex flex-col flex-1">
              <div className="flex items-center">
                <img src={listingDetails.user.profilePic} alt={listingDetails.user.name} className="w-8 h-8 rounded-full md:w-10 md:h-10" />
                <div className="ml-2">
                  <p className="font-semibold">{listingDetails.user.name}</p>
                  <p className="text-xs text-gray-500 md:text-sm">Listed on: {listingDetails.listedOn}</p>
                  <p className="text-xs text-gray-500 md:text-sm">Updated on: {listingDetails.updatedOn}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-700 md:text-base">
                {listingDetails.description}
              </p>
            </div>
            {listingDetails.location && (
              <div className="flex-1 mt-4 md:mt-0 md:ml-4">
                <img
                  src={process.env.PUBLIC_URL + "/PropertyDetails/map.png"}
                  // src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(listingDetails.location)}&zoom=14&size=300x200&key=YOUR_GOOGLE_MAPS_API_KEY`}
                  alt="Map of location"
                  className="w-full h-auto rounded-md"
                />
                <p className="mt-2 text-sm text-gray-700 md:text-base">{listingDetails.location}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-4 md:flex-row">
            <div className="flex flex-col flex-1">
              <button className="mb-4 px-2 w-full md:w-[172px] h-8 md:h-[28px] bg-gray-200 text-black text-xs md:text-sm font-medium rounded-full flex items-center justify-center">
                Message Seller
              </button>
              <div className="mt-4 md:-scroll-mt-3.5">
                <h2 className="text-sm font-semibold md:text-base">Available Times</h2>
                <ul className="mt-2 text-xs list-none md:text-sm">
                  {availableTimes.map((time, index) => (
                    <li key={index}>{time.day}: {time.time}</li>
                  ))}
                </ul>
              </div>
              <button className="py-2 px-2 mt-4 md:mt-[27px] w-full md:w-[292px] h-12 md:h-[48px] bg-[#212121] text-white text-base md:text-lg font-medium rounded-full">
                Send Someone to Check out
              </button>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-base font-semibold md:text-xl">Unit Details</h2>
              <ul className="mt-4">
                {listingDetails.unitDetails.map((unitDetail, index) => (
                  <li key={index} className="flex items-center mb-2 space-x-2 text-xs md:text-sm">
                    <img src={unitDetail.icon} alt={unitDetail.detail} className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{unitDetail.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default PropertyDetails;
