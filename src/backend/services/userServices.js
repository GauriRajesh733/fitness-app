import pool from "../db/db.js";
import fsPromises from "fs/promises";

export async function getAllUsernamesService() {
  let query = "SELECT JSON_AGG(users.username) as usernames FROM users;";

  // query database
  const result = pool.query(query);
  return (await result).rows[0];
}

export async function getAllFriendsService(username) {
  let query = `SELECT friend.name as friend FROM user_friends uf1 
    JOIN user_friends uf2 ON uf1.user_id = uf2.friend_id AND uf1.friend_id = uf2.user_id 
    JOIN users u ON u.id = uf1.user_id
    JOIN users friend ON friend.id = uf1.friend_id 
    WHERE u.name = $1`;

  // query database
  const result = await pool.query(query, [username]);
  return result.rows;
}

export async function getByUsernameService(username) {
  let query = `SELECT * FROM users WHERE username = $1 LIMIT 1;`;

  // query database
  const result = await pool.query(query, [username]);

  if (result.rows.length < 1) {
    return result.rows;
  }

  return result.rows[0];
}

export async function getUsernamesLikeService(username) {
  const usernameQuery = "%" + username + "%";
  let query = `SELECT username FROM users WHERE username LIKE $1;`;

  // query database
  const result = await pool.query(query, [usernameQuery]);

  return result.rows;
}

export async function createUserService(name, username, password) {
  const result = await pool.query(
    `INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *;`,
    [name, username, password]
  );
  return result.rows[0];
}

export async function addFriendService(username, friendUsername) {
  const userId = (await getByUsernameService(username)).id;
  const friendId = (await getByUsernameService(friendUsername)).id;

  console.log(username, " ", userId);
  console.log(friendUsername, " ", friendId);

  const result = await pool.query(
    `INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2) RETURNING *;`,
    [userId, friendId]
  );
  return result.rows[0];
}

export async function getChatHistoryService(username, friendUsername) {
  const query = `SELECT 
JSON_AGG(
CASE WHEN m.user_id = friend.id THEN
JSONB_BUILD_OBJECT('timestamp', m.created_at, 'message', m.message, 'workout_id', m.workout_id) END) as received, 
JSON_AGG(
CASE WHEN m.user_id = u.id THEN
JSONB_BUILD_OBJECT('timestamp', m.created_at, 'message', m.message, 'workout_id', m.workout_id) END) as sent
FROM user_friends uf 
JOIN users u ON u.id = uf.user_id 
JOIN users friend ON friend.id = uf.friend_id 
LEFT JOIN messages m 
ON 
(m.friend_id = u.id AND m.user_id = friend.id)
OR 
(m.user_id = u.id AND m.friend_id = friend.id)
WHERE u.name = $1 AND friend.name = $2`;

  // query database
  const result = await pool.query(query, [username, friendUsername]);

  return result.rows;
}

export async function getFriendRequestsService(username) {
  console.log('getting friend requests for ', username);
  const userId = (await getByUsernameService(username)).id;

  let query = `SELECT 
users.username
FROM
user_friends friends_of_user
RIGHT JOIN
user_friends friends_with_user
ON
friends_of_user.user_id = friends_with_user.friend_id
AND
friends_of_user.friend_id = friends_with_user.user_id
JOIN users
ON
friends_with_user.user_id = users.id
WHERE
friends_with_user.friend_id = $1 
AND friends_of_user.friend_id IS NULL;`;

  // query database
  const result = await pool.query(query, [userId]);
  console.log('query results: ', result.rows);
  return result.rows;
}
