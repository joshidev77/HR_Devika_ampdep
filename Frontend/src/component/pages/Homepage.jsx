import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaUserTie, FaQuestionCircle, FaArrowRight, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import robotAnimation from "../animations/animation.json";

const Homepage = () => {
  let navigate = useNavigate();
  const auth = localStorage.getItem("userId");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robotAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {auth && <Navbar />}
      <div className="bg-white">
        <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-2 lg:order-1"
              >
                <Lottie
                  options={defaultOptions}
                  height={"100%"}
                  width={"100%"}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-1 lg:order-2"
              >
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                  Connect & learn
                </p>
                <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-5xl xl:text-6xl">
                  HR देविका
                </h1>
                <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                  Status Code-404
                </p>
                {!auth && (
                  <motion.div
                    className="mt-5 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-blue-600">Already joined us?</p>
                    <button
                      onClick={() => navigate("/login")}
                      className="ml-2 text-purple-600 font-semibold transition-all duration-200 hover:text-purple-800"
                    >
                      Log in
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      {auth && (
        <div className="bg-white from-bg-blue-200 to-bg-blue-500 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-8 sm:mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Select What You Want to Do
            </motion.h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center w-64 h-16"
                onClick={() => navigate("/HR-Interview")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserTie className="text-2xl mr-3" />
                <span>Live HR Interview</span>
                <FaArrowRight className="text-xl ml-3" />
              </motion.button>
              {/* <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center w-64 h-16"
                onClick={() => navigate("/sanskrit")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaQuestionCircle className="text-2xl mr-3" />
                <span>View Q&A</span>
                <FaArrowRight className="text-xl ml-3" />
              </motion.button> */}
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center w-64 h-16"
                onClick={() => navigate("/Employee-portal")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="text-2xl mr-3" />
                <span>Employee Portal</span>
                <FaArrowRight className="text-xl ml-3" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Homepage;
