import { useState } from "react";
import styles from "./TourMyPage.module.css";
import MyTourList from "../../components/tour/MyTourList";

const TourMyPage = () => {
  const [tourMyPageTap, setTourMyPageTap] = useState(0); // 0: 찜목록, 1: 결제 내역
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
        <MyTourList />
      </div>
    </div>
  );
};

export default TourMyPage;
