import { use, useEffect, useRef, useState } from "react";
import styles from "./TourDetailPage.module.css";
import { useLocation, useParams } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import groupBy from "lodash/groupBy";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const TourDetailPage = () => {
  const { tourItemNo } = useParams();
  const { memberId, isReady } = useAuthStore();
  const [item, setItem] = useState();
  const [info, setInfo] = useState();
  const [imgs, setImgs] = useState();
  const [wishlistList, setWishlistList] = useState();
  const [clickedList, setClickedList] = useState();
  const [groupedData, setGroupedData] = useState();
  const [days, setDays] = useState();

  const checkReservationDeadline = () => {
    const endDate = new Date(item.endPeriod);

    const nights = item.tourItemDays - 1;
    const deadlineDate = new Date(endDate);
    deadlineDate.setDate(endDate.getDate() - nights);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return today >= deadlineDate;
  };

  const makePrettyDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = week[date.getDay()];

    const prettyDate = `${year}.${month}.${day}(${dayOfWeek})`;

    return prettyDate;
  };

  const removeTags = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, "");
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/tourItem/${tourItemNo}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tourItemNo]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/tours/tourItemInfo/${tourItemNo}`,
      )
      .then((res) => {
        setInfo(res.data);
        setGroupedData(groupBy(res.data, "tourItemDay"));
        setDays(
          Object.keys(groupBy(res.data, "tourItemDay")).sort((a, b) => a - b),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tourItemNo]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/tourItemImg/${tourItemNo}`)
      .then((res) => {
        setImgs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tourItemNo]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/wishlistList/${memberId}`)
      .then((res) => {
        setWishlistList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/tours/wishlistNoList/${memberId}/${tourItemNo}`,
      )
      .then((res) => {
        setClickedList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId, tourItemNo]);

  return (
    <div className={styles.tour_detail_wrap}>
      {item ? (
        <>
          <div className={styles.tour_detail_header}>
            <div
              className={styles.header_accout}
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
            <div className={styles.header_cart}>
              <ShoppingCartIcon />
            </div>
          </div>
          <div className={styles.tour_detail_content}>
            <div className={`${styles.content_img} ${styles.swiper_container}`}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                pagination={{ el: ".swiper-pagination", clickable: true }}
                className={styles.detail_img_wrap}
              >
                {imgs.map((img, index) => {
                  return (
                    <SwiperSlide key={"img-" + index}>
                      <img
                        src={`${import.meta.env.VITE_BACKSERVER}/tourItemImg/${img.tourItemImgPath}`}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="swiper-pagination"></div>
            </div>

            <div className={styles.content_header}>
              <div className={styles.header_header}>
                <div className={styles.header_title}>{item.tourItemName}</div>
                <div className={styles.header_icons}>
                  <div className={styles.header_icons_heart}>
                    <FavoriteIcon /> <FavoriteBorderIcon />
                  </div>
                  <div className={styles.header_icons_share}>
                    <ShareIcon />
                  </div>
                </div>
              </div>
              <div className={styles.header_middle}>
                <div className={styles.middle_date}>
                  {checkReservationDeadline() ? "[판매 마감]" : "[예약 가능]"}{" "}
                  {makePrettyDate(new Date())} |{" "}
                  {item.tourItemDays - 1 === 0
                    ? "당일치기"
                    : item.tourItemDays - 1 + "박 " + item.tourItemDays + "일"}
                </div>
                <div className={styles.middle_cal}>
                  <CalendarMonthIcon />
                  <div className={styles.middle_cal_text}>다른 출발일 선택</div>
                </div>
              </div>
              <div className={styles.header_footer}>
                <div className={styles.footer_adult}>
                  1인당 {item.tourItemAdultPrice.toLocaleString()}₩
                </div>
                <div className={styles.footer_kid}>
                  미취학 아동 {item.tourItemKidPrice.toLocaleString()}₩
                </div>
              </div>
            </div>

            <div className={styles.content_content}>
              <div className={styles.content_title}>상세 일정</div>
              <div className={styles.content_schedult_wrap}>
                {days ? (
                  days.map((day, index) => {
                    return (
                      <div
                        className={styles.content_schedule}
                        key={"day-" + index}
                      >
                        <div className={styles.schedule_titles}>
                          <div className={styles.schedule_title}>{day}일차</div>
                          <div className={styles.schedule_when}>
                            {makePrettyDate(new Date())}
                          </div>
                        </div>
                        <div className={styles.schedule_wrap}>
                          <div className={styles.schedule_days}>
                            {groupedData[day].map((dayItem, i) => {
                              const isLast = i === groupedData[day].length - 1; // true -> 마지막
                              return (
                                <div
                                  className={styles.schedule_day}
                                  key={"dayday-" + i}
                                >
                                  <div className={styles.schedule_sidebar}>
                                    <div className={styles.sidebar_circle}>
                                      <PanoramaFishEyeIcon />
                                    </div>
                                    {!isLast && (
                                      <div
                                        className={styles.sidebar_line}
                                      ></div>
                                    )}
                                  </div>
                                  <div className={styles.dayday_wrap}>
                                    <div className={styles.day_place}>
                                      {dayItem.tourItemPlace}
                                    </div>
                                    <div
                                      className={styles.day_detail}
                                      dangerouslySetInnerHTML={{
                                        __html: dayItem.tourItemPlan,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>로딩 중</div>
                )}
                <div className={styles.whiteboard}></div>
              </div>
            </div>
          </div>
          <div className={styles.tour_detail_recommend}>
            <div className={styles.recommend_header}>비슷한 상품 추천</div>
          </div>
          <div className={styles.tour_detail_btns}>
            <div className={styles.btns_btn1}></div>
            <div className={styles.btns_btn2}></div>
          </div>
        </>
      ) : (
        <div>로딩 중~</div>
      )}
    </div>
  );
};

export default TourDetailPage;
