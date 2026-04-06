import styles from "./AttractionList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";

const AttractionList = ({ title, subtitle, info, thumb }) => {
  const [isLiked, setIsLiked] = useState(0); // 1: 찜

  return (
    <>
      <div className={styles.content_list}>
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
              onClick={() => {
                setIsLiked(!isLiked);
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
