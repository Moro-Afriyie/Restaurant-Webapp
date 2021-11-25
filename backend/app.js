require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");

const port = process.env.PORT || 6000;

const app = express();

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my api");
});

app.post("https://api.reddeonline.com/v1/receive", (req, res) => {
  res.send("Welcome");
});

async function post(url, data) {
  const dataString = JSON.stringify(data);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      apikey: process.env.API_KEY,
    },
    // timeout: 1000, // in ms
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request time out"));
    });

    req.write(dataString);
    req.end();
  });
}

app.post("/api/payment", async (req, res, next) => {
  const body = {
    amount: parseInt(req.body.amount),
    appid: process.env.API_ID.toString(),
    clienttransid: "1234567890",
    nickname: process.env.NICK_NAME,
    paymentoption: req.body.paymentoption,
    walletnumber: req.body.walletnumber,
  };

  try {
    const data = await post("https://api.reddeonline.com/v1/receive", body);
    res.send(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
