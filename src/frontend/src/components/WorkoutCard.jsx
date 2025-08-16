const WorkoutCard = ({
  workout_name,
  workout_equipment,
  workout_categories,
  handleClick,
  workout_id,
  color
}) => {
  return (
    <>
      <div
        style={{
          backgroundColor: color ? color : "#ccdaf7",
        }}
        className="overflow-hidden rounded hover:shadow-lg shadow-[#7a8bb2] "
        onClick={() => handleClick(workout_id)}
      >
        <div className="px-6 py-4">
          <div className="flex font-bold text-xl mb-2">
            <label>{workout_name}</label>
          </div>
        </div>
        <div className="text-[#7a8bb2] px-6 pt-4 pb-2">
          {
            // map through categories
            workout_categories?.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-[#f9d3ecff] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                {category}
              </span>
            ))
          }
          {
            // map through equipment
            workout_equipment?.map((one_equipment, index) => (
              <span
                key={index}
                className="inline-block bg-[#fee4abff] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                {one_equipment}
              </span>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default WorkoutCard;
