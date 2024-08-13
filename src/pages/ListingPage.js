import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.js'; // Import the useAuth hook
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Custom Text Components
const Step1Text = ({ text = 'Step 1' }) => <div className="text-[#212121] text-2xl font-bold leading-9 font-red-hat-display">{text}</div>;
const Step2Text = ({ text = 'Step 2' }) => <div className="text-[#212121] text-2xl font-bold leading-9 font-red-hat-display mt-10">{text}</div>;
const Step3Text = ({ text = 'Step 3' }) => <div className="text-[#212121] text-2xl font-bold leading-9 font-red-hat-display mt-10">{text}</div>;
const PropertyTypeText = ({ text = 'Select the type of property you have' }) => <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display text-center mt-4">{text}</div>;
const AddressText = ({ text = 'Tell us your address' }) => <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display text-center mt-4">{text}</div>;
const DescriptionText = ({ text = 'Describe your property' }) => <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display mt-10">{text}</div>;
const OfferText = ({ text = 'Tell buyers and renters what your place has to offer' }) => <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display text-center mt-10">{text}</div>;

// Custom Card Components
const Card = ({ children, className = '' }) => (
  <div className={`relative bg-white rounded-[24px] border border-[#e8e8e8] box-border mt-6 flex flex-col items-center p-4 w-[351px] h-[238px] ${className}`}>
    {children}
  </div>
);

const FeatureCard = ({ icon: IconComponent, text, selected, onClick }) => (
  <div
    className={`relative bg-white rounded-[15px] border ${selected ? 'border-blue-500' : 'border-[#bababa]'} box-border w-[266px] h-[165px] m-2 flex flex-col justify-between p-4 cursor-pointer`}
    onClick={onClick}
  >
    <IconComponent className={`text-4xl ${selected ? 'text-blue-500' : 'text-gray-500'}`} />
    <div className={`text-lg font-red-hat-display ${selected ? 'text-blue-500' : ''}`}>{text}</div>
  </div>
);

const Image = ({ image }) => (
  <div
    className="w-[200px] h-[150px] rounded-[12px] bg-cover bg-center mx-auto mt-6"
    style={{ backgroundImage: `url(${image})` }}
  />
);

