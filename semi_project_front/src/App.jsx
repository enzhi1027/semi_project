import "./App.css";
import "./font.css";
import { Route, Routes } from "react-router-dom";
import AttractionSearchPage from "./pages/attraction/AttractionSearchPage";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/attraction/list" element={<AttractionSearchPage />} />
      </Routes>
    </>
  );
}

export default App;
