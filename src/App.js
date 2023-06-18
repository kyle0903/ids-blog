import { React } from "react";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Personal from "./Personal";
import MainPage from "./MainPage";
import Nav1 from "./Nav1";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Nav1 />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:vaildcode" element={<MainPage />} />
          <Route path="/personal/:id" element={<Personal />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
