const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const supabase = require("../config/supabaseClient");
const imagekit = require("../config/imagekit");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Helper to map DB fields to Frontend fields
const mapFoodItem = (item) => {
  if (!item) return item;
  return {
    ...item,
    quantity: item.quantity_description,
    foodType: item.food_type,
    _id: item.id // Frontend might rely on _id
  };
};

// additem : POST (private)
router.post(
  "/add",
  auth,
  upload.single('image'),
  [
    check("name", "Food name is required").not().isEmpty(),
    check("foodType", "Food category is required").not().isEmpty(),
    check("price", "Food price is required").not().isEmpty(),
    check("quantity", "Quantity is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const isAdmin = await checkAdmin(req.user.id);
      if (isAdmin) {
        const { foodType, name, price, quantity } = req.body;
        let imageUrl = "";

        if (req.file) {
          const uploadResponse = await imagekit.upload({
            file: req.file.buffer, // required
            fileName: `${uuidv4()}-${req.file.originalname}`, // required
            folder: "/canteen-food-items"
          });
          imageUrl = uploadResponse.url;
        } else if (req.body.image) {
           // Fallback if they send a URL string (backward compatibility)
           imageUrl = req.body.image;
        } else {
            return res.status(400).json({ errors: [{ msg: "Image is required" }] });
        }

        const { data, error } = await supabase
          .from('food_items')
          .insert([
            {
              food_type: foodType,
              name,
              price,
              quantity_description: quantity,
              image: imageUrl
            }
          ])
          .select()
          .single();

        if (error) throw error;

        res.json({ msg: "Added item successfully", food: mapFoodItem(data) });
      } else {
        res.status(401).json({ msg: "You can't access this route" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send(error.message);
    }
  }
);

// get single food item: GET (private)
router.get("/food-item/:id", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(mapFoodItem(data));
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

// edit a food item : PUT(private)
router.put("/edit/:id", auth, upload.single('image'), async (req, res) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);
    if (isAdmin) {
      const { data: existing, error: fetchError } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', req.params.id)
        .single();
        
      if (fetchError) throw fetchError;

      const updates = {};
      if (req.body.foodType) updates.food_type = req.body.foodType;
      if (req.body.name) updates.name = req.body.name;
      if (req.body.price) updates.price = req.body.price;
      if (req.body.quantity) updates.quantity_description = req.body.quantity;
      
      if (req.file) {
          const uploadResponse = await imagekit.upload({
            file: req.file.buffer, // required
            fileName: `${uuidv4()}-${req.file.originalname}`, // required
            folder: "/canteen-food-items"
          });
          updates.image = uploadResponse.url;
      } else if (req.body.image) {
          updates.image = req.body.image;
      }

      const { data, error } = await supabase
        .from('food_items')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(mapFoodItem(data));
    } else {
      res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// delete item: DELETE(private)
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (isAdmin) {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', req.params.id);
        
      if (error) throw error;
      res.json({ msg: "Deleted item successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// search item : GET (private)
router.get("/search/:food", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${req.params.food}%`);
        
    if (error) throw error;
    res.json({ data: data.map(mapFoodItem) });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// get item by type : GET (private)
router.get("/food/:food", auth, async (req, res) => {
  const foodType = req.params.food;
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('food_type', foodType);

    if (error) throw error;
    res.json({ data: data.map(mapFoodItem) });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
