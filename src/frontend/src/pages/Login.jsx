import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
const Login = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Something went wrong, please try again."
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      localStorage.setItem("username", formData.username);

      setFormData({ username: "", password: "" });
      navigate("/generate-workout");
    } catch {
      setAlertMessage("Invalid username and password combination.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <NavigationBar />
      {showAlert && (
        <ErrorAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      <section className="text-white h-[90vh] flex flex-col justify-start bg-[#fffaee] ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <div className="flex flex-col mx-auto max-w-screen-xl px-4 items-center justify-center gap-10">
            <div className="w-full lg:w-1/2 items=center"></div>
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
              <h1 className="mb-5 text-[#7a8bb2] text-2xl/7 font-bold sm:text-3xl sm:tracking-tight">
                Login
              </h1>
              <div className="text-left mb-5">
                <label
                  htmlFor="username"
                  className="text-[#7a8bb2] font-bold sm:tracking-tight"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  className="bg-[#cddbf884] border border-[#9ab0ec] text-[#4965af] text-sm rounded-lg  block w-full p-2.5 "
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-left mb-5">
                <label
                  htmlFor="password"
                  className="text-[#7a8bb2] font-bold sm:tracking-tight"
                >
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  className="bg-[#cddbf884] border border-[#9ab0ec] text-[#4965af] text-sm rounded-lg  block w-full p-2.5 "
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-[#4965af] hover:bg-[#9ab0ec] focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
