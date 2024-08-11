import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import PostListings from './pages/PostListings.js';
import SuggestListing from './pages/SuggestListing.js';
import ShoppingBasket from './pages/ShoppingBasket.js';
import AboutUsPage from './pages/AboutUsPage.js';
import ContactUs from './pages/ContactPage.js';
import ListingPage from './pages/ListingPage.js';
import HomePage from './pages/HomePage.js';
import SignInPage from './pages/SignInPage.js';
import SignUpPage from './pages/SignUpPage.js';
import PersonalProfile from './pages/PersonalProfile.js';
import PropertyDetails from './pages/PropertyDetails.js';
import ListersProfile from './pages/ListersProfile.js';
import Success from './pages/Success.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './context/AuthContext.js';
import { BasketProvider } from './context/BasketContext.js';

const stripePromise = loadStripe('pk_test_51PKNI2GDWcOLiYf2jKY1gkCudeZCUSiPVQFMno0rYR7eZzdtbCWRaMKkKFcRKwRkR3x5vpciTQyAyvxswHauk70g00tOcFkqmP');

function App() {
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <AuthProvider>
      <BasketProvider>
        <div className="relative w-full min-h-screen">
          <div className="absolute top-0 left-0 w-full h-[10px] bg-borderGrey"></div>
          <div className="absolute top-0 left-0 w-[10px] h-full bg-borderGrey"></div>
          <div className="absolute top-0 right-0 w-[10px] h-full bg-borderGrey"></div>
          <div className="relative flex flex-col min-h-screen App">
            <Router>
              <Header />
              <div className="flex-grow">
                <Elements stripe={stripePromise}>
                  <Routes>
                    <Route path="/" element={<HomePage setSelectedListing={setSelectedListing}/>} />
                    <Route path="/postlistings" element={<PostListings />} />
                    <Route path="/suggestlisting" element={<SuggestListing />} />
                    <Route path="/shoppingbasket" element={<ShoppingBasket />} />
                    <Route path="/contactus" element={<ContactUs />} />
                    <Route path="/listingpage" element={<ListingPage />} />
                    <Route path="/aboutus" element={<AboutUsPage />} />
                    <Route path="/personalprofile" element={<PersonalProfile setSelectedListing={setSelectedListing} />} />
                    <Route path="/listersprofile" element={<ListersProfile />} />
                    <Route path="/propertydetails" element={<PropertyDetails selectedListing={selectedListing} />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} /> 
                    <Route path="/success" element={<Success />} />
                  </Routes>
                </Elements>
              </div>
              <Footer />
            </Router>
          </div>
        </div>
      </BasketProvider>
    </AuthProvider>
  );
}

export default App;
