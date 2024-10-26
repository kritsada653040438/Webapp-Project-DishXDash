// app/api/get-history/route.js
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB);

    // Get food history for the specific user
    const history = await db.collection('foodHistory')
      .find({ userEmail: session.user.email })
      .sort({ selectedAt: -1 })
      .toArray();

    await client.close();

    return NextResponse.json({ history });
    
  } catch (error) {
    console.error('Error in get-history API:', error);
    return NextResponse.json(
      { message: 'Error fetching food history', error: error.message },
      { status: 500 }
    );
  }
}