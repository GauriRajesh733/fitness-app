import NavigationBar from "../components/NavigationBar";
const Landing = () => {
  return (
    <>
      <NavigationBar />
      <div className="bg-[#fffced] h-[90vh] lg:overflow-hidden">
        <div className="bg-[#fffced] text-[#4965af] py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-12 ">
          <div className="gap-10 flex flex-col lg:flex-row mx-auto max-w-screen-xl px-4 items-center justify-center">
            <div className="w-full lg:w-1/2 items=center">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">
                Ready to reach your fitness goals?
              </h1>
              <p className="mb-8 text-lg font-normal lg:text-xl px-16">
                Generate personalized workouts, track your progress, and work out with friends.
              </p>
              <div className="flex gap-2 justify-center">
                <a
                  href="/signup"
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 "
                >
                  Sign Up
                </a>
                <a
                  href="/login"
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 "
                >
                  Login
                </a>
              </div>
            </div>
            <img
              src="../public/assets/dark_plates.jpg"
              className="w-full max-w-md object-contain h-auto lg:scale-90"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
