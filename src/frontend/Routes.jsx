import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login";
import WorkoutGenerator from "./src/pages/WorkoutGenerator";
import Landing from "./src/pages/Landing";
import SignUp from "./src/pages/SignUp";
import SavedWorkouts from "./src/pages/SavedWorkouts";
import Messages from "./src/pages/Messages";
import ComingSoon from "./src/pages/ComingSoon";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/generate-workout" element={<WorkoutGenerator />} />
        <Route path="/saved-workouts" element={<SavedWorkouts />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
};
