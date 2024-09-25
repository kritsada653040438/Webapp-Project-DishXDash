"use client";

import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main
      className="bg-cover bg-center min-h-screen flex flex-col"
      style={{ backgroundImage: "url('/images/food_bg.jpg')" }}
    >
      <Container>
        <Navbar session={session} />
        <div className="flex-grow flex flex-col justify-center text-center p-6 w-3/4 ml-auto"> {/* w-3/4 ทำให้คอนเทนต์ครอบคลุม 75% ของความกว้าง */}
          <h3 className="text-6xl font-bold text-black mb-4">
            Welcome to DishXDash!
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover quick and easy meal options that fit your busy lifestyle. Our platform allows you to explore a variety of delicious dishes, perfect for any occasion. Whether you're looking for a quick breakfast, a satisfying lunch, or a delightful dinner, we've got you covered!
          </p>

          {/* Call to Action Button */}
          <div className="mt-8">
            <Link href="/discover">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-700 transition duration-200 transform hover:scale-105">
                Start eating!
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
