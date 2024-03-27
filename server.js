const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

// MongoClient.connect(
//   "mongodb+srv://alexopoku83:zGHD2ny49j3t8nmd@cluster0.k4l1ezd.mongodb.net/",
//   (err, client) => {
//     if (err) return console.error(err);
//     console.log("Connected to Database");
//   }
// );

// MongoClient.connect(
//   "mongodb+srv://alexopoku83:zGHD2ny49j3t8nmd@cluster0.k4l1ezd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//   {
//     useUnifiedTopology: true,
//   },
//   (err, client) => {
//     if (err) return console.error(err);
//     console.log("Connected to Database");
//   }
// );

MongoClient.connect(
  "mongodb+srv://alexopoku83:zGHD2ny49j3t8nmd@cluster0.k4l1ezd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    app.listen(3000, function () {
      console.log("listening on 3000");
    });

    app.set("view engine", "ejs");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(bodyParser.json());

    // app.get("/", (req, res) => {
    //   res.sendFile("/home/opkwan/Home-Work" + "/index.html");
    // });

    app.get("/", (req, res) => {
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Muni" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });

    const deleteButton = document.querySelector("#delete-button");
    const messageDiv = document.querySelector("#message");

    deleteButton.addEventListener("click", (_) => {
      fetch("/quotes", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Darth Vader",
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((response) => {
          if (response === "No quote to delete") {
            messageDiv.textContent = "No Darth Vader quote to delete";
          } else {
            window.location.reload(true);
          }
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch((error) => console.error(error));
    });
  })
  .catch(console.error);
