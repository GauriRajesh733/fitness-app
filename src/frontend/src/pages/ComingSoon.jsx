import NavigationBar from "../components/NavigationBar";
const ComingSoon = () => {
  return (
    <>
      <NavigationBar />
      <div className="p-5 lg:p-10 flex flex-col items-center justify-center bg-[#fffced] h-[90vh]">
        <h1 className="text-[#9ab0ec] font-bold tracking-tight leading-none text-5xl ">
          Coming Soon :)
        </h1>
      </div>
    </>
  );
};

export default ComingSoon;
