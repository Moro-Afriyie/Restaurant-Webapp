var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restaurant-2a643-default-rtdb.firebaseio.com",
});

admin
  .firestore()
  .collection("orders")
  .add({
    banku: true,
  })
  .then(() => {});
