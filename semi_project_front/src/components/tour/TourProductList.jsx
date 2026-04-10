import styles from "./TourProductList.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TourList from "./TourList";
import { useState, useRef } from "react";

const TourProductList = ({ memberId, wishlistList, setWishlistList }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [openIndex, setOpenIndex] = useState(null);

  const tours = [
    { id: 1, isLiked: true },
    { id: 2, isLiked: false },
    { id: 3, isLiked: true },
    { id: 4, isLiked: false },
    { id: 5, isLiked: false },
    { id: 6, isLiked: false },
    { id: 7, isLiked: false },
    { id: 8, isLiked: true },
  ];

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
        {tours.map((tour, index) => {
          return (
            <SwiperSlide key={"tour-" + tour.id}>
              <TourList
                isLiked={tour.isLiked}
                isOpen={openIndex === index}
                onToggle={() => {
                  setOpenIndex(openIndex === index ? null : index);
                }}
                memberId={memberId}
                wishlistList={wishlistList}
                setWishlistList={setWishlistList}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TourProductList;
