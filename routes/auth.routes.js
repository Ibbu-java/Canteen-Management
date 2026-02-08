const express = require("express");
const bcrypt = require("bcryptjs");
// const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const supabase = require("../config/supabaseClient");
const router = express.Router();

// Helper to map User for frontend
const mapUser = (user) => {
    if(!user) return null;
    const { password, is_admin, id, ...rest } = user;
    return {
        ...rest,
        isAdmin: is_admin,
        _id: id
    };
}

// signup: POST (public)
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail().custom((value) => {
      const allowedDomains = [
        "@siescoms.sies.edu.in",
        "@siesascn.sies.edu.in",
        "@ssbs.sies.edu.in",
        "@siesgst.sies.edu.in"
      ];
      const isValid = allowedDomains.some(domain => value.endsWith(domain));
      if (!isValid) {
        throw new Error("Please use an institutional email address");
      }
      return true;
    }),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Please select your role").not().isEmpty(),
    check("branch", "Please select your branch").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, branch, role } = req.body;

    try {
      // check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // hashing passwords
      const salt = await bcrypt.genSalt(12);
      const encryptedpassword = await bcrypt.hash(password, salt);

      // make user account
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password: encryptedpassword,
            branch,
            role,
            is_admin: false,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const user = mapUser(newUser);

      // jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token, user });
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

//signin: POST (public)
router.post(
  "/signin",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { data: userRaw, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Supabase Error during signin:", error);
        return res.status(500).json({ errors: [{ msg: "Database connection error" }] });
      }

      if (!userRaw) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email does not exist" }] });
      }

      // check password
      const isMatch = await bcrypt.compare(password, userRaw.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // JWT Token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: mapUser(userRaw) });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

//get user: GET (private)
router.get("/me", auth, async (req, res) => {
  try {
    const { data: userRaw, error } = await supabase
        .from('users')
        .select('id, name, email, branch, role, is_admin, created_at') // Exclude password
        .eq('id', req.user.id)
        .single();
    
    if (error) throw error;
    
    res.json(mapUser(userRaw));
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
