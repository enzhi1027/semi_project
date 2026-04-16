import { useEffect, useState } from "react";
import styles from "./TourMyPage.module.css";
import MyTourList from "../../components/tour/MyTourList";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";
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

const TourMyPage = () => {
  const [tourMyPageTap, setTourMyPageTap] = useState(0); // 0: 찜목록, 1: 결제 내역
  const { memberId, isReady } = useAuthStore();
  const [wishlistList, setWishlistList] = useState([]);
  const [emojiList, setEmojiList] = useState([]);

  const EMOJI_COMPONENTS = {
    InsertEmoticonIcon,
    StarIcon,
    BedtimeIcon,
    SportsBaseballIcon,
    AssistantPhotoIcon,
    AttractionsIcon,
    BeachAccessIcon,
    PhotoCameraIcon,
    BakeryDiningIcon,
    CookieIcon,
    CoffeeIcon,
    RoomServiceIcon,
    SportsBarIcon,
    FastfoodIcon,
    FlightTakeoffIcon,
    PedalBikeIcon,
    PetsIcon,
    CrueltyFreeIcon,
    EmojiEventsIcon,
    Filter1Icon,
    Filter2Icon,
    Filter3Icon,
    Filter4Icon,
    Filter5Icon,
    Filter6Icon,
    Filter7Icon,
    Filter8Icon,
    Filter9Icon,
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/wishlistList/${memberId}`)
      .then((res) => {
        setWishlistList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/emojiList`)
      .then((res) => {
        setEmojiList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(wishlistList);
  }, [wishlistList]);

  return (
    <div className={styles.tour_mypage_wrap}>
      <div className={styles.tour_mypage_header}>
        <div
          className={`${styles.tour_mypage_header_wishlist} ${tourMyPageTap === 0 ? styles.tour_mypage_header_active : ""}`}
          onClick={() => {
            setTourMyPageTap(0);
          }}
        >
          찜 목록
        </div>
        <div
          className={`${styles.tour_mypage_header_paymentlist} ${tourMyPageTap === 1 ? styles.tour_mypage_header_active : ""}`}
          onClick={() => {
            setTourMyPageTap(1);
          }}
        >
          결제 내역
        </div>
      </div>
      <div className={styles.tour_mypage}>
        {tourMyPageTap ? (
          <>결제</>
        ) : (
          <>
            {wishlistList && emojiList ? (
              <MyTourList
                wishlistList={wishlistList}
                setWishlistList={setWishlistList}
                memberId={memberId}
                emojiList={emojiList}
                EMOJI_COMPONENTS={EMOJI_COMPONENTS}
              />
            ) : (
              <d>로딩 중이라네요</d>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TourMyPage;
