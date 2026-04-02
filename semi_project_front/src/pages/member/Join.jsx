import { useEffect, useState } from "react";
import styles from "./Join.module.css";
import axios from "axios";
import { PostcodePopup } from "@clroot/react-kakao-postcode";
import Swal from "sweetalert2";

const Join = () => {
  //저장할 정보
  const [member, setMember] = useState({
    memberId: "",
    memberName: "",
    memberPw: "",
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

  //아이디 중복 체크---------------------------------------

  //아이디 중복 체크 스테이트(0 : 중복 체크 전, 1 : 아이디 중복, 2 : 아이디 사용 가능)
  const [checkId, setCheckId] = useState(0);
  const idDupCheck = () => {
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

  //비밀번호 중복 체크---------------------------------------

  //비밀번호 중복 확인 스테이트 0 : 확인 전 , 1 : 일치, 2 : 불일치
  const [checkPw, setCheckPw] = useState(0);

  const pwDupCheck = () => {
    if (member.memberPw === memberPwRe) {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };

  //전화번호 중복 체크----------------------------------------
  // 0 : 확인 전, 1 : 중복, 2 : 사용 가능
  const [checkPhone, setCheckPhone] = useState(0);

  const phoneDupCheck = () => {
    axios(
      `${import.meta.env.VITE_BACKSERVER}/members/axists?memberPhone=${member.memberPhone}`,
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //이메일 중복 체크----------------------------------------------
  const [checkEmail, setCheckEmail] = useState(0);
  const EmailDupCheck = () => {
    axios(
      `${import.meta.env.VITE_BACKSERVER}/members/axists?memberEmail=${member.memberEmail}`,
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //회원 가입 ----------------------------------------------------
  const joinMember = () => {
    if (
      checkId !== 2 ||
      checkPw !== 1 ||
      checkPhone !== 2 ||
      checkEmail !== 3 ||
      member.memberAddr === "" ||
      member.memberName === ""
    ) {
      Swal.fire({
        title: "입력값을 확인하세요.",
        icon: "warning",

        confirmButtonColor: "var(--color1)",
      });
    }
  };

  //이메일 인증 -----------------------------------------------------

  //인증 상태 관리용
  //0 : 인증 전송 버튼 누르기 전, 1 : 버튼 누른 후(코드 받기 전),
  //  2 : 코드 받은 후 3 : 인증 완료
  const [mailAuth, setMailAuth] = useState(0);
  //인증 코드 저장용
  const [mailAuthCode, setMailAuthCode] = useState(null);
  //이메일 인증 input용 state
  const [mailAuthInput, setMailAuthInput] = useState("");
  //이메일 인증 시간 처리를 위한 state
  const [time, setTime] = useState(180); //인증 유효를 3분으로 처리
  const [timeout, setTimeout] = useState(null); //유효 시간 안에 인증이 완료되면 시간이 줄어드는 함수를 정지

  const sendMail = () => {
    setTime(180);
    if (timeout) {
      window.clearInterval(timeout);
    }
    setMailAuth(1);
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        console.log(res);
        setMailAuthCode(res.data);
        setMailAuth(2);
        const intervalId = window.setInterval(() => {
          //setState(() => {})
          // -> setState함수의 매개변수로 함수를 사용하면 해당 함수의 첫번째 매개변수가 돌아가는 시점의 state값
          setTime((prev) => {
            return prev - 1;
          });
          //setTime(time - 1); 비슷해 보이지만 완전 다른 코드
          //지금은 시간이 0이 되어도 -1 음수로 넘어감
        }, 1000);
        setTimeout(intervalId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (time === 0) {
      window.clearInterval(timeout); //시간이 다 되면 시간을 줄이는 interval함수 종료
      setMailAuthCode(null); //발급된 인증코드 파기
      setTimeout(null);
    }
  }, [time]);
  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0"); //문자열은 반드시 2자리이고 남는 공간은 오른쪽 값으로 채운다.
    console.log(time);
    return `${min}:${sec}`;
  };

  return (
    <div>
      <section className={styles.join_wrap}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinMember();
          }}
          autoComplete="off"
        >
          <h3 className="page-title">회원가입</h3>
          <div className={styles.input_wrap}>
            <input
              type="text"
              name="memberId"
              id="memberId"
              placeholder="아이디"
              onChange={inputMember}
              onBlur={idDupCheck}
            />
            {checkId > 0 && (
              <p
                className={
                  checkId === 2
                    ? styles.check_msg
                    : styles.check_msg + " " + styles.invalid
                }
              >
                {checkId == 2
                  ? "사용 가능한 아이디입니다."
                  : "이미 사용 중인 아이디입니다."}
              </p>
            )}
          </div>

          <div className={styles.input_wrap}>
            <input
              type="text"
              name="memberName"
              id="memberName"
              placeholder="이름"
              onChange={inputMember}
            />
          </div>

          <div className={styles.input_wrap}>
            <input
              type="password"
              name="memberPw"
              id="memberPw"
              placeholder="비밀번호"
              onChange={inputMember}
            />
          </div>

          <div className={styles.input_wrap}>
            <input
              type="password"
              name="memberPwRe"
              id="memberPwRe"
              placeholder="비밀번호 확인"
              value={memberPwRe}
              onChange={(e) => {
                setMemberPwRe(e.target.value);
              }}
              onBlur={pwDupCheck}
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
              onChange={inputMember}
            />
          </div>

          {/*메일 입력(전송)---------------------------------------- */}
          <div className={`${styles.input_wrap} ${styles.email_check}`}>
            <input
              type="text"
              name="memberEmail"
              id="memberEmail"
              placeholder="이메일"
              onChange={inputMember}
            />
            <button type="button" onClick={sendMail}>
              메일 전송
            </button>
          </div>
          {/*메일 입력(인증)---------------------------------------- */}
          {mailAuth > 1 && ( //메일을 받았을 때만 나타날 수 있도록 해줌
            <div className={styles.input_wrap}>
              <label className="mailAuthInput">이메일 확인</label>
              <div className={styles.input_item}>
                <input
                  type="text"
                  name="mailAuthInput"
                  id="mailAuthInput"
                  value={mailAuthInput}
                  onChange={(e) => {
                    setMailAuthInput(e.target.value);
                  }}
                  disabled={mailAuth === 3}
                ></input>
                <button
                  type="button"
                  onClick={() => {
                    if (mailAuthCode === mailAuthInput) {
                      setMailAuth(3);
                      window.clearInterval(timeout); //인증이 잘 되었다면 여기도 시간을 멈춤
                      //이 코드를 작성하지 않아도 보는 입장에서는 시간이 멈춘 것으로 보이지만 랜더링은 계속 돌고 있다.
                      setTimeout(null);
                    } else {
                      alert("인증코드가 올바르지 않습니다.");
                    }
                  }}
                >
                  인증하기
                </button>
              </div>
              <p className={styles.check_msg}>
                {mailAuth === 3 ? "인증되었습니다." : showTime()}
                {/*3이면 인증되었습니다. 아니면 시간이 감*/}
              </p>
            </div>
          )}
          {/*메일 입력(인증)---------------------------------------- */}

          {/*주소 입력---------------------------------------- */}
          <div className={`${styles.input_wrap} ${styles.addr_input}`}>
            <input
              type="text"
              name="memberAddr"
              id="memberAddr"
              readOnly
              placeholder="주소"
              onChange={inputMember}
              value={member.memberAddr}
            />
            <PostcodePopup
              onComplete={(data) => {
                console.log(data);

                const roadAddress =
                  data.roadAddress +
                  (data.buildingName ? " (" + data.buildingName + ")" : "");

                setMember({
                  ...member,
                  memberAddr: roadAddress,
                });
              }}
            >
              <button type="button">주소 검색</button>
            </PostcodePopup>
          </div>
          {/*주소 입력---------------------------------------- */}

          <div className={styles.input_wrap}>
            <input
              type="text"
              name="memberAddrDetail"
              id="memberAddrDetail"
              placeholder="상세 주소"
              onChange={inputMember}
            />
          </div>
          <div className={styles.join_btn_wrap}>
            <button className={styles.join_btn} type="submit">
              회원가입
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Join;
