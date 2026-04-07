import styles from "./CourseList.module.css";
import intro1 from "../../assets/img/mainPage/intro1.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/useAuthStore";
import Swal from "sweetalert2";
import axios from "axios";

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
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const likeOff = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/courses?memberId=${memberId}&courseNo=${course.courseNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          setLike(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const likeOn = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/courses?memberId=${memberId}&courseNo=${course.courseNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          setLike(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loginMsg = () => {
    Swal.fire({
      title: "로그인 후 이용 가능합니다.",
      icon: "info",
    });
  };
  useEffect(() => {
    setLike(course.isLike);
  }, []);
  return (
    <>
      <div className={styles.course_item}>
        <div
          className={styles.course_img}
          onClick={() => {
            navigate(`/course/view/${course.courseNo}`);
          }}
        >
          <img
            src={
              course.courseThumb
                ? course.courseThumb
                : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
            }
          />
        </div>
        <div
          className={styles.course_info}
          onClick={() => {
            navigate(`/course/view/${course.courseNo}`);
          }}
        >
          <div className={styles.course_title}>{course.courseTitle}</div>
          <div className={styles.course_content}>{course.courseContent}</div>
          <div className={styles.course_writer}>
            <p className={styles.writer}>{course.courseWriter}</p>
            <p className={styles.course_index}>{course.courseCount + "코스"}</p>
          </div>
        </div>
        <div className={styles.course_like}>
          {like === 0 ? (
            <FavoriteBorderIcon onClick={memberId ? likeOn : loginMsg} />
          ) : (
            <FavoriteIcon onClick={likeOff} />
          )}
        </div>
      </div>
    </>
  );
};

export default CourseList;
