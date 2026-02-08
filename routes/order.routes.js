const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const supabase = require("../config/supabaseClient");

// Helper to check admin
const checkAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  return data.is_admin;
};

// Helper to map Order to frontend structure
const mapOrder = (order) => {
    if (!order) return null;
    return {
        _id: order.id,
        user: order.users || order.user_id, // If joined, it's an object, else ID
        orders: order.order_items ? order.order_items.map(item => ({
            ...item,
            foodType: item.food_type
        })) : [],
        totalPrice: order.total_price,
        roomNo: order.room_no,
        message: order.message,
        paymentType: order.payment_type,
        paymentStatus: order.payment_status,
        isConfirmed: order.is_confirmed,
        feedback: order.feedback,
        rejectionReason: order.rejection_reason,
        date: order.created_at
    };
};

// get admin orders : GET (private)
router.get("/orders", auth, async (req, res) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);
    if (isAdmin) {
      // Select orders where payment_status is false, populate user and items
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(name, branch, role), order_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Debugging: Check if order_items are being populated
      if (data && data.length > 0) {
          console.log("Fetched Admin Orders:", data.length);
          if (!data[0].order_items || data[0].order_items.length === 0) {
              console.warn("WARNING: First order has no order_items. Check RLS policies or Foreign Key relationships.");
          }
      }

      const orders = data.map(mapOrder);
      res.json({ data: orders });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get user(my) orders : GET (private)
router.get("/myorders", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    const result = data.map(mapOrder).filter(order => order && order.orders && order.orders.length > 0 && order.totalPrice);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// submit feedback : PUT (private)
router.put("/order/feedback/:id", auth, async (req, res) => {
  try {
    const { feedback } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ feedback })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// post orders : POST (private)
router.post("/place/order", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart, totalPrice, roomNo, message } = req.body;

    // 1. Create Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_price: totalPrice,
        room_no: roomNo,
        message: message || "",
        payment_type: "",
        payment_status: false,
        is_confirmed: null // Explicitly null if needed, or let default handle it
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Prepare Order Items
    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      food_type: item.foodType,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    // 3. Insert Order Items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
        // Ideally roll back order creation here, but for now we throw
        throw itemsError;
    }

    // Combine for response
    const fullOrder = {
        ...orderData,
        order_items: itemsData
    };

    res.json(mapOrder(fullOrder));
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update order status : PUT (private)
router.put("/orders/:id", auth, async (req, res) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (isAdmin) {
      const updateData = { is_confirmed: req.body.isConfirmed };
      if (req.body.rejectionReason) {
        updateData.rejection_reason = req.body.rejectionReason;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', req.params.id)
        .select('*, order_items(*)') // Return with items to match expectations if needed
        .single();
      
      if (error) throw error;

      res.json({ data: mapOrder(data) });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// set payment type :  PUT (private)
router.put("/order/payment-type/:id", auth, async (req, res) => {
  try {
    const { paymentType } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({ payment_type: paymentType })
      .eq('id', req.params.id)
      .select('*, order_items(*)')
      .single();

    if (error) throw error;

    res.json({ data: mapOrder(data) });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Payment : PUT (private)
router.put("/payment-status/:id", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: true })
      .eq('id', req.params.id)
      .select('*, order_items(*)')
      .single();

    if (error) throw error;

    res.json({ data: mapOrder(data) });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
