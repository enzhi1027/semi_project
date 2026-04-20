import styles from "./AdminTourInsert.module.css";
import { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import Button from "../../components/ui/Button";
import InsertItem from "../../components/admin/InsertItem";
import axios from "axios";

const AdminTourInsert = () => {
  const { memberId, memberGrade, isReady } = useAuthStore();
  const navigate = useNavigate();
  //아이디가 있고 isReady가 true일 때만 동작

  //경로 객체 접근 / 현재 경로의 정보 사용하기 위해 필요
  const location = useLocation();

  //로그인 했을 때만 사용 가능
  useEffect(() => {
    // isReady가 true인데 memberId가 없다면 로그인이 안 된 상태
    if (isReady && memberId == null) {
      Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "warning" }).then(
        () => {
          navigate("/login");
        },
      );
      //객체 주소에 admin 포함 + 회원 등급 1 아닐 때 접근 제한
    } else if (location.pathname.includes("admin") && memberGrade !== 1) {
      Swal.fire({
        title: "관리자만 접근 가능합니다.",
        text: "관리자 아이디로 접속해주세요.",
        icon: "error",
        confirmButtonColor: "var(--color1)",
        //마이페이지/내 정보로 이동
      }).then(() => {
        navigate("/mypage/myinfo");
      });
    }
  }, [isReady, memberId, memberGrade, navigate]);

  //입력받을 정보------------------------------------------------------
  //상품명(name), 가격(price 성인, 아동), 이용 가능일(period시작, 종료),
  //몇박며칠(days 기본값 1)
  const [tourItem, setTourItem] = useState({
    tourItemName: "",
    tourItemAdultPrice: "",
    tourItemKidPrice: "",
    startPeriod: "",
    endPeriod: "",
    tourItemDays: 1,
  });

  //장소명(tourItemPlace), 계획(tourItemPlan) 배열처리 --------------------
  //일차 정보, 장소 정렬 순서 저장
  const [tourItemInfo, setTourItemInfo] = useState([
    {
      id: Date.now, //아이디
      day: 1, //일차
      placeOrder: 1, //장소 정렬
      tourItemPlace: "", //장소
      tourItemPlan: "", //계획
    },
  ]);

  //상품 정보 입력--------------------------------------------------------
  const inputTourItem = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    //name 속성이 tourItemDays면 value를 number 타입으로 변환, 아니면 그냥 두기
    const numValue = name === "tourItemDays" ? Number(value) : value;

    //객체 생성
    const newTourItem = { ...tourItem, [name]: numValue };
    //상태 업데이트
    setTourItem(newTourItem);

    //몇박 며칠인지 따라 배열 길이 조절-----------------------
    if (name === "tourItemDays") {
      const newCount = Number(value); //입력된 숫자
      let newPlace = [...tourItemInfo]; //기존 배열 복사

      //day 최댓값 찾기
      let currentMaxDay = 0;
      newPlace.forEach((item) => {
        if (item.day > currentMaxDay) {
          currentMaxDay = item.day;
        }
      });

      if (newCount > currentMaxDay) {
        //일차가 증가 (입력값이 최대 일차보다 클 때)
        for (let i = currentMaxDay + 1; i <= newCount; i++) {
          newPlace.push({
            id: Date.now() + Math.random(), //난수 결합
            day: i,
            placeOrder: 1,
            tourItemPlace: "",
            tourItemPlan: "",
          });
        }
      } else if (newCount < currentMaxDay) {
        //일차가 감소(최대 일차가 newCount보다 작거나 같을 때)
        const filteredPlace = newPlace.filter((item) => item.day <= newCount);
        setTourItemInfo(filteredPlace);
        // tourItemDays 값도 상태에 반영해야 함
        setTourItem({ ...tourItem, [name]: numValue });
        return;
      }
      setTourItemInfo(newPlace);
    }
  };

  //장소명 입력-----------------------------------------------------------
  const inputTourItemPlace = (index, e) => {
    const value = e.target.value; //입력한 장소

    //배열로 처리(여러개 입력받을 수 있음)
    const newPlaceList = [...tourItemInfo]; //기존 배열
    newPlaceList[index].tourItemPlace = value; //해당 순번의 장소명만 수정

    setTourItemInfo(newPlaceList); //바뀐 배열 저장
  };

  //상품 계획 입력--------------------------------------------------------
  const inputTourItemPlan = (index, data) => {
    const newPlaceList = [...tourItemInfo];
    newPlaceList[index].tourItemPlan = data;
    setTourItemInfo(newPlaceList);
  };

  //장소, 계획 추가 -------------------------------------------------------

  //장소, 계획 입력창 추가 -------------------------------------------------
  const addPlaceField = (index) => {
    const newPlace = [...tourItemInfo];

    //클릭한 입력창의 일차 정보
    const targetDay = newPlace[index].day;

    //새로 추가할 객체
    const newField = {
      id: Date.now() + Math.random(), //랜덤 id 부여
      day: targetDay,
      placeOrder: 1, //일단 1로 세팅
      tourItemPlace: "",
      tourItemPlan: "",
    };
    //splice : 배열 객체에 사용 가능한 내장 메소드
    // 기존 요소를 삭제하거나 교체하여 배열의 내용을 변경
    // 제거된 요소가 담긴 별도의 배열을 새로 반환
    newPlace.splice(index + 1, 0, newField);
    //수정된 복사본 배열로 업데이트
    setTourItemInfo(newPlace);
  };

  //장소, 계획 입력창 삭제 -------------------------------------------------
  const deletePlaceField = (index) => {
    //해당 날짜
    const targetDay = tourItemInfo[index].day;
    //삭제하려는 입력창 날짜 추출
    const dayCheck = tourItemInfo.filter((item) => item.day === targetDay);
    if (dayCheck.length <= 1) {
      Swal.fire({
        title: "삭제할 수 없습니다!",
        text: "최소 1개 이상의 장소와 계획이 필요합니다!",
        icon: "error",
        confirmButtonColor: "var(--color1)",
      });
      return;
    }
    const newPlace = tourItemInfo.filter((_, i) => i !== index);
    setTourItemInfo(newPlace);
  };

  //첨부 파일(이미지) 첨부--------------------------------------------------
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };
  //첨부 파일(이미지) 삭제 ----------------------------------------------
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  //상품 등록 -----------------------------------------------------------
  const registTour = () => {
    //every : 배열 안의 모든 요소
    const isPlaceListValId = tourItemInfo.every(
      (item) =>
        item.tourItemPlace.trim() !== "" && item.tourItemPlan.trim() !== "",
    );

    if (
      //▽ tourItemPlace, tourItemPlan 가 공백이 아닌 지 체크
      !isPlaceListValId ||
      tourItem.tourItemName === "" ||
      tourItem.tourItemAdultPrice === "" ||
      tourItem.startPeriod === "" ||
      tourItem.endPeriod === "" ||
      tourItem.tourItemDays === 0
    ) {
      Swal.fire({
        title: "모든 정보가 입력되지 않았습니다!",
        text: "상품 정보를 확인해주세요!",
        icon: "error",
        confirmButtonColor: "var(--color1)",
      });
      return;
    }

    const form = new FormData();
    form.append("tourItemName", tourItem.tourItemName);

    // 콤마 제거 로직
    const adultPrice = String(tourItem.tourItemAdultPrice).replace(/,/g, "");
    const kidPrice = String(tourItem.tourItemKidPrice || 0).replace(/,/g, "");

    form.append("tourItemAdultPrice", Number(adultPrice));
    form.append("tourItemKidPrice", Number(kidPrice));

    form.append("startPeriod", tourItem.startPeriod);
    form.append("endPeriod", tourItem.endPeriod);
    form.append("tourItemDays", Number(tourItem.tourItemDays));
    //공개 상태
    form.append("tourItemStatus", 1);

    //장소 번호 계산---------------------------------------------
    let lastTourDay = 0; //직전 일차 저장용
    let newPlaceOrder = 0; //새로 계산할 순서 번호

    tourItemInfo.forEach((item, index) => {
      if (lastTourDay !== item.day) {
        lastTourDay = item.day;
        newPlaceOrder = 1;
      } else {
        //일차가 같으면 순번만 증가시킴
        newPlaceOrder++;
      }
      form.append(`placeList[${index}].tourItemDay`, Number(item.day)); //일차
      form.append(
        //placeList : 몇번째 장소의 설명인지
        `placeList[${index}].tourItemPlaceOrder`,
        Number(newPlaceOrder),
      ); //새로 계산한 번호 전송
      form.append(`placeList[${index}].tourItemPlace`, item.tourItemPlace); //장소
      form.append(`placeList[${index}].tourItemPlan`, item.tourItemPlan); //계획
    });

    //이미지 첨부 파일
    files.forEach((file, index) => {
      form.append("files", file);
      //이미지 인덱스 번호(첫번째 이미지 = 썸네일, 이미지 순서 정렬용)
      form.append("tourItemImgOrder", index + 1);
    });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/admin`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: "상품 등록 완료!", icon: "success" }).then(() => {
            navigate("/tour/list");
          });
        }
      })
      .catch((err) => {
        Swal.fire({ title: "상품 등록이 실패했습니다.", icon: "error" });
      });
  };

  //상품 등록 확인 메시지 출력 --------------------------------------------
  const checkRegist = () => {
    Swal.fire({
      title: "상품을 등록하시겠습니까?",
      icon: "question",
      showCancelButton: "true",
      confirmButtonText: "등록하기",
      confirmButtonColor: "var(--color1)",
      cancelButtonText: "취소",
      cancelButtonColor: "var(--color5)",
    }).then((result) => {
      if (result.isConfirmed) {
        registTour();
      }
    });
  };

  return (
    <div className={styles.tour_insert_wrap}>
      <h3 className={styles.insert_title}>상품 등록</h3>
      <div className={styles.main_wrap}>
        <InsertItem
          tourItem={tourItem} //상품명, 가격, 이용 가능일, 몇박며칠
          tourItemInfo={tourItemInfo} //장소, 계획
          files={files} //첨부파일(이미지)
          addFiles={addFiles} //첨부파일(추가)
          deleteFile={deleteFile} //첨부파일(삭제)
          inputTourItem={inputTourItem} //상품 정보 입력
          inputTourItemPlace={inputTourItemPlace} //장소 입력
          inputTourItemPlan={inputTourItemPlan} //계획 입력
          addPlaceField={addPlaceField} //장소, 계획 추가
          deletePlaceField={deletePlaceField} //장소, 계획 삭제(1개 필수)
        />
        <div className={styles.btn_wrap}>
          <Button className="btn" onClick={checkRegist}>
            상품 등록
          </Button>
          <Button
            className="btn cancel"
            onClick={() => {
              navigate("/mypage/admin/tour");
            }}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTourInsert;
