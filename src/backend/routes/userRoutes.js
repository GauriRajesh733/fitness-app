import express from "express";
import {
  createUser,
  getAllUsernames,
  getByUsername,
  loginUser,
  getUsernamesLike,
  addFriend,
  getAllFriends,
  getChatHistory,
  getFriendRequests,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authenticateToken,
} from "../middleware/authentication.js";

const router = express.Router();

router.post("/", createUser);
router.get("/usernames", getAllUsernames);
router.get("/by-username/:username", getByUsername);
router.get("/usernames-like", getUsernamesLike);
router.post("/login", authenticateUser, loginUser);
router.post("/add-friend", authenticateToken, addFriend);
router.get("/friend-requests", authenticateToken, getFriendRequests);
router.get("/friends", authenticateToken, getAllFriends);
router.get("/chat-history", authenticateToken, getChatHistory);

export default router;
