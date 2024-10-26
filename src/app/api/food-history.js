// pages/api/food-history.js
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user's session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { foodName, foodInfo, foodImg } = req.body;
    
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Insert the food selection into the history collection
    const result = await db.collection('foodHistory').insertOne({
      userEmail: session.user.email,
      foodName,
      foodInfo,
      foodImg,
      selectedAt: new Date(),
    });

    await client.close();

    res.status(200).json({ message: 'Food history saved successfully' });
  } catch (error) {
    console.error('Error saving food history:', error);
    res.status(500).json({ message: 'Error saving food history' });
  }
}