// src/routes.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Signup from "./components/Auth/Signup";
// import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/Signup" element={<Signup />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
