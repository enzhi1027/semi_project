import styles from "./CourseList.module.css";
import intro1 from "../../assets/img/mainPage/intro1.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseList = ({ courseList }) => {
  return (
    <div className={styles.course_item_wrap}>
      {courseList.map((course, index) => {
        return <CourseItem key={"course-" + index} course={course} />;
      })}
    </div>
  );
};

const CourseItem = ({ course }) => {
  const [like, setLike] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.course_item}>
        <div className={styles.course_img}>
          <img src={intro1} />
        </div>
        <div
          className={styles.course_info}
          onClick={() => {
            navigate("/course/view");
          }}
        >
          <div className={styles.course_title}>{course.courseTitle}</div>
          <div className={styles.course_content}>{course.courseContent}</div>
          <div className={styles.course_writer}>
            <p className={styles.writer}>{course.courseWriter}</p>
            <p className={styles.course_index}>{course.courseIndex + "코스"}</p>
          </div>
        </div>
        <div
          className={styles.course_like}
          onClick={() => {
            if (like === 0) {
              setLike(1);
            } else if (like === 1) {
              setLike(0);
            }
          }}
        >
          {like === 0 ? <FavoriteBorderIcon /> : <FavoriteIcon />}
        </div>
      </div>
    </>
  );
};

export default CourseList;
