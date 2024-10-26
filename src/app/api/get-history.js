// pages/api/get-history.js
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user's session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB); // เพิ่มการระบุชื่อ database

    // Get food history for the specific user
    const history = await db.collection('foodHistory')
      .find({ userEmail: session.user.email })
      .sort({ selectedAt: -1 })
      .toArray();

    await client.close();

    // ส่ง response พร้อม console.log เพื่อ debug
    console.log('History fetched successfully:', history);
    return res.status(200).json({ history });
    
  } catch (error) {
    console.error('Error in get-history API:', error);
    return res.status(500).json({ message: 'Error fetching food history', error: error.message });
  }
}