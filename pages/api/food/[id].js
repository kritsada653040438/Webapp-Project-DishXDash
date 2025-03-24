import connectMongo from '../../../lib/db';
import Food from '../../../models/food';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // ปิดการใช้ body parser เพื่อใช้ formidable
  },
};

export default async function handler(req, res) {
  await connectMongo();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'POST': // เพิ่มข้อมูลและรูปภาพใหม่
      const formPost = new formidable.IncomingForm();
      formPost.uploadDir = "./public/uploads"; 
      formPost.keepExtensions = true; 

      formPost.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ message: "Error parsing form data", error: err });
        }

        const { name, info, userId } = fields;

        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        let imgPath;
        if (files.img) {
          const oldPath = files.img.filepath;
          const newPath = path.join(formPost.uploadDir, files.img.originalFilename);
          fs.renameSync(oldPath, newPath);
          imgPath = `/uploads/${files.img.originalFilename}`;
        }

        try {
          const newFood = new Food({
            name,
            info,
            img: imgPath,
            userId
          });

          await newFood.save();
          res.status(201).json(newFood);
        } catch (error) {
          res.status(500).json({ message: "Error adding food item", error });
        }
      });
      break;

    case 'PUT': // แก้ไขข้อมูลและรูปภาพ
      const formPut = new formidable.IncomingForm();
      formPut.uploadDir = "./public/uploads";
      formPut.keepExtensions = true;

      formPut.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ message: "Error parsing form data", error: err });
        }

        const { name, info, userId } = fields;

        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        let imgPath = fields.img;
        if (files.img) {
          const oldPath = files.img.filepath;
          const newPath = path.join(formPut.uploadDir, files.img.originalFilename);
          fs.renameSync(oldPath, newPath);
          imgPath = `/uploads/${files.img.originalFilename}`;
        }

        try {
          const updatedFood = await Food.findOneAndUpdate(
            { _id: id, userId }, 
            { name, info, img: imgPath },
            { new: true }
          );

          if (!updatedFood) {
            return res.status(404).json({ message: "Food item not found or user not authorized" });
          }

          res.status(200).json(updatedFood);
        } catch (error) {
          res.status(500).json({ message: "Error updating food item", error });
        }
      });
      break;

    case 'DELETE': // ลบข้อมูลและรูปภาพ
      try {
        const foodItem = await Food.findOneAndDelete({ _id: id, userId: req.body.userId });

        if (!foodItem) {
          return res.status(404).json({ message: "Food item not found or user not authorized" });
        }

        // ลบไฟล์ภาพออกจากเซิร์ฟเวอร์
        if (foodItem.img) {
          const imgPath = path.join(process.cwd(), 'public', foodItem.img);
          fs.unlink(imgPath, (err) => {
            if (err) console.error("Error deleting image:", err);
          });
        }

        res.status(200).json({ message: "Food item deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting food item", error });
      }
      break;

    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
