import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProfile } from "./utilities/userProfile";
import Login from "./screens/Login";
import Home from "./screens/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/styles.css";
import "./styles/home.css";
import "./styles/navbar.css";
import "./styles/userInterests.css";
import "./styles/userCard.css";
import "./styles/profileModal.css";

function App() {
  const [user] = useProfile();
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
