import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import CourseInfo from "../../components/Course/CourseInfo";
import Swal from "sweetalert2";

const CourseViewPage = () => {
  //주소에 있는 코스번호 가저오는 파람
  const params = useParams();
  const courseNo = params.courseNo;

  //로그인정보
  const { memberId } = useAuthStore();

  //코스제목 저장하는 스테이트
  const [courseTitle, setCourseTitle] = useState(null);

  //코스의 관광지 리스트 저장하는 스테이트
  const [attractionList, setAttractionList] = useState([]);

  //페이지이동을 위한 네비게이트
  const navigate = useNavigate();

  //코스 관광지 리스트 가져오는 GET요청
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

  //코스 제목 가져오는 GET요청
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

  //코스 삭제 버튼 클릭시 뜨는 알림 -> 확인 시 코스 삭제하는 DELETE요청
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
