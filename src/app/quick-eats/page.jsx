"use client";
import React, { useState, useEffect } from 'react';
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
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes.json');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.recipes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (!session) redirect("/login");

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  if (loading) {
    return (
      <main className="bg-gray-100 min-h-screen">
        <Container>
          <Navbar session={session}/>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
          <Footer />
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-100 min-h-screen">
        <Container>
          <Navbar session={session}/>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-xl text-red-600">เกิดข้อผิดพลาด: {error}</div>
          </div>
          <Footer />
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Container>
        <Navbar session={session}/>
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