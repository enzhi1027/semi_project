import styles from "./Join.module.css";

const Join = () => {
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
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberId"
            id="memberId"
            placeholder="아이디"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="password"
            name="memberPw"
            id="memberPw"
            placeholder="비밀번호"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="password"
            name="memberPwRe"
            id="memberPwRe"
            placeholder="비밀번호 확인"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="number"
            name="memberPhone"
            id="memberPhone"
            placeholder="전화번호"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberEmail"
            id="memberEmail"
            placeholder="이메일"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberAddr"
            id="memberAddr"
            readOnly
            placeholder="주소"
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <input
            type="text"
            name="memberAddrDetail"
            id="memberAddrDetail"
            placeholder="상세 주소"
          ></input>
        </div>
      </section>
    </div>
  );
};

export default Join;
