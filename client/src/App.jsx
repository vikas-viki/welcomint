import Home from "./pages/Home";
import Mint from "./pages/Mint";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
