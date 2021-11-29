require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("cors");
const https = require("https");
const Redde = require("redde-nodejs-sdk");

const port = process.env.PORT || 6000;

const app = express();

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require("./startup/prod")(app);

app.get("/", (req, res) => {
  res.send("Welcome to my api");
});

// handles post request in the api endpoint
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
  //Instantiate ReddeApi class
  const redde = new Redde(process.env.API_KEY, process.env.API_ID.toString());
  //Generating Random Client Reference
  var ref = redde.clientRef(6);
  //Generating Random Client ID
  var clientid = redde.clientID(6);
  //Calling Receive Function
  var receive = redde.receiveMoney(
    parseFloat(req.body.amount).toFixed(2),
    req.body.paymentoption,
    req.body.walletnumber,
    ref,
    clientid
  );

  try {
    const data = await post(receive.url, receive.json);
    res.send(data);
  } catch (error) {
    console.log(error);
    next();
  }
});

// app.post("/api/payment", (req, res, next) => {
//   //Instantiate ReddeApi class
//   const redde = new Redde(process.env.API_KEY, process.env.API_ID.toString());
//   //Generating Random Client Reference
//   var ref = redde.clientRef(6);
//   //Generating Random Client ID
//   var clientid = redde.clientID(6);
//   //Calling Receive Function
//   var receive = redde.receiveMoney(
//     0.01,
//     "VODAFONE",
//     233501658639,
//     ref,
//     clientid
//   );
//   console.log(receive);
//   //Sending a request to redde endpoint
//   request.post(receive, (err, response, body) => {
//     if (err) {
//       return console.log(err);
//     }
//     console.log(JSON.parse(JSON.stringify(body)));
//     res.send(body);
//   });
// });

//Callback Url Endpoint
app.post("/api/reditpayment", function (req, res) {
  const data = req.body;
  if (data.status === "FAILED")
    return res.status(200).json({ sucess: false, data });
  if (data.status === "PAID")
    return res.status(200).json({ sucess: true, data });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
