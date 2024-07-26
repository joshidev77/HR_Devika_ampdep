import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SearchPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Search for the keywords</h1>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Type your search query here..."
            />
          </div>
          <div className="flex justify-center">
            <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500">
              Search
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
