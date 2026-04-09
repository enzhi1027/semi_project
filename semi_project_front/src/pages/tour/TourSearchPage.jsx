import styles from "./TourSearchPage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState, useRef } from "react";
import TourList from "../../components/tour/TourList";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";

const TourSearchPage = () => {
  const navigate = useNavigate();
  const { memberId, isReady } = useAuthStore();

  const [searchWhere, setSearchWhere] = useState("");
  const [searchPriceMin, setSeachPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchWhen, setSearchWhen] = useState("");

  const ProductList = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
      <div className={styles.swiper_container}>
        <NavigateBeforeIcon ref={prevRef} className={styles.btn_prev} />
        <NavigateNextIcon ref={nextRef} className={styles.btn_next} />
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          navigation={{ prevEl: prevRef, nextEl: nextRef }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
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
          <SwiperSlide>
            <TourList isLiked={true} />
          </SwiperSlide>
          <SwiperSlide>
            <TourList isLiked={true} />
          </SwiperSlide>
          <SwiperSlide>
            <TourList isLiked={true} />
          </SwiperSlide>
        </Swiper>
      </div>
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
            <div
              className={styles.icon_mypage}
              onClick={() => {
                if (isReady && memberId == null) {
                  Swal.fire({
                    title: "로그인 후 이용 가능합니다.",
                    icon: "warning",
                  });
                } else {
                  navigate("/tour/mypage");
                }
              }}
            >
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
            <ProductList />
          </div>
        </div>
      </section>
    </>
  );
};

export default TourSearchPage;
