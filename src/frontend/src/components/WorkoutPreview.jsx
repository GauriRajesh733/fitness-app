import ExerciseCard from "./ExerciseCard";

const WorkoutPreview = ({ name, exercises, exitPreview }) => {

  return (
    <div onClick={exitPreview}>
      <div
        aria-hidden="true"
        className="fixed inset-[0] bg-gray-500/75 transition-opacity"
      ></div>
      <div>
        <h2 className="py-8 text-[#cddbf8] relative z-20 text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight">
          {name}
        </h2>
      </div>
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {exercises?.map((exercise) => (
          <ExerciseCard
            key={exercise.exercise_name}
            name={exercise.exercise_name}
            reps={exercise.exercise_reps}
            sets={exercise.exercise_sets}
            description={exercise.exercise_description}
            canEdit={false}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutPreview;
