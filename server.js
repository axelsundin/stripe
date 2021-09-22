const express = require("express");
const env = require("dotenv");
env.config(".env");
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secretKey);
const app = express();

app.use(express.static("public"));
app.use("/api", express.json());

app.post("/api/session/new", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: req.body.line_items,
    mode: "payment",
    success_url: "http://localhost:3000/checkout_success.html",
    cancel_url: "http://localhost:3000/index.html",
  });
  res.status(200).json({ id: session.id });
});

app.listen(3000, () => {
  console.log("Server running on port: 3000");
});
