import React from 'react';
import Heart from '../components/Heart';

const PersonalProfile = () => {
  const savedListings = [
    {
      title: 'Private Room For Rent',
      hearts: 15,
      location: 'Larchmont',
      price: '$1,100',
      image: process.env.PUBLIC_URL + "/personalProfile/listimage.png"
    },
    {
      title: 'Title',
      hearts: 130,
      location: 'location',
      price: '$Price',
      image: process.env.PUBLIC_URL + "/personalProfile/listimage1.png"
    },
    {
      title: 'Title',
      hearts: 3,
      location: 'location',
      price: '$Price',
      image: process.env.PUBLIC_URL + "/personalProfile/listimage2.png"
    },
    {
      title: 'Title',
      hearts: 19,
      location: 'location',
      price: '$Price',
      image: process.env.PUBLIC_URL + "/personalProfile/listimage3.png"
    },
    {
      title: 'Title',
      hearts: 83,
      location: 'location',
      price: '$Price',
      image: process.env.PUBLIC_URL + "/personalProfile/listimage4.png"
    }
  ];
  const viewedListings = [
    {
      image: process.env.PUBLIC_URL + "/personalProfile/viewedlisting.png",
      description: 'Viewed on 12/04/23'
    },
    {
      image: process.env.PUBLIC_URL + "/personalProfile/viewedlisting1.png",
      description: 'Viewed on 12/04/23'
    },
    {
      image: process.env.PUBLIC_URL + "/personalProfile/viewedlisting2.png",
      description: 'Viewed on 12/04/23'
    }  
  ];

  return (
    <div className="w-full overflow-hidden font-red-hat-display">
      <div className="relative w-full p-3 ml-4">
        <button className="absolute z-10 p-2 font-light text-gray-500 top-5 left-5">&lt;&nbsp;&nbsp;Back</button>
        <div className="flex flex-row items-start mt-12 md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <img
              src={process.env.PUBLIC_URL + "/personalProfile/propic1.png"}
              alt="Dominique Perriseau"
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col items-start w-full mt-0 ml-4 md:ml-8 md:w-auto">
            <h1 className="text-3xl font-bold md:text-5xl whitespace-nowrap text-textTeritary" style={{ fontSize: '46px' }}>Dominique Perriseau</h1>
            <p className="text-xl md:text-2xl text-textTeritary" style={{ fontSize: '16px' }}>Los Angeles, CA</p>
          </div>
        </div>
        <div className="flex mt-4 ml-4 space-x-2">
          <button className="flex items-center justify-center min-w-[160px] px-8 py-2 text-white bg-[#47CAD2] rounded-full">Request a Viewing</button>
          <button className="flex items-center justify-center min-w-[160px] px-16 py-2 text-textTeritary border border-black rounded-full">Edit Profile</button>
        </div>
      </div>
      <div className="w-full px-10 py-5">
        <h2 className="mb-5 text-2xl font-semibold text-textTeritary">Saved Listings</h2>
        <div className="flex space-x-6 overflow-x-auto flex-nowrap">
          {savedListings.map((item, index) => (
            <div key={index} className="flex-shrink-0 mb-5">
              <button className="focus:outline-none">
                <img src={item.image} alt={item.title} className="w-64 h-64 mb-2 rounded-md" />
              </button>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-thin text-textPrimary">{item.title}</h2>
                <span className="flex items-center space-x-2 text-textPrimary">
                  {item.hearts}
                  <Heart color="text-pinkHeartColor" size={20} className="ml-2" />
                </span>
              </div>
              <p className="mb-1 font-thin text-textSecondary">{item.location}</p>
              <p className="mb-1 text-xl font-bold text-textTeritary">{item.price}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-10 mb-5 text-2xl font-semibold text-textTeritary">Listings You've Had Us View</h2>
        <div className="flex space-x-6 overflow-x-auto flex-nowrap">
          {viewedListings.map((item, index) => (
            <div key={index} className="flex-shrink-0 mb-5">
              <button className="focus:outline-none">
                <img src={item.image} alt={item.description} className="w-64 mb-2 rounded-md h-36" style={{ width: '256px', height: '148px' }} />
              </button>
              <p className="text-lg font-thin text-textPrimary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;


