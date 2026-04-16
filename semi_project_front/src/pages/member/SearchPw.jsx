import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import styles from "./SearchPw.module.css";
import { useState } from "react";
import axios from "axios";

const SearchPw = () => {
  const navigate = useNavigate();

  //입력 정보
  const [memberId, setMemberId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [mailAuthInput, setMailAuthInput] = useState("");

  //상태 관리
  const [mailAuthCode, setMailAuthCode] = useState(null);
  const [mailAuthStatus, setMailAuthStatus] = useState(0);
  // 0:전송전, 1:전송중, 2:인증대기, 3:인증완료

  //타이머 관련
  const [time, setTime] = useState(180);
  const [timeoutId, setTimeoutId] = useState(null);

  //에러 메시지
  const [errorMsg, setErrorMsg] = useState("");

  const sendMail = () => {
    if (!memberId.trim() || !memberEmail.trim()) {
      Swal.fire({
        title: "정보 입력",
        text: "아이디와 이메일을 모두 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
      return;
    }

    setMailAuthStatus(1); //전송중

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-search-pw`, {
        memberId,
        memberEmail,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.search_pw_wrap}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        autoComplete="off"
      >
        <h3 className="page-title">비밀번호 찾기</h3>
        <div className={styles.search_pw_input_wrap}>
          <div className={styles.input_wrap}>
            <Input type="text" placeholder="아이디" />
          </div>
          <div className={styles.input_wrap}>
            <div className={styles.email_wrap}>
              <Input type="text" placeholder="이메일" />
              <Button type="button" className="btn">
                인증메일 발송
              </Button>
            </div>
          </div>
          <div className={styles.input_wrap}>
            <div className={styles.check_wrap}>
              <Input type="text" placeholder="인증번호 입력" />
              <Button type="button" className="btn">
                인증하기
              </Button>
            </div>
          </div>
          <div className={styles.pw_re_wrap}>
            <Button type="button" className="btn">
              비밀번호 재설정
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SearchPw;
