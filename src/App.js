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


function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Router>
        <Header />
        <div className="flex-grow">
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/postlistings" element={<PostListings />} />
            <Route path="/suggestlisting" element={<SuggestListing />} />
            <Route path="/shoppingbasket" element={<ShoppingBasket />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
