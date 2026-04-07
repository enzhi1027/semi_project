import styles from "./AttractionList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/useAuthStore";
import Swal from "sweetalert2";

const AttractionList = ({
  attractionNo,
  title,
  subtitle,
  info,
  thumb,
  isLiked,
  handleWishToggle,
  setClickedAttraction,
  selectAttraction,
}) => {
  const { memberId, isReady } = useAuthStore();

  return (
    <>
      <div
        className={styles.content_list}
        onClick={() => {
          // selectAttraction;
          setClickedAttraction(attractionNo);
        }}
      >
        <div className={styles.content_img}>
          <img
            src={
              thumb
                ? thumb
                : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
            }
          />
        </div>
        <div className={styles.content_list_text}>
          <div className={styles.content_list_titles}>
            <div className={styles.content_list_title}>{title}</div>
            <div className={styles.content_list_subtitle}>{subtitle}</div>
            <div
              className={styles.content_list_like}
              onClick={(e) => {
                e.stopPropagation();
                if (isReady && memberId == null) {
                  Swal.fire({
                    title: "로그인 후 이용 가능합니다.",
                    icon: "warning",
                  });
                } else {
                  handleWishToggle(attractionNo);
                }
              }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </div>
          </div>
          <div className={styles.content_list_info}>{info}</div>
        </div>
      </div>
    </>
  );
};

export default AttractionList;
