import "./App.css";
import "./font.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/Commons/MainPage";
import Header from "./components/Commons/Header";
import Footer from "./components/Commons/Footer";
import CourseListPage from "./pages/course/CourseListPage";
import AttractionSearchPage from "./pages/attraction/AttractionSearchPage";
import { useState } from "react";
import Login from "./pages/member/Login";
import Join from "./pages/member/Join";
import Mypage from "./pages/member/Mypage";
import CourseViewPage from "./pages/course/CourseViewPage";

function App() {
  return (
    <>
      <div className="wrap">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/course/list" element={<CourseListPage />} />
            <Route path="/course/view" element={<CourseViewPage />} />
            <Route path="/attraction/list" element={<AttractionSearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
