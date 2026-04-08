import styles from "./TourSearchPage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import TourList from "../../components/tour/TourList";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TourSearchPage = () => {
  const [searchWhere, setSearchWhere] = useState("");
  const [searchPriceMin, setSeachPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchWhen, setSearchWhen] = useState("");

  const ProductList = () => {
    return (
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20} // 슬라이드 사이 간격
        slidesPerView={4} // 한 화면에 보여질 개수
        navigation
        className={styles.produt_list_wrap}
      >
        <SwiperSlide>
          <TourList isLiked={true} />
        </SwiperSlide>
        <SwiperSlide>
          <TourList isLiked={false} />
        </SwiperSlide>
        <SwiperSlide>
          <TourList isLiked={false} />
        </SwiperSlide>
        <SwiperSlide>
          <TourList isLiked={true} />
        </SwiperSlide>
        <SwiperSlide>
          <TourList isLiked={true} />
        </SwiperSlide>
      </Swiper>
    );
  };

  return (
    <>
      <section className={styles.tour_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.menubar_search_wrap}>
            <div className={styles.search_where}>
              <input
                type="text"
                placeholder="어디로 여행 가세요?"
                value={searchWhere}
                onChange={(e) => {
                  setSearchWhere(e.target.value);
                }}
              />
              <SearchIcon />
            </div>
            <div className={styles.search_price}>
              <SellIcon />
              <input
                type="text"
                placeholder="130,000"
                value={searchPriceMin}
                onChange={(e) => {
                  setSeachPriceMin(e.target.value);
                }}
                className={styles.price_min}
              />
              <div>~</div>
              <input
                type="text"
                placeholder="130,000,000"
                value={searchPriceMax}
                onChange={(e) => {
                  setSearchPriceMax(e.target.value);
                }}
                className={styles.price_max}
              />
              <SearchIcon />
            </div>
            <div className={styles.search_when}>
              <div className={styles.search_when_btn}>
                <CalendarMonthIcon />
                <div>출발일 선택</div>
              </div>
            </div>
          </div>
          <div className={styles.menubar_icon_wrap}>
            <div className={styles.icon_mypage}>
              <AccountCircleIcon />
            </div>
            <div className={styles.icon_cart}>
              <ShoppingCartIcon />
            </div>
          </div>
        </div>

        <div className={styles.tour_product_wrap}>
          <div className={styles.tour_product_recommend}>
            <div className={styles.product_list_title}>추천 상품</div>
            <ProductList />
          </div>
          <div className={styles.tour_product_all}>
            <div className={styles.product_list_title}>전체 상품</div>
            <div className={styles.produt_list_wrap}>
              <TourList isLiked={false} />
              <TourList isLiked={false} />
              <TourList isLiked={false} />
              <TourList isLiked={true} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourSearchPage;
