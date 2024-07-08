import React from 'react';
//import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
      </div>
      <Footer />
    </div>
  );
}

export default App;
