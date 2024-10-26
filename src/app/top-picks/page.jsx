"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { X, Clock, MapPin, Phone, Facebook, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecipeModal = ({ isOpen, onClose, recipe }) => {
    const [activeTab, setActiveTab] = useState('data');
  
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
                        <div className="flex justify-end items-center mb-4">
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                            </div>
                        </div>

                        <img src={recipe.image} alt={recipe.title} className="w-full h-80 object-cover rounded-lg mb-6 shadow-md" />

                        <AnimatePresence mode="wait">
                            {activeTab === 'data' && (
                                <motion.div
                                    key="data"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '10px' }}>{recipe.title}</h2>
                                    <p className="text-gray-600 mb-4">{recipe.description}</p>

                                    <ul className="list-none space-y-2">
                                        {recipe.data.map((data, index) => {
                                            if (index > 2) {
                                                return (
                                                    <li key={index} className="website" style={{ padding: '10px', backgroundColor: '#ecf8f8', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <Globe className="w-8 h-8 text-violet-400 hover:text-blue-700 cursor-pointer mr-4" />
                                                        <a href={data} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a>
                                                    </li>
                                                );
                                            } else if (index > 1) {
                                                return (
                                                    <li key={index} className="website" style={{ padding: '10px', backgroundColor: '#ecf8f8', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <Facebook className="w-8 h-8 text-blue-600 hover:text-blue-700 cursor-pointer mr-4" />
                                                        <a href={data} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Page</a>
                                                    </li>
                                                );
                                            } else if (index > 0) {
                                                return (
                                                    <li key={index} className="website" style={{ padding: '10px', backgroundColor: '#ecf8f8', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <Phone className="w-8 h-8 text-green-400 hover:text-blue-700 cursor-pointer mr-4" />
                                                        {data}
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li key={index} className="website" style={{ padding: '10px', backgroundColor: '#ecf8f8', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                                                        <MapPin className="w-8 h-8 text-blue-600 hover:text-blue-700 cursor-pointer mr-4" />
                                                        {data}
                                                    </li>
                                                );
                                            }
                                        })}
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const RecipeCard = ({ recipe, onViewRecipe, rank }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
        onClick={() => onViewRecipe(recipe)}
    >
        <img src={recipe.image} alt={recipe.title} className="w-full object-cover" style={{ height: '200px' }} />

        {rank && (
            <div
                className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full
          ${rank === 1 ? 'bg-yellow-500' : ''} 
          ${rank === 2 ? 'bg-gray-500' : ''} 
          ${rank === 3 ? 'bg-red-500' : ''} 
          ${rank > 3 ? 'bg-amber-500 text-black' : ''}`}
            >
                Top Pick #{rank}
            </div>
        )}

        <div className="p-4 text-left">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
        </div>
    </motion.div>
);

export default function Toppick() {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [topPicks, setTopPicks] = useState([]);
    const { data: session } = useSession();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/restaurants.json');
                const data = await response.json();
                setTopPicks(data.topPicks);
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            }
        };

        fetchData();
    }, []);

    if (!session) redirect("/login");

    const handleViewRecipe = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const handleCloseModal = () => {
        setSelectedRecipe(null);
    };
    
    return (
        <main className="bg-gray-100 min-h-screen">
            <Container>
                <Navbar />
                <div className="flex-grow text-center py-10 px-4">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">Top Picks - Restaurants</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: '70px' }}>
                        {topPicks.map((recipe, index) => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onViewRecipe={handleViewRecipe} 
                                rank={index + 1} 
                            />
                        ))}
                    </div>
                </div>
                <RecipeModal 
                    isOpen={!!selectedRecipe} 
                    onClose={handleCloseModal} 
                    recipe={selectedRecipe} 
                />
                <Footer />
            </Container>
        </main>
    );
}