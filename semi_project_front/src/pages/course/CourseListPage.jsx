import { Link } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import styles from "./CourseListPage.module.css";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useEffect, useState } from "react";
import CourseList from "../../components/Course/CourseList";

const CourseListPage = () => {
  const [order, setOrder] = useState(1);
  const [courseList, setCourseList] = useState([]);
  useEffect(() => {
    setCourseList([
      {
        courseTitle: "관광지 추천 코스 제 목",
        courseContent:
          "코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 5,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 8,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 6,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 4,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 5,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 9,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 5,
      },
      {
        courseTitle: "관광지 추천 코스 제목",
        courseContent: "코스 관련 설명 내용",
        courseWriter: "작성자(유저이름)",
        courseIndex: 7,
      },
    ]);
  }, []);
  return (
    <section className={styles.course_wrap}>
      <h3 className={styles.page_title}>관광지 코스 목록</h3>
      <div className={styles.option_wrap}>
        <Link to="/course/write" className={styles.write_course}>
          <PlaylistAddIcon />
          <p>코스생성</p>
        </Link>
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
      <Pagination />
    </section>
  );
};

export default CourseListPage;
