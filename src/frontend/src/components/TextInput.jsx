const TextInput = ({
  header,
  placeholder,
  input,
  errorMessage,
  showErrorMessage,
  inputSaveCallback,
}) => {
  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm/6 font-medium text-[#2c2c34]"
      >
        {header ? header : null}
      </label>
      <p className="text-[#fabcacff] font-bold sm:text-sm/6">
        {showErrorMessage ? errorMessage : null}
      </p>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-[#cddbf8] pl-3 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[#9ab0ec]">
          <div className="shrink-0 text-base select-none sm:text-sm/6"></div>
          <input
            id="price"
            type="text"
            name="price"
            placeholder={placeholder ? placeholder : ""}
            value={input}
            onChange={inputSaveCallback}
            required
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-[#2c2c34] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;
