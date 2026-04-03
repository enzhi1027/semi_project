import { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MemberCommons.css";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";

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
      Swal.fire({
        title: "아이디 혹은, 비밀번호를<br>입력해주세요!",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
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
          <Input
            type="text"
            placeholder="아이디"
            name="memberId"
            id="memberId"
            value={member.memberId}
            onChange={inputMember}
            autoComplete="username" //사용자id, 이메일, 별명 명시
            //여기서는 유저ID를 명시
          ></Input>
        </div>
        <div className={styles.input_wrap}>
          <Input
            type="password"
            placeholder="비밀번호"
            name="memberPw"
            id="memberPw"
            value={member.memberPw}
            onChange={inputMember}
            autoComplete="current-password" //현재 사용 중인 비밀번호 명시
          ></Input>
        </div>
        <div className={styles.member_button_wrap}>
          <Button className="btn" type="submit">
            로그인
          </Button>
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
              navigate("/join");
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
