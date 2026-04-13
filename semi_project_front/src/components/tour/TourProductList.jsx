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
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ListPage = ({
  memberId,
  isReady,
  wishlistList,
  setWishlistList,
  order,
  recommendItemList,
  setRecommendItemList,
  allItemList,
  setAllItemList,
  openIndex,
  setOpenIndex,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/itemList/${order}`)
      .then((res) => {
        if (order) {
          // 0: 추천 상품, 1: 전체 상품
          setAllItemList(res.data);
        } else {
          setRecommendItemList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        {order === 0
          ? recommendItemList.map((item, index) => {
              return (
                <SwiperSlide key={"item-" + item.tourItemNo}>
                  <TourList
                    isLiked={false}
                    isOpen={openIndex === index}
                    onToggle={() => {
                      setOpenIndex(openIndex === index ? null : index);
                    }}
                    memberId={memberId}
                    isReady={isReady}
                    wishlistList={wishlistList}
                    setWishlistList={setWishlistList}
                    item={item}
                  />
                </SwiperSlide>
              );
            })
          : allItemList.map((item, index) => {
              return (
                <SwiperSlide key={"item-" + item.tourItemNo}>
                  <TourList
                    isLiked={false}
                    isOpen={openIndex === index}
                    onToggle={() => {
                      setOpenIndex(openIndex === index ? null : index);
                    }}
                    memberId={memberId}
                    isReady={isReady}
                    wishlistList={wishlistList}
                    setWishlistList={setWishlistList}
                    item={item}
                  />
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  );
};

const SearchPage = ({
  memberId,
  isReady,
  wishlistList,
  setWishlistList,
  searchItemList,
  setSearchItemList,
  openIndex,
  setOpenIndex,
}) => {
  return (
    <div className={styles.search_page_container}>
      {searchItemList.length != 0 ? (
        searchItemList.map((item, index) => {
          return (
            <>
              <div
                className={styles.search_page_item_wrap}
                key={"item-" + item.tourItemNo}
              >
                <TourList
                  isLiked={false}
                  isOpen={openIndex === index}
                  onToggle={() => {
                    setOpenIndex(openIndex === index ? null : index);
                  }}
                  memberId={memberId}
                  isReady={isReady}
                  wishlistList={wishlistList}
                  setWishlistList={setWishlistList}
                  item={item}
                />
              </div>
            </>
          );
        })
      ) : (
        <div className={styles.none_result}>검색 결과가 존재하지 않습니다.</div>
      )}
    </div>
  );
};

const TourProductList = ({
  memberId,
  isReady,
  wishlistList,
  setWishlistList,
  order,
  recommendItemList,
  setRecommendItemList,
  allItemList,
  setAllItemList,
  searchItemList,
  setSearchItemList,
  type,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  return type === "list" ? (
    <ListPage
      memberId={memberId}
      isReady={isReady}
      wishlistList={wishlistList}
      setWishlistList={setWishlistList}
      order={order}
      recommendItemList={recommendItemList}
      setRecommendItemList={setRecommendItemList}
      allItemList={allItemList}
      setAllItemList={setAllItemList}
      openIndex={openIndex}
      setOpenIndex={setOpenIndex}
    />
  ) : (
    <SearchPage
      memberId={memberId}
      isReady={isReady}
      wishlistList={wishlistList}
      setWishlistList={setWishlistList}
      searchItemList={searchItemList}
      setSearchItemList={setSearchItemList}
      openIndex={openIndex}
      setOpenIndex={setOpenIndex}
    />
  );
};

export default TourProductList;
