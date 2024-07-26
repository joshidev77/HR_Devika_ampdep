import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../components/Navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";
import { db } from "../../firebase/Firebase";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(100);
  const [earnedPoints, setEarnedPoints] = useState(50); // Get the navigation function
  const [email, setEmail] = useState();
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userId");
    if (storedEmail) {
      setEmail(storedEmail);
      const q = query(
        collection(db, "users"),
        where("Email", "==", storedEmail)
      );
      getQuery(q);
    }
  }, []);

  const getQuery = async (q) => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setData(doc.data());
    });
  };

  const sections = [
    {
      title: "Sanskrit",
      value: Math.round((data?.Sanskrit_point / 300) * 100),
    },
    { title: "Hindi", value: Math.round((data?.Hindi_point / 300) * 100) },
    {
      title: "Gujarati",
      value: Math.round((data?.Gujarati_point / 300) * 100),
    },
    { title: "English", value: Math.round((data?.English_point / 300) * 100) },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={data?.ProfilePicture}
              alt="Profile"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
            {data?.Name}
          </h2>
          <p className="text-gray-600 text-center mb-6">{data?.Email}</p>
          <div className="container mx-auto px-4">
            <div className="points_container text-center mb-8"></div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              onClick={() => navigate("/editprofile")} // Use the navigation function
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
