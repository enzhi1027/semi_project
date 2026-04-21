import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import styles from "./SearchId.module.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const SearchId = () => {
  const navigate = useNavigate();

  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [mailAuthInput, setMailAuthInput] = useState(""); // 입력한 인증번호
  const [mailAuthCode, setMailAuthCode] = useState(null); // 서버에서 받은 인증번호
  const [mailAuthStatus, setMailAuthStatus] = useState(0); // 0:전송전, 1:전송중, 2:인증대기, 3:인증완료

  //에러 메시지
  const [errorMsg, setErrorMsg] = useState({
    name: "",
    phone: "",
    email: "",
    auth: "",
  });

  //타이머
  const [time, setTime] = useState(180);
  const [timeoutId, setTimeoutId] = useState(null);

  // ----------------------------------------------------

  const updateError = (field, msg) => {
    setErrorMsg((prev) => ({ ...prev, [field]: msg }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      const msgs = {
        memberName: "이름을 입력해주세요.",
        memberPhone: "전화번호를 입력해주세요.",
        memberEmail: "이메일을 입력해주세요.",
      };
      // Input의 name 속성에 따라 에러 메시지 설정
      const field = name.replace("member", "").toLowerCase(); // 'name', 'phone', 'email'
      updateError(field, msgs[name]);
    }
  };

  //전화번호 정규식
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (value.length > 7) {
      formatted = value.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }
    setMemberPhone(formatted);
  };

  const sendMail = () => {
    if (!memberName.trim() || !memberPhone.trim() || !memberEmail.trim()) {
      setErrorMsg({
        name: !memberName.trim() ? "이름을 입력해주세요." : "",
        phone: !memberPhone.trim() ? "전화번호를 입력해주세요." : "",
        email: !memberEmail.trim() ? "이메일을 입력해주세요." : "",
        auth: "",
      });
      return;
    }

    setMailAuthStatus(1); //전송 중으로 변경
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-search`, {
        memberName: memberName,
        memberPhone: memberPhone,
        memberEmail: memberEmail,
      })
      .then((res) => {
        setMailAuthCode(res.data);
        setMailAuthStatus(2);
        setTime(180);
        if (timeoutId) clearInterval(timeoutId);
        const interval = setInterval(() => setTime((prev) => prev - 1), 1000);
        setTimeoutId(interval);
      })
      .catch(() => {
        setMailAuthStatus(0);

        Swal.fire({
          title: "아이디 찾기",
          html: "입력된 전화번호 혹은, 이메일을 찾을 수 없습니다.<br><br>입력하신 정보를<br>다시 확인해주세요",
          confirmButtonColor: "var(--color1)",
          confirmButtonText: "회원가입",
          showCancelButton: true,
          cancelButtonColor: "var(--color5)",
          cancelButtonText: "닫기",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/join");
          }
        });
      });
  };

  //타이머 정지
  useEffect(() => {
    if (time === 0) {
      clearInterval(timeoutId);
      setMailAuthStatus(0);
    }
  }, [time]);

  //인증번호 입력
  const authCheck = () => {
    if (
      String(mailAuthCode) === String(mailAuthInput) &&
      mailAuthCode !== null
    ) {
      setMailAuthStatus(3);
      setErrorMsg((prev) => ({ ...prev, auth: "" }));
      clearInterval(timeoutId);
    } else {
      setErrorMsg((prev) => ({
        ...prev,
        auth: "인증번호가 일치하지 않습니다.",
      }));
    }
  };

  const searchId = () => {
    if (mailAuthStatus !== 3) {
      setErrorMsg((prev) => ({
        ...prev,
        auth: "인증을 완료해야 조회가 가능합니다.",
      }));
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/searchId`, {
        params: { memberName, memberPhone, memberEmail },
      })
      .then((res) => {
        Swal.fire({
          title: "아이디 찾기",
          html: `회원님의 아이디는 <p>${res.data}</p>입니다!`,
          icon: "info",
          confirmButtonColor: "var(--color1)",
          confirmButtonText: "로그인하기",
          showDenyButton: true,
          denyButtonColor: "var(--color5)",
          denyButtonText: "비밀번호 찾기",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/login");
          } else if (res.isDenied) {
            navigate("/searchPw");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "아이디 찾기",
          html: "조회된 아이디가 없습니다.<br><br>입력하신 정보를<br>다시 확인해주세요",
          confirmButtonColor: "var(--color1)",
          confirmButtonText: "회원가입",
          showCancelButton: true,
          cancelButtonColor: "var(--color5)",
          cancelButtonText: "닫기",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/join");
          }
        });
      });
  };

  //에러 메시지 공통
  const errorStyle = {
    color: "red",
    fontSize: "0.85rem",
    marginTop: "5px",
    paddingLeft: "5px",
  };

  return (
    <section>
      <div className={styles.search_id_wrap}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <h3 className="page-title">아이디 찾기</h3>
          <div className={styles.name_input_wrap}>
            <div className={styles.input_wrap}>
              <Input
                name="memberName"
                type="text"
                placeholder="이름 입력"
                value={memberName}
                onChange={(e) => {
                  setMemberName(e.target.value);
                  updateError("name", "");
                }}
                onBlur={handleBlur}
              />
            </div>
            {errorMsg.name && <div style={errorStyle}>{errorMsg.name}</div>}
          </div>
          <div className={styles.phone_input_wrap}>
            <div className={styles.input_wrap}>
              <Input
                name="memberPhone"
                type="text"
                placeholder="가입한 전화번호"
                value={memberPhone}
                onChange={handlePhoneInput}
                onBlur={handleBlur}
                maxLength={13}
              />
            </div>
            {errorMsg.phone && <div style={errorStyle}>{errorMsg.phone}</div>}
          </div>
          <div className={styles.input_wrap}>
            <div className={styles.email_wrap}>
              <Input
                name="memberEmail"
                type="text"
                placeholder="가입한 이메일"
                value={memberEmail}
                onChange={(e) => {
                  setMemberEmail(e.target.value);
                  updateError("email", "");
                }}
                onBlur={handleBlur}
              />
              <Button type="button" className="btn" onClick={sendMail}>
                인증메일 발송
              </Button>
            </div>
            {errorMsg.email && (
              <div className={styles.error}>{errorMsg.email}</div>
            )}
          </div>

          {/* 인증번호 (mailAuthStatus가 2 이상일 때만 표시) */}
          <div className={styles.input_wrap}>
            <div className={styles.check_wrap}>
              <Input
                type="text"
                placeholder="인증번호 입력"
                value={mailAuthInput}
                onChange={(e) => {
                  setMailAuthInput(e.target.value);
                  updateError("auth", "");
                }}
                disabled={mailAuthStatus < 2 || mailAuthStatus === 3}
              />
              <Button
                type="button"
                className="btn"
                onClick={authCheck}
                disabled={mailAuthStatus < 2 || mailAuthStatus === 3}
              >
                인증하기
              </Button>
            </div>

            {/* 타이머 (왼쪽 정렬을 위해 클래스 적용) */}
            {mailAuthStatus === 2 && (
              <div className={styles.timer}>
                남은 시간: {Math.floor(time / 60)}:
                {String(time % 60).padStart(2, "0")}
              </div>
            )}

            {/* 인증 성공 메시지 */}
            {mailAuthStatus === 3 && (
              <div className={styles.success_msg}>인증이 완료되었습니다.</div>
            )}

            {errorMsg.auth && (
              <div className={styles.error}>{errorMsg.auth}</div>
            )}
          </div>

          <div className={styles.search_id_btn_wrap}>
            <Button type="button" className="btn" onClick={searchId}>
              아이디 조회
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchId;
