import "./App.css";
import "./font.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/Commons/MainPage";
import Header from "./components/Commons/Header";
import Footer from "./components/Commons/Footer";
import CourseListPage from "./pages/course/CourseListPage";
import AttractionSearchPage from "./pages/attraction/AttractionSearchPage";
import { useState } from "react";

function App() {
  return (
    <>
      <div className="wrap">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/course/list" element={<CourseListPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
