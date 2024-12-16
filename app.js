require("dotenv").config();

const express = require("express");
const expressLayouyt = require("express-ejs-layouts");

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"));

//Templating Engine
app.use(expressLayouyt);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
