import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import testImg from "../../assets/img/mainPage/main.jpg";

const CourseViewPage = () => {
  const [attractionList, setAttractionList] = useState([
    {
      attractionImg: testImg,
      attractionIndex: 1,
      attractionTitle: "관광지명",
      attractionContent:
        "관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명",
      attractionAddr: "강원특별자치도 양구군 동면 바랑길 87",
    },
    {
      attractionImg: testImg,
      attractionIndex: 2,
      attractionTitle: "관광지명",
      attractionContent:
        "관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 ",
      attractionAddr: "강원특별자치도 양구군 동면 숨골로310번길 131",
    },
    {
      attractionImg: testImg,
      attractionIndex: 3,
      attractionTitle: "관광지명",
      attractionContent:
        "관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명",
      attractionAddr: "강원특별자치도 양구군 양구읍 고대리",
    },
    {
      attractionImg: testImg,
      attractionIndex: 4,
      attractionTitle: "관광지명",
      attractionContent:
        "관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명 관광지설명",
      attractionAddr: "강원특별자치도 양구군 양구읍 군량리",
    },
  ]);

  const mapDivRef = useRef(null);
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }

    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(37.5696734, 126.9843022),
      zoom: 10,
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

          new naver.maps.Marker({
            position: latlng,
            map: map,
            icon: {
              content: `<div class="${styles.marker}"><p>${spot.attractionIndex}</p></div>`,
            },
          });

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
    </section>
  );
};

const AttractionItem = ({ attraction }) => {
  return (
    <>
      {attraction.attractionIndex % 2 === 0 ? (
        <div className={styles.attraction_wrap}>
          <div className={styles.content_wrap}>
            <div className={styles.content_title}>
              <div>
                <p>{attraction.attractionIndex}</p>
              </div>
              <h3>{attraction.attractionTitle}</h3>
            </div>
            <div className={styles.attraction_content}>
              {attraction.attractionContent}
            </div>
          </div>
          <div className={styles.img_wrap}>
            <img src={attraction.attractionImg} />
          </div>
        </div>
      ) : (
        <div className={styles.attraction_wrap}>
          <div className={styles.img_wrap}>
            <img src={attraction.attractionImg} />
          </div>
          <div className={styles.content_wrap}>
            <div className={styles.content_title}>
              <div>
                <p>{attraction.attractionIndex}</p>
              </div>
              <h3>{attraction.attractionTitle}</h3>
            </div>
            <div>{attraction.attractionContent}</div>
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
            <p>{attraction.attractionIndex}</p>
          </div>
          <div className={styles.index_bar}></div>
        </div>
        <div className={styles.attraction_img_wrap}>
          <img src={attraction.attractionImg} />
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
