import TextInput from "./TextInput";

const SearchDialog = ({
  header,
  message,
  buttonText,
  hasInput,
  inputPlaceholder,
  saveCallback,
  cancelCallback,
  input,
  errorMessage,
  showErrorMessage,
  inputSaveCallback,
  searchResults,
  saveResult,
  selectedResult,
}) => {
  return (
    <div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-10"
      >
        <div
          aria-hidden="true"
          className="fixed inset-0 transition-opacity"
        ></div>
        <div className="fixed inset-0 z-10 w-screen">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="max-h-[40vh] resize-none overflow-y-hidden overflow-x-hidden relative transform rounded-lg bg-[#fffaee] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="text-[#2c2c34] bg-[#fffaee] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-fit mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="dialog-title" className="text-base font-semibold">
                      {header}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                    {hasInput ? (
                      <TextInput
                        placeholder={inputPlaceholder}
                        input={input}
                        errorMessage={errorMessage}
                        showErrorMessage={showErrorMessage}
                        inputSaveCallback={inputSaveCallback}
                      />
                    ) : null}
                    <div className="mt-2 max-h-[15vh] overflow-y-auto">
                      {searchResults?.map((result) => (
                        <button
                          key={result}
                          name={result}
                          value={false}
                          onClick={saveResult}
                          style={{
                            border:
                              selectedResult == result
                                ? "4px solid #4965af"
                                : "0px",
                          }}
                          className="mb-2 mr-2 rounded-md bg-[#7a8bb2] text-white px-3 py-2 text-sm font-semibold hover:scale-105 sm:mt-0"
                        >
                          {result}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex  justify-center rounded-md bg-[#d8d9a2ff] border-[#d8d9a2ff] hover:bg-[#ced063] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#919a92ff] sm:ml-3 sm:w-auto"
                  onClick={saveCallback}
                >
                  {buttonText}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex  justify-center rounded-md hover:bg-[#9cb2ea] text-white px-3 py-2 text-sm font-semibold shadow-xs bg-[#ccdaf7] sm:mt-0 "
                  onClick={cancelCallback}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