const Button = ({ label, onClick, selected }) => (
  <button
    className={`cursor-pointer w-[105px] h-[38px] px-2 border ${selected ? 'bg-[#47cad2] text-white' : 'border-[#212121] bg-white text-[#212121]'} box-border rounded-full text-sm font-medium leading-5 font-roboto mt-4 mx-auto block`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Input Components
const InputText = ({ text }) => <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display text-center mt-6">{text}</div>;
const InputLabel = ({ text }) => <div className="text-[#030303] text-base font-roboto leading-6">{text}</div>;
const InputStepper = ({ value, onChange }) => <input type="number" className="w-[100px] h-[40px] px-2 border border-[#e8e8e8] rounded-full bg-white text-[#94a3b8] text-sm font-roboto leading-[40px] outline-none" value={value} onChange={onChange} />;
const InputField = ({ value, onChange, placeholder }) => <input type="text" className="w-full sm:w-[200px] h-[40px] px-2 border border-[#e8e8e8] rounded-full bg-white text-[#030303] text-sm font-roboto leading-[40px] outline-none mt-2" placeholder={placeholder} value={value} onChange={onChange} />;
const HorizontalDivider = () => <div className="w-full h-[2px] bg-[#e8e8e8] mt-10" />;
const UploadPhotosText = ({ text = 'Upload Property Photos' }) => <div className="text-[#212121] text-lg font-bold leading-7 font-red-hat-display mt-6">{text}</div>;
const PhotoDescriptionText = ({ text = "Photos of your listing should be well lit, clear, and highlight your property's features" }) => <div className="text-[#212121] text-lg font-bold leading-7 font-red-hat-display text-center mt-4">{text}</div>;
const IconUploadComponent = ({ className = '' }) => (
  <svg className={`text-[#47cad2] fill-current ${className}`} viewBox="0 0 576 512">
    <path d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path>
  </svg>
);

const PlusIconComponent = () => <svg className="text-[#bababa] fill-current w-[32px] h-[38px]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
const MinusIconComponent = () => <svg className="text-[#bababa] fill-current w-[32px] h-[32px]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 13H5v-2h14v2z" /></svg>;

const UploadCardText = ({ text }) => <div className="text-[#212121] text-base font-medium leading-6 font-red-hat-display text-center mt-4">{text}</div>;
const DragDropText = ({ text }) => <div className="text-[#737373] text-sm font-red-hat-display leading-4 text-center mt-2">{text}</div>;
const SmallerCard = ({ children }) => <div className="w-[160px] h-[123px] bg-[#f9f9f9] rounded-[16px] m-1 flex justify-center items-center">{children}</div>;
const InfoText = ({ text }) => {
  const [before] = text.split('Commerce Policy.');
  return (
    <div className="text-[#737373] text-base font-semibold leading-6 font-red-hat-display text-left mt-8 px-4">
      {before}
      <div className="mt-2">
        <a href="/commerce-policy" className="text-[#47cad2]">Commerce Policy</a>
      </div>
    </div>
  );
};

const AddressCard = ({ placeholder, value, name, onChange }) => (
  <div className="relative bg-white rounded-[26px] shadow-md w-full h-[77px] mt-6 shadow-[0px_2px_8px_rgba(0,0,0,0.16)] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
    <input 
      className="w-full h-full p-4 bg-transparent rounded-[26px] outline-none text-[#030303] text-base font-red-hat-display leading-5" 
      placeholder={placeholder} 
      value={value}
      name={name}
      onChange={onChange}
    />
  </div>
);

const DescriptionInput = ({ value, onChange }) => (
  <textarea 
    className="w-full h-[150px] p-4 border border-[#e8e8e8] rounded-[16px] bg-white mt-2 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
    placeholder="Enter property description here..."
    value={value}
    onChange={onChange}
  />
);

// Title Input Component
const TitleInput = ({ value, onChange }) => (
  <input 
    className="w-full h-[40px] p-4 border border-[#e8e8e8] rounded-[16px] bg-white mt-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
    placeholder="Enter title here..."
    value={value}
    onChange={onChange}
  />
);

// Custom Icons
const WashingMachineIcon = () => <svg className="text-[#030303] fill-current w-[62px] h-[61px]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M9.17 16.83a4.008 4.008 0 0 0 5.66 0 4.008 4.008 0 0 0 0-5.66l-5.66 5.66zM18 2.01 6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM10 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path></svg>;
const ParkingIcon = () => <svg className="text-[#030303] fill-current w-[54px] h-[53px]" viewBox="0 0 24 24"><path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"></path></svg>;
const AirConditioningIcon = () => <svg className="text-[#030303] fill-current w-[48px] h-[48px]" viewBox="0 0 512 512"><path d="M475.6 384.1C469.7 394.3 458.9 400 447.9 400c-5.488 0-11.04-1.406-16.13-4.375l-25.09-14.64l5.379 20.29c3.393 12.81-4.256 25.97-17.08 29.34c-2.064 .5625-4.129 .8125-6.164 .8125c-10.63 0-20.36-7.094-23.21-17.84l-17.74-66.92L288 311.7l.0002 70.5l48.38 48.88c9.338 9.438 9.244 24.62-.1875 33.94C331.5 469.7 325.4 472 319.3 472c-6.193 0-12.39-2.375-17.08-7.125l-14.22-14.37L288 480c0 17.69-14.34 32-32.03 32s-32.03-14.31-32.03-32l-.0002-29.5l-14.22 14.37c-9.322 9.438-24.53 9.5-33.97 .1875c-9.432-9.312-9.525-24.5-.1875-33.94l48.38-48.88L223.1 311.7l-59.87 34.93l-17.74 66.92c-2.848 10.75-12.58 17.84-23.21 17.84c-2.035 0-4.1-.25-6.164-.8125c-12.82-3.375-20.47-16.53-17.08-29.34l5.379-20.29l-25.09 14.64C75.11 398.6 69.56 400 64.07 400c-11.01 0-21.74-5.688-27.69-15.88c-8.932-15.25-3.785-34.84 11.5-43.75l25.96-15.15l-20.33-5.508C40.7 316.3 33.15 303.1 36.62 290.3S53.23 270 66.09 273.4L132 291.3L192.5 256L132 220.7L66.09 238.6c-2.111 .5625-4.225 .8438-6.305 .8438c-10.57 0-20.27-7.031-23.16-17.72C33.15 208.9 40.7 195.8 53.51 192.3l20.33-5.508L47.88 171.6c-15.28-8.906-20.43-28.5-11.5-43.75c8.885-15.28 28.5-20.44 43.81-11.5l25.09 14.64L99.9 110.7C96.51 97.91 104.2 84.75 116.1 81.38C129.9 77.91 142.1 85.63 146.4 98.41l17.74 66.92L223.1 200.3l-.0002-70.5L175.6 80.88C166.3 71.44 166.3 56.25 175.8 46.94C185.2 37.59 200.4 37.72 209.8 47.13l14.22 14.37L223.1 32c0-17.69 14.34-32 32.03-32s32.03 14.31 32.03 32l.0002 29.5l14.22-14.37c9.307-9.406 24.51-9.531 33.97-.1875c9.432 9.312 9.525 24.5 .1875 33.94l-48.38 48.88L288 200.3l59.87-34.93l17.74-66.92c3.395-12.78 16.56-20.5 29.38-17.03c12.82 3.375 20.47 16.53 17.08 29.34l-5.379 20.29l25.09-14.64c15.28-8.906 34.91-3.75 43.81 11.5c8.932 15.25 3.785 34.84-11.5 43.75l-25.96 15.15l20.33 5.508c12.81 3.469 20.37 16.66 16.89 29.44c-2.895 10.69-12.59 17.72-23.16 17.72c-2.08 0-4.193-.2813-6.305-.8438L379.1 220.7L319.5 256l60.46 35.28l65.95-17.87C458.8 270 471.9 277.5 475.4 290.3c3.473 12.78-4.082 25.97-16.89 29.44l-20.33 5.508l25.96 15.15C479.4 349.3 484.5 368.9 475.6 384.1z"></path></svg>;
const PoolSpaIcon = () => <svg className="text-[#030303] fill-current w-[62px] h-[54px]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M7 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM11.15 12c-.31-.22-.59-.46-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C6.01 9 5 10.01 5 11.25V12H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8H11.15zM7 20H5v-6h2v6zm4 0H9v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6zm-.35-14.14-.07-.07c-.57-.62-.82-1.41-.67-2.2L18 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71zm-4 0-.07-.07c-.57-.62-.82-1.41-.67-2.2L14 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71z"></path></svg>;
const BBQGrillIcon = () => <svg className="text-[#030303] fill-current w-[66px] h-[56px]" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 22c1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.3 0-2.4.84-2.82 2H9.14l1.99-3.06a6.36 6.36 0 0 0 1.74 0l1.02 1.57c.42-.53.96-.95 1.6-1.21l-.6-.93A6.992 6.992 0 0 0 19 8H5c0 2.84 1.69 5.27 4.12 6.37l-3.95 6.08a1 1 0 0 0 .29 1.38 1 1 0 0 0 1.38-.29l1-1.55h6.34C14.6 21.16 15.7 22 17 22zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9.41 7h1c.15-1.15.23-1.64-.89-2.96-.42-.5-.68-.77-.46-2.04h-.99c-.21 1.11.03 2.05.89 2.96.22.24.79.67.45 2.04zm2.48 0h1c.15-1.15.23-1.64-.89-2.96-.42-.5-.68-.78-.46-2.04h-.99c-.21 1.11.03 2.05.89 2.96.23.24.8.67.45 2.04zm2.52 0h1c.15-1.15.23-1.64-.89-2.96-.42-.5-.68-.77-.46-2.04h-.99c-.21 1.11.03 2.05.89 2.96.22.24.79.67.45 2.04z"></path></svg>;
const HotTubIcon = () => <svg className="text-[#030303] fill-current w-[71px] h-[64px]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M7 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM11.15 12c-.31-.22-.59-.46-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C6.01 9 5 10.01 5 11.25V12H2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8H11.15zM7 20H5v-6h2v6zm4 0H9v-6h2v6zm4 0h-2v-6h2v6zm4 0h-2v-6h2v6zm-.35-14.14-.07-.07c-.57-.62-.82-1.41-.67-2.2L18 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71zm-4 0-.07-.07c-.57-.62-.82-1.41-.67-2.2L14 3h-1.89l-.06.43c-.2 1.36.27 2.71 1.3 3.72l.07.06c.57.62.82 1.41.67 2.2l-.11.59h1.91l.06-.43c.21-1.36-.27-2.71-1.3-3.71z"></path></svg>;
const FirePitIcon = () => <svg className="text-[#030303] fill-current w-[64px] h-[55px]" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M2 2v20h20V2H2zm9.86 14.96c.76-.24 1.4-1.04 1.53-1.63.13-.56-.1-1.05-.2-1.6-.08-.46-.07-.85.08-1.28.54 1.21 2.15 1.64 1.98 3.18-.19 1.7-2.11 2.38-3.39 1.33zM20 20h-2v-2h-2.02A4.98 4.98 0 0 0 17 15c0-1.89-1.09-2.85-1.85-3.37C12.2 9.61 13 7 13 7c-6.73 3.57-6.02 7.47-6 8 .03.96.49 2.07 1.23 3H6v2H4V4h16v16z"></path></svg>;
const GymIcon = () => <svg className="text-[#030303] fill-current w-[73px] h-[52px]" viewBox="0 0 640 512"><path d="M104 96h-48C42.75 96 32 106.8 32 120V224C14.33 224 0 238.3 0 256c0 17.67 14.33 32 31.1 32L32 392C32 405.3 42.75 416 56 416h48C117.3 416 128 405.3 128 392v-272C128 106.8 117.3 96 104 96zM456 32h-48C394.8 32 384 42.75 384 56V224H256V56C256 42.75 245.3 32 232 32h-48C170.8 32 160 42.75 160 56v400C160 469.3 170.8 480 184 480h48C245.3 480 256 469.3 256 456V288h128v168c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V56C480 42.75 469.3 32 456 32zM608 224V120C608 106.8 597.3 96 584 96h-48C522.8 96 512 106.8 512 120v272c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V288c17.67 0 32-14.33 32-32C640 238.3 625.7 224 608 224z"></path></svg>;

const PostButton = ({ onClick }) => {
  const styles = {
    Button: {
      cursor: 'pointer',
      width: '306px',
      height: '72px',
      padding: '0px 8px',
      border: '0',
      boxSizing: 'border-box',
      borderRadius: '100px',
      backgroundColor: '#47cad2',
      color: '#ffffff',
      fontSize: '27px',
      fontFamily: 'Red Hat Display',
      fontWeight: '500',
      lineHeight: '42px',
      outline: 'none',
      marginTop: '45px',
    },
  };

  const defaultProps = {
    label: 'Post Listing',
  };

  return (
    <button style={styles.Button} onClick={onClick}>
      {defaultProps.label}
    </button>
  );
};

const ListingPage = () => {
  const { idToken } = useAuth(); // Accessing the idToken from AuthContext
  const navigate = useNavigate();
  const [listing, setListing] = useState({
    type: '',
    bedroom_count: 0,
    bathroom_count: 0,
    price: 0,
    image_urls: [],
    location: {
      street_address: '',
      city: '',
      state_name: '',
      zip_code: '',
    },
    title: '',
    description: '',
    features: [],
    available_times: {
      sunday: [{ start: '09:00', end: '17:00' }],
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [{ start: '09:00', end: '17:00' }]
    },
    date_created: serverTimestamp(), 
    last_updated: serverTimestamp(), 
    user_name: '', 
    user_email: '' 
  });

  const items = [
    {
      label: 'Apartment',
      image: 'https://assets.api.uizard.io/api/cdn/stream/bd1b508f-1665-4b3f-adb2-e940fe688ef4.png'
    },
    {
      label: 'Duplex',
      image: 'https://images.unsplash.com/photo-1582586285668-6fa0104f35f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHwzfHxkdXBsZXh8ZW58MXx8fHwxNzE5MTk5Nzg2fDA&ixlib=rb-4.0.3&q=80&w=1080'
    },
    {
      label: 'House',
      image: 'https://assets.api.uizard.io/api/cdn/stream/8bbd539b-72af-4f50-86b4-5c0bd1bc6119.png'
    }
  ];

  const smallerCards = new Array(8).fill(null);
  const features = [
    { text: "Washer", icon: WashingMachineIcon },
    { text: "Free Parking on Premise", icon: ParkingIcon },
    { text: "Air Conditioning", icon: AirConditioningIcon },
    { text: "Pool or Spa", icon: PoolSpaIcon },
    { text: "BBQ Grill", icon: BBQGrillIcon },
    { text: "Hot Tub", icon: HotTubIcon },
    { text: "Fire Pit", icon: FirePitIcon },
    { text: "Access to Gym", icon: GymIcon }
  ];

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const submitListing = async () => {
    try {
      if (!idToken) {
        navigate('/signin');
        return;
      }
  
      const isValidAvailability = Object.values(listing.available_times).some(dayTimes => {
        if (dayTimes.length === 0) {
          return false;
        }
        return dayTimes.some(slot => slot.start && slot.end);
      });
  
      const isValidFeatures = listing.features.length > 0;
  
      console.log("Type:", listing.type);
      console.log("Bedrooms:", listing.bedroom_count);
      console.log("Bathrooms:", listing.bathroom_count);
      console.log("Price:", listing.price);
      console.log("Street Address:", listing.location.street_address);
      console.log("City:", listing.location.city);
      console.log("State:", listing.location.state_name);
      console.log("Zip Code:", listing.location.zip_code);
      console.log("Title:", listing.title);
      console.log("Description:", listing.description);
      console.log("Photos count:", listing.image_urls.length);
      console.log("Valid Availability:", isValidAvailability);
      console.log("Valid Features:", isValidFeatures);
      console.log("Available Times:", listing.available_times);
  
      const isListingValid = listing.type && listing.bedroom_count > 0 && listing.bathroom_count > 0 && listing.price > 0 &&
        listing.location.street_address && listing.location.city && listing.location.state_name && listing.location.zip_code &&
        listing.title && listing.description && listing.image_urls.length > 0 && isValidAvailability && isValidFeatures;
  
      if (!isListingValid) {
        alert('Please fill out all fields before submitting. Ensure at least one viewing time and one feature are selected.');
        return;
      }
  
      const newListingRef = doc(db, 'property_listings', `listing_${Date.now()}`);
      const newListingId = newListingRef.id;
      const listingWithId = { ...listing, id: newListingId };
  
      await setDoc(newListingRef, listingWithId);
  
      console.log('Listing posted:', newListingId);
  
      // Redirect to home page after successful listing
      navigate('/');
    } catch (error) {
      console.error('Error posting listing:', error);
      
    }
  };

  const toggleFeature = (text) => {
    setListing((prevListing) => ({
      ...prevListing,
      features: prevListing.features.includes(text)
        ? prevListing.features.filter((feature) => feature !== text)
        : [...prevListing.features, text]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      location: {
        ...prevListing.location,
        [name]: value
      }
    }));
  };

  const handleBedroomCountChange = (e) => {
    setListing((prevListing) => ({
      ...prevListing,
      bedroom_count: e.target.value
    }));
  };

  const handleBathroomCountChange = (e) => {
    setListing((prevListing) => ({
      ...prevListing,
      bathroom_count: e.target.value
    }));
  };

  const handlePriceChange = (e) => {
    setListing((prevListing) => ({
      ...prevListing,
      price: e.target.value
    }));
  };

  const handleTitleChange = (e) => {
    setListing((prevListing) => ({
      ...prevListing,
      title: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setListing((prevListing) => ({
      ...prevListing,
      description: e.target.value
    }));
  };

  // Available Times 
  const handleAvailableTimesChange = (day, index, timeType, value) => {
    setListing((prevListing) => {
      const updatedTimes = [...prevListing.available_times[day.toLowerCase()]];
      updatedTimes[index] = { ...updatedTimes[index], [timeType]: value };
      
      return {
        ...prevListing,
        available_times: {
          ...prevListing.available_times,
          [day.toLowerCase()]: updatedTimes
        }
      };
    });
    console.log(`Availability updated: ${day} ${timeType} = ${value}`);
  };

  const handlePostListing = () => {
    console.log('Posting listing:', listing);
    submitListing();
  };

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const storage = getStorage(); // Initialize Firebase storage
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });

    try {
      const photoURLs = await Promise.all(uploadPromises);
      setListing((prevListing) => ({
        ...prevListing,
        image_urls: [...prevListing.image_urls, ...photoURLs]
      }));
      console.log("Uploaded photos:", photoURLs);
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  const handlePropertyTypeClick = (type) => {
    setListing((prevListing) => ({
      ...prevListing,
      type: prevListing.type === type ? '' : type
    }));
  };

  useEffect(() => {
    // Set initial available times
    const initialTimes = {
      sunday: [{ start: '09:00', end: '17:00' }],
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [{ start: '09:00', end: '17:00' }]
    };
    setListing(prevListing => ({
      ...prevListing,
      available_times: initialTimes
    }));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:px-10">
      <div className="self-start mb-4">
        <Step1Text />
      </div>
      <PropertyTypeText />
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
        {items.map((item, index) => (
          <Card key={index}>
            <Image image={item.image} />
            <Button 
              label={item.label} 
              onClick={() => handlePropertyTypeClick(item.label)}
              selected={listing.type === item.label}
            />
          </Card>
        ))}
      </div>
      <InputText text="Enter the number of bedrooms and bathrooms" />
      <div className="flex flex-col mt-6 sm:flex-row sm:space-x-6">
        <div className="flex flex-col items-center">
          <InputLabel text="Bedrooms" />
          <InputStepper value={listing.bedroom_count} onChange={handleBedroomCountChange} />
        </div>
        <div className="flex flex-col items-center mt-4 sm:mt-0">
          <InputLabel text="Bathrooms" />
          <InputStepper value={listing.bathroom_count} onChange={handleBathroomCountChange} />
        </div>
      </div>
      <InputText text="Enter the price of your property" />
      <div className="flex flex-col items-center mt-4">
        <InputLabel text="Price per month" />
        <InputField placeholder="$0.00" value={listing.price} onChange={handlePriceChange} />
      </div>
      <HorizontalDivider />
      <div className="self-start mb-4">
        <Step2Text />
      </div>
      <UploadPhotosText />
      <PhotoDescriptionText />
      <div className="w-full sm:w-[727px] flex flex-col items-center">
        <Card className="w-full sm:w-[694px] h-[372px] bg-[#f9f9f9] flex flex-col justify-center items-center relative">
          <div className="w-[100px] h-[100px] bg-[#e8e8e8] rounded-full flex justify-center items-center">
            <IconUploadComponent className="w-[43px] h-[43px] text-[#47cad2]" />
          </div>
          <UploadCardText text="Upload images" />
          <DragDropText text="or use Drag & Drop" />
          <input 
            type="file" 
            multiple 
            onChange={handlePhotoUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          />
        </Card>
        <div className="grid grid-cols-2 gap-2 mt-6 sm:grid-cols-4">
          {listing.image_urls.map((photo, index) => (
            <SmallerCard key={index}>
              <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover rounded-[16px]" />
            </SmallerCard>
          ))}
          {smallerCards.slice(listing.image_urls.length).map((_, index) => (
            <SmallerCard key={index}>
              <PlusIconComponent className="w-[40px] h-[40px] text-[#bababa]" />
            </SmallerCard>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <InfoText text="Someone to Checkout listings are public and can be seen by anyone on or off our website. Items like animals, drugs, weapons, scams, and other items that infringe intellectual property aren't allowed on Someone to Checkout. See our Commerce Policy." />
      </div>
      <HorizontalDivider />
      <div className="self-start mb-4">
        <Step3Text />
      </div>
      <AddressText />
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row">
        <div className="relative flex flex-col self-start w-full gap-4 sm:w-1/2">
          <AddressCard text="Street address" placeholder="Enter street address" value={listing.location.street_address} name="street_address" onChange={handleLocationChange} />
          <AddressCard text="City/Town" placeholder="Enter city/town" value={listing.location.city} name="city" onChange={handleLocationChange} />
          <AddressCard text="State/Territory" placeholder="Enter state/territory" value={listing.location.state_name} name="state_name" onChange={handleLocationChange} />
          <AddressCard text="Zipcode" placeholder="Enter zipcode" value={listing.location.zip_code} name="zip_code" onChange={handleLocationChange} />
        </div>
      </div>
      <div className="self-start w-full mt-10">
        <InputText text="Enter the title of your property" />
        <TitleInput value={listing.title} onChange={handleTitleChange} />
      </div>
      <div className="self-start w-full mt-10">
        <DescriptionText />
        <DescriptionInput value={listing.description} onChange={handleDescriptionChange} />
      </div>
      <OfferText text="Tell buyers and renters what your place has to offer" />
      <div className="grid grid-cols-2 gap-6 mt-6 sm:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            text={feature.text}
            icon={feature.icon}
            selected={listing.features.includes(feature.text)}
            onClick={() => toggleFeature(feature.text)}
          />
        ))}
      </div>
      <div className="self-start w-full mt-10">
        <div className="text-[#212121] text-xl font-bold leading-9 font-red-hat-display">
          Available Viewing Times
        </div>
        <div className="text-[#737373] text-base leading-6 mt-2">
          Please input the times you or someone would be available to show the property to a Viewer
        </div>
      </div>
      <div className="flex flex-col items-center w-full mt-6">
  {daysOfWeek.map((day, dayIndex) => (
    <div key={dayIndex} className="flex flex-col items-center w-full mb-2 sm:flex-row sm:space-x-4 sm:w-1/2">
      <label className="text-[#212121] text-base font-red-hat-display">{day}</label>
      <div className="flex flex-col sm:flex-row sm:space-x-2">
        {listing.available_times[day.toLowerCase()].map((time, timeIndex) => (
          <div key={timeIndex} className="flex space-x-2 mt-2">
            <input 
              type="time" 
              name={`${day.toLowerCase()}_start_${timeIndex}`}
              className="w-[100px] h-[40px] px-2 border border-[#e8e8e8] rounded-full bg-white text-[#030303] text-sm font-roboto leading-[40px] outline-none"
              placeholder="Start time"
              step="1800"
              value={time.start}
              onChange={(e) => handleAvailableTimesChange(day, timeIndex, 'start', e.target.value)}
            />
            <input 
              type="time" 
              name={`${day.toLowerCase()}_end_${timeIndex}`}
              className="w-[100px] h-[40px] px-2 border border-[#e8e8e8] rounded-full bg-white text-[#030303] text-sm font-roboto leading-[40px] outline-none"
              placeholder="End time"
              step="1800"
              value={time.end}
              onChange={(e) => handleAvailableTimesChange(day, timeIndex, 'end', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
      <div className="self-start w-full mt-10">
        <InputText text="Enter your name" />
        <InputField placeholder="Your name" value={listing.user_name} onChange={(e) => setListing({ ...listing, user_name: e.target.value })} />
      </div>
      <div className="self-start w-full mt-10">
        <InputText text="Enter your email" />
        <InputField placeholder="Your email" value={listing.user_email} onChange={(e) => setListing({ ...listing, user_email: e.target.value })} />
      </div>
      <PostButton onClick={handlePostListing} />
    </div>
  );
};

export default ListingPage;