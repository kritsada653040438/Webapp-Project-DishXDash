"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { X, Clock, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecipeModal = ({ isOpen, onClose, recipe }) => {
  const [activeTab, setActiveTab] = useState('ingredients');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{recipe.title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{recipe.cookTime} นาที</span>
              </div>
              <div className="flex items-center">
                <BarChart size={16} className="mr-1" />
                <span>ระดับความยาก : {recipe.difficulty}</span>
              </div>
            </div>

            <img src={recipe.image} alt={recipe.title} className="w-full h-80 object-cover rounded-lg mb-6 shadow-md" />

            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'ingredients' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('ingredients')}
              >
                วัตถุดิบ
              </button>
              <button
                className={`px-4 py-2 font-semibold ${activeTab === 'instructions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('instructions')}
              >
                วิธีทำ
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">วัตถุดิบ</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'instructions' && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">วิธีทำ</h3>
                  <ol className="list-decimal list-inside space-y-3">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RecipeCard = ({ recipe, onViewRecipe }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white shadow-lg rounded-lg overflow-hidden"
  >
    <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover"/>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h2>
      <p className="text-gray-600 mb-4">{recipe.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span className="flex items-center"><Clock size={16} className="mr-1" /> {recipe.cookTime} นาที</span>
        <span className="flex items-center"><BarChart size={16} className="mr-1" /> {recipe.difficulty}</span>
      </div>
      <button 
        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={() => onViewRecipe(recipe)}
      >
        ดูสูตร
      </button>
    </div>
  </motion.div>
);

export default function QuickEats() {
  const { data: session } = useSession();
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (!session) redirect("/login");

  const recipes = [
    {
      id: 1,
      title: "ข้าวผัดไข่",
      description: "อาหารจานด่วนแสนอร่อย",
      image: "/images/fried-rice.jpg",
      cookTime: 10,
      difficulty: "ง่าย",
      ingredients: ["ข้าวสวย 1 จาน", "ไข่ไก่ 2 ฟอง", "น้ำมันพืช 2 ช้อนโต๊ะ", "ซีอิ๊วขาว 1 ช้อนโต๊ะ", "ต้นหอม 2 ต้น"],
      instructions: [
        "ตั้งกระทะใส่น้ำมัน พอร้อนใส่ไข่ลงไปผัด",
        "ใส่ข้าวสวยลงไปผัดให้เข้ากัน",
        "ปรุงรสด้วยซีอิ๊วขาว ผัดให้เข้ากัน",
        "โรยต้นหอมซอย ผัดอีกครั้ง",
        "ตักใส่จาน พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 2,
      title: "บะหมี่กึ่งสำเร็จรูป",
      description: "มื้อด่วนทันใจ อิ่มได้ในพริบตา",
      image: "/images/instant-noodles.jpg",
      cookTime: 5,
      difficulty: "ง่ายมาก",
      ingredients: ["บะหมี่กึ่งสำเร็จรูป 1 ซอง", "น้ำเปล่า 1 ถ้วยตวง", "ไข่ไก่ 1 ฟอง (ถ้าต้องการ)"],
      instructions: [
        "ต้มน้ำให้เดือด",
        "ใส่บะหมี่ลงไปต้ม 3 นาที",
        "เติมเครื่องปรุงรสที่มาในซอง คนให้เข้ากัน",
        "หากต้องการเพิ่มไข่ ตอกไข่ลงไปในน้ำซุป",
        "ตักใส่ชาม พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 3,
      title: "ไข่เจียว",
      description: "เมนูง่ายๆ ทานได้ทุกมื้อ",
      image: "/images/omelette.jpg",
      cookTime: 5,
      difficulty: "ง่าย",
      ingredients: ["ไข่ไก่ 2-3 ฟอง", "น้ำมันพืช 2 ช้อนโต๊ะ", "ซีอิ๊วขาว 1/2 ช้อนชา", "พริกไทย (ตามชอบ)"],
      instructions: [
        "ตีไข่ในชามผสมกับซีอิ๊วขาวและพริกไทย",
        "ตั้งกระทะใส่น้ำมัน รอให้ร้อน",
        "เทไข่ลงในกระทะ เกลี่ยให้ทั่ว",
        "พอไข่เริ่มสุก พลิกกลับด้าน ทอดต่ออีกสักครู่",
        "ตักขึ้นจาก พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 4,
      title: "สลัดผักรวม",
      description: "เมนูสุขภาพ สดชื่น อร่อย",
      image: "/images/mixed-salad.jpg",
      cookTime: 10,
      difficulty: "ง่าย",
      ingredients: ["ผักสลัดรวม 1 ถ้วย", "มะเขือเทศราชินี 5-6 ลูก", "แตงกวา 1/2 ลูก", "น้ำสลัด 2 ช้อนโต๊ะ"],
      instructions: [
        "ล้างผักสลัดและผักอื่นๆ ให้สะอาด",
        "หั่นแตงกวาเป็นชิ้นบางๆ ผ่ามะเขือเทศเป็นสองซีก",
        "จัดผักลงในจาน",
        "ราดน้ำสลัดตามชอบ",
        "คลุกเคล้าให้เข้ากัน พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 5,
      title: "แซนด์วิชแฮมชีส",
      description: "อาหารว่างแสนอร่อย ทำง่ายในพริบตา",
      image: "/images/ham-cheese-sandwich.jpg",
      cookTime: 5,
      difficulty: "ง่ายมาก",
      ingredients: ["ขนมปังแผ่น 2 แผ่น", "แฮม 1-2 แผ่น", "ชีสแผ่น 1 แผ่น", "ผักสลัด (ตามชอบ)", "มายองเนส (ตามชอบ)"],
      instructions: [
        "ทามายองเนสบนขนมปังทั้งสองแผ่น",
        "วางแฮมและชีสบนขนมปังแผ่นหนึ่ง",
        "เพิ่มผักสลัดตามชอบ",
        "ปิดทับด้วยขนมปังอีกแผ่น",
        "หั่นครึ่งตามแนวทแยงมุม พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 6,
      title: "ไข่ต้ม",
      description: "อาหารเช้าง่ายๆ อุดมไปด้วยโปรตีน",
      image: "/images/boiled-eggs.jpg",
      cookTime: 7,
      difficulty: "ง่ายมาก",
      ingredients: ["ไข่ไก่ 2-3 ฟอง", "น้ำเปล่า", "เกลือ (ตามชอบ)"],
      instructions: [
        "ใส่น้ำในหม้อ เติมเกลือเล็กน้อย",
        "นำไข่ใส่ลงไปในน้ำ",
        "ต้มน้ำให้เดือด ลดไฟลง",
        "ต้มไข่ต่อ 6-7 นาทีสำหรับไข่ต้มสุก",
        "ตักไข่ขึ้น แช่น้ำเย็นสักครู่ แกะเปลือก พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 7,
      title: "มักกะโรนีผัดซอสมะเขือเทศ",
      description: "พาสต้าแสนอร่อย ทำง่ายใน 15 นาที",
      image: "/images/tomato-pasta.jpg",
      cookTime: 15,
      difficulty: "ปานกลาง",
      ingredients: ["มักกะโรนี 1 ถ้วย", "ซอสมะเขือเทศ 1/2 ถ้วย", "หอมใหญ่ 1/4 หัว", "กระเทียม 2 กลีบ", "น้ำมันมะกอก 2 ช้อนโต๊ะ", "เกลือและพริกไทย (ตามชอบ)"],
      instructions: [
        "ต้มมักกะโรนีตามเวลาที่ระบุบนซอง",
        "สับหอมใหญ่และกระเทียม",
        "ผัดหอมใหญ่และกระเทียมในน้ำมันมะกอกจนหอม",
        "เทซอสมะเขือเทศลงไปผัด",
        "ใส่มักกะโรนีที่ต้มสุกแล้ว คลุกเคล้าให้เข้ากัน",
        "ปรุงรสด้วยเกลือและพริกไทย พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 8,
      title: "สมูทตี้ผลไม้รวม",
      description: "เครื่องดื่มสุขภาพ เต็มไปด้วยวิตามิน",
      image: "/images/fruit-smoothie.jpg",
      cookTime: 5,
      difficulty: "ง่าย",
      ingredients: ["ผลไม้ตามใจชอบ", "นมสด 1 ถ้วย", "น้ำผึ้ง 1 ช้อนโต๊ะ", "น้ำแข็ง (ตามชอบ)"],
      instructions: [
        "หั่นกล้วยเป็นชิ้นๆ",
        "ใส่กล้วย สตรอเบอร์รี่ นมสด น้ำผึ้ง และน้ำแข็งลงในเครื่องปั่น",
        "ปั่นจนส่วนผสมเข้ากันดี",
        "เทใส่แก้ว พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 9,
      title: "ไข่คน",
      description: "อาหารเช้าคลาสสิก ทำง่าย อร่อยได้ใน 5 นาที",
      image: "/images/scrambled-eggs.jpg",
      cookTime: 5,
      difficulty: "ง่าย",
      ingredients: ["ไข่ไก่ 2-3 ฟอง", "นม 2 ช้อนโต๊ะ", "เนยจืด 1 ช้อนชา", "เกลือและพริกไทย (ตามชอบ)"],
      instructions: [
        "ตีไข่กับนมในชาม ปรุงรสด้วยเกลือและพริกไทย",
        "ละลายเนยในกระทะด้วยไฟอ่อน",
        "เทส่วนผสมไข่ลงในกระทะ",
        "ใช้พายคนไข่เบาๆ จนสุกและข้นตามต้องการ",
        "ตักใส่จาน พร้อมเสิร์ฟ"
      ]
    },
    {
      id: 10,
      title: "ขนมปังปิ้งเนยน้ำผึ้ง",
      description: "ขนมหวานง่ายๆ หอมอร่อย",
      image: "/images/honey-toast.jpg",
      cookTime: 5,
      difficulty: "ง่ายมาก",
      ingredients: ["ขนมปังแผ่น 2 แผ่น", "เนยสด 2 ช้อนชา", "น้ำผึ้ง 2 ช้อนชา"],
      instructions: [
        "ปิ้งขนมปังให้กรอบ",
        "ทาเนยสดบนขนมปังขณะยังร้อน",
        "ราดน้ำผึ้งด้านบน",
        "หั่นเป็นชิ้นสามเหลี่ยม พร้อมเสิร์ฟ"
      ]
    },
  ];

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <Container>
        <Navbar session={session} />
        <div className="flex-grow text-center py-10 px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">QuickEats - อาหารทำง่าย รวดเร็วทันใจ</h1>
          <p className="text-xl text-gray-600 mb-8">รวมเมนูอาหารที่ทำได้ง่ายและรวดเร็ว ไม่ต้องใช้เวลานาน!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onViewRecipe={handleViewRecipe} />
            ))}
          </div>
        </div>
        <RecipeModal isOpen={!!selectedRecipe} onClose={handleCloseModal} recipe={selectedRecipe} />
        <Footer />
      </Container>
    </main>
  );
}