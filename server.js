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
    success_url:
      "http://localhost:3000/checkout_success.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/checkout.html",
  });
  res.status(200).json({ id: session.id });
});

app.post("/api/session/verify/:sessionId", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.params.sessionId,
    {
      expand: ["line_items"],
    }
  );
  /* const lineItems = await stripe.checkout.sessions.listLineItems(
    req.params.sessionId
  ); */

  if (session.payment_status == "paid") {
    //Spara
    const key = session.payment_intent;

    //const paymentIntent = await stripe.paymentIntents.retrieve(
    //  session.payment_intent
    //);

    let raw = fs.readFileSync("orders.json");
    let data = JSON.parse(raw);
    //console.log(data);

    if (!data[key]) {
      data[key] = {
        sessionId: req.params.sessionId,
        paymentIntent: session.payment_intent,
        customerId: session.customer,
        date: new Date(),
        customerEmail: session.customer_details.email,
        totalPrice: session.amount_total,
        currency: session.currency,
        products: session.line_items.data.map(
          ({ id, description, price, quantity, amount_total }) => {
            return {
              id: id,
              description: description,
              unit_price: price.unit_amount,
              currecny: price.currency,
              quantity: quantity,
              totalPrice: amount_total,
            };
          }
        ),
        /*  products: session.line_items.data.map(
          ({ id, description, price, quantity, amount_total }) => {
            return {
              id: id,
              description: description,
              price: price.map(({ unit_amount, currency }) => {
                return {
                  unit_price: unit_amount,
                  currecny: currency,
                };
              }),
              quantity: quantity,
              totalPrice: amount_total,
            };
          }
        ), */
      };
      data.push(data[key]);
      fs.writeFileSync("orders.json", JSON.stringify(data));
    }
    res.status(200).json({ paid: true });
  } else {
    res.status(200).json({ paid: false });
  }
});

app.get("/api/admin/purchases", async (req, res) => {
  let raw = fs.readFileSync("orders.json");
  let data = JSON.parse(raw);
  res.status(200).json(data);
});

app.listen(3000, () => {
  console.log("Server running on port: 3000");
});
