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

  const [member, setMember] = useState({
    //비밀번호 변경하기 위해서는 아이디를 알아야 하니 넣음.
    //새 비밀번호 입력용
    memberId: memberId,
    memberPw: "",
  });
  const [memberPwRe, setMemberPwRe] = useState(""); //새 비밀번호 확인용
  const [isAuth, setIsAuth] = useState(false); //화면 전환용(인증)

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
      <div className={styles.check_pw_wrap}>
        <h3>기존 비밀번호 확인</h3>
        <div className={`${styles.input_wrap} ${styles.check_pw}`}>
          <>
            <Input
              type="password"
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
      </div>

      {/*새 비밀번호 입력-------------------------------------- */}
      <div className={styles.new_pw_wrap}>
        <div>
          <>
            <h3>새 비밀번호 입력</h3>
            <div className={styles.input_wrap}>
              <Input
                type="password"
                name="memberPw"
                id="memberPw"
                placeholder="새 비밀번호 입력"
                value={member.memberPw}
                disabled={!isAuth}
                onChange={(e) => {
                  setMember({ ...member, memberPw: e.target.value });
                }}
              />
            </div>

            {/*새 비밀번호 확인-------------------------------------- */}
            <div className={styles.input_wrap}>
              <Input
                type="password"
                name="memberPwRe"
                id="memberPwRe"
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
      </div>
    </div>
  );
};

export default MyPw;
