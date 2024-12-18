const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin.ejs";
const jwtSecret = process.env.JWT_SECRET;

// Get
// Admin Login
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorised" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorised" });
  }
};

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Console.Blog - Admin",
      description:
        "This is my blog where I talk about my journey to becoming a software engineer",
    };
    const data = await Post.find();
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// POST
// Admin Check Login

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// GET
// Admin Reroute to dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description:
        "This is my blog where I talk about my journey to becoming a software engineer",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
    });
  } catch (error) {}
});

// GET
// Admin Create new Post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description:
        "This is my blog where I talk about my journey to becoming a software engineer",
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {}
});

// POST
// Admin Post new Blog entry to DB
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {}
    console.log(error);
  } catch (error) {
    console.log(error);
  }
});

// Get
// Admin - Get View/Edit post
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description:
        "This is my blog where I talk about my journey to becoming a software engineer",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", { data, locals, layout: adminLayout });
  } catch (error) {}
});

// PUT
// Admin - View/Edit post
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    // res.redirect(`/edit-post/${req.params.id}`);
    res.redirect("/dashboard");
  } catch (error) {}
});

// Delete
// Admin - Delete post
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");

    // res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// GET
// Admin - logout

router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");

  res.redirect("/");
});

//
// Admin Check Login

// POST
// Admin Register

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password: hashedPassword });
//       res.status(201).json({ message: "usercreated", user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "User already in use" });
//       }
//       res.status(500).json({ message: "Internal server error" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
