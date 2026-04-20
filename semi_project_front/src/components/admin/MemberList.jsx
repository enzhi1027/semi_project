import { useNavigate } from "react-router-dom";
import styles from "./MemberList.module.css";
import userImg from "../../assets/img/mainPage/user.png"; // 사용자 기본 이미지
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const MemberList = ({ memberList }) => {
  return (
    <ul className={styles.member_list_wrap}>
      {memberList.map((member) => {
        return <MemberItem key={`member-${member.memberId}`} member={member} />;
      })}
    </ul>
  );
};

const MemberItem = ({ member }) => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);

  const changeGrade = (e) => {
    const newGrade = e.target.value;

    // 2. Swal.fire를 이용한 컨펌창 구성
    Swal.fire({
      title: "회원 등급 변경",
      text: "회원 등급을 변경하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color1)",
      cancelButtonColor: "var(--color5)",
      confirmButtonText: "변경",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          memberId: member.memberId,
          memberGrade: newGrade,
        };

        axios
          .patch(
            `${import.meta.env.VITE_BACKSERVER}/admin/changeMemberGrade`,
            data,
          )
          .then((res) => {
            if (res.data > 0) {
              Swal.fire({
                title: "완료",
                text: "등급 변경이 완료되었습니다.",
                icon: "success",
                confirmButtonColor: "var(--color1)",
                confirmButtonText: "닫기",
              }).then(() => {
                window.location.reload();
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              title: "실패",
              text: "등급 변경 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "var(--color1)",
              confirmButtonText: "닫기",
            }).then(() => {
              window.location.reload();
            });
          });
      }
    });
  };

  return (
    <li className={styles.member_item}>
      <div className={styles.member_info_wrap}>
        <div
          className={
            member.memberThumb
              ? styles.member_thumb_exists
              : styles.member_thumb
          }
        >
          <img
            src={
              member.memberThumb
                ? `${import.meta.env.VITE_IMG_SERVER}/member/thumb/${member.memberThumb}`
                : userImg
            }
          />
        </div>
        <div className={styles.member_info}>
          <div className={styles.id_name_wrap}>
            <p>이름 : {member.memberName}</p>
            <p>아이디 : {member.memberId}</p>
          </div>
          <div className={styles.grade_wrap}>
            <p>
              회원 등급 :
              {member.memberGrade === 0
                ? " 일반 회원"
                : member.memberGrade === 1
                  ? " 관리자"
                  : " 차단 회원"}
            </p>
            <div className={styles.grade_change_wrap}>
              <span>회원 등급 변경</span>
              <select
                className={styles.grade_select}
                value={member.memberGrade}
                onChange={changeGrade}
              >
                <option value={0}>일반</option>
                <option value={1}>관리자</option>
                <option value={2}>차단</option>
              </select>
            </div>
          </div>

          {/*상세 정보 접기/펼치기 ------------------------------------ */}
          <div className={styles.detail_wrap}>
            <div className={styles.detail_toggle_btn}>
              <p
                className={styles.member_detail_info_btn}
                onClick={() => setIsShow(!isShow)}
              >
                {isShow ? "상세 정보 접기 ↑" : "상세 정보 보기 ↓"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*상세 정보 ------------------------------------------------ */}
      {isShow && (
        <div className={styles.member_detail_info_wrap}>
          {/* 그룹 1: 이름, 이메일, 주소, 상세 주소 */}
          <div className={styles.detail_group}>
            <p>이름 : {member.memberName}</p>
            <p>이메일 : {member.memberEmail}</p>
            <p>주소 : {member.memberAddr}</p>
            <p>
              상세 주소 :{" "}
              {member.memberAddrDetail ? member.memberAddrDetail : "없음"}
            </p>
          </div>

          {/* 그룹 2: 아이디, 전화번호, 회원 등급, 가입일 */}
          <div className={styles.detail_group}>
            <p>아이디 : {member.memberId}</p>
            <p>전화번호 : {member.memberPhone}</p>
            <p>
              회원 등급 :{" "}
              {member.memberGrade === 0
                ? "일반 회원"
                : member.memberGrade === 1
                  ? "관리자"
                  : "차단 회원"}
            </p>
            <p>가입일 : {member.enrollDate.substring(0, 10)}</p>
          </div>
        </div>
      )}
    </li>
  );
};

export default MemberList;
