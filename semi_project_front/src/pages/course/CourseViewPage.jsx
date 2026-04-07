import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import CourseInfo from "../../components/Course/CourseInfo";

const CourseViewPage = () => {
  const params = useParams();
  const courseNo = params.courseNo;
  const { memberId } = useAuthStore();
  const [attractionList, setAttractionList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/${courseNo}`)
      .then((res) => {
        console.log(res);
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.course_view_wrap}>
      <h3 className={styles.page_title}>관광지 코스 제목</h3>
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
            <Button className="btn danger sm">코스 삭제하기</Button>
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
