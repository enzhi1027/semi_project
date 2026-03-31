import { useState } from "react";
import "./App.css";
import "./font.css";
import Pagination from "./components/ui/Pagination";

function App() {
  const [page, setPage] = useState(0);

  return (
    <>
      <h1>hi</h1>
      <div className="hi"></div>
      <h1>good</h1>
      <Pagination page={page} setPage={setPage} totalPage={30} naviSize={5} />
    </>
  );
}

export default App;
