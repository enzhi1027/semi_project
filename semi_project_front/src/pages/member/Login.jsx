import { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MemberCommons.css";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";

const Login = () => {
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const navigate = useNavigate();
  const inputMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };

  const login = () => {
    if (member.memberId === "" || member.memberPw === "") {
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, member)
      .then((res) => {
        console.log(res);
        useAuthStore.getState().login(res.data);
        axios.defaults.headers.common["Authorization"] = res.data.token;
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "로그인 실패",
          text: "아이디, 혹은 비밀번호를 확인하세요.",
          icon: "error",

          confirmButtonColor: "var(--color1)",
        });
        setMember({ memberId: "", memberPw: "" });
      });
  };

  return (
    <section className={styles.login_wrap}>
      <h3 className="page-title">로그인</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        autoComplete="off"
      >
        <div className={styles.input_wrap}>
          <input
            type="text"
            placeholder="아이디"
            name="memberId"
            id="memberId"
            value={member.memberId}
            onChange={inputMember}
          ></input>
        </div>
        <div className={styles.input_wrap}>
          <input
            type="password"
            placeholder="비밀번호"
            name="memberPw"
            id="memberPw"
            value={member.memberPw}
            onChange={inputMember}
          ></input>
        </div>
        <div className={styles.member_button_wrap}>
          <button type="submit">로그인</button>
        </div>
        <div className={styles.assist_wrap}>
          <div className={styles.search_info}>
            <p
              className={styles.search_id}
              onClick={() => {
                navigate("/member/searchId");
              }}
            >
              아이디 찾기
            </p>

            <p
              className={styles.search_pw}
              onClick={() => {
                navigate("/member/searchPw");
              }}
            >
              비밀번호 찾기
            </p>
          </div>
          <p
            className={styles.join_member}
            onClick={() => {
              navigate("/member/join");
            }}
          >
            회원가입
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
