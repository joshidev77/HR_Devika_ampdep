import React from "react";
import "../css/AboutUs.css";
import bhuvi from "../assets/github.jpg";
import dev from "../assets/github1.jpg";
import harsh from "../assets/github2.jpg";
import sujal from "../assets/github3.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";

const TeamMemberCard = ({ name, position, imgSrc, social }) => {
  return (
    <div className="column">
      <div className="card">
        <div>
          <img className="img-container" src={imgSrc} alt={name} />
        </div>
        <h3>{name}</h3>
        <p>{position}</p>
        <div className="icons">
          {social.map((link, index) => (
            <a href={link.url} key={index} target="_blank">
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamSection = ({ teamData }) => {
  return (
    <>
      <Navbar />
      <section className="root1">
        <div className="row">
          <h1 className="h11">Our Team</h1>
        </div>
        <div className="row">
          {teamData.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </section>
    </>
  );
};

const jsonData = [
  {
    name: "Bhuvnesh Sanathara",
    position: "Full Stack Developer",
    imgSrc: bhuvi,
    social: [
      { url: "https://twitter.com/bhuvisanathra", icon: "fab fa-twitter" },
      {
        url: "https://www.linkedin.com/in/bhuvisanathara/",
        icon: "fab fa-linkedin",
      },
      { url: "https://github.com/bhuvisanathra", icon: "fab fa-github" },
    ],
  },
  {
    name: "Dev Joshi",
    position: "Backend Developer",
    imgSrc: dev,
    social: [
      {
        url: "https://x.com/Dev_Joshi_0910?t=oqB5G_fd8Q-gKRp6sKZiwA&s=09",
        icon: "fab fa-twitter",
      },
      { url: "https://www.linkedin.com/in/devjjoshi", icon: "fab fa-linkedin" },
      { url: "https://github.com/joshidev77", icon: "fab fa-github" },
    ],
  },
  {
    name: "Harsh Langaliya",
    position: "Full Stack Developer",
    imgSrc: harsh,
    social: [
      { url: "https://x.com/Harsh_6045", icon: "fab fa-twitter" },
      {
        url: "https://www.linkedin.com/in/harsh-langaliya/",
        icon: "fab fa-linkedin",
      },
      { url: " https://github.com/harsh6045", icon: "fab fa-github" },
    ],
  },
  {
    name: "Sujal Vadgama",
    position: "Cloud Computing",
    imgSrc: sujal,
    social: [
      { url: "https://x.com/Harsh_6045", icon: "fab fa-twitter" },
      {
        url: "https://www.linkedin.com/in/harsh-langaliya/",
        icon: "fab fa-linkedin",
      },
      { url: " https://github.com/harsh6045", icon: "fab fa-github" },
    ],
  },
];

const App = () => {
  return (
    <>
      <div>
        <TeamSection teamData={jsonData} />
      </div>
      <Footer />
    </>
  );
};

export default App;
