import { useEffect, useState } from "react";
import Map from "../../components/attraction/Map";
import styles from "./AttractionSearchPage.module.css";
import axios from "axios";

const AttractionSearchPage = () => {
  const greenTourService = encodeURIComponent(
    import.meta.env.VITE_GREEN_TOUR_SERVICE_KEY,
  );

  const [areaList, setAreaList] = useState(null);
  const [areaCode, setAreaCode] = useState(1);
  const [sigunguCode, setSigunguCode] = useState(1);

  useEffect(() => {
    axios
      .get(
        // `https://apis.data.go.kr/B551011/GreenTourService1/areaCode1?serviceKey=${greenTourService}&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json` /* 지역 */,
        // `https://apis.data.go.kr/B551011/GreenTourService1/areaCode1?serviceKey=${greenTourService}&numOfRows=35&pageNo=1&MobileOS=ETC&MobileApp=AppTest&areaCode=${areaCode}&_type=json` /* 시군구 */,
        `https://apis.data.go.kr/B551011/GreenTourService1/areaBasedSyncList1?serviceKey=${greenTourService}&numOfRows=50&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&areaCode=${areaCode}&sigunguCode=&arrange=C` /* 관광지 */,
      )
      .then((res) => {
        // const areas = res.data.response.body.items.item;
        // console.log(areas);
        // if (areas.length / 2 === 0) {
        //   setAreaList(areas);
        // } else {
        //   setAreaList([...areas, {}]);
        // }
        console.log(res.data.response.body.items.item);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <section className={styles.attraction_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.select_where}>
            <div className={styles.select_where_title}>지역 선택</div>
            <div className={styles.select_where_content}>
              <div className={styles.select_where_content_areas}>
                {areaList &&
                  areaList.map((item, index) => (
                    <div
                      key={"area" + index}
                      className={styles.select_where_content_area}
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
              <div className={styles.select_where_content_sigungus}>
                <div className={styles.select_where_content_sigungu}>
                  <input type="checkbox" id="gungu1" />
                  <label htmlFor="gungu1">혜화1</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Map></Map>
      </section>
    </>
  );
};

export default AttractionSearchPage;
