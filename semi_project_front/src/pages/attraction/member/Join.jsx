import { useState } from "react";
import styles from "./Join.module.css";
import axios from "axios";

const Join = () => {
  //저장할 정보
  const [member, setMember] = useState({
    memberId: "",
    memberName: "",
    memberPW: "",
    memberPhone: "",
    memberEmail: "",
    memberAddr: "",
    memberAddrDetail: "",
  });

  const inputMember = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };

  //비밀번호 재입력
  const [memberPwRe, setMemberPwRe] = useState("");

  //아이디 중복 체크 스테이트(0 : 중복 체크 전, 1 : 아이디 중복, 2 : 아이디 사용 가능)
  const [checkId, setCheckId] = useState(0);
  //아이디 중복 체크---------------------------------------
  const idCheck = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/axists?memberId=${member.memberId}`,
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //아이디 중복 체크---------------------------------------

  const pwCheck = () => {
    if (member.memberPW === memberPwRe) {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };

  //비밀번호 중복 확인 스테이트 0 : 확인 전 , 1 : 일치, 2 : 불일치
  const [checkPw, setCheckPw] = useState(0);

  return (
    <div>
      <section className={styles.join_wrap}>
        <h3 className="page-title">회원가입</h3>
        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberName"
            id="memberName"
            placeholder="이름"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberId"
            id="memberId"
            placeholder="아이디"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="password"
            name="memberPw"
            id="memberPw"
            placeholder="비밀번호"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="password"
            name="memberPwRe"
            id="memberPwRe"
            placeholder="비밀번호 확인"
            onChange={(e) => {
              setMemberPwRe(e.target.value);
            }}
            onBlur={pwCheck}
          />
          {checkPw > 0 && (
            <p
              className={
                checkPw === 1
                  ? styles.check_msg
                  : styles.check_msg + " " + styles.invalid
              }
            >
              {checkPw === 1
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberPhone"
            id="memberPhone"
            placeholder="전화번호"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberEmail"
            id="memberEmail"
            placeholder="이메일"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberAddr"
            id="memberAddr"
            readOnly
            placeholder="주소"
          />
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberAddrDetail"
            id="memberAddrDetail"
            placeholder="상세 주소"
          />
        </div>
      </section>
    </div>
  );
};

export default Join;
