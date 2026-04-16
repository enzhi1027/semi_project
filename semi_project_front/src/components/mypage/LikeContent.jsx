import { useEffect, useState } from "react";
import styles from "./LikeContent.module.css";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import CourseList from "../Course/CourseList";
import Pagination from "../../components/ui/Pagination";
import AttractionList from "../Attraction/AttractionList";
import CloseIcon from "@mui/icons-material/Close";
import AttractionInfo from "../../components/attraction/AttractionInfo";
import AttractionReview from "../../components/attraction/AttractionReview";
import MyBoardList from "./mycontentcomponents/MyBoardList";

const LikeContent = () => {
  const [tab, setTab] = useState("likeAttraction");
  const { memberId } = useAuthStore();

  const [likeAttractionList, setLikeAttractionList] = useState([]);
  const [clickedAttractionNo, setClickedAttractionNo] = useState(0);
  const [attractionDetailTap, setAttractionDetailTap] = useState(0); // 0: info, 1:review
  const [reviewCategory, setReviewCategory] = useState(0); // 0: 추천, 1: 최신, 2: 오래된순

  const [likeBoardList, setLikeBoardList] = useState([]);
  const [likeCourseList, setLikeCourseList] = useState([]);

  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [size, setSize] = useState(9);

  const orderChange = (e) => {
    setOrder(Number(e.target.value));
    setPage(0); //정렬 바뀌면 첫 페이지부터
  };

  const handleWishToggle = (attractionNo) => {
    // 이미 좋아요 리스트에 있는 상태이므로, 취소, 복구를 반복할 수 있게 처리
    // 1. 삭제, 추가 요청 - 현재 하트 상태에 따라 분기
    const isCurrentlyLiked =
      likeAttractionList.find((item) => item.attractionNo === attractionNo)
        ?.isLiked !== false;

    if (isCurrentlyLiked) {
      // 좋아요 취소 요청
      axios
        .delete(
          `${import.meta.env.VITE_BACKSERVER}/attractions/wishList/${memberId}/${attractionNo}`,
        )
        .then(() => {
          // 리스트에서 지우지 않고, 해당 아이템의 isLiked 속성만 false로 변경
          setLikeAttractionList((prev) =>
            prev.map((item) =>
              item.attractionNo === attractionNo
                ? { ...item, isLiked: false }
                : item,
            ),
          );
        });
    } else {
      // 실수로 취소했을 때 다시 복구 요청
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/attractions/wishList`, {
          memberId: memberId,
          attractionNo: attractionNo,
        })
        .then(() => {
          setLikeAttractionList((prev) =>
            prev.map((item) =>
              item.attractionNo === attractionNo
                ? { ...item, isLiked: true }
                : item,
            ),
          );
        });
    }
  };

  useEffect(() => {
    if (memberId != null) {
      //좋아요 표시한 관광지 조회
      if (tab === "likeAttraction" && memberId) {
        axios
          .get(
            `${import.meta.env.VITE_BACKSERVER}/members/like-attraction?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
          )
          .then((res) => {
            console.log(res);
            setLikeAttractionList(res.data.items);
            setTotalPage(res.data.totalPage);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      //좋아요 표시한 게시글 조회
      if (tab === "likeBoard" && memberId) {
        axios
          .get(
            `${import.meta.env.VITE_BACKSERVER}/members/like-board?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
          )
          .then((res) => {
            setLikeBoardList(res.data.items);
            setTotalPage(res.data.totalPage);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      //좋아요 표시한 코스 목록 조회
      if (tab === "likeCourse" && memberId) {
        axios
          .get(
            `${import.meta.env.VITE_BACKSERVER}/members/like-course?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
          )
          .then((res) => {
            setLikeCourseList(res.data.items);
            setTotalPage(res.data.totalPage);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [tab, memberId, order, page]);

  return (
    <>
      <section className={styles.like_content_wrap}>
        <h3 className={styles.page_title}>좋아요 표시한 컨텐츠</h3>
        {/* 탭 변경 랩 */}
        <div className={styles.like_content_tab_wrap}>
          <div className={styles.like_content_tab}>
            <span
              className={tab === "likeAttraction" ? styles.active_tab : ""}
              onClick={() => {
                setTab("likeAttraction");
                setPage(0);
              }}
            >
              관광지
            </span>
            <span
              className={tab === "likeBoard" ? styles.active_tab : ""}
              onClick={() => {
                setTab("likeBoard");
                setPage(0);
              }}
            >
              게시글
            </span>
            <span
              className={tab === "likeCourse" ? styles.active_tab : ""}
              onClick={() => {
                setTab("likeCourse");
                setPage(0);
              }}
            >
              관광 코스
            </span>
          </div>
          <div
            className={styles.order_select_wrap}
            style={{
              opacity: tab === "likeAttraction" ? 0 : 1,
              pointerEvents: tab === "likeAttraction" ? "none" : "auto",
            }}
          >
            <select
              className={styles.order_select}
              value={order}
              onChange={orderChange}
            >
              <option value={1}>최신순</option>
              <option value={2}>작성순</option>
            </select>
          </div>
        </div>

        <div className={styles.like_list_wrap}>
          {tab === "likeAttraction" &&
            (likeAttractionList.length > 0 ? (
              likeAttractionList.map((item, index) => {
                // 원래 페이지에서 사용하던 방식대로 info 문자열을 조합 (데이터가 있다면)
                const infoStr = `${item.attractionHoliday ? "휴무일: " + item.attractionHoliday + " | " : ""}${item.attractionFee ? "이용요금: " + item.attractionFee + " | " : ""}${item.attractionRestroom ? "화장실: " + item.attractionRestroom + " | " : ""}${item.attractionAccessible ? "장애인편의시설: " + item.attractionAccessible + " | " : ""}${item.attractionParking ? "주차장: " + item.attractionParking + " | " : ""}${item.tel ? "기타문의: " + item.tel : ""}`;

                return (
                  <AttractionList
                    key={`like-attraction-${index}`}
                    attractionNo={item.attractionNo}
                    title={item.title}
                    thumb={item.mainimage}
                    info={infoStr}
                    subtitle={item.attractionDesignation}
                    isLiked={item.isLiked !== false}
                    // 클릭 시 상세 팝업을 띄우기 위한 상태 변경 함수
                    setClickedAttractionNo={setClickedAttractionNo}
                    handleWishToggle={handleWishToggle}
                  />
                );
              })
            ) : (
              <div className={styles.content_empty}>
                좋아요 한 관광지가 없습니다.
              </div>
            ))}

          {/* 게시글 탭 */}
          {tab === "likeBoard" &&
            (likeBoardList.length > 0 ? (
              <MyBoardList boardList={likeBoardList} />
            ) : (
              <div className={styles.content_empty}>
                좋아요 한 게시글이 없습니다.
              </div>
            ))}

          {/* 코스 탭 */}
          {tab === "likeCourse" &&
            (likeCourseList.length > 0 ? (
              <CourseList courseList={likeCourseList} />
            ) : (
              <div className={styles.content_empty}>
                좋아요 한 코스가 없습니다.
              </div>
            ))}
        </div>
        <div className={styles.pagination}>
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            naviSize={5}
          />
        </div>
      </section>

      {/* 상세보기 팝업 */}
      {clickedAttractionNo ? (
        <section
          className={styles.attraction_detail_wrap}
          onClick={() => setClickedAttractionNo(null)} // 여백 클릭 시 닫기
        >
          <div
            className={styles.attraction_detail_popup}
            onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 안 닫히게
          >
            <div className={styles.detail_menubar}>
              <div className={styles.detail_mini}>
                <div
                  className={`${styles.detail_mimi_info} ${attractionDetailTap === 0 ? styles.detail_mini_active : ""}`}
                  onClick={() => setAttractionDetailTap(0)}
                >
                  INFO
                </div>
                <div
                  className={`${styles.detail_mimi_review} ${attractionDetailTap === 1 ? styles.detail_mini_active : ""}`}
                  onClick={() => setAttractionDetailTap(1)}
                >
                  REVIEW
                </div>
              </div>
              <div
                className={styles.detail_cancel}
                onClick={() => setClickedAttractionNo(null)}
              >
                <CloseIcon />
              </div>
            </div>

            {attractionDetailTap ? (
              <>
                <div className={styles.reviewCategory}>
                  <input
                    type="radio"
                    id="recommend"
                    name="reviewOrder"
                    value={reviewCategory}
                    onChange={() => setReviewCategory(0)}
                    checked={reviewCategory === 0}
                  />
                  <label htmlFor="recommend" className="radio">
                    추천순
                  </label>

                  <input
                    type="radio"
                    id="recent"
                    name="reviewOrder"
                    value={reviewCategory}
                    onChange={() => setReviewCategory(1)}
                    checked={reviewCategory === 1}
                  />
                  <label htmlFor="recent" className="radio">
                    최신순
                  </label>

                  <input
                    type="radio"
                    id="old"
                    name="reviewOrder"
                    value={reviewCategory}
                    onChange={() => setReviewCategory(2)}
                    checked={reviewCategory === 2}
                  />
                  <label htmlFor="old" className="radio">
                    오래된순
                  </label>
                </div>
                <AttractionReview
                  attractionNo={clickedAttractionNo}
                  reviewCategory={reviewCategory}
                />
              </>
            ) : (
              <AttractionInfo
                attraction={likeAttractionList.find(
                  (it) => it.attractionNo === clickedAttractionNo,
                )}
                isLiked={
                  likeAttractionList.find(
                    (it) => it.attractionNo === clickedAttractionNo,
                  )?.isLiked !== false
                }
                handleWishToggle={handleWishToggle}
                memberId={memberId}
              />
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default LikeContent;
