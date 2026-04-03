import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import testImg from "../../assets/img/mainPage/main.jpg";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import { StyleSharp } from "@mui/icons-material";
import useAuthStore from "../../components/utils/useAuthStore";

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

  const mapDivRef = useRef(null);
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }

    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(37.5696734, 126.9843022),
      zoom: 10,
    });

    var polyline = new naver.maps.Polyline({
      map: map,
      path: [],
      strokeColor: "#ff6f61",
      strokeWeight: 2,
    });

    const bounds = new naver.maps.LatLngBounds();
    const coords = [];

    attractionList.forEach((spot) => {
      naver.maps.Service.geocode(
        { query: spot.attractionAddr },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) return;
          if (!response.v2 || response.v2.addresses.length === 0) return;

          const result = response.v2.addresses[0];
          const latlng = new naver.maps.LatLng(result.y, result.x);

          bounds.extend(latlng);

          const marker = new naver.maps.Marker({
            position: latlng,
            map: map,
            icon: {
              content: `
                <div style="
                  background-color:#ffffff;
                  color:#ff6f61;
                  font-weight:bold;
                  border-radius:50%;
                  border : 3px solid #ff6f61;
                  width:30px;
                  height:30px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:14px;
                ">
                  ${spot.courseIndex}
                </div>
              `,
              size: new naver.maps.Size(10, 10),
              anchor: new naver.maps.Point(13, 16),
            },
          });

          coords.push({ index: spot.courseIndex, latlng });

          if (coords.length === attractionList.length) {
            coords.sort((a, b) => a.index - b.index);

            polyline.setPath(coords.map((c) => c.latlng));
          }
          map.fitBounds(bounds, {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          });
        },
      );
    });
  }, [attractionList]);
  return (
    <section className={styles.course_view_wrap}>
      <h3 className={styles.page_title}>관광지 코스 제목</h3>
      {attractionList.map((attraction, index) => {
        return <AttractionItem key={"key-" + index} attraction={attraction} />;
      })}
      <div className={styles.course_info_wrap}>
        <div className={styles.course_info}>
          {attractionList.map((attraction, index) => {
            return (
              <AttractionInfoItem
                key={"key-" + index}
                attraction={attraction}
              />
            );
          })}
        </div>
        <div className={styles.course_map} ref={mapDivRef}></div>
      </div>
      {attractionList.length !== 0 && (
        <div className={styles.delete_btn}>
          {memberId === attractionList[0].courseWriter && (
            <Button className="btn danger">코스 삭제하기</Button>
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
            <img src={attraction.attractionThumb} />
          </div>
        </div>
      ) : (
        <div className={styles.attraction_wrap}>
          <div className={styles.img_wrap}>
            <img src={attraction.attractionThumb} />
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

const AttractionInfoItem = ({ attraction }) => {
  return (
    <>
      <div className={styles.info_item_wrap}>
        <div className={styles.attraction_index}>
          <div className={styles.index_num}>
            <p>{attraction.courseIndex}</p>
          </div>
          <div className={styles.index_bar}></div>
        </div>
        <div className={styles.attraction_img_wrap}>
          <img src={attraction.attractionThumb} />
          <div className={styles.img_back}></div>
          <p className={styles.info_attraction_title}>
            {attraction.attractionTitle}
          </p>
        </div>
      </div>
    </>
  );
};

export default CourseViewPage;
