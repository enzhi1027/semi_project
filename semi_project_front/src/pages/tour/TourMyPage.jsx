import { useEffect, useState } from "react";
import styles from "./TourMyPage.module.css";
import MyTourList from "../../components/tour/MyTourList";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";

const TourMyPage = () => {
  const [tourMyPageTap, setTourMyPageTap] = useState(0); // 0: 찜목록, 1: 결제 내역
  const { memberId, isReady } = useAuthStore();
  const [wishlistList, setWishlistList] = useState([]);

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
        {wishlistList ? (
          <MyTourList
            wishlistList={wishlistList}
            setWishlistList={setWishlistList}
            memberId={memberId}
          />
        ) : (
          <d>로딩 중이라네요</d>
        )}
      </div>
    </div>
  );
};

export default TourMyPage;
