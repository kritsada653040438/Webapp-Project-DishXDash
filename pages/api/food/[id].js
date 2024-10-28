import connectMongo from '../../../lib/db';
import Food from '../../../models/food';

export default async function handler(req, res) {
  await connectMongo();

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'DELETE':
      try {
        // ตรวจสอบว่ามี userId ใน req.body
        if (!req.body.userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        // ลบรายการอาหารโดยเช็คว่า _id และ userId ตรงกัน
        const deletedFood = await Food.findOneAndDelete({ _id: id, userId: req.body.userId });

        // ตรวจสอบว่ามีรายการอาหารที่ต้องการลบหรือไม่
        if (!deletedFood) {
          return res.status(404).json({ message: "Food item not found or user not authorized" });
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
