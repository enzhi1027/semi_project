import { useNavigate, useParams } from "react-router-dom";
import styles from "./AdminModifyTour.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import InsertItem from "../../components/admin/InsertItem";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

const AdminModifyTour = () => {
  const navigate = useNavigate();
  const params = useParams();
  const tourItemNo = params.tourItemNo; //주소에서 상품 번호 가져오기

  const [tourItem, setTourItem] = useState(null); //기본 정보(이름, 가격 등등)
  const [tourItemInfo, setTourItemInfo] = useState([]); //일정 리스트

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admin/${tourItemNo}`)
      .then((res) => {
        //이용 가능일 날짜에 시간 정보 제외하고 날짜만 가져오기
        const start = res.data.startPeriod
          ? res.data.startPeriod.split(" ")[0]
          : "";
        const end = res.data.endPeriod ? res.data.endPeriod.split(" ")[0] : "";

        const formattedData = {
          ...res.data,
          startPeriod: start,
          endPeriod: end,
          fileList: res.data.fileList || [], //첨부파일 없으면 빈 배열
        };
        setTourItem(formattedData);
        //상세 일정 누락, null 방어. 에러 방지용
        const savePlaceList = res.data.placeList || [];

        if (savePlaceList.length > 0) {
          //각 일정 데이터에 key값용 id와 일차(day) 정보를 맵핑하여 저장
          const infoWithId = savePlaceList.map((item) => ({
            ...item,
            id: Math.random(),
            day: item.tourItemDay || item.day,
          }));
          setTourItemInfo(infoWithId);
        } else {
          //데이터가 없으면 빈 배열 세팅
          setTourItemInfo([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tourItemNo]);

  //장소 수정
  const inputTourItemPlace = (index, e) => {
    const newPlaceList = [...tourItemInfo];
    newPlaceList[index].tourItemPlace = e.target.value;
    setTourItemInfo(newPlaceList);
  };

  //계획 수정
  const inputTourItemPlanModify = (index, data) => {
    const newPlaceList = [...tourItemInfo];
    newPlaceList[index].tourItemPlan = data;
    setTourItemInfo(newPlaceList);
  };

  //새 일정 입력창 추가
  const addPlaceField = (index) => {
    const targetDay =
      tourItemInfo[index].day || tourItemInfo[index].tourItemDay;
    const newField = {
      id: Math.random(),
      day: targetDay,
      tourItemPlace: "",
      tourItemPlan: "",
    };
    const newPlace = [...tourItemInfo];
    newPlace.splice(index + 1, 0, newField);
    setTourItemInfo(newPlace);
  };

  //일정 입력창 삭제(1개는 필수)
  const deletePlaceField = (index) => {
    if (tourItemInfo.length > 1) {
      setTourItemInfo(tourItemInfo.filter((_, i) => i !== index));
    }
  };
  //새로 추가할 이미지 넣은 상태
  //새로 추가한 이미지 파일을 리스트에 추가
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };

  //상품 기본 정보 변경(제목, 가격, 일정 등등)
  const inputTourItem = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newTourItem = { ...tourItem, [name]: value };
    setTourItem(newTourItem);
  };

  //신규 추가 목록에서 특정 파일 삭제
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  //상품 전체 계획 수정용
  const inputTourItemPlan = (data) => {
    setTourItem({ ...tourItem, tourItemPlan: data });
  };
  const [deleteFileList, setDeleteFileList] = useState([]);
  //기존 등록된 이미지 삭제, 리스트에 추가하고 화면에서 제거
  const addDeleteFileList = (file) => {
    const currentFileList = tourItem.fileList || [];
    const newFileList = tourItem.fileList.filter((item) => item !== file);

    setTourItem({ ...tourItem, fileList: newFileList }); //화면에서 이미지 제거
    setDeleteFileList([...deleteFileList, file.tourItemImgPath]);
    //서버 삭제 요청용 경로 저장
  };

  //수정 완료 버튼 클릭 시 실행
  const modifyTourItem = () => {
    Swal.fire({
      title: "상품을 수정하시겠습니까?",
      text: "이전 정보로 되돌릴 수 없습니다.",
      icon: "question",
      confirmButtonColor: "var(--color1)",
      confirmButtonText: "수정하기",
      showCancelButton: true,
      cancelButtonColor: "var(--gray4)",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        //Multipart 전송용 FormData 객체 생성
        const form = new FormData();
        //기존 상품 정보 데이터 추가
        form.append("tourItemNo", tourItem.tourItemNo);
        form.append("tourItemName", tourItem.tourItemName);
        form.append("tourItemDays", tourItem.tourItemDays);
        form.append("tourItemAdultPrice", tourItem.tourItemAdultPrice);
        form.append("tourItemKidPrice", tourItem.tourItemKidPrice);
        form.append("startPeriod", tourItem.startPeriod);
        form.append("endPeriod", tourItem.endPeriod);

        //상세 일정 리스트 데이터 처리(order: 일차별 순번 재계산, 인덱스 처리)
        let lastDay = 0;
        let order = 0;
        tourItemInfo.forEach((item, index) => {
          const currentDay = item.day || item.tourItemDay;
          //일차가 바뀌면 순번 1번으로 초기화, 같으면 순번 증가
          if (lastDay !== currentDay) {
            lastDay = currentDay;
            order = 1;
          } else {
            order++;
          }
          form.append(`placeList[${index}].tourItemDay`, Number(currentDay));
          form.append(`placeList[${index}].tourItemPlaceOrder`, order);
          form.append(
            `placeList[${index}].tourItemPlace`,
            item.tourItemPlace || "",
          );
          form.append(
            `placeList[${index}].tourItemPlan`,
            item.tourItemPlan || "",
          );
        });
        // 새 이미지 파일 리스트에 추가
        files.forEach((file) => {
          form.append("files", file);
        });
        //삭제할 기존 파일 경로 리스트 추가
        deleteFileList.forEach((tourItemImgPath) => {
          form.append("deleteFilePath", tourItemImgPath);
        });
        axios
          .put(`${import.meta.env.VITE_BACKSERVER}/admin/${tourItemNo}`, form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data > 0) {
              Swal.fire({
                title: "수정이 완료되었습니다!",
                icon: "success",
              }).then(() => {
                navigate(`/tour/detail/${tourItem.tourItemNo}`);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className={styles.tour_insert_wrap}>
      <h3 className={styles.insert_title}>상품 수정</h3>

      <div className={styles.main_wrap}>
        {tourItem && (
          <InsertItem
            tourItem={tourItem}
            tourItemInfo={tourItemInfo}
            inputTourItem={inputTourItem}
            files={files}
            addFiles={addFiles}
            deleteFile={deleteFile}
            inputTourItemPlace={inputTourItemPlace}
            inputTourItemPlan={inputTourItemPlanModify}
            addPlaceField={addPlaceField}
            deletePlaceField={deletePlaceField}
            addDeleteFileList={addDeleteFileList}
          />
        )}

        <div className={styles.btn_wrap}>
          <Button className="btn" onClick={modifyTourItem}>
            수정 완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminModifyTour;
