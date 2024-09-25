"use client"
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function TopPick() {

    const { data: session } = useSession();
    if (!session) redirect("/login");
    console.log(session)

  return (
    <main>
      <Container>
        <Navbar session={session}/>
          <div className="flex-grow text-center p-10">
            
          </div>
        <Footer />
      </Container>
    </main>
    
  );
}