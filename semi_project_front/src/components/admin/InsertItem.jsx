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
      //숫자 타입 변환 후 성인가 * 0.8
      const rawKidPrice = Number(tourItem.tourItemAdultPrice) * 0.8;
      //1원 단위 버리기
      const autoTourItemKidPrice = Math.floor(rawKidPrice / 10) * 10;
      inputTourItem({
        target: { name: "tourItemKidPrice", value: autoTourItemKidPrice },
      });
    }
  }, [tourItem.tourItemAdultPrice, isKidEnabled]);

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
      <div className={`${styles.add_file_wrap}`}>
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
            addFiles(fileList);
            //그냥 사용 시 이전 목록이 사라짐. 방지 목적으로 배열로  넣음
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
                <FileItem key={"old-file-item-" + index} file={file}></FileItem>
              );
            })}

          {files.map((file, index) => {
            //새 파일-------------------------------------------------------
            return (
              <FileItem
                key={"file-item-" + index}
                file={file}
                deleteFile={deleteFile}
              ></FileItem>
            );
          })}
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
            onChange={inputTourItem}
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
                  console.log(isChecked);
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
            onChange={inputTourItem}
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
              min={tourItem.startPeriod}
              value={tourItem.endPeriod}
              onChange={inputTourItem}
            />
          </div>
        </div>
      </div>

      {/*몇박 며칠인지 ------------------------------------------------ */}
      <div className={`${styles.tour_days_wrap}`}>
        <label htmlFor="tourItemDays">몇박 며칠 프로그램인지</label>
        <Input
          type="text"
          name="tourItemDays"
          id="tourItemDays"
          value={tourItem.tourItemDays}
          min="1" //최소값 1
          onChange={inputTourItem}
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
                    //css 좀 처 먹으라고 참 더러운 녀석아
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
  return (
    <ul className={styles.file_item}>
      <li className={styles.file_name}>{file.name || file.tourItemFileName}</li>
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

export default InsertItem;
