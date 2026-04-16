import { useEffect, useState } from "react";
import styles from "./LikeContent.module.css";
import BoardList from "../board/BoardList";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import CourseList from "../Course/CourseList";
import Pagination from "../../components/ui/Pagination";
import { Input } from "../ui/Form";
import Button from "../ui/Button";
import AttractionList from "../Attraction/AttractionList";

const LikeContent = () => {
  const [tab, setTab] = useState("likeAttraction");
  const { memberId } = useAuthStore();

  const [likeAttractionList, setLikeAttractionList] = useState([]);
  const [clickedAttractionNo, setClickedAttractionNo] = useState(null);

  const [likeBoardList, setLikeBoardList] = useState([]);
  const [likeCourseList, setLikeCourseList] = useState([]);

  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [size, setSize] = useState(9);

  const [searchKeyword, setSearchKeyword] = useState("");

  const orderChange = (e) => {
    setOrder(Number(e.target.value));
    setPage(0); // 정렬이 바뀌면 첫 페이지부터 보여줘야 함
  };

  useEffect(() => {
    if (memberId != null) {
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
    <section className={styles.like_content_wrap}>
      <h3 className={styles.page_title}>좋아요 표시한 컨텐츠</h3>
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
        {tab === "likeAttraction" && likeAttractionList.length > 0 ? (
          likeAttractionList.map((item, index) => (
            <AttractionList
              key={index}
              // 컴포넌트 Props : 내 데이터 변수명 (콘솔에 찍힌 이름대로)
              attractionNo={item.attractionNo}
              title={item.attractionTitle}
              subtitle={item.attractionAddr}
              info={item.attractionSummary}
              thumb={item.attractionThumbnail}
              isLiked={true} // 일단 화면에 빨간 하트가 뜨게 고정
              setClickedAttractionNo={setClickedAttractionNo}
            />
          ))
        ) : (
          <div className={styles.content_empty}>
            좋아요 한 관광지가 없습니다.
          </div>
        )}

        {tab === "likeBoard" && <BoardList boardList={likeBoardList} />}

        {tab === "likeCourse" && <CourseList courseList={likeCourseList} />}
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
  );
};

export default LikeContent;
