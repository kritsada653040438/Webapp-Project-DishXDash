"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { X, Clock, MapPin, Phone, Facebook, Globe, Star, ChevronRight } from 'lucide-react';
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="bg-white rounded-2xl relative max-h-[90vh] w-full max-w-3xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button - แยกออกมาอยู่ด้านบนขวา */}
                        <motion.button 
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={24} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                        </motion.button>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto custom-scrollbar">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">{recipe.title}</h2>

                                <div className="relative">
                                    <img 
                                        src={recipe.image} 
                                        alt={recipe.title} 
                                        className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg" 
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl" />
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-600 text-lg leading-relaxed">{recipe.description}</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {activeTab === 'data' && (
                                        <motion.div
                                            key="data"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            <ul className="grid gap-4">
                                                <li className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <MapPin className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                                                    <span className="text-gray-700">{recipe.data[0]}</span>
                                                </li>
                                                <li className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <Phone className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                                                    <span className="text-gray-700">{recipe.data[1]}</span>
                                                </li>
                                                <motion.li 
                                                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <Facebook className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                                    <a 
                                                        href={recipe.data[2]} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        Facebook Page
                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                    </a>
                                                </motion.li>
                                                <motion.li 
                                                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <Globe className="w-6 h-6 text-violet-500 mr-4 flex-shrink-0" />
                                                    <a 
                                                        href={recipe.data[3]} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        Visit Website
                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                    </a>
                                                </motion.li>
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const RecipeCard = ({ recipe, onViewRecipe, rank }) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => onViewRecipe(recipe)}
    >
        <div className="relative">
            <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {rank && (
            <div className="absolute top-4 left-4 flex items-center space-x-1">
                <div className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded-full font-medium text-sm
                    ${rank === 1 ? 'bg-yellow-500 text-white' : ''} 
                    ${rank === 2 ? 'bg-gray-500 text-white' : ''} 
                    ${rank === 3 ? 'bg-red-500 text-white' : ''} 
                    ${rank > 3 ? 'bg-amber-500 text-white' : ''}
                `}>
                    <Star className="w-4 h-4" />
                    <span>#{rank}</span>
                </div>
            </div>
        )}

        <div className="p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                {recipe.title}
            </h2>
            <p className="text-gray-600 line-clamp-2">
                {recipe.description}
            </p>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{recipe.data[0]}</span>
            </div>
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

    return (
        <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <Container>
                <Navbar />
                <div className="flex-grow py-12 px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Top Restaurant Picks
                        </h1>
                        <p className="text-lg text-gray-600">
                            Discover the finest dining experiences in town, carefully curated for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {topPicks.map((recipe, index) => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onViewRecipe={setSelectedRecipe} 
                                rank={index + 1} 
                            />
                        ))}
                    </div>
                </div>
                <RecipeModal 
                    isOpen={!!selectedRecipe} 
                    onClose={() => setSelectedRecipe(null)} 
                    recipe={selectedRecipe} 
                />
                <Footer />
            </Container>
        </main>
    );
}