import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProfile } from "./utilities/userProfile";
import Login from "./screens/Login";
import Home from "./screens/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/styles.css";
import "./styles/home.css";
import "./styles/navbar.css";
import "./styles/eventCard.css";
import "./styles/eventModal.css";

function App() {
  const [user] = useProfile();
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate replace to="/login" state={{inviteLink: window.location.search}}/>}
          />
          <Route
            path=':handle'
            element={user ? <Home /> : <Navigate replace to="/login" state={{inviteLink: window.location.search}}/>}
          />
          <Route
            path="/login"
            element={ <Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
