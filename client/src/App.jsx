import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import {  Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <ToastContainer />    
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    </>
  );
};

export default App;
