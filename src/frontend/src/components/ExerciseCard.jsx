const ExerciseCard = ({
  name,
  description,
  sets,
  reps,
  categories,
  muscles,
  equipment,
  handleSetsReps,
  canEdit,
}) => {
  return (
    <>
      <div className="bg-[#ccdaf7] overflow-hidden rounded text-[#7a8bb2]">
        <div className="px-6 py-4">
          <div className="flex font-bold text-xl mb-2">
            <p className="basis-2/3">{name ? name : "No Exercise Name"}</p>
            <div>
              {canEdit ? (
                <span className="inline-block bg-[#9cb2ea] rounded-full px-3 py-1 text-sm font-semibold ml-2 mr-2 mb-2">
                  <input
                    type="number"
                    name="sets"
                    min={1}
                    id={name}
                    onChange={handleSetsReps}
                    placeholder={3}
                    value={sets}
                    className="w-10 px-1 py-0.5 text-center rounded-sm border border-gray-300 "
                  ></input>{" "}
                  sets
                </span>
              ) : (
                <span className="inline-block bg-[#9cb2ea] rounded-full px-3 py-1 text-sm font-semibold ml-2 mr-2 mb-2">
                  {sets} sets
                </span>
              )}
              {canEdit ? (
                <span className="inline-block bg-[#9cb2ea] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 max-h-30">
                  <input
                    type="number"
                    id={name}
                    name="reps"
                    min={1}
                    onChange={handleSetsReps}
                    placeholder={8}
                    value={reps}
                    className="w-10 px-1 py-0.5 text-center rounded-sm border border-gray-300"
                  ></input>{" "}
                  reps
                </span>
              ) : (
                <span className="inline-block bg-[#9cb2ea] rounded-full px-3 py-1 text-sm font-semibold ml-2 mr-2 mb-2">
                  {reps} reps
                </span>
              )}
            </div>
          </div>
          <p className="pt-2 text-base">
            {description ? description : "No Exercise Description."}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {
            // map through categories
            categories?.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-[#d8d9a2ff] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                {category}
              </span>
            ))
          }
          {
            // map through muscles
            muscles?.map((muscle, index) => (
              <span
                key={index}
                className="inline-block bg-[#f9d3ecff] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                {muscle}
              </span>
            ))
          }
          {
            // map through equipment
            equipment?.map((one_equipment, index) => (
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

export default ExerciseCard;
