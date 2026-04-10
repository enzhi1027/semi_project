import styles from "./TourList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useRef, useState } from "react";
import MyTourListPopup from "./MyTourListPopup";
import axios from "axios";

const TourList = ({
  isLiked,
  isOpen,
  onToggle,
  memberId,
  wishlistList,
  setWishlistList,
}) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleHeartClick = (e) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setCoords({
      top: rect.bottom + 18 + window.scrollY,
      left: rect.left - 218 + window.scrollX,
    });

    onToggle();
  };

  return (
    <>
      <div className={styles.tour_list_item_wrap}>
        <div className={styles.tour_list_item_img}>
          <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" />
        </div>
        <div className={styles.tour_list_item_header}>
          <div className={styles.tour_list_item_title}>투어명</div>
          <div
            className={styles.tour_list_item_heart}
            onClick={handleHeartClick}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </div>
        </div>
        <div className={styles.tour_list_item_price}>150,000₩</div>
        <div className={styles.tour_list_item_schedule}>
          3월 ~ 6월 / 4박 5일
        </div>
      </div>

      {isOpen && (
        <MyTourListPopup
          coords={coords}
          wishlistList={wishlistList}
          setWishlistList={setWishlistList}
          onToggle={onToggle}
          memberId={memberId}
        />
      )}
    </>
  );
};

export default TourList;
