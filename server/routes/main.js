const express = require("express");
const router = express.Router();

// Routes
router.get("", (req, res) => {
  const locals = {
    title: "Console.blog",
    description:
      "This is my blog where I talk about my journey to becoming a software engineer",
  };
  res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
