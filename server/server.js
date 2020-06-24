require('babel-register')({
  presets: [ 'es2015' ]
});

const express = require("express");
const app = express();
const apiKeys = require('../src/ApiKeys.js').default;
var cors = require('cors');


// This is your real test secret API key.
const stripe = require("stripe")(apiKeys.STRIPESECRETKEY);

app.use(express.static("."));
app.use(express.json());
app.use(cors())

app.post("/create-payment-intent", async (req, res) => {
  const { total } = req.body;
  // Create a PaymentIntent with the order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total.totalPriceToCharge,
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
//make this serverless and host it on aws lambda