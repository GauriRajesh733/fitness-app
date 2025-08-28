import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import { useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import SuccessAlert from "../components/SuccessAlert";
import axios from "axios";
import SearchDialog from "../components/SearchDialog";
import ErrorAlert from "../components/ErrorAlert";
const Messages = () => {
  const [showChat, setShowChat] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Something went wrong :(");
  const [showSearchError, setShowSearchError] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [username, setUsername] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [currentFriend, setCurrentFriend] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [senderUsername, setSenderUsername] = useState([]);

  function handleNotification(message) {
    setConfirmationMessage(message);
    setShowSaveConfirmation(true);
  }

  function handleError(message) {
    setAlertMessage(message);
    setShowAlert(true);
  }

  async function getFriendRequests() {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("localhost:5001/users/friend-requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let loadedRequests = [];
      response.data.map((request) => loadedRequests.push(request.friend));
      setFriendRequests(loadedRequests);
    } catch (err) {
      if (err.message.includes("403") || err.message.includes("401")) {
        setAlertMessage(
          "Please login or create an account to view friend requests."
        );
      } else {
        setAlertMessage("Something went wrong while loading chats.");
      }
      setShowAlert(true);
      setShowChat(false);
    }
  }

  async function getFriends() {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("localhost:5001/users/friends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let loadedFriends = [];

      response.data.map((friend) => {
        loadedFriends.push({
          username: friend.friend,
        });
      });

      setFriends(loadedFriends);
    } catch (err) {
      if (err.message.includes("403") || err.message.includes("401")) {
        setAlertMessage("Please login or create an account to view chats.");
      } else {
        setAlertMessage("Something went wrong while loading chats.");
      }
      setShowAlert(true);
      setShowChat(false);
    }
  }

  async function addFriend() {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "localhost:5001/users/add-friend",
        { friend_username: selectedFriend },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowSaveConfirmation(true);
      setShowSearch(false);
      setSelectedFriend("");
      getFriends();
      getFriendRequests();
    } catch (err) {
      setShowSearch(false);
      if (err.message.includes("403") || err.message.includes("401")) {
        setAlertMessage("Please login or create an account to add friends.");
      } else {
        setAlertMessage(
          "Something went wrong while adding friend, please login and try again."
        );
      }
      setShowAlert(true);
      setSelectedFriend("");
    }
  }

  async function getSearchedUsers(search) {
    try {
      const response = await axios.get("localhost:5001/users/usernames-like/", {
        params: {
          search: search,
        },
      });
      setSearchedUsers(response.data.map((user) => user.username));
      return response.data;
    } catch {
      setAlertMessage(
        "Something went wrong while getting usernames, please login and try again."
      );
    }
  }

  useEffect(() => {
    getFriends();
    getFriendRequests();
    setSenderUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    setShowSearchError(false);
  }, [selectedFriend]);

  useEffect(() => {
    if (currentFriend == "") {
      setShowChat(false);
    } else {
      setShowChat(true);
    }
  }, [currentFriend]);

  useEffect(() => {
    if (username != "") {
      getSearchedUsers(username);
    } else {
      setSearchedUsers([]);
    }

    if (!searchedUsers.includes(selectedFriend)) {
      setSelectedFriend("");
    }
  }, [username]);

  return (
    <div>
      <NavigationBar />
      {showAlert && (
        <ErrorAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      {showSaveConfirmation && (
        <SuccessAlert
          message={confirmationMessage}
          onClose={() => setShowSaveConfirmation(false)}
        />
      )}
      <div className="overflow-hidden h-[90vh] flex flex-row">
        <section className="px-4 py-8  bg-[#cddbf884] text-white flex flex-col w-[30vw]">
          <h1 className="text-[#7a8bb2] text-2xl/7 font-bold sm:text-3xl sm:tracking-tight">
            Messages
          </h1>
          <div className="my-2 px-2 py-2 gap-4 flex flex-row flex-wrap">
            <button
              onClick={() => setShowSearch(true)}
              className="w-[100px] justify-center rounded-md hover:shadow-[#cddbf8] px-2 py-2 text-sm font-semibold text-white shadow-lg bg-[#7a8bb2]"
            >
              Add Friend
            </button>
            <button
              onClick={() => {
                setShowRequests(true);
              }}
              className="w-[100px] justify-center rounded-md hover:shadow-[#cddbf8] px-2 py-2 text-sm font-semibold text-white shadow-lg  bg-[#7a8bb2]"
            >
              Requests ({friendRequests.length})
            </button>
          </div>

          <section className="overflow-y-auto">
            {friends.map((friend) => (
              <div
                key={friend.username}
                onClick={() => setCurrentFriend(friend.username)}
                className="font-bold mb-4 line-clamp-2 truncate bg-[#fffaee] mx-2 overflow-hidden rounded hover:shadow-lg hover:shadow-white  text-[#7a8bb2]"
              >
                <div className="px-4 py-2">{friend.username}</div>
              </div>
            ))}
          </section>
        </section>
        <section className="h-[90vh] px-4 py-8 flex flex-col bg-[#fbf7ebb9] text-white w-[70vw]">
          {showChat && (
            <ChatContainer
              senderUsername={senderUsername}
              recipientUsername={currentFriend}
              handleNotification={handleNotification}
              handleError={handleError}
            />
          )}
        </section>
      </div>
      <div className="mx-auto max-w-screen-xl text-center">
        {showRequests && (
          <SearchDialog
            header="Friend Requests"
            buttonText="Add Friend"
            errorMessage={"Please select a user."}
            searchResults={friendRequests}
            selectedResult={selectedFriend}
            showErrorMessage={showSearchError}
            saveCallback={() => {
              if (selectedFriend != "") {
                addFriend();
                setConfirmationMessage(
                  "You have added " + selectedFriend + "!  Say Hi!"
                );

                setShowRequests(false);
              }
            }}
            cancelCallback={() => {
              setShowRequests(false);
              setSelectedFriend("");
            }}
            saveResult={(e) => {
              if (selectedFriend == e.target.name) {
                setSelectedFriend("");
              } else {
                setSelectedFriend(e.target.name);
              }
            }}
          />
        )}
        {showSearch && (
          <SearchDialog
            header="Search By Username"
            hasInput={true}
            buttonText="Send Friend Request"
            inputPlaceholder="Search by username"
            errorMessage="Please select a user."
            showErrorMessage={showSearchError}
            input={username}
            saveCallback={() => {
              if (selectedFriend == "") {
                setShowSearchError(true);
              } else {
                setShowSearchError(false);
                setConfirmationMessage(
                  "Your friend request to " + selectedFriend + " has been sent!"
                );
                addFriend();
              }
            }}
            cancelCallback={() => {
              setShowSearch(false);
              setSelectedFriend("");
            }}
            inputSaveCallback={(e) => {
              setUsername(e.target.value);
            }}
            searchResults={searchedUsers}
            selectedResult={selectedFriend}
            saveResult={(e) => {
              if (selectedFriend == e.target.name) {
                setSelectedFriend("");
              } else {
                setSelectedFriend(e.target.name);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
