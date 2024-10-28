import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js'; // Ensure the .js extension is added
import Footer from './components/Footer.js'; // Ensure the .js extension is added
import PostListings from './pages/PostListings.js'; // Ensure the .js extension is added
import SuggestListing from './pages/SuggestListing.js'; // Ensure the .js extension is added
import ShoppingBasket from './pages/ShoppingBasket.js'; // Ensure the .js extension is added
import AboutUsPage from './pages/AboutUsPage.js'; // Ensure the .js extension is added
import ContactUs from './pages/ContactPage.js'; // Ensure the .js extension is added
import ListingPage from './pages/ListingPage.js'; // Ensure the .js extension is added
import HomePage from './pages/HomePage.js'; // Ensure the .js extension is added
import SignInPage from './pages/SignInPage.js'; // Ensure the .js extension is added
import SignUpPage from './pages/SignUpPage.js'; // Ensure the .js extension is added
import PersonalProfile from './pages/PersonalProfile.js'; // Ensure the .js extension is added
import PropertyDetails from './pages/PropertyDetails.js'; // Ensure the .js extension is added
import ListersProfile from './pages/ListersProfile.js'; // Ensure the .js extension is added
import Success from './pages/Success.js'; // Ensure the .js extension is added
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './context/AuthContext.js'; // Ensure the .js extension is added
import { BasketProvider } from './context/BasketContext.js'; // Ensure the .js extension is added

// Load your publishable key from the Stripe dashboard
const stripePromise = loadStripe('pk_test_51PKNI2GDWcOLiYf2jKY1gkCudeZCUSiPVQFMno0rYR7eZzdtbCWRaMKkKFcRKwRkR3x5vpciTQyAyvxswHauk70g00tOcFkqmP');

function App() {
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <AuthProvider>
      <BasketProvider>
        <div className="relative w-full min-h-screen">
          {/* Grey borders matching footer color */}
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
