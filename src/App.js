import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostListings from './pages/PostListings';
import SuggestListing from './pages/SuggestListing';
import ShoppingBasket from './pages/ShoppingBasket';
import PersonalProfile from './pages/PersonalProfile';
import './index.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen App">
      <Router>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/postlistings" element={<PostListings />} />
            <Route path="/suggestlisting" element={<SuggestListing />} />
            <Route path="/shoppingbasket" element={<ShoppingBasket />} />
            <Route path="/personalprofile" element={<PersonalProfile />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
