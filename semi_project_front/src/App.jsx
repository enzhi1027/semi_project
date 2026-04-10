import "./App.css";
import "./font.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/Commons/MainPage";
import Header from "./components/Commons/Header";
import Footer from "./components/Commons/Footer";
import CourseListPage from "./pages/course/CourseListPage";
import AttractionSearchPage from "./pages/attraction/AttractionSearchPage";
import { useEffect, useState } from "react";
import Login from "./pages/member/Login";
import Join from "./pages/member/Join";
import Mypage from "./pages/member/Mypage";
import CourseViewPage from "./pages/course/CourseViewPage";
import useAuthStore from "./components/utils/useAuthStore";
import axios from "axios";
import BoardListPage from "./pages/board/BoardListPage";
import BoardWritePage from "./pages/board/BoardWritePage";
import NaverSearch from "./pages/board/NaverSearch";
import CourseWritePage from "./pages/course/CourseWritePage";
import AdminTourInsert from "./pages/member(admin)/AdminTourInsert";
import TourSearchPage from "./pages/tour/TourSearchPage";
import BoardViewPage from "./pages/board/BoardViewPage";
import BoardModifyPage from './pages/board/BoardModifyPage';
import TourMyPage from "./pages/tour/TourMyPage";

function App() {
  const { endTime, token } = useAuthStore();
  const [categoryTest, setCategoryTest] = useState(0); // 0: 기본, 1: 커뮤니티 -> 관광
  const logout = () => {
    useAuthStore.getState().logout();
    delete axios.defaults.headers.common["Authorization"];
  };
  useEffect(() => {
    useAuthStore.getState().setReady(true);
    if (endTime === null) {
      return;
    }
    const timeout = endTime - Date.now();
    if (timeout > 0) {
      axios.defaults.headers.common["Authorization"] = token;
      window.setTimeout(() => {
        logout();
      }, timeout);
    } else {
      logout();
    }
  }, [endTime]);
  return (
    <>
      <div className="wrap">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/course/list" element={<CourseListPage />} />
            <Route path="/course/view/:courseNo" element={<CourseViewPage />} />
            <Route path="/course/write" element={<CourseWritePage />} />
            <Route
              path="/attraction/list"
              element={
                <AttractionSearchPage
                  categoryTest={categoryTest}
                  setCategoryTest={setCategoryTest}
                />
              }
            />

            {/*로그인, 회원가입 마이페이지------------------------------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/mypage/*" element={<Mypage />} />
            <Route
              path="/admin/tour/insertitem"
              element={<AdminTourInsert />}
            />
            {/*로그인, 회원가입 마이페이지------------------------------- */}

            <Route path="/board/list" element={<BoardListPage />} />
            <Route
              path="/board/write"
              element={
                <BoardWritePage
                  categoryTest={categoryTest}
                  setCategoryTest={setCategoryTest}
                />
              }
            />
            <Route path="/boardNavermap" element={<NaverSearch />} />
            <Route path="/tour/list" element={<TourSearchPage />} />
            <Route path="/board/view/:boardNo" element={<BoardViewPage />} />
            <Route path="/tour/mypage" element={<TourMyPage />} />
            <Route
              path="/board/modify/:boardNo"
              element={<BoardModifyPage />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
