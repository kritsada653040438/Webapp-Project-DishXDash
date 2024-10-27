"use client";
import { useRef, useState, useEffect } from "react"; // Consolidate imports here
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Fireworks from "./fireworks"; // นำเข้า Fireworks component
import foodList from "./foodlists";

export default function Discover() {
  const [foodItems, setFoodItems] = useState(foodList); // ใช้รายการอาหารเริ่มต้นจาก Foodlist.js
  const [usedFoodItems, setUsedFoodItems] = useState([]); // รายการที่สุ่มไปแล้ว
  const [newFood, setNewFood] = useState({ name: "", info: "", img: null });
  const [displayedFood, setDisplayedFood] = useState({ name: "Name of Food", info: "Info of Food", img: "/images/randomfood2.jpg" });
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFood, setModalFood] = useState({ name: "", info: "", img: "" });
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false); // สถานะสำหรับการแสดงผลพลุ
  const [showSettings, setShowSettings] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [settingsClass, setSettingsClass] = useState("-translate-x-full opacity-0");
  const [isCheckAll, setIsCheckAll] = useState(true); // Default Check All to true
  const [markedItems, setMarkedItems] = useState([]); // Track unchecked items
  // Initialize audio elements
  const fireworksSoundRef = useRef(new Audio("/fireworks.mp3"));
  const cheeringSoundRef = useRef(new Audio("/cheering.mp3"));
  const pixelSoundRef = useRef(new Audio("/pixel-song.mp3"));
  const randomBeepRef = useRef(new Audio("/random-beep.mp3"));
  useEffect(() => {
    const audio = pixelSoundRef.current;
    audio.loop = true;
    audio.muted = true; // Start muted to improve autoplay chances

    const shouldPlay = sessionStorage.getItem("audioShouldPlay");

    const playAudio = async () => {
      try {
        await audio.play();
        console.log("Audio is playing in loop mode.");
        if (shouldPlay) {
          audio.muted = false; // Unmute if autoplay is allowed
        }
      } catch (error) {
        console.log("Autoplay blocked. Waiting for user interaction.");
        // Listen for a user interaction to unmute the audio
        document.addEventListener("click", () => {
          audio.muted = false;
          audio.play();
          console.log("Audio unmuted after interaction.");
        }, { once: true });
      }
    };

    playAudio();
    sessionStorage.setItem("audioShouldPlay", "true");

    // Cleanup to stop audio on component unmount
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

 // Function to handle individual item checks
const handleMarkItem = (foodName) => {
  setMarkedItems((prev) => {
    const updatedMarkedItems = prev.includes(foodName)
      ? prev.filter((item) => item !== foodName) // Remove from markedItems if checked
      : [...prev, foodName]; // Add to markedItems if unchecked

    // Update Check All state based on individual checkboxes
    setIsCheckAll(updatedMarkedItems.length === 0);
    return updatedMarkedItems;
  });
};

// Function to handle Check All toggle
const handleCheckAll = () => {
  if (isCheckAll) {
    setMarkedItems(foodItems.map(food => food.name)); // Uncheck all items
  } else {
    setMarkedItems([]); // Check all items
  }
  setIsCheckAll(!isCheckAll); // Toggle Check All state
};
  

  useEffect(() => {
    if (showSettings) {
      setSettingsClass("translate-x-0 opacity-100");
    } else {
      setSettingsClass("-translate-x-full opacity-0");
    }
  }, [showSettings]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

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
    setDisplayedFood({ name: "Name of Food", info: "Info of Food", img: "/images/randomfood2.jpg" });
  };

  const deleteAllFoodItems = () => {
    setFoodItems([]);
    setUsedFoodItems([]);
    setDisplayedFood({ name: "Name of Food", info: "Info of Food", img: "/images/randomfood2.jpg" });
  };

 // ฟังก์ชันสุ่มอาหาร โดยสุ่มเฉพาะรายการที่ไม่ได้อยู่ใน usedFoodItems
 const handleRandomizeFood = () => {
  const availableFoods = foodItems.filter(food => !markedItems.includes(food.name));

  if (availableFoods.length === 0) {
    alert("ไม่มีรายการอาหารที่พร้อมสุ่ม กรุณาเลือกอาหารใน Settings");
    return;
  }

  // Reset usedFoodItems if more than 2/3 of the list has been used
  if (usedFoodItems.length >= (2 / 3) * availableFoods.length) {
    setUsedFoodItems([]);
  }

  // Create a weighted list with a 5% chance for previously chosen items
  const weightedFoods = availableFoods.flatMap(food =>
    usedFoodItems.includes(food.name) ? Array(1).fill(food) : Array(20).fill(food)
  );

  // Start randomization effect
  setIsRandomizing(true);
  const audio = randomBeepRef.current;
    audio.loop = true;
    audio.volume = 0.1; // Set volume to 20% of maximum volume
    audio.play();
  const interval = setInterval(() => {
    const randomFood = weightedFoods[Math.floor(Math.random() * weightedFoods.length)];
    setDisplayedFood({
      ...randomFood,
      info: truncateText(randomFood.info, 30)
    });
  }, 100);

  // Final selection after randomization effect
  setTimeout(() => {
    clearInterval(interval);
    const finalFood = weightedFoods[Math.floor(Math.random() * weightedFoods.length)];
    setDisplayedFood(finalFood);

    // Add the final selection to usedFoodItems if not already present
    if (!usedFoodItems.includes(finalFood.name)) {
      setUsedFoodItems([...usedFoodItems, finalFood.name]);
    }

    setIsRandomizing(false);
    setIsConfirmEnabled(true);
    audio.pause(); // Stop the audio
      audio.currentTime = 0; // Reset to the beginning
  }, 3000);
};


  
  
  
  

  const handleConfirmFood = () => {
    openModal(displayedFood); // เปิดโมดัลพร้อมแสดงข้อมูลอาหารเต็มรูปแบบ
  
    // ตั้งค่าให้แสดงข้อความ "คุณเลือกอาหารนี้"
    setShowConfirmationMessage(true);
  
    // แสดงพลุ
    setShowFireworks(true);
    // Start playback of both sounds
    fireworksSoundRef.current.play();
    cheeringSoundRef.current.play();

  };

  // ฟังก์ชันเปิดป๊อปอัปแสดงข้อมูลอาหาร
const openModal = (food) => {
  setModalFood(food); // ตั้งค่าอาหารที่จะแสดง
  setShowModal(true); // เปิดป๊อปอัป
  setShowConfirmationMessage(false);
  setShowFireworks(false); // ปิดพลุ ถ้าเปิดอยู่
};

const closeModal = () => {
  setShowModal(false);
  setShowConfirmationMessage(false);
  setShowFireworks(false); // ปิดพลุเมื่อปิดป๊อปอัป
  
  // Stop and reset the audio
  // Stop and reset audio when closing modal
  fireworksSoundRef.current.pause();
  cheeringSoundRef.current.pause();
  fireworksSoundRef.current.currentTime = 0;
  cheeringSoundRef.current.currentTime = 0;
};



  // ฟังก์ชันแสดงรายการอาหาร
  const displayFoodList = () => {
    return foodItems.map((food, index) => (
      <div
        key={index}
        className={`p-4 rounded-lg shadow-md flex justify-between items-center hover:translate-y-[-5px] transition-transform duration-300 ${
          markedItems.includes(food.name) ? 'bg-red-300' : food.img ? 'bg-[#caed9d]' : 'bg-[#ffd6a5]'
        }`}
        onClick={() => openModal(food)}
      >
        <span className="truncate w-2/3">{food.name}</span>
        <button
          className="bg-red-400 text-white w-8 h-8 rounded-md flex items-center justify-center"
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
  
  
  

  const closeEditPopup = () => {
    setEditFood(null);
  };

  const updateFoodItem = (index, updatedFood) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index] = updatedFood;
    setFoodItems(newFoodItems);
  };

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไขแล้ว รวมถึงการอัปเดตรูปภาพใหม่
const handleSaveEdit = () => {
  // สร้างสำเนาของ foodItems แล้วแก้ไขรายการที่เลือก
  const updatedFoodItems = [...foodItems];
  
  // เช็คและอัปเดตค่ารูปภาพ
  updatedFoodItems[editFood.index] = {
    ...updatedFoodItems[editFood.index],
    name: editFood.name,
    info: editFood.info,
    img: editFood.img, // ตั้งค่ารูปภาพใหม่ (URL)
  };

  // ตั้งค่า foodItems ใหม่ เพื่อให้ React รีเรนเดอร์
  setFoodItems(updatedFoodItems);

  // ปิดป๊อปอัปหลังจากบันทึก
  setIsEditModalOpen(false);
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูลที่ถูกแก้ไข (รวมถึงการอัปโหลดรูปภาพใหม่)
const handleEditChange = (key, value) => {
  // อัปเดตค่าใน editFood โดยตรง
  setEditFood((prevEditFood) => ({
    ...prevEditFood,
    [key]: value,
  }));
};




  const handleEditFood = (food, index) => {
    setEditFood({ ...food, index, fileName: '' }); // รวมถึงการบันทึกชื่อไฟล์ (fileName) หากต้องการแสดงผล
    setIsEditModalOpen(true); // เปิดป๊อปอัปเพื่อให้ผู้ใช้สามารถแก้ไขได้
  };



  return (
    <main
      className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col font-sarabun font-bold"
      style={{
        backgroundImage: "url('/images/window.jpg')", // ตั้งค่าพื้นหลังจากภาพ food_bg.jpg
      }}>
      <Navbar />
      <Container>
  <div className="font-sans bg-opacity-75 bg-white p-10 min-h-screen flex flex-col items-center">
    <h1 className="text-5xl sm:text-6xl md:text-7xl text-center text-[#9379C2] font-bold font-serif mb-10 drop-shadow-lg shadow-[#a6a5d1] transition-all duration-300 ease-in-out hover:scale-105 hover:text-[#B09AC7]">
      Dish Randomizer
    </h1>

    <div className="flex flex-col min-733:flex-row justify-between space-y-8 min-733:space-y-0 min-733:space-x-8 w-full max-w-5xl mb-10">
  <div className="bg-[#d6e6f2] w-full min-733:w-1/2 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <input
          className="w-full p-3 mb-4 border rounded-lg"
          type="text"
          placeholder="เพิ่มชื่ออาหารที่นี่"
          maxLength="30"
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
            if (inputText.length <= 1000 && lines.length <= 30) {
              setNewFood({ ...newFood, info: inputText });
            } else {
              const truncatedText = inputText.slice(0, 1000);
              const truncatedLines = truncatedText.split('\n').slice(0, 30).join('\n');
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

      <div className="bg-[#e1eec3] min-733:w-1/2 w-full p-8 rounded-lg shadow-lg flex flex-col items-center relative">
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
              <div className="flex space-x-4 w-full">
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
                  <img src="/images/magnifying-glass.png" alt="magnifying glass" className="w-6 h-6"/>
                </button>
              </div>
            </div>
          </div>

    <div className="bg-white w-full max-w-5xl p-8 rounded-lg shadow-lg mb-10">
  <h3 className="text-xl font-semibold mb-4">Dash List</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 max-834:grid-cols-3 max-640:grid-cols-2 max-431:grid-cols-1 gap-4">
    {displayFoodList()}
  </div>
</div>





<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-5xl">
    {/* ปุ่ม */}
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-5xl">
  <button
    className="w-full bg-[#a8e6cf] p-4 rounded-lg text-white shadow-lg hover:bg-[#88d8b0]"
    onClick={resetFoodList}
  >
    RESET
  </button>
  <button
    className="w-full bg-[#f5a9ac] p-4 rounded-lg text-white shadow-lg hover:bg-[#f2888b]"
    onClick={deleteAllFoodItems}
  >
    DELETE ALL
  </button>
  <button
    className="w-full bg-[#a0d8ef] p-4 rounded-lg text-white shadow-lg hover:bg-[#8ac9e2]"
    onClick={toggleSettings}
  >
    SETTINGS
  </button>
</div>
</div>
</div>
</Container>


      {/* ป๊อปอัปสำหรับแสดงข้อความยืนยัน */}
    {showModal && (
      <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="relative flex flex-col items-center justify-center">
          {/* การแสดงข้อความ "คุณเลือกอาหารนี้" */}
          {showConfirmationMessage && (
            <div 
              className="absolute bg-white text-center rounded-lg shadow-lg px-8 py-4"
              style={{
                bottom: '100%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                marginBottom: '10px'
              }}
            >
              <p className="text-green-500 text-xl font-semibold">คุณเลือกอาหารนี้</p>
            </div>
          )}
          
          <div 
            className="bg-white p-6 rounded-lg shadow-lg text-center relative"
            style={{
              width: '90vw',
              maxWidth: '400px',
              maxHeight: '60vh',
              overflowY: 'auto'
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
{showSettings && (
  <div
    className={`fixed inset-y-0 left-0 bg-white shadow-lg p-6 w-64 transform transition-transform transition-opacity duration-500 ease-out ${
      showSettings ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`}
  >
    {/* Close Button at the Top Right */}
    <button 
      className="absolute top-4 right-4 text-gray-600 text-xl font-bold" 
      onClick={() => setShowSettings(false)}
    >
      ×
    </button>

    <h3 className="text-lg font-semibold mb-4">Food List Settings</h3>
    
    {/* Check All Checkbox */}
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="checkbox"
        className="w-5 h-5 appearance-none border border-gray-300 rounded-sm checked:bg-green-200 checked:before:content-['✓'] checked:before:text-white checked:before:text-lg flex items-center justify-center"
        checked={isCheckAll}
        onChange={handleCheckAll}
      />
      <label className="text-gray-700 font-semibold">Check All</label>
    </div>

    {/* Food List Items with Individual Checkboxes */}
    <div className="flex flex-col space-y-2">
      {foodItems.map((food, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-md flex justify-between items-center transition-transform duration-300 ${
            markedItems.includes(food.name) ? 'bg-red-300' : food.img ? 'bg-[#caed9d]' : 'bg-[#ffd6a5]'
          }`}
        >
          <span className="truncate w-2/3 pr-4 font-semibold">{food.name}</span>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-500"
              onClick={() => handleEditFood(food, index)}
            >
              <img src="/images/gear-icon.png" alt="Edit" className="w-5 h-5" />
            </button>
            <input
              type="checkbox"
              className="w-5 h-5 appearance-none border border-gray-300 rounded-sm checked:bg-green-200 checked:before:content-['✓'] checked:before:text-white checked:before:text-lg flex items-center justify-center"
              checked={!markedItems.includes(food.name)} // Checked if not in markedItems
              onChange={() => handleMarkItem(food.name)}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}




{isEditModalOpen && (
  <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 max-w-full">
      {/* ปุ่มปิดกากะบาท */}
      <button 
        className="absolute top-4 right-4 text-gray-600 text-xl font-bold" 
        onClick={() => setIsEditModalOpen(false)}
      >
        ×
      </button>
      
      <h2 className="font-semibold text-2xl mb-6 text-[#4d4c7d]">แก้ไขข้อมูลอาหาร</h2>
      
      {/* อินพุตชื่ออาหาร */}
      <input
        type="text"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c3bef0]"
        value={editFood.name}
        onChange={(e) => handleEditChange('name', e.target.value)}
        placeholder="ชื่ออาหาร"
      />
      
      {/* อัพโหลดรูปภาพ */}
      <div className="w-full p-3 mb-4 border rounded-lg bg-white flex items-center justify-center">
        <input
          id="fileInput"
          className="w-full cursor-pointer"
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            handleEditChange('img', file ? URL.createObjectURL(file) : null);
            handleEditChange('fileName', file ? file.name : "");
          }}
        />
      </div>
      
      {/* ข้อมูลอาหาร */}
      <textarea
        className="w-full p-3 mb-4 border rounded-lg resize-y min-h-[150px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#c3bef0]"
        value={editFood.info}
        onChange={(e) => handleEditChange('info', e.target.value)}
        placeholder="ข้อมูลอาหาร"
      ></textarea>
      
      {/* ปุ่มบันทึก */}
      <button 
        className="w-full bg-[#c3bef0] p-4 rounded-lg text-white shadow-lg hover:bg-[#a59aca]"
        onClick={handleSaveEdit}
      >
        บันทึก
      </button>
    </div>
  </div>
)}

      {showFireworks && <Fireworks />} {/* แสดงพลุเมื่อกดปุ่ม Confirm */}
      <Footer />
    </main>
  );
}