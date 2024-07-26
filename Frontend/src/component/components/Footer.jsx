import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold">Team Status - Code 404</h2>
            <p className="mt-2 text-pink-200">Innovating the future, one line at a time.</p>
          </div>
          <div className="flex space-x-6">
            
          </div>
        </div>
        <div className="border-t border-pink-300 py-6">
          <p className="text-center text-sm text-pink-200">
            © {new Date().getFullYear()} Team Status-Code. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;