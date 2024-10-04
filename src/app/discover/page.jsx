"use client";
import { useState } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './styles2.css'; 

export default function Discover() {
  return (
    <main>
      <Navbar />
      <div className="container">
    <h1>Dish Randomizer</h1>

    <div className="flex-row">
        <div className="add-food-section">
            <input type="text" id="food-name" placeholder="add food name here" maxLength="30" />
            <input type="file" id="food-img" placeholder="UPLOAD IMG" />
            <textarea id="food-info" placeholder="add food info here"></textarea>
            <button id="add-food-btn">ADD FOOD</button>
        </div>

        <div id="random-food-section" className="random-food-section">
            <div id="food-name-display">NAMETAG</div>
            <div id="food-img-display">
                <img id="food-img-preview" src="randomfood2.jpg" alt="No Image" />
            </div>
            <div id="food-info-display">show food info here</div>
            <button id="random-btn">RANDOM</button>
            <button className="plus-btn">
                <img src="magnifying-glass.png" alt="magnifying glass" style={{ width: '24px', height: '24px' }} />
            </button>
        </div>
    </div>

    <div className="food-list">
        <h3>Dash List</h3>
        <p>No image upload for some food list</p>
        <div id="food-list"></div>
    </div>

    <div id="food-modal" className="modal">
        <div className="modal-content">
            <span className="close-btn">&times;</span>
            <h2 id="modal-food-name">Food Name</h2>
            <img id="modal-food-img" src="" alt="Food Image" />
            <p id="modal-food-info">Food Info</p>
        </div>
    </div>

    <button id="reset-btn">RESET</button>
    <button id="delete-all-btn">DELETE ALL</button>
</div>
      <Footer />
    </main>
  );
}
