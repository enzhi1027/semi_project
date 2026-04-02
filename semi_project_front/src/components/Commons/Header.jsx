import { Link, useLocation } from "react-router-dom";
import styles from "./Commons.module.css";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const Header = () => {
  const location = useLocation();
  const mainPage = location.pathname === "/";
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
          <div className={styles.member}>
            <>
              <Link to="/member/login">
                <LoginIcon />
                <p>로그인</p>
              </Link>
              <Link to="/member/join">
                <PersonAddAlt1Icon />
                <p>회원가입</p>
              </Link>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
