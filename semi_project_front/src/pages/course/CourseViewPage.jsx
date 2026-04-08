import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import CourseInfo from "../../components/Course/CourseInfo";
import Swal from "sweetalert2";

const CourseViewPage = () => {
  const params = useParams();
  const courseNo = params.courseNo;
  const { memberId } = useAuthStore();
  const [courseTitle, setCourseTitle] = useState(null);
  const [attractionList, setAttractionList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/${courseNo}`)
      .then((res) => {
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/courseTitle/${courseNo}`)
      .then((res) => {
        setCourseTitle(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteCourse = () => {
    Swal.fire({
      title: "코스를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color2)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/courses/${courseNo}`)
          .then((res) => {
            console.log(res);
            if (res.data !== 0) {
              navigate(`/course/list`);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <section className={styles.course_view_wrap}>
      <h3 className={styles.page_title}>{courseTitle}</h3>
      {attractionList.map((attraction, index) => {
        return <AttractionItem key={"key-" + index} attraction={attraction} />;
      })}
      <CourseInfo
        attractionList={attractionList}
        listLength={attractionList.length}
      />
      {attractionList.length !== 0 && (
        <div className={styles.delete_btn}>
          {memberId === attractionList[0].courseWriter && (
            <Button className="btn danger sm" onClick={deleteCourse}>
              코스 삭제하기
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

const AttractionItem = ({ attraction }) => {
  return (
    <>
      {attraction.courseIndex % 2 === 0 ? (
        <div className={styles.attraction_wrap}>
          <div className={styles.content_wrap}>
            <div className={styles.content_title}>
              <div>
                <p>{attraction.courseIndex}</p>
              </div>
              <h3>{attraction.attractionTitle}</h3>
            </div>
            <div className={styles.attraction_content}>
              {attraction.attractionSummary}
            </div>
          </div>
          <div className={styles.img_wrap}>
            <img
              src={
                attraction.attractionThumb
                  ? attraction.attractionThumb
                  : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              }
            />
          </div>
        </div>
      ) : (
        <div className={styles.attraction_wrap}>
          <div className={styles.img_wrap}>
            <img
              src={
                attraction.attractionThumb
                  ? attraction.attractionThumb
                  : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              }
            />
          </div>
          <div className={styles.content_wrap}>
            <div className={styles.content_title}>
              <div>
                <p>{attraction.courseIndex}</p>
              </div>
              <h3>{attraction.attractionTitle}</h3>
            </div>
            <div className={styles.attraction_content}>
              {attraction.attractionSummary}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseViewPage;
export { AttractionItem };
