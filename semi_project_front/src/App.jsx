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
import BoardListPage from "./pages/board/BoardListPage";

function App() {
  return (
    <>
      <div className="wrap">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/course/list" element={<CourseListPage />} />
            <Route path="/course/view/:courseNo" element={<CourseViewPage />} />
            <Route path="/attraction/list" element={<AttractionSearchPage />} />
            <Route path="/member/login" element={<Login />} />
            <Route path="/member/join" element={<Join />} />
            <Route path="/member/mypage" element={<Mypage />} />
            <Route path="/board/list" element={<BoardListPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
