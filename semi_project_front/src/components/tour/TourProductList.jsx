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
  recommendItemList,
  setRecommendItemList,
  allItemList,
  setAllItemList,
  openIndex,
  setOpenIndex,
  allClickedItems,
  setAllClickedItems,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const updateItemWishStatus = (tourItemNo, newListOrUpdater) => {
    setAllClickedItems((prev) => {
      const currentItemWishList = prev[tourItemNo] || [];
      const nextList =
        typeof newListOrUpdater === "function"
          ? newListOrUpdater(currentItemWishList)
          : newListOrUpdater;

      return {
        ...prev,
        [tourItemNo]: nextList,
      };
    });
  };

  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      const order = i;
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/tours/itemList/${order}`)
        .then((res) => {
          if (order) {
            setAllItemList(res.data);
          } else {
            setRecommendItemList(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <div className={styles.tour_product_recommend}>
        <div className={styles.product_list_title}>추천 상품</div>
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
            {recommendItemList.map((item) => {
              return (
                <SwiperSlide key={"item-" + item.tourItemNo}>
                  <TourList
                    isLiked={false}
                    isOpen={openIndex === `recommend-${item.tourItemNo}`}
                    onToggle={() => {
                      setOpenIndex(
                        openIndex === `recommend-${item.tourItemNo}`
                          ? null
                          : `recommend-${item.tourItemNo}`,
                      );
                    }}
                    memberId={memberId}
                    isReady={isReady}
                    wishlistList={wishlistList}
                    setWishlistList={setWishlistList}
                    item={item}
                    clickedList={allClickedItems[item.tourItemNo] || []}
                    setClickedList={(newList) =>
                      updateItemWishStatus(item.tourItemNo, newList)
                    }
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
      <div className={styles.tour_product_all}>
        <div className={styles.product_list_title}>전체 상품</div>
        <div className={styles.product_list_allItem}>
          {allItemList.map((item) => {
            return (
              <TourList
                isLiked={false}
                isOpen={openIndex === `all-${item.tourItemNo}`}
                onToggle={() => {
                  setOpenIndex(
                    openIndex === `all-${item.tourItemNo}`
                      ? null
                      : `all-${item.tourItemNo}`,
                  );
                }}
                memberId={memberId}
                isReady={isReady}
                wishlistList={wishlistList}
                setWishlistList={setWishlistList}
                item={item}
                key={"item-" + item.tourItemNo}
                clickedList={allClickedItems[item.tourItemNo] || []}
                setClickedList={(newList) =>
                  updateItemWishStatus(item.tourItemNo, newList)
                }
              />
            );
          })}
        </div>
      </div>
    </>
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
  allClickedItems,
  setAllClickedItems,
}) => {
  return (
    <>
      <div className={styles.product_list_title}>검색 결과</div>
      <div className={styles.search_page_container}>
        {searchItemList.length != 0 ? (
          searchItemList.map((item, index) => {
            return (
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
                  clickedList={allClickedItems[item.tourItemNo] || []}
                  setClickedList={(newList) =>
                    updateItemWishStatus(item.tourItemNo, newList)
                  }
                />
              </div>
            );
          })
        ) : (
          <div className={styles.none_result}>
            검색 결과가 존재하지 않습니다.
          </div>
        )}
      </div>
    </>
  );
};

const TourProductList = ({
  memberId,
  isReady,
  wishlistList,
  setWishlistList,
  recommendItemList,
  setRecommendItemList,
  allItemList,
  setAllItemList,
  searchItemList,
  setSearchItemList,
  type,
  allClickedItems,
  setAllClickedItems,
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  return type === "list" ? (
    <ListPage
      memberId={memberId}
      isReady={isReady}
      wishlistList={wishlistList}
      setWishlistList={setWishlistList}
      recommendItemList={recommendItemList}
      setRecommendItemList={setRecommendItemList}
      allItemList={allItemList}
      setAllItemList={setAllItemList}
      openIndex={openIndex}
      setOpenIndex={setOpenIndex}
      allClickedItems={allClickedItems}
      setAllClickedItems={setAllClickedItems}
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
      allClickedItems={allClickedItems}
      setAllClickedItems={setAllClickedItems}
    />
  );
};

export default TourProductList;
