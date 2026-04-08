import { useEffect, useState } from "react";
import styles from "./Join.module.css";
import axios from "axios";
import { PostcodePopup } from "@clroot/react-kakao-postcode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";

const Join = () => {
  const navigate = useNavigate();

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

    if (name === "memberId") {
      setCheckId(0); //중복 체크 하기 전으로 초기화(입력이 달라질 때마다 체크해야 함)
    }
    if (name === "memberPw") {
      setCheckPw(0);
    }
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };

  //비밀번호 재입력
  const [memberPwRe, setMemberPwRe] = useState("");

  //아이디 중복 체크---------------------------------------
  //아이디 중복 체크 스테이트(0 : 중복 체크 전, 1 : 아이디 중복, 2 : 아이디 사용 가능, 3 : 공백)
  const [checkId, setCheckId] = useState(0);

  const idDupCheck = () => {
    if (member.memberId === "") {
      //공백일 때
      setCheckId(3);
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists?memberId=${member.memberId}`,
      )
      .then((res) => {
        console.log(res);
        if (res.data) {
          setCheckId(2);
        } else {
          setCheckId(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //아이디 중복 체크---------------------------------------

  //비밀번호 중복 체크---------------------------------------
  //비밀번호 중복 확인 스테이트 0 : 확인 전 , 1 : 일치, 2 : 불일치, 3 : 공백, 4 : 조건 불일치
  const [checkPw, setCheckPw] = useState(0);

  const pwDupCheck = () => {
    //▽비밀번호 정규표현식
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    const pwValue = member.memberPw;

    if (!pwRegex.test(pwValue)) {
      //비밀번호 조건 불일치할 때 4 리턴
      setCheckPw(4);
      return;
    }

    if (member.memberPw === "") {
      setCheckPw(3);
    } else if (member.memberPw === memberPwRe) {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };
  //비밀번호 중복 체크---------------------------------------

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
        title: "모든 정보, 혹은 올바른 정보를 입력해 주세요!",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
      return; //코드 종료
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res);
        if (res.data == 1) {
          //로그인 페이지로 이동
          Swal.fire({
            title: "회원가입이 완료되었습니다!",
            icon: "success",
            confirmButtonColor: "var(--color1)",
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //회원 가입 ----------------------------------------------------

  //전화번호 중복 체크----------------------------------------
  // 0 : 확인 전, 1 : 중복, 2 : 사용 가능 3 : 공백
  const [checkPhone, setCheckPhone] = useState(0);

  const phoneDupCheck = () => {
    //전화번호 정규표현식(010으로 시작하는 핸드폰 번호만)
    //▽010으로 시작하고 - 3~4자리 숫자 - 4자리 숫자
    const phoneRegex = /^010-\d{3,4}-\d{4}$/;
    const phoneValue = member.memberPhone;

    //숫자가 아닌 문자를 찾는 정규식 ^가 대괄호 내에서 사용되면 부정형
    const onlyNum = phoneValue.replace(/[^\d]/g, "");
    let onlyNumPhone = onlyNum;

    if (onlyNum.length == 11) {
      onlyNumPhone = onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (onlyNum.length == 10) {
      onlyNumPhone = onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    //숫자만 입력하면 - 자동으로 삽입
    setMember({ ...member, memberPhone: onlyNumPhone });

    if (!phoneRegex.test(onlyNumPhone)) {
      setCheckPhone(4);
      return;
    }

    if (member.memberPhone === "") {
      setCheckPhone(3);
      return;
    }
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists/phone?memberPhone=${onlyNumPhone}`,
      )
      .then((res) => {
        console.log(res);
        if (res.data) {
          setCheckPhone(1);
        } else {
          setCheckPhone(2);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //이메일 중복 체크----------------------------------------------
  //조회 전 : 0 / 중복 : 1 / 사용 가능 : 2 / 공백 : 3 / 조건 불일치 : 4

  const [checkEmail, setCheckEmail] = useState(0);
  const EmailDupCheck = () => {
    //▽이메일 정규표현식
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emailValue = member.memberEmail;

    //정규표현식 검사 로직
    if (!emailRegex.test(emailValue)) {
      setCheckEmail(4);
      return;
    }

    if (!member.memberEmail || member.memberEmail.trim() === "") {
      setCheckEmail(3);
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists/email?memberEmail=${member.memberEmail}`,
      )
      .then((res) => {
        console.log(res);
        if (res.data) {
          setCheckEmail(1); //중복
        } else {
          setCheckEmail(2); //사용 가능
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //이메일 중복 체크----------------------------------------------

  //이메일 인증 -----------------------------------------------------

  //인증 상태 관리용
  //0 : 인증 전송 버튼 누르기 전, 1 : 버튼 누른 후(코드 받기 전),
  //  2 : 코드 받은 후 3 : 인증 완료
  const [mailAuth, setMailAuth] = useState(0);
  //인증 코드 저장용
  const [mailAuthCode, setMailAuthCode] = useState(null);
  //이메일 인증 input용 state
  const [mailAuthInput, setMailAuthInput] = useState("");
  //이메일 인증 시간 처리를 위한 state 내가 이걸 왜 한다고 했을까
  const [time, setTime] = useState(180); //인증 유효를 3분으로 처리
  const [timeout, setTimeout] = useState(null); //유효 시간 안에 인증이 완료되면 시간이 줄어드는 함수를 정지

  const sendMail = () => {
    if (!member.memberEmail || member.memberEmail.trim() === "") {
      Swal.fire({
        title: "이메일을 입력해주세요!",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
      });
      setMember({ ...member, memberEmail: "" });
      return;
    }
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
  //이메일 인증 -----------------------------------------------------

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
            <div className={styles.input_id}>
              <Input
                type="text"
                name="memberId"
                id="memberId"
                placeholder="아이디"
                onChange={inputMember}
                autoComplete="username"
              />
              <Button className="btn" type="button" onClick={idDupCheck}>
                중복 체크
              </Button>
            </div>
            {checkId > 0 && (
              <p
                className={
                  checkId === 2
                    ? styles.check_msg
                    : styles.check_msg + " " + styles.invalid
                }
              >
                {checkId == 2 && "사용 가능한 아이디입니다!"}
                {checkId == 1 && "이미 사용 중인 아이디입니다."}
                {checkId == 3 && "아이디를 입력해주세요."}
              </p>
            )}
          </div>

          <div className={styles.input_wrap}>
            <Input
              type="password"
              name="memberPw"
              id="memberPw"
              placeholder="비밀번호 / 8자리 이상/대소문자,숫자,특수문자 포함"
              onChange={inputMember}
              //onBlur={pwDupCheck}
              autoComplete="new-password"
            />
            {checkPw == 4 && (
              <p className={styles.dup_false}>
                조건에 맞는 비밀번호를 입력해주세요.
              </p>
            )}
          </div>

          <div className={styles.input_wrap}>
            <Input
              type="password"
              name="memberPwRe"
              id="memberPwRe"
              placeholder="비밀번호 확인"
              value={memberPwRe}
              onChange={(e) => {
                setMemberPwRe(e.target.value);
              }}
              onBlur={pwDupCheck}
              autoComplete="new-password" //오토컴플아 경고문을 없애다오
              //라벨태그 사용 안 할 시 작성해서 무엇을 위한 인풋인지 명시하기 위해 사용
            />
            {checkPw > 0 && (
              <p
                className={
                  checkPw === 1
                    ? styles.check_msg
                    : styles.check_msg + " " + styles.invalid
                }
              >
                {checkPw === 1 && "비밀번호가 일치합니다."}
                {checkPw === 2 && "비밀번호가 일치하지 않습니다."}
                {checkPw === 3 && "비밀번호를 입력해주세요."}
              </p>
            )}
          </div>

          <div className={styles.input_wrap}>
            <Input
              type="text"
              name="memberName"
              id="memberName"
              placeholder="이름"
              onChange={inputMember}
            />
            {member.memberName === "" ? <p>이름을 입력해주세요.</p> : null}
          </div>

          <div className={styles.input_wrap}>
            <Input
              type="text"
              name="memberPhone"
              id="memberPhone"
              placeholder="전화번호 / 010-0000-0000"
              value={member.memberPhone}
              onChange={inputMember}
              onBlur={phoneDupCheck}
            />
            {checkPhone === 1 && (
              <p className={styles.dup_false}>이미 사용 중인 전화번호입니다.</p>
            )}
            {checkPhone === 2 && (
              <p className={styles.dup_ture}>사용 가능한 전화번호입니다!</p>
            )}
            {checkPhone === 3 && (
              <p className={styles.dup_false}>전화번호를 입력해주세요.</p>
            )}
            {checkPhone === 4 && (
              <p className={styles.dup_false}>
                올바른 전화번호를 입력해주세요.
              </p>
            )}
          </div>

          {/*메일 입력(전송)---------------------------------------- */}
          <div className={`${styles.input_wrap} ${styles.email_check}`}>
            <div>
              <Input
                type="text"
                name="memberEmail"
                id="memberEmail"
                placeholder="이메일"
                value={member.memberEmail}
                onBlur={EmailDupCheck}
                onChange={inputMember}
              />
              <Button className="btn" type="button" onClick={sendMail}>
                메일 전송
              </Button>
            </div>
            {checkEmail === 1 && (
              <p className={styles.dup_false}>이미 사용 중인 이메일입니다.</p>
            )}
            {checkEmail === 2 && (
              <p className={styles.dup_true}>사용 가능한 이메일입니다!</p>
            )}
            {checkEmail === 3 && (
              <p className={styles.dup_false}>이메일을 입력해주세요.</p>
            )}
            {checkEmail === 4 && (
              <p className={styles.dup_false}>
                형식에 맞는 이메일을 작성해주세요.
              </p>
            )}
          </div>
          {/*메일 입력(인증)---------------------------------------- */}
          {mailAuth > 1 && ( //메일을 받았을 때만 나타날 수 있도록 해줌
            <div className={styles.input_wrap}>
              <div className={styles.input_item}>
                <Input
                  type="text"
                  name="mailAuthInput"
                  id="mailAuthInput"
                  placeholder="인증번호"
                  value={mailAuthInput}
                  onChange={(e) => {
                    setMailAuthInput(e.target.value);
                  }}
                  disabled={mailAuth === 3}
                />
                <Button
                  className="btn"
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
                </Button>
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
            <Input
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
              <Button className="btn" type="button">
                주소 검색
              </Button>
            </PostcodePopup>
          </div>
          {/*주소 입력---------------------------------------- */}

          <div className={styles.input_wrap}>
            <Input
              type="text"
              name="memberAddrDetail"
              id="memberAddrDetail"
              placeholder="상세 주소"
              onChange={inputMember}
            />
          </div>
          <div className={styles.join_btn_wrap}>
            <Button className="join_btn" type="submit">
              회원가입
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Join;
