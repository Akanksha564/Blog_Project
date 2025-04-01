import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const images = [slide1, slide2, slide3];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="slideshow-container">
        <div className="slideshow">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={index === currentIndex ? "active" : ""}
            />
          ))}
        </div>
        <div className="overlay">
          <h1>Welcome to the Blog App</h1>
          <p>Read and share amazing blog posts!</p>
          <Link to="/blogs" className="btn btn-primary">View Blogs</Link>
        </div>
      </div>
    </>
  );
};

export default Home;



