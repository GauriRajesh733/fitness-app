import ExerciseCard from "../components/ExerciseCard";
import MultiSelectMenu from "../components/MultiSelectMenu";
import axios from "axios";
import { useEffect, useState } from "react";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import NavigationBar from "../components/NavigationBar";
import InputDialog from "../components/InputDialog";

const WorkoutGenerator = () => {
  const [alertMessage, setAlertMessage] = useState(
    "Something went wrong while generating or saving workout, please try again."
  );
  const [inputError, setInputError] = useState(
    "Workout with given name already exists, please enter a different name."
  );
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [showInputError, setShowInputError] = useState(false);

  const [displayWorkout, setDisplayWorkout] = useState(false);
  const [workout, setWorkout] = useState([]);
  const [exerciseCards, setExerciseCards] = useState([]);
  const [canSaveWorkout, setCanSaveWorkout] = useState(false);

  const [muscles, setMuscles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);

  const handleSetsReps = async (e) => {
    const newWorkout = [...workout];
    
    for (const exercise of newWorkout) {
      if (exercise.exercise[0].name == e.target.id) {
        if (e.target.name == "sets") {
          exercise.exercise[0].exercise_sets = e.target.value;
        }
        if (e.target.name == "reps") {
          exercise.exercise[0].exercise_reps = e.target.value;
        }

        break;
      }
    }
    setWorkout(newWorkout);
  };

  const fetchOptions = async (link, setOptions) => {
    try {
      const response = await axios.get(link);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching options: ", error.message);
      setAlertMessage(
        "Something went wrong while getting workout filters, please try again."
      );
      setShowAlert(true);
    }
  };

  const fetchWorkoutNames = async (link, setOptions, auth) => {
    try {
      const response = await axios.get(link, auth);
      setOptions(response.data.map((workout) => workout.workout_name));
    } catch (error) {
      if (error.message.includes("403") || error.message.includes("401")) {
        setAlertMessage(
          "Please login or create an account to save generated workouts."
        );
      } else {
        setAlertMessage(
          "Something went wrong, please login again to save generated workouts."
        );
      }
      setShowAlert(true);
    }
  };

  useEffect(() => {
    fetchOptions("http://localhost:5001/exercises/muscles", setMuscles);
    fetchOptions("http://localhost:5001/exercises/categories", setCategories);
    fetchOptions("http://localhost:5001/exercises/equipment", setEquipment);
  }, []);

  useEffect(() => {
    if (workoutName.trim() == "") {
      setInputError("Workout name cannot be blank.");
      setShowInputError(true);
    } else if (workoutNames.includes(workoutName)) {
      setInputError(
        "Workout with given name already exists, please enter a different name."
      );

      setShowInputError(true);
    } else {
      setShowInputError(false);
    }
  }, [workoutName, workoutNames]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const auth = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetchWorkoutNames("http://localhost:5001/workouts", setWorkoutNames, auth);
  }, []);

  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  // TO DO: add number of exercises select option
  const handleChange = (e, selectedOptions, setSelectedOptions) => {
    const isChecked = e.target.checked;
    const option = e.target.value;
    const selectedOptionsSet = new Set(selectedOptions);

    if (isChecked) {
      selectedOptionsSet.add(option);
    } else {
      selectedOptionsSet.delete(option);
    }
    const newSelectedOptions = Array.from(selectedOptionsSet);
    setSelectedOptions(newSelectedOptions);
  };



  useEffect(() => {

    let generatedExerciseCards = [];
    workout.forEach((exercise) => {
      generatedExerciseCards.push({
        name: exercise.exercise[0].name,
        description: exercise.exercise[0].description,
        // TO DO: edit sets and reps
        categories: exercise.category.map((category) => category.name),
        muscles: exercise.muscles.map((muscle) => muscle.name),
        equipment: exercise.equipment.map(
          (one_equipment) => one_equipment.name
        ),
      });
    });


    setExerciseCards(generatedExerciseCards);
    setDisplayWorkout(true);
  }, [workout]);

  // TO DO: fix re rendering! (have to click twice for ui to update?)
  const generateWorkout = async (e) => {
    e.preventDefault();
    setWorkout([]);



    try {
      let queryParams = [];
      if (selectedCategories.length > 0) {
        queryParams.push(["categories", selectedCategories]);
      }
      if (selectedEquipment.length > 0) {
        queryParams.push(["equipment", selectedEquipment]);
      }
      if (selectedMuscles.length > 0) {
        queryParams.push(["muscles", selectedMuscles]);
      }

      const params = new URLSearchParams(queryParams);

      const response = await axios.get("http://localhost:5001/exercises", {
        params,
      });
      const shuffledExercises = response.data;
      for (let i = 0; i < shuffledExercises.length; i++) {
        let swapIndex = Math.floor(Math.random() * shuffledExercises.length);
        let temp = shuffledExercises[i];
        shuffledExercises[i] = shuffledExercises[swapIndex];
        shuffledExercises[swapIndex] = temp;
      }
      // TO DO: if more than 5 exercises shuffle them
      setWorkout(shuffledExercises.slice(0, 5));
      setCanSaveWorkout(true);
    } catch {
      setAlertMessage(
        "Something went wrong while generating workout, please try again."
      );
      setShowAlert(true);
    }
  };

  const saveWorkout = async (e) => {
    e.preventDefault();

    let workoutData = {
      workout_name: workoutName,
      workout_exercises: [],
    };

    for (const exercise of workout) {
      if (
        exercise.exercise[0].exercise_sets <= 0 ||
        exercise.exercise[0].exercise_reps <= 0
      ) {
        setAlertMessage(
          "Exercise sets and repetitions must be greater than 0."
        );
        setShowAlert(true);
        setShowInputDialog(false);
        return;
      }

      workoutData.workout_exercises.push({
        exercise_name: exercise.exercise[0].name,
        exercise_sets: exercise.exercise[0].exercise_sets
          ? exercise.exercise[0].exercise_sets
          : 3,
        exercise_reps: exercise.exercise[0].exercise_reps
          ? exercise.exercise[0].exercise_reps
          : 8,
      });
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5001/workouts", workoutData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setShowSaveConfirmation(true);
      setWorkoutNames((savedWorkoutNames) => [
        ...savedWorkoutNames,
        workoutName,
      ]);
      setShowInputDialog(false);
    } catch (error) {
      setShowInputDialog(false);
      if (error.message.includes("403") || error.message.includes("401")) {
        setAlertMessage(
          "Please login or create an account to save generated workouts."
        );
      } else {
        setAlertMessage(
          "Something went wrong while saving workout, please try again."
        );
      }

      setShowAlert(true);
    }
  };

  return (
    <div>
      <NavigationBar />
      {showAlert && (
        <ErrorAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      {showInputDialog && (
        <InputDialog
          header="Save Workout"
          buttonText="Save Workout"
          hasInput={true}
          inputPlaceholer="workout name"
          errorMessage={inputError}
          showErrorMessage={showInputError}
          input={workoutName}
          saveCallback={(e) => {
            setWorkoutName(workoutName);
            if (workoutName.trim() == "") {
              setInputError("Workout name cannot be blank.");
              setShowInputError(true);
            } else if (workoutNames.includes(workoutName)) {
              setInputError(
                "Workout with given name already exists, please enter a different name."
              );
              setShowInputError(true);
            } else {
              setShowInputError(false);
              saveWorkout(e);
            }
          }}
          cancelCallback={() => {
            setShowInputDialog(false);
          }}
          inputSaveCallback={(e) => {
            setWorkoutName(e.target.value);
          }}
        />
      )}
      {showSaveConfirmation && (
        <SuccessAlert
          message="Your workout has been saved!"
          onClose={() => setShowSaveConfirmation(false)}
        />
      )}
      <section className="bg-[#fffced] text-[#ccdaf7] min-h-screen h-fit flex flex-col justify-start bg-[#101010]">
        <div className=" py-8 px-4 mx-auto max-w-screen-xl text-center">
          <h2 className="text-[#7a8bb2] text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Workout Generator
          </h2>{" "}
          <div className="py-8 flex text-white justify-center space-x-2 max-w-screen-xl">
            <form className="flex space-x-4" onSubmit={generateWorkout}>
              <MultiSelectMenu
                name={"Categories"}
                options={categories}
                formFieldName={"categories"}
                handleChange={handleChange}
                selectedOptions={selectedCategories}
                setSelectedOptions={setSelectedCategories}
                color="#9cb2ea"
                menuColor="#ccdaf7"
              />
              <MultiSelectMenu
                name={"Muscles"}
                options={muscles}
                formFieldName={"muscles"}
                handleChange={handleChange}
                selectedOptions={selectedMuscles}
                setSelectedOptions={setSelectedMuscles}
                color="#9cb2ea"
                menuColor="#ccdaf7"
              />
              <MultiSelectMenu
                name={"Equipment"}
                options={equipment}
                formFieldName={"equipment"}
                handleChange={handleChange}
                selectedOptions={selectedEquipment}
                setSelectedOptions={setSelectedEquipment}
                color="#9cb2ea"
                menuColor="#ccdaf7"
              />
              <button
                type="submit"
                className="inline-block border  hover:bg-[#dcde7dff] border-[#d8d9a2ff] bg-[#d8d9a2ff] text-[#7a8bb2] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                Generate Workout
              </button>
            </form>
            {canSaveWorkout && (
              <button
                type="submit"
                className="inline-block hover:bg-[#f7d284ff] bg-[#fee4abff] text-[#7a8bb2] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                onClick={() => {
                  if (exerciseCards.length == 0) {
                    setAlertMessage(
                      "Need at least 1 exercise to save workout."
                    );
                    setShowAlert(true);
                  } else {
                    setShowInputDialog(true);
                  }
                }}
              >
                Save Workout
              </button>
            )}
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayWorkout &&
                exerciseCards.map((card) => (
                  <ExerciseCard
                    name={card.name}
                    description={card.description}
                    categories={card.categories}
                    muscles={card.muscles}
                    equipment={card.equipment}
                    handleSetsReps={handleSetsReps}
                    canEdit={true}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkoutGenerator;
