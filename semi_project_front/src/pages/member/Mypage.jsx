import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./Mypage.module.css";
import Swal from "sweetalert2";
import MyInfo from "../../components/mypage/MyInfo";
import MyPw from "../../components/mypage/MyPw";
import LikeContent from "../../components/mypage/LikeContent";
import MyActive from "../../components/mypage/MyActive";
import Mypayment from "../../components/mypage/MyPayment";
import userImg from "../../assets/img/mainPage/user.png";
import { useEffect, useRef } from "react";
import axios from "axios";
import AdminContent from "../../components/admin/AdminContent";
import AdminTour from "../../components/admin/AdminTour";

const Mypage = () => {
  const { memberId, memberGrade, isReady } = useAuthStore();
  const navigate = useNavigate();
  //아이디가 있고 isReady가 true일 때만 동작

  //경로 객체 접근 / 현재 경로의 정보 사용하기 위해 필요
  const location = useLocation();

  useEffect(() => {
    // isReady가 true인데 memberId가 없다면 로그인이 안 된 상태
    // 비 로그인 사용자 차단
    if (isReady && memberId == null) {
      Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "warning" }).then(
        () => {
          navigate("/login");
        },
      );
      //관리자 페이지 접근 제한
      //객체 주소에 admin 포함 + 회원 등급 1 아닐 때 접근 제한
    } else if (location.pathname.includes("admin") && memberGrade !== 1) {
      Swal.fire({
        title: "관리자만 접근 가능합니다.",
        text: "관리자 아이디로 접속해주세요.",
        icon: "error",
        confirmButtonColor: "var(--color1)",
        //마이페이지/내 정보로 이동
      }).then(() => {
        navigate("/mypage/myinfo");
      });
    }
  }, [isReady, memberId, memberGrade, navigate]);
  return (
    isReady &&
    memberId && (
      <section className={styles.mypage_wrap}>
        <h3 className={styles.mypage_title}>마이페이지</h3>
        <div className={styles.mypage_menu_wrap}>
          <div className={styles.mypage_aside}>
            <MemberProfileSide />
            <SideMenu />
          </div>

          {/*메인 정보창 */}
          <div className={styles.mypage_content}>
            <Routes>
              {/*서브 라우팅*/}
              <Route
                path="/"
                element={
                  <Navigate to="myinfo" replace />
                  /*마이 페이지 들어와서 바로 내 정보 뜨게 해주는 CODE*/
                }
              />
              <Route
                path="myinfo"
                element={<MyInfo /> /*내 정보 || 그래도 얘는 필요함*/}
              />
              <Route path="mypw" element={<MyPw /> /*비밀번호 변경 */} />
              <Route
                path="likecontent"
                element={
                  <LikeContent />
                  /*좋아요 표시한 컨텐츠 */
                }
              />
              <Route path="myactive" element={<MyActive /> /*내 활동 관리 */} />
              <Route path="mypayment" element={<Mypayment /> /*결제 내역 */} />
              <Route path="admin/content" element={<AdminContent />} />
              <Route
                path="admin/tour"
                element={<AdminTour /> /*투어 상품 관리 */}
              />
              /
            </Routes>
          </div>
        </div>
      </section>
    )
  );
};

//사이드바 프로필 이미지(여기선 이미지 변경 불가)
const MemberProfileSide = () => {
  const { memberThumb } = useAuthStore();

  return (
    <div className={styles.member_profile_side}>
      <div
        className={
          memberThumb ? styles.member_thumb_exists : styles.member_thumb
        }
      >
        <img
          src={
            memberThumb
              ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${memberThumb}`
              : userImg
          }
        />
      </div>
    </div>
  );
};

//사이드 메뉴 -----------------------------------------------------------
const SideMenu = () => {
  const { memberGrade } = useAuthStore();
  return (
    <div className={styles.side_menu}>
      {/*내 정보------------------------------------------------------ */}
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/mypage/myinfo"
      >
        내 정보
      </NavLink>

      {/*비밀번호 변경------------------------------------------------- */}
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/mypage/mypw"
      >
        비밀번호 변경
      </NavLink>

      {/*좋아요 표시한 컨텐츠------------------------------------------- */}
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/mypage/likecontent"
      >
        좋아요 표시한 컨텐츠
      </NavLink>

      {/*내 활동 관리-------------------------------------------------- */}
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/mypage/myactive"
      >
        내 활동 관리
      </NavLink>

      {/*결제 내역----------------------------------------------------- */}
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/mypage/mypayment"
      >
        결제 내역
      </NavLink>

      {/*관리자 전용 --------------------------------------------------- */}
      {memberGrade === 1 && (
        <>
          <div className={styles.admin_line}>
            <ul>
              관리자 전용
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active_menu : ""
                  }
                  to="/mypage/admin/content"
                >
                  회원, 게시글 관리
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active_menu : ""
                  }
                  to="/mypage/admin/tour"
                >
                  투어 상품 관리
                </NavLink>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Mypage;
