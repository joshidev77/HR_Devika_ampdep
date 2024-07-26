import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./component/pages/Login";
import Homepage from "./component/pages/Homepage";
import HRInterview from "./component/pages/HRInterview.jsx";
import AboutUs from "./component/pages/AboutUs";
import ContactUs from "./component/pages/contactUs.jsx";
import ProfilePage from "./component/pages/profile_page.jsx";
import ProfileEditPage from "./component/pages/profile_edit_page.jsx";
import ProtectedRoutes from "../src/context/ProtectedRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import EmployeePage from "./component/pages/EmployeePage.jsx";
import SearchPage from "./component/pages/SearchPage.jsx";

const AppRoutes = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/homepage"
              element={
                <ProtectedRoutes>
                  <Homepage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/HR-Interview"
              element={
                <ProtectedRoutes>
                  <HRInterview />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/Employee-portal"
              element={
                <ProtectedRoutes>
                  <EmployeePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/search-candidate"
              element={
                <ProtectedRoutes>
                  <SearchPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/about-us"
              element={
                <ProtectedRoutes>
                  <AboutUs />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoutes>
                  <ContactUs />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/editprofile"
              element={
                <ProtectedRoutes>
                  <ProfileEditPage />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
};

export default AppRoutes;
