import { useState } from "react";
import useAuthStore from "../utils/useAuthStore";
import styles from "./MyPw.module.css";
import Button from "../ui/Button";
import { Input } from "../ui/Form";
import axios from "axios";
import Swal from "sweetalert2";

const MyPw = () => {
  const { memberId } = useAuthStore();
  const [currentPw, setCurrentPw] = useState(""); //기존 비밀번호 확인용

  //비밀번호 정규표현식 검사용 스테이트
  const [pwError, setPwError] = useState("");

  const [member, setMember] = useState({
    //비밀번호 변경하기 위해서는 아이디를 알아야 하니 넣음.
    //새 비밀번호 입력용
    memberId: memberId,
    memberPw: "",
  });
  const [memberPwRe, setMemberPwRe] = useState(""); //새 비밀번호 확인용
  const [isAuth, setIsAuth] = useState(false); //화면 전환용(인증)

  //비밀번호 정규 표현식
  const checkPwFormat = () => {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

    if (!member.memberPw) {
      setPwError("새 비밀번호를 입력해주세요.");
    } else if (!pwRegex.test(member.memberPw)) {
      setPwError("8자리 이상 / 대소문자, 숫자, 특수문자를 포함시켜주세요.");
    } else {
      setPwError("");
    }
  };

  const checkPw = () => {
    //비밀번호 관련 조회니까 post
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/check-pw`, {
        memberId: memberId,
        memberPw: currentPw,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          setIsAuth(true);
          setMember({ ...member, memberPw: "" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changePw = () => {
    //정규식 통과 여부
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    if (!pwRegex.test(member.memberPw)) {
      Swal.fire({
        title: "새 비밀번호를 확인해주세요.",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
    }

    if (member.memberPw !== "" && member.memberPw === memberPwRe) {
      axios
        .patch(`${import.meta.env.VITE_BACKSERVER}/members/pw`, member)
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "비밀번호 변경 완료!",
            text: "변경된 비밀번호로 로그인 해주세요!",
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            title: "비밀번호 변경 실패",
            text: "다시 시도해주세요.",
          });
        });
    }
  };

  return (
    <div className={styles.my_pw_wrap}>
      {/*기존 비밀번호 확인-------------------------------------- */}
      <form
        className={styles.check_pw_wrap}
        onSubmit={(e) => {
          e.preventDefault();
          checkPw();
        }}
      >
        <h3 className={styles.my_pw_title}>비밀번호 변경</h3>
        <h3 className={styles.check_pw_title}>기존 비밀번호 확인</h3>
        <div className={`${styles.input_wrap} ${styles.check_pw}`}>
          <>
            <Input
              type="password"
              name="currentPw"
              autoComplete="currentPw" //dom에러야 내 개발자 도구에서 꺼져
              value={currentPw}
              placeholder="기존 비밀번호 입력"
              onChange={(e) => {
                setCurrentPw(e.target.value);
              }}
              disabled={isAuth}
            />
            <Button className="btn" onClick={checkPw} disabled={isAuth}>
              비밀번호 확인
            </Button>
          </>
        </div>
        {isAuth ? (
          <p className={styles.true_msg}>확인 되었습니다.</p>
        ) : (
          <p className={styles.false_msg}>기존 비밀번호를 입력해주세요.</p>
        )}
      </form>

      {/*새 비밀번호 입력-------------------------------------- */}
      <form
        className={styles.new_pw_wrap}
        onSubmit={(e) => {
          e.preventDefault();
          changePw();
        }}
      >
        <div>
          <>
            <h3>새 비밀번호 입력</h3>
            <div className={styles.input_wrap}>
              <Input
                type="password"
                name="memberPw"
                id="memberPw"
                autoComplete="memberPw"
                placeholder="새 비밀번호 입력 / 8자리 이상 / 대소문자, 숫자, 특수문자 포함"
                value={member.memberPw}
                disabled={!isAuth}
                onChange={(e) => {
                  setMember({ ...member, memberPw: e.target.value });
                }}
                onBlur={checkPwFormat}
              />
              {pwError && <p className={styles.check_false}>{pwError}</p>}
            </div>

            {/*새 비밀번호 확인-------------------------------------- */}
            <div className={styles.input_wrap}>
              <Input
                type="password"
                name="memberPwRe"
                id="memberPwRe"
                autoComplete="memberPwRe"
                placeholder="새 비밀번호 확인"
                value={memberPwRe}
                disabled={!isAuth}
                onChange={(e) => {
                  setMemberPwRe(e.target.value);
                }}
              />
            </div>
            {isAuth &&
              (member.memberPw === "" || memberPwRe === "" ? (
                <p className={styles.check_msg}>새 비밀번호를 입력해주세요.</p>
              ) : member.memberPw === memberPwRe ? (
                <p className={styles.true_msg}>비밀번호가 일치합니다.</p>
              ) : (
                <p className={styles.false_msg}>
                  비밀번호가 일치하지 않습니다.
                </p>
              ))}
            <div className={`${styles.input_wrap} ${styles.check_btn}`}>
              <Button className="btn" onClick={changePw}>
                비밀번호 변경
              </Button>
            </div>
          </>
        </div>
      </form>
    </div>
  );
};

export default MyPw;
