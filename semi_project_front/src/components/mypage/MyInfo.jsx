import styles from "./MyInfo.module.css";
import userImg from "../../assets/img/mainPage/user.png";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/Form";
import { PostcodePopup } from "@clroot/react-kakao-postcode";
import Button from "../ui/Button";
import Swal from "sweetalert2";

const MyInfo = () => {
  const { memberId } = useAuthStore();
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  //수정 에러 메시지(이메일, 전화번호)
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        console.log(res);
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //회원 탈퇴 -------------------------------------------------------------
  const outMember = () => {
    Swal.fire({
      title: "회원 탈퇴",
      html: "정말로 탈퇴하시겠습니까?<br><br>아직 소개해드릴 곳이<br>남아있습니다.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "닫기",
      confirmButtonText: "탈퇴하기",
      cancelButtonColor: "var(--color1)",
      confirmButtonColor: "var(--gray4)",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title:
            "탈퇴 시 회원 정보가 모두 삭제되며 <br>추후 복구가 불가합니다.",
          text: "정말로 탈퇴하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "닫기",
          confirmButtonText: "탈퇴하기",
          cancelButtonColor: "var(--color1)",
          confirmButtonColor: "var(--gray4)",
        }).then((res) => {
          if (res.isConfirmed) {
            axios
              .delete(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
              .then((res) => {
                console.log(res);
                if (res.data === 1) {
                  useAuthStore.getState().logout();
                  delete axios.defaults.headers.common["Authorization"];
                  Swal.fire({
                    title: "회원 탈퇴가 정상적으로<br>처리되었습니다.",
                    text: "그동안 감사했습니다! 언젠가 다시 만나요!",
                    icon: "success",
                  }).then((res) => {
                    navigate("/");
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    });
  };
  //회원 탈퇴 -------------------------------------------------------------

  //이메일 수정 ------------------------------------------------------
  const checkEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!member.memberEmail) {
      setEmailError("이메일을 입력해주세요.");
    } else if (!emailRegex.test(member.memberEmail)) {
      setEmailError("올바른 이메일을 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  //전화번호 수정 ------------------------------------------------------
  const checkPhone = () => {
    const phoneValue = member.memberPhone;
    if (!phoneValue) {
      setPhoneError("전화번호를 입력해주세요.");
    }

    const onlyNum = phoneValue.replace(/[^\d]/g, "");
    let onlyNumPhone = onlyNum;

    if (onlyNum.length == 11) {
      onlyNumPhone = onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (onlyNum.length == 10) {
      onlyNumPhone = onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    setMember({ ...member, memberPhone: onlyNumPhone });

    const phoneRegex = /^010-\d{3,4}-\d{4}$/;

    if (!phoneRegex.test(onlyNumPhone)) {
      setPhoneError("올바른 전화번호를 입력해주세요.");
    } else {
      setPhoneError("");
    }
  };

  return (
    member && (
      <div className={styles.my_info_wrap}>
        <h3>내 정보</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            const phoneRegex = /^010-\d{3,4}-\d{4}$/;

            //에러 메시지가 있고, 검사식 결과가 불일치할 때는 등록 불가
            if (
              emailError ||
              phoneError ||
              !emailRegex.test(member.memberEmail) ||
              !phoneRegex.test(member.memberPhone)
            ) {
              Swal.fire({
                title: "잘못된 정보가 있습니다!",
                text: "정보를 다시 확인해주세요!",
                icon: "error",
                confirmButtonColor: "var(--color1)",
              });
              return;
            }
            axios
              .patch(
                `${import.meta.env.VITE_BACKSERVER}/members/${member.memberId}`,
                member,
              )
              .then((res) => {
                console.log(res);
                if (res.data === 1) {
                  Swal.fire({
                    title: "정보가 변경되었습니다!",
                    icon: "success",
                    confirmButtonColor: "var(--color1)",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <div className={styles.thumb_and_info_wrap}>
            <MemberProfileInfo />
            <div className={styles.all_input_wrap}>
              <div className={styles.input_wrap}>
                <label htmlFor="memberId">아이디 : </label>
                <Input
                  type="text"
                  name="memberId"
                  id="memberId"
                  value={member.memberId}
                  disabled={true} //선택막기
                ></Input>
              </div>

              <div className={styles.input_wrap}>
                <label htmlFor="memberName">이름 : </label>
                <Input
                  type="text"
                  name="memberName"
                  id="memberName"
                  value={member.memberName}
                  onChange={(e) => {
                    setMember({ ...member, memberName: e.target.value });
                  }}
                ></Input>
              </div>

              <div className={styles.input_wrap}>
                <label htmlFor="memberEmail">이메일 : </label>
                <div className={styles.check_wrap}>
                  <Input
                    type="text"
                    name="memberEmail"
                    id="memberEmail"
                    value={member.memberEmail}
                    onChange={(e) => {
                      setMember({ ...member, memberEmail: e.target.value });
                    }}
                    onBlur={checkEmail}
                  />
                  {emailError && (
                    <p className={styles.check_false}>{emailError}</p>
                  )}
                </div>
              </div>

              <div className={styles.input_wrap}>
                <label htmlFor="memberPhone">전화번호 : </label>
                <div className={styles.check_wrap}>
                  <Input
                    type="text"
                    name="memberPhone"
                    id="memberPhone"
                    value={member.memberPhone}
                    onBlur={checkPhone}
                    onChange={(e) => {
                      setMember({ ...member, memberPhone: e.target.value });
                    }}
                  />
                  {phoneError && (
                    <p className={styles.check_false}>{phoneError}</p>
                  )}
                </div>
              </div>

              <div className={`${styles.input_wrap} ${styles.input_addr_wrap}`}>
                <label htmlFor="memberAddr">주소 : </label>
                <Input
                  type="text"
                  name="memberAddr"
                  id="memberAddr"
                  value={member.memberAddr}
                  disabled={true}
                  onChange={(e) => {
                    setMember({ ...member, memberAddr: e.target.value });
                  }}
                ></Input>
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

              <div className={styles.input_wrap}>
                <label htmlFor="memberAddrDetaul">상세주소 : </label>
                <Input
                  type="text"
                  name="memberAddrDetail"
                  id="memberAddrDetail"
                  value={member.memberAddrDetail}
                  onChange={(e) => {
                    setMember({ ...member, memberAddrDetail: e.target.value });
                  }}
                ></Input>
              </div>
            </div>
          </div>
          <div className={styles.btn_wrap}>
            <Button className="btn" type="submit">
              정보 수정
            </Button>
          </div>
        </form>
        <div className={styles.member_out}>
          <p onClick={outMember}>회원 탈퇴</p>
        </div>
      </div>
    )
  );
};

//내 정보 프로필 이미지 변경 ----------------------------------------------
const MemberProfileInfo = () => {
  const { memberId, memberThumb } = useAuthStore();
  const inputRef = useRef(null);
  const changeThumb = (e) => {
    const file = inputRef.current.files && inputRef.current.files[0];
    if (!file) {
      return;
    }
    const form = new FormData();
    form.append("file", file);
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/${memberId}/thumbnail`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        console.log(res);
        useAuthStore.getState().setThumb(res.data);
      });
  };
  return (
    <div className={styles.member_profile_info}>
      <div
        className={
          memberThumb ? styles.member_thumb_exists : styles.member_thumb
        }
        onClick={() => inputRef.current.click()}
        style={{ cursor: "pointer" }}
      >
        <img
          src={
            memberThumb
              ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${memberThumb}`
              : userImg
          }
        ></img>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={changeThumb}
      />
    </div>
  );
};
//내 정보 프로필 이미지 변경 ----------------------------------------------

export default MyInfo;
