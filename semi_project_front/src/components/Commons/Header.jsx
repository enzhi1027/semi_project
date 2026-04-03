import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Commons.module.css";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useAuthStore from "../utils/useAuthStore";

const Header = () => {
  const location = useLocation();
  const mainPage = location.pathname === "/";
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const logout = () => {
    useAuthStore.getState().logout();
    delete axios.defaults.headers.common["Authorization"];
  };
  return (
    <>
      <div className={mainPage ? styles.header_wrap_main : styles.header_wrap}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Link to="/">LeafyGo</Link>
          </div>
          <ul className={styles.header_nav}>
            <li>
              <Link to="/attraction/list">생태관광지</Link>
            </li>
            <li>
              <Link to="/course/list">관광코스</Link>
            </li>
            <li>
              <Link to="/">커뮤니티</Link>
            </li>
            <li>
              <Link to="/">투어상품</Link>
            </li>
          </ul>
          {memberId ? (
            <>
              <div className={styles.member}>
                <Link to="/member/mypage">
                  <AccountCircleIcon sx={{ fontSize: 32, color: "#fff" }} />
                  <p>마이페이지</p>
                </Link>
                <div className={styles.logout} onClick={logout}>
                  <LogoutIcon />
                  <p>로그아웃</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.member}>
                <Link to="/member/login">
                  <LoginIcon />
                  <p>로그인</p>
                </Link>
                <Link to="/member/join">
                  <PersonAddAlt1Icon />
                  <p>회원가입</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
