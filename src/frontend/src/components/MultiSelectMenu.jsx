const MultiSelectMenu = ({
  name,
  formFieldName,
  options,
  handleChange,
  selectedOptions,
  setSelectedOptions,
  color,
  menuColor,
}) => {
  return (
    <label className="relative group">
      <input type="checkbox" className="hidden peer" />

      <div
        style={{
          backgroundColor: color ? color : "#7E9680",
        }}
        className="cursor-pointer after:content-['▼'] after:text-xs after:ml-1 after:inline-flex after:items-center group-hover:after:-rotate-180 after:transition-transform rounded-full px-3 py-1 text-sm font-semibold mb-2"
      >
        {name}
      </div>
      <div
        style={{ backgroundColor: menuColor ? menuColor : "white" }}
        className="text-[#7a8bb2]  absolute p-2 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
      >
        <ul>
          {options?.map((option) => (
            <li key={option}>
              <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:font-bold [&:has(input:checked)]:bg-blue-200">
                <input
                  type="checkbox"
                  name={formFieldName}
                  value={option}
                  className="cursor-pointer"
                  onChange={(e) =>
                    handleChange(e, selectedOptions, setSelectedOptions)
                  }
                />
                <span className="ml-1">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
};

export default MultiSelectMenu;
