import styles from "./LikeCourseList.module.css";
import intro1 from "../../assets/img/mainPage/intro1.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/useAuthStore";
import Swal from "sweetalert2";
import axios from "axios";

// 좋아요 표시한 관광 코스 표시용(문건우)
const LikeCourseList = ({ courseList }) => {
  return (
    <div className={styles.course_list_wrap}>
      <div className={styles.course_item_wrap}>
        {courseList.map((course, index) => {
          return <CourseItem key={"course-" + index} course={course} />;
        })}
      </div>
    </div>
  );
};

const CourseItem = ({ course }) => {
  //코스 좋아요 화면에 바로 적용하기 위한 스테이트
  const [like, setLike] = useState(0);

  //로그인상태
  const { memberId } = useAuthStore();

  //페이지이동을 위한 네비게이트
  const navigate = useNavigate();

  //좋아요 해제하는 함수 - 좋아요 삭제하는 DELETE요청
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

  //좋아요 하는 함수 - 좋아요 추가하는 POST요청
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

  //로그인 했을때만 좋아요 누를 수 있도록 알림
  const loginMsg = () => {
    Swal.fire({
      title: "로그인 후 이용 가능합니다.",
      icon: "info",
    });
  };

  //좋아요 상태변경
  useEffect(() => {
    setLike(course.isLike);
  }, [course]);
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
            <>
              <FavoriteIcon
                onClick={memberId ? likeOff : loginMsg}
                sx={{ fill: "var(--color1)" }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LikeCourseList;
