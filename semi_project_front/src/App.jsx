import "./App.css";
import "./font.css";
import { Route, Routes } from "react-router-dom";
import AttractionSearchPage from "./pages/attraction/AttractionSearchPage";
import { useState } from "react";
import Login from "./pages/attraction/member/Login";

function App() {
  const [page, setPage] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/attraction/list" element={<AttractionSearchPage />} />
        <Route path="/member/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
