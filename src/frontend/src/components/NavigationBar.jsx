const NavigationBar = () => {
  return (
    <nav className="bg-[#cddbf8]">
      <div className="max-w-screen px-6">
        <div className="lg:justify-start relative flex h-16 items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="text-[#9ab0ec] flex space-x-4">
              <a
                href="/"
                aria-current="page"
                className="flex-1 rounded-md border-2 border-dotted border-[#9ab0ec] hover:bg-[#9ab0ec] hover:text-white px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="/generate-workout"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium border-2 border-dotted border-[#9ab0ec] hover:bg-[#9ab0ec] hover:text-white"
              >
                Generate
              </a>
              <a
                href="/saved-workouts"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium border-2 border-dotted border-[#9ab0ec] hover:bg-[#9ab0ec] hover:text-white"
              >
                Workouts
              </a>
              <a
                href="/messages"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium  border-2 border-dotted border-[#9ab0ec] hover:bg-[#9ab0ec] hover:text-white "
              >
                Messages
              </a>
              <a
                href="/coming-soon"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium  border-2 border-dotted border-[#9ab0ec] hover:bg-[#9ab0ec] hover:text-white "
              >
                Progress
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
