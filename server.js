const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const dns = require("node:dns");

// Force IPv4 to avoid ETIMEDOUT errors on some networks with Node 17+
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require("dotenv").config();

// connectDB();
app.use(express.json({ extended: false }));

app.use(cors());

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/food.routes"));
app.use("/api", require("./routes/order.routes"));
app.use("/api", require("./routes/payment.routes"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
