import styles from "./SearchPwRe.module.css";
import { useState } from "react";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SearchPwRe = ({ memberId }) => {
  const navigate = useNavigate();
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");

  // 비밀번호 상태 관리 (Join.jsx와 동일)
  // 0: 확인 전, 1: 일치, 2: 불일치, 3: 공백, 4: 조건 불일치
  const [checkPw, setCheckPw] = useState(0);

  // 비밀번호 정규식 및 일치 체크 함수
  const pwCheck = () => {
    // Join.jsx에서 가져온 정규표현식
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

    if (newPw === "") {
      setCheckPw(3); // 공백
    } else if (!pwRegex.test(newPw)) {
      setCheckPw(4); // 조건 불일치
    } else if (newPw === newPwConfirm) {
      setCheckPw(1); // 일치 및 조건 충족
    } else {
      setCheckPw(2); // 불일치
    }
  };

  const handleChangePw = () => {
    // 최종 가입 전 상태가 1(성공)인지 확인
    if (checkPw !== 1) {
      Swal.fire({
        title: "입력 정보를 확인해주세요",
        text: "비밀번호가 조건에 맞지 않거나 일치하지 않습니다.",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
      return;
    }

    // 서버로 전송
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/reset-pw`, {
        memberId: memberId,
        memberPw: newPw,
      })
      .then((res) => {
        Swal.fire({
          title: "성공",
          text: "비밀번호가 변경되었습니다!",
          icon: "success",
          confirmButtonColor: "var(--color1)",
        }).then(() => {
          sessionStorage.removeItem("authMemberId"); // 세션 스토리지 청소
          navigate("/login");
        });
      })
      .catch((err) => {
        Swal.fire("오류", "비밀번호 변경에 실패했습니다.", "error");
      });
  };

  return (
    <section className={styles.reset_pw}>
      <h3 className="page-title">비밀번호 재설정</h3>
      <p>
        <strong>'{memberId}'</strong> 님의 새로운 비밀번호를 입력해주세요.
      </p>

      <div className={styles.input_wrap}>
        <Input
          type="password"
          placeholder="비밀번호 / 8자리 이상/대소문자,숫자,특수문자 포함"
          value={newPw}
          onChange={(e) => {
            setNewPw(e.target.value);
            setCheckPw(0); // 입력 시 상태 초기화
          }}
          onBlur={pwCheck}
          autoComplete="new-password"
        />
        {checkPw === 4 && (
          <p className={styles.invalid_msg}>
            조건에 맞는 비밀번호를 입력해주세요.
          </p>
        )}
      </div>

      <div className={styles.input_wrap}>
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={newPwConfirm}
          onChange={(e) => {
            setNewPwConfirm(e.target.value);
            setCheckPw(0); // 입력 시 상태 초기화
          }}
          onBlur={pwCheck}
          autoComplete="new-password"
        />
        {checkPw > 0 && checkPw !== 4 && (
          <p
            className={
              checkPw === 1
                ? styles.check_msg
                : `${styles.check_msg} ${styles.invalid}`
            }
          >
            {checkPw === 1 && "비밀번호가 일치합니다."}
            {checkPw === 2 && "비밀번호가 일치하지 않습니다."}
            {checkPw === 3 && "비밀번호를 입력해주세요."}
          </p>
        )}
      </div>

      <div className={styles.reset_btn_wrap}>
        <Button type="button" className="btn" onClick={handleChangePw}>
          비밀번호 변경하기
        </Button>
      </div>
    </section>
  );
};

export default SearchPwRe;
