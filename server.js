const express = require("express");
const env = require("dotenv");
env.config(".env");
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secretKey);
const app = express();
const fs = require("fs");

app.use(express.static("public"));
app.use("/api", express.json());

app.post("/api/session/new", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: req.body.line_items,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/",
  });
  res.status(200).json({ id: session.id });
});

app.post("/api/session/verify", async (req, res) => {
  const sessionId = req.body.sessionId;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status == "paid") {
    //Spara
    const key = session.payment_intent;

    /* const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    ); */

    let raw = fs.readFileSync("orders.json");
    let data = JSON.parse(raw);
    //console.log(data);

    if (!data[key]) {
      data[key] = {
        amount: session.amount_total / 100,
        customerId: session.customer,
        customerEmail: session.customer_details.email,
        //metadata: session.metadata,
      };
      data.push(data[key]);
      fs.writeFileSync("orders.json", JSON.stringify(data));
    }
    res.status(200).json({ paid: true });
  } else {
    res.status(200).json({ paid: false });
  }
  //console.log(session);
});

app.get("/api/admin/purchases", async (req, res) => {
  let raw = fs.readFileSync("orders.json");
  let data = JSON.parse(raw);
  res.status(200).json(data);
});

app.listen(3000, () => {
  console.log("Server running on port: 3000");
});
