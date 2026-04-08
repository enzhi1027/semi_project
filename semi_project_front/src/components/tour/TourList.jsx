import styles from "./TourList.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TourList = ({ isLiked }) => {
  return (
    <div className={styles.tour_list_item_wrap}>
      <div className={styles.tour_list_item_img}>
        <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" />
      </div>
      <div className={styles.tour_list_item_header}>
        <div className={styles.tour_list_item_title}>투어명</div>
        <div className={styles.tour_list_item_heart}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
      </div>
      <div className={styles.tour_list_item_price}>150,000₩</div>
      <div className={styles.tour_list_item_schedule}>3월 ~ 6월 / 4박 5일</div>
    </div>
  );
};

export default TourList;
