import connectMongo from '../../../lib/db';
import Food from '../../../models/food';

export default async function handler(req, res) {
  await connectMongo();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.query; // ดึง userId จาก query
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }
        const userFoods = await Food.find({ userId }); // ดึงข้อมูลอาหารตาม userId
        res.status(200).json(userFoods);
      } catch (error) {
        res.status(500).json({ error: "Error fetching food items" });
      }
      break;

    case 'POST':
      try {
        const { userId, name, info, img } = req.body;
        const newFood = await Food.create({ userId, name, info, img });
        res.status(201).json(newFood);
      } catch (error) {
        res.status(500).json({ error: "Error adding food" });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const { userId } = req.body;
        const deletedFood = await Food.findOneAndDelete({ _id: id, userId });

        if (!deletedFood) {
          return res.status(404).json({ error: "Food item not found" });
        }
        res.status(200).json({ message: "Food item deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting food item" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
