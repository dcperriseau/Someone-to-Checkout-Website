import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostListings from './pages/PostListings';
import SuggestListing from './pages/SuggestListing';
import ShoppingBasket from './pages/ShoppingBasket';
import AboutUsPage from './pages/AboutUsPage';
import ContactUs from './pages/Contact Page/ContactPage';
import ListingPage from './pages/ListingPage';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';


function App() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Grey borders matching footer color */}
      <div className="absolute top-0 left-0 w-full h-[10px] bg-gray-100"></div>
      <div className="absolute top-0 left-0 w-[10px] h-full bg-gray-100"></div>
      <div className="absolute top-0 right-0 w-[10px] h-full bg-gray-100"></div>

      <div className="relative App flex flex-col min-h-screen">
        <Router>
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<SignInPage />} />
              <Route path="/postlistings" element={<PostListings />} />
              <Route path="/suggestlisting" element={<SuggestListing />} />
              <Route path="/shoppingbasket" element={<ShoppingBasket />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/listingpage" element={<ListingPage />} />
              <Route path="/aboutus" element={<AboutUsPage />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
