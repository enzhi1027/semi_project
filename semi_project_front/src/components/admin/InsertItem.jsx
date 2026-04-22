import { useEffect, useRef, useState } from "react";
import { Input, TextArea } from "../ui/Form";
import styles from "./InsertItem.module.css";
import Button from "../ui/Button";
import addBox from "../../assets/img/insertTourItem/add_box.png";
import deleteImg from "../../assets/img/insertTourItem/delete.png";
import Checkbox from "@mui/material/Checkbox";
import TourItemTextEditor from "../ui/TourItemTextEditor";

const InsertItem = ({
  tourItem,
  tourItemInfo,
  files,
  addFiles,
  deleteFile,
  inputTourItem,
  inputTourItemPlace,
  inputTourItemPlan,
  addPlaceField,
  deletePlaceField,
  addDeleteFileList,
}) => {
  //상품 이미지 추가 버튼 첨부파일 인풋과 연결
  const inputRef = useRef(null);
  const imgbuttonClick = () => {
    inputRef.current.click();
  };

  //가격 계산 (아동가격 = 성인가격 * 0.8) ------------------------------------
  //체크박스 상태 관리 스테이트(기본 체크 상태 유지할거니 true)
  const [isKidEnabled, setIsKidEnabled] = useState(true);

  useEffect(() => {
    if (isKidEnabled && tourItem.tourItemAdultPrice) {
      // 성인 가격에서 콤마 제거 후 숫자로 변환 (이미 adultPriceNum을 만드셨으니 활용)
      const adultPriceNum = Number(
        tourItem.tourItemAdultPrice.toString().replace(/,/g, ""),
      );

      // 숫자가 정상일 때만 계산 진행
      if (!isNaN(adultPriceNum)) {
        // 성인가 * 0.8 계산
        const rawKidPrice = adultPriceNum * 0.8;
        // 1원 단위 버리기
        const autoTourItemKidPrice = Math.floor(rawKidPrice / 10) * 10;

        // 계산된 아동 가격에도 콤마(,) 포맷팅 적용하여 문자열로 변환
        const formattedKidPrice = autoTourItemKidPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // 가공된 값을 inputTourItem에 전달
        inputTourItem({
          target: { name: "tourItemKidPrice", value: formattedKidPrice },
        });
      }
    }
  }, [tourItem.tourItemAdultPrice, isKidEnabled]);

  // 가격용 핸들러 (숫자만 허용 + 3자리 ,)
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // 숫자 외의 모든 문자 제거
    const onlyNumber = value.replace(/[^0-9]/g, "");
    // 3자리마다 콤마 추가
    const formattedValue = onlyNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // inputTourItem에 값 전달
    inputTourItem({
      target: { name, value: formattedValue },
    });
  };

  // 숫자 전용 핸들러 (일정/박수 등)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // 숫자 외의 모든 문자 제거
    const onlyNumber = value.replace(/[^0-9]/g, "");

    inputTourItem({
      target: { name, value: onlyNumber },
    });
  };

  //종료일 제한
  const getMinEndPeriod = () => {
    if (!tourItem.startPeriod) {
      // 시작일이 아직 선택되지 않았다면 기본적으로 내일부터 선택 가능
      const now = new Date();
      const tomorrowDate = new Date(now.setDate(now.getDate() + 1));
      return tomorrowDate.toISOString().split("T")[0];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 정보를 0으로 초기화하여 날짜만 비교

    const startDate = new Date(tourItem.startPeriod);
    startDate.setHours(0, 0, 0, 0);

    // 1. 시작일이 오늘보다 미래(오늘 이후)인 경우
    if (startDate > today) {
      // 종료일은 시작일과 같을 수 없으므로 시작일 + 1일
      const nextDayOfStart = new Date(startDate);
      nextDayOfStart.setDate(startDate.getDate() + 1);
      return nextDayOfStart.toISOString().split("T")[0];
    }

    // 2. 시작일이 오늘이거나 오늘 이전인 경우
    else {
      // 종료일은 내일(오늘 + 1일)부터 선택 가능
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
  };

  const minEndDay = getMinEndPeriod();

  return (
    <div className={styles.insert_wrap}>
      {/*상품명 --------------------------------------------------------- */}
      <div className={`${styles.tour_name_wrap}`}>
        <label htmlFor="itemName">상품명</label>
        {/* || "" = 값이 없으면 빈 문자열 삽입*/}
        <Input
          name="tourItemName"
          id="tourItemName"
          value={tourItem.tourItemName || ""}
          onChange={inputTourItem}
        />
      </div>

      {/*첨부파일 -------------------------------------------------------- */}
      <div className={styles.add_file_wrap}>
        <div className={styles.button_wrap}>
          <label htmlFor="file">첨부파일</label>
          <Button className="btn" onClick={imgbuttonClick}>
            상품 이미지 추가
          </Button>
        </div>
        <input
          type="file"
          id="files"
          className={styles.select_file_wrap}
          ref={inputRef}
          onChange={(e) => {
            const fileList = Array.from(e.target.files);
            if (fileList.length > 0) {
              addFiles(fileList);
              //그냥 사용 시 이전 목록이 사라짐. 방지 목적으로 배열로  넣음
              e.target.value = "";
            }
          }}
          multiple //파일 다중 선택
          style={{ display: "none" }} //숨김
        />

        {/*기존 첨부파일 ------------------------------------------------- */}
        <div className={styles.file_wrap}>
          {tourItem.fileList && //파일 리스트가 있을 때만 동작
            tourItem.fileList.map((file, index) => {
              //기존 파일
              return (
                <FileItem
                  key={"old-file-item-" + index}
                  file={file}
                  deleteFile={addDeleteFileList}
                ></FileItem>
              );
            })}

          {files.map((file, index) => (
            <FilePreviewItem
              key={"file-item-" + index}
              file={file}
              deleteFile={deleteFile}
            />
          ))}
        </div>
      </div>

      {/*가격 (성인+아동) ------------------------------------------------ */}
      {/*성인 ------------------------------------------------ */}

      <div className={`${styles.price_wrap}`}>
        <div>
          <label htmlFor="adultPrice">가격(성인)(input)</label>
          {/*입력은 text로 받는 대신 숫자만 입력 가능하게 정규식 작성,
          실시간, 혹은 작성완료 시점(포커스 아웃)에 3자리마다 , 작성
          */}
          <Input
            type="text"
            name="tourItemAdultPrice"
            id="tourItemAdultPrice"
            value={tourItem.tourItemAdultPrice || ""}
            onChange={handlePriceChange}
          />
        </div>
        {/*아동 ------------------------------------------------ */}

        <div>
          {/*체크박스 있어야 함. 체크 시 활성화, 미 체크 시 비활성화+값 비우기
          기본 가격 성인 * 0.8 */}
          <div className={styles.kid_price_title}>
            <label htmlFor="kidPriceCheck">
              아동 가격(기본 : 성인 * 0.8)
              <Checkbox
                className={styles.check_box}
                id="kidPriceCheck"
                checked={isKidEnabled}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsKidEnabled(e.target.checked);
                  if (!isChecked) {
                    inputTourItem({
                      target: { name: "tourItemKidPrice", value: "" },
                    });
                  }
                }}
                size="small"
                disableRipple
              ></Checkbox>
            </label>
          </div>
          <Input
            type="text"
            name="tourItemKidPrice"
            id="tourItemKidPrice"
            value={tourItem.tourItemKidPrice || ""}
            disabled={!isKidEnabled}
            placeholder={isKidEnabled ? "" : "선택불가"}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      {/*이용 가능 기간 ---------------------------------------------------- */}
      <div className={`${styles.tour_period_wrap}`}>
        <div className={styles.period_wrap}>
          <div>
            <label htmlFor="startPeriod">이용 가능 기간(시작)</label>
            <Input
              type="date"
              name="startPeriod"
              id="startPeriod"
              value={tourItem.startPeriod}
              onChange={inputTourItem}
            />
          </div>
          <div>
            <label htmlFor="endPeriod">이용 가능 기간(종료)</label>
            <Input
              type="date"
              name="endPeriod"
              id="endPeriod"
              //이용 가능 기간(종료)는 시작일 이전은 선택 불가능하다.
              min={minEndDay}
              value={tourItem.endPeriod}
              onChange={inputTourItem}
            />
          </div>
        </div>
      </div>

      {/*몇박 며칠인지 ------------------------------------------------ */}
      <div className={`${styles.tour_days_wrap}`}>
        <label htmlFor="tourItemDays">일차 정보(몇박 며칠)</label>
        <Input
          type="text"
          name="tourItemDays"
          id="tourItemDays"
          value={tourItem.tourItemDays}
          onChange={handleNumberChange}
          onBlur={(e) => {
            // 포커스가 나갈 때 값이 비어있거나 0이면 강제로 1로 변경
            if (!e.target.value || parseInt(e.target.value) < 1) {
              inputTourItem({
                target: { name: "tourItemDays", value: "1" },
              });
            }
          }}
        ></Input>
      </div>

      {/*장소, 계획 ------------------------------------------------------- */}
      {tourItemInfo.map((item, index) => {
        const dayCheck =
          index === 0 || tourItemInfo[index - 1].day !== item.day;

        return (
          <div key={item.id} className={styles.place_plan_wrap}>
            {dayCheck && <h3 className={styles.day_title}>{item.day}일차</h3>}
            <div className={styles.place_wrap}>
              <label htmlFor="place">장소</label>
              <div className={styles.place_input_wrap}>
                <Input
                  type="text"
                  placeholder={`${item.day}일차 장소를 입력하세요`}
                  value={item.tourItemPlace || ""}
                  onChange={(e) => inputTourItemPlace(index, e)}
                ></Input>
                <img
                  src={addBox}
                  onClick={() => addPlaceField(index)}
                  className={styles.add_btn}
                />
                <img
                  src={deleteImg}
                  onClick={() => deletePlaceField(index)}
                  className={styles.delete_btn}
                />
              </div>
            </div>
            <div className={styles.plan_wrap}>
              <label htmlFor="plan">계획</label>
              <div className={styles.plan_input_wrap}>
                <TourItemTextEditor
                  className={styles.plan_text_editor}
                  type="text"
                  data={item.tourItemPlan}
                  setData={(val) => {
                    inputTourItemPlan(index, val);
                  }}
                  placeholder={`${item.day}일차 상세 일정을 입력하세요`}
                ></TourItemTextEditor>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

//첨부 파일 삭제 -------------------------------------------------------------------
const FileItem = ({ file, deleteFile }) => {
  const fileName =
    file.name || file.tourItemImgName || file.tourItemImgPath || "기존 이미지";
  return (
    <ul className={styles.file_item}>
      <li className={styles.file_name}>{fileName}</li>
      <li>
        {/*삭제 아이콘*/}
        <img
          className={styles.addBtn}
          src={deleteImg}
          onClick={() => {
            deleteFile(file); //파일을 가지고 있으면 동작
          }}
        />
      </li>
    </ul>
  );
};

const FilePreviewItem = ({ file, deleteFile }) => {
  // 이미지 경로 설정 로직
  let imgSrc = "";

  if (file instanceof File) {
    // 1. 새로 추가한 파일 (브라우저 임시 URL 생성)
    imgSrc = URL.createObjectURL(file);
  } else if (file.tourItemImgPath) {
    // 2. 서버에서 불러온 기존 파일 (서버 주소와 결합)
    imgSrc = `${import.meta.env.VITE_IMG_SERVER}/tourItem/${file.tourItemImgPath}`;
  }

  const fileName = file.name || file.tourItemImgName || "첨부 이미지";

  return (
    <ul className={styles.file_preview_item}>
      <li className={styles.preview_img_wrap}>
        {imgSrc ? (
          <img src={imgSrc} alt="미리보기" className={styles.preview_img} />
        ) : (
          <div className={styles.no_img}>No Image</div>
        )}
      </li>
      <li className={styles.file_name_text}>{fileName}</li>
      <li>
        <img
          className={styles.delete_btn_img}
          src={deleteImg}
          alt="삭제"
          onClick={() => deleteFile(file)}
        />
      </li>
    </ul>
  );
};

export default InsertItem;
