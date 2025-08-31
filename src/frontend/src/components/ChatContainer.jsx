import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import SearchDialog from "./SearchDialog";
import WorkoutCard from "./WorkoutCard";
import ErrorAlert from "./ErrorAlert";
import InputDialog from "./InputDialog";
import SuccessAlert from "./SuccessAlert";
import { useRef } from "react";
const ChatContainer = ({
  senderUsername,
  recipientUsername,
  handleNotification,
  handleError,
}) => {
  const s = useRef(null);
  const [showSaveWorkout, setShowSaveWorkout] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [workoutId, setWorkoutId] = useState("");
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [workoutMessageId, setWorkoutMessageId] = useState("");
  const [workoutMessageName, setWorkoutMessageName] = useState("");

  const saveWorkoutMessage = async () => {
    if (workoutNames.includes(workoutMessageName)) {
	handleError("Cannot save workout, already have workout with same name");
        return;
    }

    if (workoutMessageId) {
      try {
        const token = localStorage.getItem("token");
        const data = { workout_id: workoutMessageId };

        await axios.post(`/api/workouts/message`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkoutMessageId("");
        setWorkoutNames((prevNames) => [...prevNames, workoutMessageName]);
        handleNotification(`Workout from ${recipientUsername} has been saved!`);
      } catch (error) {
        if (!error.message.includes("403") && !error.message.includes("401")) {
          handleError(
            "Something went wrong, please login again to save workout message."
          );
        } else {
          handleError("Please login or create an account to view messages.");
        }
        console.log(error);
      }
    }
  };

  const fetchWorkout = async (workoutId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `/api/workouts?workout_id=${workoutId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data[0];
    } catch (error) {
      if (!error.message.includes("403") && !error.message.includes("401")) {
        handleError(
          "Something went wrong, please login again to save workout message."
        );
      } else {
        handleError("Please login or create an account to view messages.");
      }
      console.log(error);
    }
  };

  const fetchSavedWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/workouts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const savedWorkouts = response.data.reverse();

      setWorkouts(savedWorkouts);

      const savedWorkoutNames = savedWorkouts.map((workout) => workout.workout_name);
      setWorkoutNames(savedWorkoutNames);
    } catch (error) {
      if (!error.message.includes("403") && !error.message.includes("401")) {
        handleError(
          "Something went wrong, please login again to save workout message."
        );
      } else {
        handleError("Please login or create an account to view messages.");
      }
      console.log(error);
    }
  };

  const getChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users/chat-history", {
        params: {
          friendUsername: recipientUsername,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let history = [];
      // all asynchronous fetch calls for workout details
      let workoutPromises = [];

      response.data?.[0].received.map((msg) => {
        if (msg != null && msg.workout_id == null) {
          history.push({
            message: msg.message,
            timestamp: new Date(msg.timestamp),
          });
        }
        if (msg != null && msg.workout_id != null) {
          workoutPromises.push(fetchWorkout(msg.workout_id));
          history.push({
            timestamp: new Date(msg.timestamp),
          });
        }
      });

      response.data?.[0].sent.map((msg) => {
        if (msg != null && msg.workout_id == null) {
          history.push({
            message: msg.message,
            timestamp: new Date(msg.timestamp),
            sent: true,
          });
        }
        if (msg != null && msg.workout_id != null) {
          workoutPromises.push(fetchWorkout(msg.workout_id));
          history.push({
            timestamp: new Date(msg.timestamp),
            sent: true,
          });
        }
      });

      // wait for all workout details to be fetched
      const fetchedWorkoutMessages = await Promise.all(workoutPromises);

      // add workout details
      let workoutIdx = 0;
      history = history.map((item) => {
        if (item.message) {
          return item;
        } else {
          const workoutData = fetchedWorkoutMessages[workoutIdx++];
          return {
            ...item,
            ...workoutData,
          };
        }
      });

      // sort chat history by timestamp
      history.sort((a, b) => a.timestamp - b.timestamp);
      setChatHistory(history);
    } catch (error) {
      if (!error.message.includes("403") && !error.message.includes("401")) {
        handleError(
          "Something went wrong, please login again to save workout message."
        );
      } else {
        handleError("Please login or create an account to view messages.");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavedWorkouts();
  }, []);

  useEffect(() => {
    // get chat history
    setChatHistory([]);
    getChatHistory();
    setShowSaveWorkout(false);
    console.log(recipientUsername, ' is current messages');
  }, [recipientUsername]);

  useEffect(() => {

    if (!senderUsername) {
      return;
    }

    if (s.current) {
      s.current.off();
      s.current.disconnect();
      s.current = null;
    }
    // connect to backend server
    const socket = io("/", { path: "/socket.io", transports: ["websocket"], autoConnect: false,});
    s.current = socket;

    socket.connect();

    socket.on("connect", () => {
	// emit username to server when there is socket.id
        socket.emit("user:login", senderUsername);
    });

    socket.on("connect_error", (err) => {
	console.error("connection error: ", err.message);
    });

    const handleDisconnect = () => {
      socket.emit("user:disconnect", senderUsername);
      socket.disconnect();
    };

    // tab closes
    window.addEventListener("beforeunload", handleDisconnect);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleDisconnect();
      } else {
        socket.connect();
        socket.emit("user:login", senderUsername);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    socket.on("chat message", (msg) => {
      if (!msg.workoutId) {
        setChatHistory((history) => [
          ...history,
          {
            message: msg.content,
            timestamp: msg.timestamp,
            sent: msg.fromSelf,
          },
        ]);
      } else {
        getChatHistory();
      }
    });
    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket.off("chat message");
      socket.off("connect");
      socket.off("connect_error");
      s.current = null;
    };
  }, [senderUsername]);

  const handleSendMessage = async () => {
    // do not send empty message
    if (message.trim()) {
      const chatMessage = {
        senderUsername: senderUsername,
        recipientUsername: recipientUsername,
        content: message,
        timestamp: new Date(),
      };

      // send message to server
      s.current.emit("chat message", chatMessage);
    }
    setMessage("");
  };

  const handleSendWorkout = async () => {

    // do not send empty message
    if (selectedWorkout && workoutId) {
      const chatMessage = {
        senderUsername: senderUsername,
        recipientUsername: recipientUsername,
        content: selectedWorkout,
        timestamp: new Date(),
        workoutId: workoutId,
      };

      // send message to server
      s.current.emit("chat message", chatMessage);
    }
    setWorkoutId("");
    setSelectedWorkout("");
  };

  return (
    <div>
      <div className="flex flex-col bg-[#fbf7ebb9] rounded text-white">
        <section className="overflow-y-auto h-[75vh] mb-4">
          {chatHistory.map((message, index) => {
            // sent message
            if (message.sent && !message.workout_id) {
              return (
                <div
                  key={index}
                  className="ml-auto max-w-[30vw] mb-2 text-wrap truncate bg-[#7a8bb2] mx-4 rounded  text-white"
                >
                  <div className="px-4 py-2">
                    <h3 className="text-[#cddbf8]  line-clamp-1">
                      {message.timestamp.toString()}
                    </h3>
                    <h3 className="font-bold">{message.message}</h3>
                  </div>
                </div>
              );
            }
            // received message
            else if (!message.sent && !message.workout_id) {
              return (
                <div
                  key={index}
                  className="max-w-[30vw] my-4 text-wrap truncate bg-[#7a8bb2] mx-4 rounded  text-white"
                >
                  <div className="px-4 py-2">
                    <h3 className="text-[#cddbf8] line-clamp-1">
                      {message.timestamp.toString()}
                    </h3>
                    <h3 className="font-bold">{message.message}</h3>
                  </div>
                </div>
              );
            }
            // sent workout
            else if (message.sent && message.workout_id) {
              return (
                <div
                  key={index}
                  className="text-[#cddbf8] ml-auto max-w-[30vw] mb-2 text-wrap truncate mx-4 rounded"
                >
                  <WorkoutCard
                    workout_name={message.workout_name}
                    workout_equipment={message.workout_equipment}
                    workout_categories={message.workout_categories}
                    workout_id={message.workout_id}
                    handleClick={() => {}}
                    color={"#7a8bb2"}
                  />
                </div>
              );
            }
            // received workout
            else {
              return (
                <div
                  key={index}
                  className="shadow-xlg hover:shadow-[#7a8bb2] shadow-lg text-[#cddbf8] max-w-[30vw] mb-2 text-wrap truncate mx-4 rounded"
                >
                  <WorkoutCard
                    workout_name={message.workout_name}
                    workout_equipment={message.workout_equipment}
                    workout_categories={message.workout_categories}
                    workout_id={message.workout_id}
                    handleClick={() => {
                      setShowSaveWorkout(true);
                      setWorkoutMessageName(message.workout_name);
                      setWorkoutMessageId(message.workout_id);
                    }}
                    color={"#7a8bb2"}
                  />
                </div>
              );
            }
          })}
        </section>
        <div className="mt-auto px-4 py-2 bg-[#7a8bb2] flex">
          <input
            id="message"
            type="text"
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            required
            className="block grow py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-400 focus:outline-none w-full "
          />
          <div className="ml-auto">
            <button
              type="button"
              className="inline-flex justify-center rounded-md bg-[#cddbf896] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:shadow-white shadow-lg sm:ml-3 sm:w-auto"
              onClick={handleSendMessage}
            >
              ➤
            </button>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="inline-flex justify-center rounded-md bg-[#cddbf896] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:shadow-white shadow-lg sm:ml-3 sm:w-auto"
              onClick={() => setShowWorkouts(true)}
            >
              🏋️
            </button>
          </div>
        </div>
        {showSaveWorkout && senderUsername != recipientUsername && (
          <InputDialog
            header="Would you like to save this workout?"
            buttonText="Yes"
            cancelCallback={() => setShowSaveWorkout(false)}
            saveCallback={() => {
              saveWorkoutMessage();
              setShowSaveWorkout(false);
            }}
          />
        )}
        {showWorkouts && (
          <SearchDialog
            header="Workouts"
            buttonText="Send Workout"
            searchResults={workouts.map((workout) => workout.workout_name)}
            selectedResult={selectedWorkout}
            saveCallback={() => {
              if (selectedWorkout != "") {
                setShowWorkouts(false);
                handleSendWorkout();
              }
            }}
            cancelCallback={() => {
              // hide dialog
              setShowWorkouts(false);
              // set selected workout to ""
              setSelectedWorkout("");
            }}
            saveResult={(e) => {
              if (selectedWorkout == e.target.name) {
                setSelectedWorkout("");
              } else {
                setSelectedWorkout(e.target.name);
                const workoutDetails = workouts.find(
                  (workout) => workout.workout_name == e.target.name
                );
                setWorkoutId(workoutDetails.workout_id);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
