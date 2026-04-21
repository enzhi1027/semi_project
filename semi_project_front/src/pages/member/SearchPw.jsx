import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import styles from "./SearchPw.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SearchPwRe from "../../components/member/SearchPwRe";

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
  const [errorMsg, setErrorMsg] = useState({
    id: "",
    email: "",
    auth: "",
  });

  // 공통 에러 업데이트
  const updateError = (field, msg) => {
    setErrorMsg((prev) => ({ ...prev, [field]: msg }));
  };

  // 포커스 아웃 유효성 검사
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      const msgs = {
        memberId: "아이디를 입력해주세요.",
        memberEmail: "이메일을 입력해주세요.",
      };
      const field = name === "memberId" ? "id" : "email";
      updateError(field, msgs[name]);
    }
  };

  //메일 발송
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

    updateError("auth", "");

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-search-pw`, {
        memberId,
        memberEmail,
      })
      .then((res) => {
        setMailAuthCode(res.data);
        setMailAuthStatus(2); // 인증 대기
        setTime(180);
        if (timeoutId) clearInterval(timeoutId);
        const interval = setInterval(() => setTime((prev) => prev - 1), 1000);
        setTimeoutId(interval);
      })
      .catch((err) => {
        console.error(err);
        setMailAuthStatus(0);
        Swal.fire({
          title: "오류",
          text: "일치하는 회원 정보가 없거나 발송에 실패했습니다.",
          icon: "error",
        });
      });
  };

  // 인증번호 확인
  const authCheck = () => {
    if (
      String(mailAuthCode) === String(mailAuthInput) &&
      mailAuthCode !== null
    ) {
      setMailAuthStatus(3); // 인증 완료
      // 세션 스토리지에 인증 정보 저장 (새로고침 대비)
      sessionStorage.setItem("authMemberId", memberId);
      updateError("auth", "");
      clearInterval(timeoutId);
      Swal.fire("성공", "인증이 완료되었습니다.", "success");
    } else {
      updateError("auth", "인증번호가 일치하지 않습니다.");
    }
  };

  //타이머 정지
  useEffect(() => {
    if (time === 0) {
      clearInterval(timeoutId);
      setMailAuthStatus(0);
      updateError("auth", "인증 시간이 만료되었습니다. 다시 시도해주세요.");
    }
  }, [time]);

  return (
    <section className={styles.search_pw_wrap}>
      {mailAuthStatus === 3 ? (
        <SearchPwRe memberId={memberId} />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <h3 className="page-title">비밀번호 찾기</h3>
          <div className={styles.search_pw_input_wrap}>
            <div className={styles.input_wrap}>
              <Input
                type="text"
                name="memberId"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                onBlur={handleBlur}
                placeholder="아이디"
              />

              {errorMsg.id && <p className={styles.error}>{errorMsg.id}</p>}
            </div>
            <div className={styles.input_wrap}>
              <div className={styles.email_wrap}>
                <Input
                  type="text"
                  name="memberEmail"
                  value={memberEmail}
                  onBlur={handleBlur}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="이메일"
                />
                <Button type="button" className="btn" onClick={sendMail}>
                  인증메일 발송
                </Button>
              </div>
            </div>

            <div className={styles.input_wrap}>
              <div className={styles.check_wrap}>
                <Input
                  type="text"
                  name="mailAuthInput"
                  value={mailAuthInput}
                  onChange={(e) => {
                    setMailAuthInput(e.target.value);
                    updateError("auth", "");
                  }}
                  placeholder="인증번호 입력"
                  // 상태가 2(전송완료)가 아니면 입력 불가
                  disabled={mailAuthStatus < 2 || mailAuthStatus === 3}
                />
                <Button
                  type="button"
                  className="btn"
                  onClick={authCheck}
                  // 상태가 2가 아니면 버튼 클릭 불가
                  disabled={mailAuthStatus < 2 || mailAuthStatus === 3}
                >
                  인증하기
                </Button>
              </div>

              {/* 타이머 표시 영역 (전송 완료 상태에서만 노출) */}
              {mailAuthStatus === 2 && (
                <div className={styles.timer}>
                  남은 시간: {Math.floor(time / 60)}:
                  {String(time % 60).padStart(2, "0")}
                </div>
              )}

              {/* 인증 성공 시 메시지 표시 */}
              {mailAuthStatus === 3 && (
                <p className={styles.success_msg}>인증이 완료되었습니다.</p>
              )}

              {errorMsg.auth && <p className={styles.error}>{errorMsg.auth}</p>}
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default SearchPw;
