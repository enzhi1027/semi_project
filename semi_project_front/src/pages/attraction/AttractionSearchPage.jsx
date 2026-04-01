import Map from "../../components/attraction/Map";
import styles from "./AttractionSearchPage.module.css";

const AttractionSearchPage = () => {
  return (
    <>
      <section className={styles.attraction_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.select_area}>
            <div className={styles.select_area_title}>지역 선택</div>
            <div className={styles.select_area_content}>
              <div className={styles.select_area_content_citys}>
                <div className={styles.select_area_content_city}>서울</div>
                <div className={styles.select_area_content_city}>대구</div>
                <div className={styles.select_area_content_city}>대전</div>
                <div className={styles.select_area_content_city}>부산</div>
                <div className={styles.select_area_content_city}>경기</div>
                <div className={styles.select_area_content_city}>인천</div>
              </div>
              <div className={styles.select_area_content_gungus}>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu1" />
                  <label htmlFor="gungu1">혜화1</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu2" />
                  <label htmlFor="gungu2">혜화2</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu3" />
                  <label htmlFor="gungu3">혜화3</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu4" />
                  <label htmlFor="gungu4">혜화4</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu5" />
                  <label htmlFor="gungu5">혜화5</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu6" />
                  <label htmlFor="gungu6">혜화6</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu7" />
                  <label htmlFor="gungu7">혜화7</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu8" />
                  <label htmlFor="gungu8">혜화8</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu9" />
                  <label htmlFor="gungu9">혜화9</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu10" />
                  <label htmlFor="gungu10">혜화10</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu11" />
                  <label htmlFor="gungu11">혜화11</label>
                </div>
                <div className={styles.select_area_content_gungu}>
                  <input type="checkbox" id="gungu12" />
                  <label htmlFor="gungu12">혜화12</label>
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
