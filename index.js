import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// REPLACE LINK WITH YOUR DATABASE OR USE THIS IF YOU HAVE MONGODB INSTALLED LOCALLY
mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB");

const itemsSchema = new mongoose.Schema({
  itemContent: {
    type: String,
    required: [true, "Must provide at least 1 character!"],
  },
});

const ItemHome = mongoose.model("ItemHome", itemsSchema);
const ItemWork = mongoose.model("ItemWork", itemsSchema);

// Render home list and get items from database
app.get("/", async (req, res) => {
  try {
    const dbResponseHome = await ItemHome.find({}, { itemContent: 1 });
    res.render("index.ejs", {
      newListItem: dbResponseHome,
      listTitle: "home",
    });
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not fetch items from Database",
      listTitle: "home",
    });
  }
});

// Add an item to home list
app.post("/home-submit", async (req, res) => {
  try {
    const itemsHome = new ItemHome({
      itemContent: req.body.newitem,
    });
    itemsHome.save();
    res.render("index.ejs", {
      newListItem: await ItemHome.find({}, { itemContent: 1 }),
      listTitle: "home",
    });
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not add item to Database",
      newListItem: await ItemHome.find({}, { itemContent: 1 }),
      listTitle: "home",
    });
  }
});

// Render work list
app.get("/work", async (req, res) => {
  try {
    const dbResponseWork = await ItemWork.find({}, { itemContent: 1 });
    res.render("index.ejs", {
      newListItem: dbResponseWork,
      listTitle: "work",
    });
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not fetch items from Database",
      listTitle: "work",
    });
  }
});

// Add an item to work list
app.post("/work-submit", async (req, res) => {
  try {
    const itemsWork = new ItemWork({
      itemContent: req.body.newitem,
    });
    itemsWork.save();
    res.render("index.ejs", {
      newListItem: await ItemWork.find({}, { itemContent: 1 }),
      listTitle: "work",
    });
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not add item to Database",
      newListItem: await ItemWork.find({}, { itemContent: 1 }),
      listTitle: "work",
    });
  }
});

// Delete item from home list
app.post("/deletehome", async (req, res) => {
  try {
    await ItemHome.deleteOne({ itemContent: req.body.delete });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not delete item from Database",
      listTitle: "home",
    });
  }
});

// Delete item from work list
app.post("/deletework", async (req, res) => {
  try {
    await ItemWork.deleteOne({ itemContent: req.body.delete });
    res.redirect("/work");
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      error: "Error: Could not delete item from Database",
      listTitle: "work",
    });
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});
