import styles from "./TourList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useRef, useState } from "react";
import MyTourListPopup from "./MyTourListPopup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TourList = ({
  isOpen,
  onToggle,
  memberId,
  isReady,
  wishlistList,
  setWishlistList,
  item,
  clickedList,
  setClickedList,
  startDate,
  setStartDate,
}) => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (memberId && clickedList.length === 0) {
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/tours/wishlistNoList/${memberId}/${item.tourItemNo}`,
        )
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setClickedList(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [memberId, item.tourItemNo, clickedList, setClickedList]);

  const handleHeartClick = (e) => {
    e.stopPropagation();

    if (isReady && memberId == null) {
      Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "warning" });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();

      setCoords({
        top: rect.bottom + 18 + window.scrollY,
        left: rect.left - 218 + window.scrollX,
      });

      onToggle();
    }
  };

  return (
    <>
      <div
        className={styles.tour_list_item_wrap}
        onClick={() =>
          navigate(`/tour/detail/${item.tourItemNo}`, {
            state: {
              startDate: startDate,
            },
          })
        }
      >
        <div className={styles.tour_list_item_img}>
          <img
            src={
              item.tourItemImgPath
                ? `${item.tourItemImgPath}`
                : "기본이미지주소"
            }
            alt={item.tourItemName}
          />
        </div>

        <div className={styles.tour_list_item_info_container}>
          <div className={styles.tour_list_item_header}>
            <div className={styles.tour_list_item_title}>
              {item.tourItemName}
            </div>
            <div
              className={styles.tour_list_item_heart}
              onClick={handleHeartClick}
            >
              {clickedList.length !== 0 ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
          </div>

          <div className={styles.tour_list_item_price}>
            {item.tourItemAdultPrice.toLocaleString()}원 <span>(성인)</span>
          </div>

          <div className={styles.tour_list_item_schedule}>
            📅{item.startPeriod.substring(0, 10).replaceAll("-", ".")} ~{" "}
            {item.endPeriod.substring(0, 10).replaceAll("-", ".")} |{" "}
            {item.tourItemDays - 1 === 0
              ? "당일"
              : `${item.tourItemDays - 1}박 ${item.tourItemDays}일`}
          </div>
        </div>
      </div>

      {isOpen && (
        <MyTourListPopup
          coords={coords}
          wishlistList={wishlistList}
          setWishlistList={setWishlistList}
          onToggle={onToggle}
          memberId={memberId}
          item={item}
          clickedList={clickedList}
          setClickedList={setClickedList}
        />
      )}
    </>
  );
};

export default TourList;
