import styles from "./TourList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"; // 스마일
import StarIcon from "@mui/icons-material/Star"; // 별
import AttractionsIcon from "@mui/icons-material/Attractions"; // 관람차
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto"; // 깃발
import BakeryDiningIcon from "@mui/icons-material/BakeryDining"; // 크루와상
import BedtimeIcon from "@mui/icons-material/Bedtime"; // 달
import BeachAccessIcon from "@mui/icons-material/BeachAccess"; // 파라솔
import CookieIcon from "@mui/icons-material/Cookie"; // 쿠키
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // 트로피
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff"; // 비행기
import PedalBikeIcon from "@mui/icons-material/PedalBike"; // 자전거
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // 카메라
import PetsIcon from "@mui/icons-material/Pets"; // 곰 발바닥
import RoomServiceIcon from "@mui/icons-material/RoomService"; // 음식
import SportsBarIcon from "@mui/icons-material/SportsBar"; // 술
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball"; // 운동
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree"; // 토끼
import CoffeeIcon from "@mui/icons-material/Coffee"; // 커피
import FastfoodIcon from "@mui/icons-material/Fastfood"; // 햄버거
import Filter1Icon from "@mui/icons-material/Filter1"; // 1
import Filter2Icon from "@mui/icons-material/Filter2"; // 2
import Filter3Icon from "@mui/icons-material/Filter3"; // 3
import Filter4Icon from "@mui/icons-material/Filter4"; // 4
import Filter5Icon from "@mui/icons-material/Filter5"; // 5
import Filter6Icon from "@mui/icons-material/Filter6"; // 6
import Filter7Icon from "@mui/icons-material/Filter7"; // 7
import Filter8Icon from "@mui/icons-material/Filter8"; // 8
import Filter9Icon from "@mui/icons-material/Filter9"; // 9

const TourList = ({ isLiked }) => {
  const [tourListPopup, setTourListPopup] = useState(false); // false: 닫힘, true: 열림
  const [listList, setListList] = useState([]);

  const AddList = () => {
    return (
      <>
        <div className={styles.addlist_input_div}>
          <input
            type="text"
            placeholder="새 리스트명을 입력해주세요"
            className={styles.addlist_input}
          />
          <div className={styles.addlist_input_count}>0 / 20</div>
        </div>
        <div className={styles.addlist_text1}>이모지 선택</div>
        <div className={styles.addlist_emoji}>
          <InsertEmoticonIcon />
          <StarIcon />
          <BedtimeIcon />
          <SportsBaseballIcon />
          <AssistantPhotoIcon />
          <AttractionsIcon />
          <BeachAccessIcon />
          <PhotoCameraIcon />
          <BakeryDiningIcon />
          <CookieIcon />
          <CoffeeIcon />
          <RoomServiceIcon />
          <SportsBarIcon />
          <FastfoodIcon />
          <FlightTakeoffIcon />
          <PedalBikeIcon />
          <PetsIcon />
          <CrueltyFreeIcon />
          <EmojiEventsIcon />
          <Filter1Icon />
          <Filter2Icon />
          <Filter3Icon />
          <Filter4Icon />
          <Filter5Icon />
          <Filter6Icon />
          <Filter7Icon />
          <Filter8Icon />
          <Filter9Icon />
        </div>
        <div className={styles.addlist_btn}>완 료</div>
      </>
    );
  };

  const ShowList = () => {
    return (
      <>
        <AddCircleOutlineIcon />
        <div>리스트 추가</div>
      </>
    );
  };

  return (
    <div className={styles.tour_list_item_wrap}>
      <div className={styles.tour_list_item_img}>
        <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" />
      </div>
      <div className={styles.tour_list_item_header}>
        <div className={styles.tour_list_item_title}>투어명</div>
        <div
          className={styles.tour_list_item_heart}
          onClick={(e) => {
            e.stopPropagation();
            setTourListPopup(!tourListPopup);
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
      </div>
      <div className={styles.tour_list_item_price}>150,000₩</div>
      <div className={styles.tour_list_item_schedule}>3월 ~ 6월 / 4박 5일</div>
      {tourListPopup && (
        <>
          <div className={styles.tour_list_triangle}></div>
          <div className={styles.tour_list_mylist}>
            {listList.length === 0 ? <AddList /> : <ShowList />}
          </div>
        </>
      )}
    </div>
  );
};

export default TourList;
