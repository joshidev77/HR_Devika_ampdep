import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { db, storage } from "../../firebase/Firebase";

function ProfileEditPage() {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
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
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      setData(userData);
      setId(doc.id);
      setName(userData?.Name);
      setEmail(userData?.Email);
      setDescription(userData?.Description);
      setPhotoURL(userData?.ProfilePicture);
    } else {
      console.log("No matching documents.");
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let updateData = {
      Name: name,
      Email: email,
      Description: description,
    };

    try {
      if (photo) {
        const imgRef = ref(storage, `files/${v4()}`);
        await uploadBytes(imgRef, photo);
        const downloadURL = await getDownloadURL(imgRef);
        console.log("New file available at", downloadURL);
        updateData.ProfilePicture = downloadURL;
      } else {
        updateData.ProfilePicture = data.ProfilePicture;
      }

      if (id) {
        await updateDoc(doc(db, "users", id), updateData);
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        console.error("Error: ID is null or undefined");
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center mb-4">
              <img
                className="w-32 h-32 rounded-full object-cover"
                src={photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <label
                htmlFor="photo"
                className="ml-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
              >
                Change Photo
              </label>
              <input
                id="photo"
                type="file"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <input
              name="name"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="w-full mt-4 bg-pink-500 text-white font-bold py-2 rounded-md focus:outline-none focus:bg-pink-600 hover:bg-pink-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ProfileEditPage;