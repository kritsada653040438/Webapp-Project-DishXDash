"use client";

import { useState } from "react";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Discover() {
  const [foodItems, setFoodItems] = useState([]);
  const [usedFoodItems, setUsedFoodItems] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", info: "", img: null });
  const [displayedFood, setDisplayedFood] = useState({ name: "Name of Food", info: "Info of Food", img: null });
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFood, setModalFood] = useState({ name: "", info: "", img: "" });
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const handleAddFood = () => {
    if (!newFood.name || !newFood.info) {
      alert("กรุณาใส่ชื่อและข้อมูลของอาหาร");
      return;
    }
    setFoodItems([...foodItems, newFood]);
    setNewFood({ name: "", info: "", img: null });
    document.getElementById("fileInput").value = null;
  };

  const handleDeleteFood = (index) => {
    const updatedFoodItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedFoodItems);
  };

  const resetFoodList = () => {
    setUsedFoodItems([]);
    setDisplayedFood({ name: "Name of Food", info: "Info of Food", img: null });
  };

  const deleteAllFoodItems = () => {
    setFoodItems([]);
    setUsedFoodItems([]);
    setDisplayedFood({ name: "Name of Food", info: "Info of Food", img: null });
  };

  const handleRandomizeFood = () => {
    const availableFoods = foodItems.filter(food => !usedFoodItems.includes(food.name));
    if (availableFoods.length === 0) {
      alert("ไม่มีรายการอาหารให้สุ่มแล้ว");
      return;
    }

    setIsRandomizing(true);
    const interval = setInterval(() => {
      const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
      setDisplayedFood({
        ...randomFood,
        info: truncateText(randomFood.info, 30)
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
      setDisplayedFood(finalFood);
      setUsedFoodItems([...usedFoodItems, finalFood.name]);
      setIsRandomizing(false);
      setIsConfirmEnabled(true);
    }, 3000);
  };

  const handleConfirmFood = () => {
    openModal(displayedFood); // Opens the modal with full food information
    setShowConfirmationMessage(true);
  };

  const openModal = (food) => {
    setModalFood(food);
    setShowModal(true);
    setShowConfirmationMessage(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConfirmationMessage(false);
  };

  const displayFoodList = () => {
    return foodItems.map((food, index) => (
      <div
        key={index}
        className={`p-4 rounded-lg shadow-md flex justify-between items-center hover:translate-y-[-5px] transition-transform duration-300 ${
          usedFoodItems.includes(food.name)
            ? 'bg-red-300'
            : food.img
            ? 'bg-[#caed9d]'
            : 'bg-[#ffd6a5]'
        }`}
        onClick={() => openModal(food)}
      >
        <span className="truncate w-2/3">{food.name}</span>
        <button
          className="bg-red-500 text-white p-2 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteFood(index);
          }}
        >
          X
        </button>
      </div>
    ));
  };

  return (
    <main>
      <Navbar />
      <Container>
        <div className="font-sans bg-[#f7f5f2] text-gray-800 p-10 min-h-screen flex flex-col items-center">
          <h1 className="text-4xl text-center text-[#4d4c7d] font-serif mb-10">Dish Randomizer</h1>
          
          <div className="flex justify-between space-x-8 w-full max-w-5xl mb-10">
          <div className="bg-[#d6e6f2] w-1/2 p-8 rounded-lg shadow-lg flex flex-col items-center">
  <input
    className="w-full p-3 mb-4 border rounded-lg"
    type="text"
    placeholder="เพิ่มชื่ออาหารที่นี่"
    maxLength="30" // Set maxLength for input to limit to 20 characters
    value={newFood.name}
    onChange={(e) => setNewFood({ ...newFood, name: e.target.value.substring(0, 30) })}
  />
  <div className="w-full p-3 mb-4 border rounded-lg bg-white flex items-center justify-center">
    <input
      id="fileInput"
      className="w-full cursor-pointer"
      type="file"
      onChange={(e) =>
        setNewFood({ ...newFood, img: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null })
      }
    />
  </div>
  <textarea
  className="w-full p-3 mb-4 border rounded-lg resize-y min-h-[150px] max-h-[150px]"
  placeholder="เพิ่มข้อมูลอาหารที่นี่"
  value={newFood.info}
  onChange={(e) => {
    const inputText = e.target.value;
    const lines = inputText.split('\n');
    
    // ตรวจสอบจำนวนตัวอักษรและจำนวนบรรทัด
    if (inputText.length <= 1000 && lines.length <= 30) {
      setNewFood({ ...newFood, info: inputText });
    } else {
      // จำกัดข้อมูลที่เกิน
      const truncatedText = inputText.slice(0, 1000); // จำกัดตัวอักษรที่ 1000 ตัวอักษร
      const truncatedLines = truncatedText.split('\n').slice(0, 30).join('\n'); // จำกัดบรรทัดที่ 30 บรรทัด
      alert("สามารถป้อนข้อมูลได้สูงสุด 1000 ตัวอักษร และไม่เกิน 30 บรรทัด");
      setNewFood({ ...newFood, info: truncatedLines });
    }
  }}
></textarea>




  <button
    className="w-full bg-[#c3bef0] p-4 rounded-lg text-white shadow-lg hover:bg-[#a59aca]"
    onClick={handleAddFood}
  >
    ADD FOOD
  </button>
</div>


            <div className="bg-[#e1eec3] w-1/2 p-8 rounded-lg shadow-lg flex flex-col items-center relative">
              <div className="w-full p-3 bg-white text-center rounded-lg mb-4">
                {displayedFood.name}
              </div>
              <img
                className="w-full h-40 object-cover rounded-lg mb-4"
                src={displayedFood.img || "https://via.placeholder.com/300"}
                alt="No Image"
              />
              <div className="w-full p-3 bg-white text-center rounded-lg mb-4">
                {truncateText(displayedFood.info, 30)}
              </div>
              <div className="flex space-x-4">
                <button
                  className={`w-full p-4 rounded-lg text-white shadow-lg ${
                    isRandomizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c3bef0] hover:bg-[#a59aca]'
                  }`}
                  onClick={handleRandomizeFood}
                  disabled={isRandomizing}
                >
                  RANDOM
                </button>
                <button
                  className={`w-full p-4 rounded-lg text-white shadow-lg ${
                    isConfirmEnabled ? 'bg-[#a8e6cf] hover:bg-[#88d8b0]' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleConfirmFood}
                  disabled={!isConfirmEnabled}
                >
                  CONFIRM
                </button>
                <button
                  className="absolute top-4 right-4 bg-[#e0f7da] w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                  onClick={() => openModal(displayedFood)}
                >
                  <img src="magnifying-glass.png" alt="magnifying glass" className="w-6 h-6"/>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white w-full max-w-5xl p-8 rounded-lg shadow-lg mb-10">
            <h3 className="text-xl font-semibold mb-4">Dash List</h3>
            <p className="text-gray-600 mb-4">No image upload for some food list</p>
            <div className="grid grid-cols-5 gap-4">
              {displayFoodList()}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              className="bg-[#7fd8be] p-4 rounded-lg text-white shadow-lg hover:bg-[#6fc1a4]"
              onClick={resetFoodList}
            >
              RESET
            </button>
            <button
              className="bg-[#c3bef0] p-4 rounded-lg text-white shadow-lg hover:bg-[#a59aca]"
              onClick={deleteAllFoodItems}
            >
              DELETE ALL
            </button>
          </div>
        </div>
      </Container>

      {showModal && (
  <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="relative flex flex-col items-center justify-center">
    {showConfirmationMessage && (
      <div 
        className="absolute bg-white text-center rounded-lg shadow-lg px-8 py-4"
        style={{
          bottom: '100%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
          marginBottom: '10px' // เพิ่มระยะห่างเล็กน้อยจากส่วนบน
        }}
      >
        <p className="text-green-500 text-xl font-semibold">คุณเลือกอาหารนี้</p>
      </div>
    )}
    
    <div 
      className="bg-white p-6 rounded-lg shadow-lg text-center relative"
      style={{
        width: '90vw', // กำหนดให้เป็น 90% ของความกว้างหน้าจอ
        maxWidth: '400px', // กำหนดขนาดสูงสุดเมื่อหน้าจอใหญ่
        maxHeight: '60vh', // กำหนดความสูงไม่เกิน 60% ของหน้าจอ
        overflowY: 'auto', // ถ้ามีเนื้อหาเยอะจะเลื่อนดูได้
      }}
    >
      <button className="absolute top-4 right-4 text-gray-600 text-xl font-bold" onClick={closeModal}>×</button>
      <h2 
        className="font-semibold text-xl mb-4"
        style={{
          overflowWrap: 'break-word', 
          wordBreak: 'break-word',
          maxWidth: '100%' 
        }}
      >
        {modalFood.name}
      </h2>
      <img src={modalFood.img || "https://via.placeholder.com/300"} alt="Food Image" className="w-full h-40 object-cover rounded-lg mb-4"/>
      <p className="text-gray-700 mb-4 text-left" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', maxWidth: '100%', margin: '0 auto' }}>
        {modalFood.info}
      </p>
    </div>
  </div>
</div>


)}


      <Footer />
    </main>
  );
}
