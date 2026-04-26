import { Routes, Route } from "react-router-dom";
import Studentlogin from "./components/Studentlogin";
import Home from "./pages/Home";
import LiveSession from "./pages/LiveSession";
import MentoraAnalytics from "./pages/MentoraAnalytics"
import MentorLogin from "./components/MentorLogin"
import StudentDashboard from "./pages/StudentDashboard";

import MentorDashboard from "./pages/MentorDashboard"; // ← add this import

function App() {
  return (
 
      <Routes>
         <Route path="/invest" element={<Mentora-board-inteliigence/>} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<MentoraAnalytics />} />
        <Route path="/Login/mentor" element={<MentorLogin />} />
        <Route path="/login/student" element={<Studentlogin />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/live-session" element={<LiveSession />} />
        <Route path="/mentor" element={<MentorDashboard />} />
      </Routes>

  );
}

export default App;