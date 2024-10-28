// lib/db.js

import mongoose from 'mongoose';

let gridfsBucket;

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return gridfsBucket;
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI);

  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: 'uploads',
  });

  return gridfsBucket;
};

export default connectMongo;
