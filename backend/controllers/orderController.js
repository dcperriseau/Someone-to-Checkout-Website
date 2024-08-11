import { db } from '../adminConfig';

const orderController = {};

// Get orders for a user
orderController.getOrders = async (req, res) => {
  const { uid } = req.user;

  try {
    const orders = [];
    const querySnapshot = await db.collection('orders').where('purchaserUid', '==', uid).get();
    querySnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: error.message });
  }
};

export default orderController;
