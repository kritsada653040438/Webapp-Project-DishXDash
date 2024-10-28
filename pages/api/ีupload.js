import nextConnect from 'next-connect';
import multer from 'multer';
import { connectMongo, gridfsBucket } from '../../lib/db';

const upload = multer();

const apiRoute = nextConnect();

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  await connectMongo();

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // สร้าง stream สำหรับการเขียนไฟล์ไปยัง GridFS
  const uploadStream = gridfsBucket.openUploadStream(req.file.originalname);
  uploadStream.write(req.file.buffer, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    uploadStream.end(() => {
      res.status(200).json({ fileId: uploadStream.id });
    });
  });
});

export const config = {
  api: {
    bodyParser: false, // ปิด body parser เพื่อให้ multer ทำงานกับ multipart/form-data
  },
};

export default apiRoute;
