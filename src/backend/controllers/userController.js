import {
  createUserService,
  getByUsernameService,
  getAllUsernamesService,
  getUsernamesLikeService,
  addFriendService,
  getAllFriendsService,
  getChatHistoryService,
  getFriendRequestsService,
} from "../services/userServices.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function getAllUsernames(req, res) {
  try {
    const users = await getAllUsernamesService(req.query);
    res.json(users);
  } catch (err) {
    console.error("Error in controller getting users: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getChatHistory(req, res) {
  try {
    const username = req.user.username;
    const friendUsername = req.query.friendUsername;
    const chatHistory = await getChatHistoryService(username, friendUsername);
    res.json(chatHistory);
    console.log('chat history: ', chatHistory);
  } catch (err) {
    console.error("Error in controller getting chat history: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getAllFriends(req, res) {
  try {
    const username = req.user.username;
    const friends = await getAllFriendsService(username);
    res.json(friends);
    console.log('got all friends: ', friends);
  } catch (err) {
    console.error("Error in controller getting friends: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getByUsername(req, res) {
  try {
    const user = await getByUsernameService(req.params.username);
    res.json(user);
  } catch (err) {
    console.error("Error in controller getting users: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function createUser(req, res) {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      console.error("Missing fields");
      return res.status(400).json({ message: "Missing required fields." });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await createUserService(name, username, hashedPassword);
    res.json(newUser);
  } catch (err) {
    // unique violation in postgres
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already exists." });
    }
    console.error("An error occurred: ", err);
    return res.status(500).json({ error: "An error occurred" });
  }
}

export async function addFriend(req, res) {
  try {
    const username = req.user.username;
    if (!req.body.friend_username) {
      console.error("Missing friend username to add.");
      return res
        .status(400)
        .json({ message: "Missing friend username to add." });
    }
    const friendUsername = req.body.friend_username;
    const newFriend = await addFriendService(username, friendUsername);
    res.json(newFriend);
    console.log("new friend added!");
  } catch (err) {
    // ignore error if due to user already being friends with given user
    if (err.code == "23505") {
      return res
        .status(200)
        .json({ message: "Current user already friends with given user." });
    }
    console.error("An error occurred: ", err);
    return res.status(500).json({ error: "An error occurred" });
  }
}

export async function loginUser(req, res) {
  console.log("logging in user");
  // login user
  const reqUsername = req.body.username;
  const username = { username: reqUsername };
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({ accessToken: accessToken });
}

export async function getUsernamesLike(req, res) {
  try {
    if (req.query.search) {
      const users = await getUsernamesLikeService(req.query.search);
      res.json(users);
    }
  } catch (err) {
    console.error("Error in controller getting users: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}

export async function getFriendRequests(req, res) {
  console.log('getting friend requests for: ', req.user.username);
  try {
    const username = req.user?.username;
    if (!username) {
       console.error("Missing username to get friend requests.");
      return res
        .status(400)
        .json({ message: "Missing username to get friend requests." });
    }
    const requests = await getFriendRequestsService(username);
    console.log('getting friend requests for, ', req.user.username);
    res.json(requests);
    console.log('got all friend requests: ', requests);
  } catch (err) {
    console.error("Error in controller getting friend requests: ", err);
    res.status(500).json({ error: "Error in controller" });
  }
}
