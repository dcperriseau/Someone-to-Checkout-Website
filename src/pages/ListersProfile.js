import React from 'react';
import Heart from '../components/Heart';

const ListersProfile = () => {
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

  return (
    <div className="w-full overflow-hidden font-red-hat-display">
      <div className="relative w-full p-3 md:ml-4">
        <button className="absolute z-10 p-2 font-light text-gray-500 top-5 left-5">&lt;&nbsp;&nbsp;Back</button>
        <div className="flex flex-col items-start mt-12 md:flex-row md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <img
              src={process.env.PUBLIC_URL + "/personalProfile/propic1.png"}
              alt="Dominique Perriseau"
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col items-start w-full mt-4 md:mt-0 md:ml-8 md:w-auto">
            <h1 className="text-3xl font-bold md:text-5xl text-textTeritary" style={{ fontSize: '46px' }}>Dominique Perriseau</h1>
            <p className="text-xl md:text-2xl text-textTeritary" style={{ fontSize: '16px' }}>Los Angeles, CA</p>
          </div>
        </div>
        <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:ml-4 md:space-x-2">
          <button className="flex items-center justify-center min-w-[160px] max-w-[200px] px-8 py-2 text-white bg-[#47CAD2] rounded-full">Send a message</button>
        </div>
      </div>
      <div className="w-full px-5 py-5 md:px-10">
  <h2 className="mb-5 text-2xl font-semibold text-textTeritary">All Listings</h2>
  <div className="flex flex-wrap justify-start -mx-2">
    {savedListings.map((item, index) => (
      <div key={index} className="w-1/2 px-2 mb-5 md:w-1/3 lg:w-1/5">
        <button className="w-full focus:outline-none">
          <img src={item.image} alt={item.title} className="object-cover w-full h-48 mb-2 rounded-md md:h-64" />
        </button>
        <div className="flex items-center justify-between mb-1">
          <p className="text-lg font-thin text-textPrimary">{item.title}</p>
          <span className="flex items-center space-x-2 text-textPrimary">
              {item.hearts}
              <Heart color="text-pinkHeartColor" size={20} className="ml-2" />
            </span>
        </div>
        <p className="mb-1 font-thin text-textSecondary">{item.location}</p>
        <p className="mb-1 text-xl font-bold text-textTeritary">{item.price}</p>
      </div>
    ))}
    {[...Array(5 - savedListings.length)].map((_, index) => (
      <div key={`placeholder-${index}`} className="invisible w-1/2 px-2 mb-5 md:w-1/3 lg:w-1/5">
        Placeholder
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default ListersProfile;
