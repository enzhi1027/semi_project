import styles from "./MyTourListPopup.module.css";
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
import Portal from "../Commons/Portal";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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

const AddList = ({
  onComplete,
  wishlistList,
  setWishlistList,
  memberId,
  emojiList,
}) => {
  const [newListName, setNewListName] = useState("");
  const [selectedEmojiId, setSelectedEmojiId] = useState(null);
  const [selectedEmojiNo, setSelectedEmojiNo] = useState(null);

  const addWishlist = () => {
    if (newListName.length === 0) {
      Swal.fire({
        title: "1글자 이상 입력해주세요",
        icon: "warning",
      });
    } else if (selectedEmojiNo === null) {
      Swal.fire({
        title: "이모지를 선택해주세요",
        icon: "warning",
      });
    } else if (
      wishlistList.some((wishlist) => wishlist.tourWishlistName === newListName)
    ) {
      Swal.fire({
        title: "이미 존재하는 리스트입니다",
        icon: "warning",
      });
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/tours/wishList`, {
          memberId: memberId,
          tourWishlistName: newListName,
          emojiNo: selectedEmojiNo,
        })
        .then((res) => {
          if (res.data !== 0) {
            setWishlistList((prev) => [
              { tourWishlistName: newListName, emojiNo: selectedEmojiNo },
              ...prev,
            ]);
            onComplete();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (newListName.length > 20) {
      setNewListName(newListName.substring(0, 20));
    }
  }, [newListName]);

  return (
    <>
      <div className={styles.addlist_input_div}>
        <input
          type="text"
          placeholder="새 리스트명을 입력해주세요"
          className={styles.addlist_input}
          value={newListName}
          onChange={(e) => {
            setNewListName(e.target.value);
          }}
        />
        <div
          className={styles.addlist_input_count}
          style={{
            color: newListName.length >= 20 ? "#D9534F" : "var(--text1)",
          }}
        >
          {newListName.length} / 20
        </div>
      </div>
      <div className={styles.addlist_text1}>이모지 선택</div>
      <div className={styles.addlist_emoji}>
        {emojiList.map((emoji, index) => {
          const IconComponent = EMOJI_COMPONENTS[emoji.emojiName];

          return IconComponent ? (
            <div
              key={"emoji-" + index}
              onClick={() => {
                setSelectedEmojiId(IconComponent);
                setSelectedEmojiNo(emoji.emojiNo);
              }}
              className={`${selectedEmojiId === IconComponent && styles.selectedEmoji} ${styles.emoji_wrap}`}
            >
              <IconComponent />
            </div>
          ) : null;
        })}
      </div>
      <div
        className={styles.addlist_btn}
        onClick={() => {
          addWishlist(memberId);
        }}
      >
        완 료
      </div>
    </>
  );
};

const ShowList = ({
  onAddClick,
  wishlistList,
  emojiList,
  memberId,
  item,
  clickedList = [],
  setClickedList,
}) => {
  const safeClickedList = Array.isArray(clickedList) ? clickedList : [];

  return (
    <>
      <div className={styles.show_list_header} onClick={onAddClick}>
        <AddCircleOutlineIcon />
        <div>리스트 추가</div>
      </div>

      <div className={styles.show_list_wrap}>
        {wishlistList.map((wishlist) => {
          const targetEmoji = emojiList.find(
            (e) => e.emojiNo === wishlist.emojiNo,
          );
          const emojiName = targetEmoji?.emojiName;
          const IconComponent = EMOJI_COMPONENTS[emojiName];
          const isClicked =
            clickedList &&
            Array.isArray(clickedList) &&
            clickedList.includes(wishlist.tourWishlistNo);
          return (
            <div
              key={wishlist.tourWishlistNo}
              className={`${styles.wishlist_row} ${isClicked ? styles.wishlist_clicked : ""}`}
              onClick={() => {
                if (isClicked) {
                  // delete
                  axios
                    .delete(`${import.meta.env.VITE_BACKSERVER}/tours/wish`, {
                      data: {
                        memberId: memberId,
                        tourWishlistName: wishlist.tourWishlistName,
                        tourWishlistNo:
                          wishlist.tourWishlistNo != null
                            ? wishlist.tourWishlistNo
                            : 0,
                        tourItemNo: item.tourItemNo,
                      },
                    })
                    .then((res) => {
                      console.log(res.data);
                      if (res.data) {
                        // delete 성공
                        setClickedList((prev) => {
                          const current = Array.isArray(prev) ? prev : [];
                          return current.filter(
                            (id) => id !== wishlist.tourWishlistNo,
                          );
                        });
                      } else {
                        // delete 실패
                        Swal.fire({
                          title: "잠시 후 다시 시도해주세요",
                          icon: "error",
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      Swal.fire({
                        title: "잠시 후 다시 시도해주세요",
                        icon: "error",
                      });
                    });
                } else {
                  // insert
                  axios
                    .post(`${import.meta.env.VITE_BACKSERVER}/tours/wish`, {
                      memberId: memberId,
                      tourWishlistName: wishlist.tourWishlistName,
                      tourWishlistNo:
                        wishlist.tourWishlistNo != null
                          ? wishlist.tourWishlistNo
                          : 0,
                      tourItemNo: item.tourItemNo,
                    })
                    .then((res) => {
                      console.log(res.data);
                      if (res.data) {
                        // insert 성공
                        setClickedList((prev) => {
                          const current = Array.isArray(prev) ? prev : [];
                          return [...current, wishlist.tourWishlistNo];
                        });
                      } else {
                        // insert 실패
                        Swal.fire({
                          title: "잠시 후 다시 시도해주세요",
                          icon: "error",
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      Swal.fire({
                        title: "잠시 후 다시 시도해주세요",
                        icon: "error",
                      });
                    });
                }
              }}
            >
              <div className={styles.wishlist_icon_box}>
                {IconComponent ? <IconComponent /> : <StarIcon />}
              </div>
              <div className={styles.wishlist_name}>
                {wishlist.tourWishlistName}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const MyTourListPopup = ({
  coords,
  wishlistList,
  setWishlistList,
  onToggle,
  memberId,
  item,
  clickedList,
  setClickedList,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [emojiList, setEmojiList] = useState([]);

  const renderPopupContent = () => {
    if (wishlistList.length === 0 || isAdding) {
      return (
        <AddList
          onComplete={() => setIsAdding(false)}
          wishlistList={wishlistList}
          setWishlistList={setWishlistList}
          memberId={memberId}
          emojiList={emojiList}
        />
      );
    }
    return (
      <ShowList
        onAddClick={() => setIsAdding(true)}
        wishlistList={wishlistList}
        emojiList={emojiList}
        memberId={memberId}
        item={item}
        clickedList={clickedList}
        setClickedList={setClickedList}
      />
    );
  };

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

  return (
    <Portal>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 900,
          backgroundColor: "transparent",
        }}
        onClick={onToggle}
      />
      <div
        className={styles.tour_list_wrap}
        style={{
          position: "absolute",
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          zIndex: 1000,
        }}
      >
        <div className={styles.tour_list_triangle}></div>
        <div className={styles.tour_list_mylist}>{renderPopupContent()}</div>
      </div>
    </Portal>
  );
};

export default MyTourListPopup;
