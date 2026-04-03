import { useEffect, useState } from "react";
import Map from "../../components/attraction/Map";
import styles from "./AttractionSearchPage.module.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AttractionSearchPage = () => {
  const [areaList, setAreaList] = useState(null);
  const [sigunguList, setSigunguList] = useState(null);

  // 페이징 처리
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);

  // 검색
  const [areaCode, setAreaCode] = useState("39"); // 0: 전체
  const [sigunguCode, setSigunguCode] = useState("4"); // 0: 전체
  const [searchKeyword, setSearchKeyword] = useState(""); // 키워드 포함시 출력(일치X 포함O)
  const [fee, setFee] = useState(0); // 0: 전체, 1: 무료
  const [restroom, setRestroom] = useState(0); // 0: 전체, 1: 화장실 있음
  const [accessible, setAccessible] = useState(0); // 0: 전체, 1: 장애인 편의 시설 있음
  const [parking, setParking] = useState(0); // 0: 전체, 1: 주차장 있음

  const [isWhereOpen, setIsWhereOpen] = useState(false); // true: 열림, false: 닫힘

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/attractions`, {
        params: {
          page: page,
          size: size,
          areaCode: areaCode,
          sigunguCode: sigunguCode,
          searchKeyword: searchKeyword,
          fee: fee,
          restroom: restroom,
          accessible: accessible,
          parking: parking,
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }, [
    page,
    areaCode,
    sigunguCode,
    searchKeyword,
    fee,
    restroom,
    accessible,
    parking,
  ]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/attractions/areaList`)
      .then((res) => {
        const areas = res.data;
        if (areas.length % 2 === 0) {
          setAreaList(areas);
        } else {
          setAreaList([...areas, {}]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/attractions/sigunguList/${areaCode}`,
      )
      .then((res) => {
        const sigungus = res.data;
        setSigunguList(sigungus);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [areaCode]);
  return (
    <>
      <section className={styles.attraction_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.select_where}>
            <div
              className={styles.select_where_title}
              onClick={() => {
                console.log("diq");
                setIsWhereOpen(!isWhereOpen);
              }}
            >
              <div>지역 선택</div>
              {isWhereOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </div>

            {isWhereOpen && (
              <div className={styles.select_where_content}>
                <div className={styles.select_where_content_areas}>
                  {areaList &&
                    areaList.map((item, index) => {
                      if (item.code) {
                        return (
                          <div
                            key={"area-" + index}
                            className={`${styles.select_where_content_area} ${index === areaList.length - 2 ? styles.select_where_content_area_bdrs : ""} ${String(item.code) === String(areaCode) ? styles.active : ""}`}
                            onClick={() => {
                              setAreaCode(item.code);
                            }}
                          >
                            {item.name}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={"area-" + index}
                            className={styles.select_where_content_area_null}
                          ></div>
                        );
                      }
                    })}
                </div>
                <div className={styles.select_where_content_sigungus}>
                  {sigunguList && (
                    <>
                      <div
                        key={"sigungu-all"}
                        className={styles.select_where_content_sigungu}
                      >
                        <div>
                          <input type="checkbox" id={"gunguAll"} />
                          <label htmlFor={"gunguAll"}>전체</label>
                        </div>
                      </div>

                      {sigunguList.map((item, index) => (
                        <div
                          key={"sigungu-" + index}
                          className={styles.select_where_content_sigungu}
                        >
                          <div>
                            <input type="checkbox" id={"gungu" + index} />
                            <label htmlFor={"gungu" + index}>{item.name}</label>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={styles.search_bar}>
            <div>
              <input type="text" />
              <SearchIcon />
            </div>
          </div>
          <div className={styles.category_bar}>
            <div className={styles.category}>
              <input type="checkbox" id="category_fee" />
              <label htmlFor="category_fee">무료</label>
            </div>
            <div className={styles.category}>
              <input type="checkbox" id="category_restroom" />
              <label htmlFor="category_restroom">화장실</label>
            </div>
            <div className={styles.category}>
              <input type="checkbox" id="category_accessible" />
              <label htmlFor="category_accessible">장애인편의시설</label>
            </div>
            <div className={styles.category}>
              <input type="checkbox" id="category_parking" />
              <label htmlFor="category_parking">주차장</label>
            </div>
          </div>
        </div>
        <Map></Map>
      </section>
    </>
  );
};

export default AttractionSearchPage;
