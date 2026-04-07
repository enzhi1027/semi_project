import styles from "./AdminTourInsert.module.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { data, useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";

const AdminTourInsert = () => {
  const { memberId, isReady } = useAuthStore();
  const navigate = useNavigate();
  //아이디가 있고 isReady가 true일 때만 동작

  useEffect(() => {
    // isReady가 true인데 memberId가 없다면 로그인이 안 된 상태
    if (isReady && memberId == null) {
      Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "warning" }).then(
        () => {
          navigate("/login");
        },
      );
    }
  }, [isReady, memberId, navigate]);

  //입력받을 정보
  //상품명(name), 가격(price 성인, 아동), 이용 가능일(period시작, 종료),
  //몇박며칠(days 기본값 1)
  const [tourItem, setTourItem] = useState({
    tourItemName: "",
    tourItemAdultPrice: "",
    tourItemKidPrice: "",
    tourItemPeriodStart: "",
    tourItemPeriodEnd: "",
    tourItemDays: 1,
  });

  //장소명(tourItemPlace), 계획(tourItemPlan)
  const [tourItemPlace, setTourItemPlace] = useState([
    {
      tourItemPlace: "",
      tourItemPlan: "",
    },
  ]);

  //첨부 파일(이미지) 첨부
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };
  //첨부 파일(이미지) 삭제
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  //상품 계획 입력
  const inputTourItemPlace = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newTourItemPlace = { ...tourItem, [name]: value };
    setTourItemPlace(newTourItemPlace);
  };
  const inputTourItemPlacePlan = (data) => {
    setTourItemPlace({ ...tourItemPlace, tourItemPlan: data });
  };

  return (
    <div className={styles.tour_insert_wrap}>
      <h3 className={styles.insert_title}>상품 등록</h3>

      <Button className="btn">상품 등록</Button>
    </div>
  );
};

export default AdminTourInsert;
