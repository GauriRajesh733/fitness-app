import WorkoutPreview from "../components/WorkoutPreview";
import axios from "axios";
import { useEffect, useState } from "react";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import WorkoutCard from "../components/WorkoutCard";
import NavigationBar from "../components/NavigationBar";
const SavedWorkouts = () => {
  const [currentWorkout, setCurrentWorkout] = useState("");
  const [currentExercises, setCurrentExercises] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Something went wrong while generating or saving workout, please try again."
  );
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  const handleClick = async (workout_id) => {
    for (const workout of savedWorkouts) {
      if (workout.workout_id == workout_id) {
        setCurrentWorkout(workout.workout_name);
        setCurrentExercises(workout.workout_exercises);
        break;
      }
    }

    setShowPreview(true);
  };

  const fetchSavedWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("localhost:5001/workouts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const workouts = response.data.reverse();

      setSavedWorkouts(workouts);
    } catch (error) {
      if (error.message.includes("403") || error.message.includes("401")) {
        setAlertMessage(
          "Please login or create an account to view saved workouts."
        );
      } else {
        setAlertMessage(
          "Something went wrong, please login again to view saved workouts."
        );
      }
      setShowAlert(true);
    }
  };

  useEffect(() => {
    fetchSavedWorkouts();
  }, []);

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
          message="Your workout has been saved!"
          onClose={() => setShowSaveConfirmation(false)}
        />
      )}
      <section className="bg-[#fffced] text-[#7a8bb2] min-h-screen h-fit flex flex-col justify-start bg-[#101010]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          {!showPreview && (
            <h2 className="text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight">
              Saved Workouts
            </h2>
          )}
          {showPreview && (
            <WorkoutPreview
              name={currentWorkout}
              exercises={currentExercises}
              exitPreview={() => setShowPreview(false)}
            />
          )}
          <div className="grid grid-cols-1 py-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {savedWorkouts.map((workout) => (
              <WorkoutCard
                workout_id={workout.workout_id}
                workout_name={workout.workout_name}
                workout_equipment={workout.workout_equipment}
                workout_categories={workout.workout_categories}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SavedWorkouts;
