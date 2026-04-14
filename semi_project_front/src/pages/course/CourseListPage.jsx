import { Link } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import styles from "./CourseListPage.module.css";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useEffect, useState } from "react";
import CourseList from "../../components/Course/CourseList";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";

const CourseListPage = () => {
  //인기순, 최신순 정렬 - 1:인기순 / 2:최신순
  const [order, setOrder] = useState(1);

  //코스 리스트 받아오는 스테이트
  const [courseList, setCourseList] = useState([]);

  //로그인정보
  const { memberId } = useAuthStore();

  //현재페이지
  const [page, setPage] = useState(0);

  //한페이지에 코스 8개 출력
  const [size, setSize] = useState(8);

  //총 코스의 출력 페이지
  const [totalPage, setTotalPage] = useState(0);

  //코스 리스트 가져오는 GET요청
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/courses?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
      )
      .then((res) => {
        setCourseList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order]);

  return (
    <section className={styles.course_wrap}>
      <h3 className={styles.page_title}>관광지 코스</h3>
      <div className={styles.option_wrap}>
        {memberId && (
          <Link to="/course/write" className={styles.write_course}>
            <PlaylistAddIcon />
            <p>코스생성</p>
          </Link>
        )}
        <div className={styles.order}>
          <p
            className={
              order === 1
                ? `${styles.order_active} ${styles.order_text}`
                : styles.order_text
            }
            onClick={() => {
              setOrder(1);
            }}
          >
            인기순
          </p>
          <p className={styles.order_line}>|</p>
          <p
            className={
              order === 2
                ? `${styles.order_active} ${styles.order_text}`
                : styles.order_text
            }
            onClick={() => {
              setOrder(2);
            }}
          >
            최신순
          </p>
        </div>
      </div>
      <CourseList courseList={courseList} />
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

export default CourseListPage;
