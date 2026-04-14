import styles from "./AttractionInfo.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Swal from "sweetalert2";

const AttractionInfo = ({
  attraction,
  isLiked,
  handleWishToggle,
  memberId,
  isReady,
}) => {
  return (
    <div className={styles.attraction_info_wrap}>
      <div className={styles.attraction_info_header}>
        <div className={styles.attraction_info_titles}>
          <div className={styles.attraction_info_title}>{attraction.title}</div>
          <div className={styles.attraction_info_subtitle}>
            {attraction.attractionDesignation}
          </div>
        </div>
        <div
          className={styles.attraction_heart}
          onClick={(e) => {
            e.stopPropagation();
            if (isReady && memberId == null) {
              Swal.fire({
                title: "로그인 후 이용 가능합니다.",
                icon: "warning",
              });
            } else {
              handleWishToggle(attraction.attractionNo);
            }
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
      </div>
      <div className={styles.attraction_info_img}>
        <img
          src={
            attraction.mainimage
              ? attraction.mainimage
              : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
          }
        />
      </div>
      <div
        className={styles.attraction_info_content}
        dangerouslySetInnerHTML={{
          __html: attraction.summary,
        }}
      ></div>
    </div>
  );
};

export default AttractionInfo;
