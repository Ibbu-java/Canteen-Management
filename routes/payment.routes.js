const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const supabase = require("../config/supabaseClient");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post("/payment/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
        return res.status(500).send("Some error occured");
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

// @route   POST /payment/verify-payment
// @desc    Verify Razorpay payment signature and update order status
// @access  Private
router.post("/payment/verify-payment", auth, async (req, res) => {
  try {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        db_order_id // The ID of the order in our Supabase database
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
        // Payment verified successfully, update the database
        const { data, error } = await supabase
            .from('orders')
            .update({ 
                payment_status: true, 
                payment_type: 'online'
            })
            .eq('id', db_order_id);

        if (error) {
            console.error("Supabase update error:", error);
            return res.status(500).json({ message: "Payment verified but failed to update database" });
        }

        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying payment");
  }
});

module.exports = router;
