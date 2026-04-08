import { Link } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import styles from "./CourseListPage.module.css";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useEffect, useState } from "react";
import CourseList from "../../components/Course/CourseList";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";

const CourseListPage = () => {
  const [order, setOrder] = useState(1);
  const [courseList, setCourseList] = useState([]);
  const { memberId } = useAuthStore();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPage, setTotalPage] = useState(0);
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
      <h3 className={styles.page_title}>관광지 코스 목록</h3>
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
