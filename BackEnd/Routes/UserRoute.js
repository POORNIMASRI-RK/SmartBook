const express = require("express");
const router = express.Router();
const  { registerUser, loginUser, updateUser, deleteUser, getUser } = require("../Controller/UserController");
const UserAuth = require("../Middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login",loginUser);
router.put("/update/:id",UserAuth, updateUser);
router.delete("/delete/:id",UserAuth, deleteUser);
router.get("/users", UserAuth, getUser);
//router.get("/users/:id",UserAuth, getUserById);

module.exports = router;