import { useEffect, useState, useRef } from "react";
import Map from "../../components/attraction/Map";
import styles from "./AttractionSearchPage.module.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Pagination from "../../components/ui/Pagination";
import AttractionList from "../../components/Attraction/AttractionList";
import useAuthStore from "../../components/utils/useAuthStore";

const AttractionSearchPage = () => {
  const [areaList, setAreaList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [attractionList, setAttractionList] = useState([]);

  // 페이징 처리
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPage, setTotalPage] = useState(0);

  // 검색
  const [areaCode, setAreaCode] = useState("1"); // 0: 전체
  const [sigunguCode, setSigunguCode] = useState("0"); // 0: 전체
  const [searchKeyword, setSearchKeyword] = useState(""); // 키워드 포함시 출력(일치X 포함O)
  const [fee, setFee] = useState(0); // 0: 전체, 1: 무료
  const [restroom, setRestroom] = useState(0); // 0: 전체, 1: 화장실 있음
  const [accessible, setAccessible] = useState(0); // 0: 전체, 1: 장애인 편의 시설 있음
  const [parking, setParking] = useState(0); // 0: 전체, 1: 주차장 있음

  const [isWhereOpen, setIsWhereOpen] = useState(false); // true: 열림, false: 닫힘
  const whereRef = useRef(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const isAllChecked =
    sigunguList.length > 0 && checkedItems.length === sigunguList.length;

  const [wishList, setWishList] = useState([]);

  const { memberId, isReady } = useAuthStore();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/attractions/wishList/${memberId}`,
      )
      .then((res) => {
        setWishList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          checkedItems: checkedItems,
        },
      })
      .then((res) => {
        setAttractionList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, searchKeyword, fee, restroom, accessible, parking, checkedItems]);

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
        setSigunguList(res.data);
        setCheckedItems(res.data.map((item) => item.sigunguNo));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [areaCode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (whereRef.current && !whereRef.current.contains(e.target)) {
        setIsWhereOpen(false);
      }
    };

    if (isWhereOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWhereOpen]);

  const handleAllCheck = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(sigunguList.map((item) => item.sigunguNo));
    }
  };

  const handleSingleCheck = (sigunguNo) => {
    if (checkedItems.includes(sigunguNo)) {
      setCheckedItems(checkedItems.filter((el) => el !== sigunguNo));
    } else {
      setCheckedItems([...checkedItems, sigunguNo]);
    }
  };

  const handleWishToggle = (attractionNo) => {
    if (wishList.includes(attractionNo)) {
      axios
        .delete(
          `${import.meta.env.VITE_BACKSERVER}/attractions/wishList/${memberId}/${attractionNo}`,
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setWishList(wishList.filter((id) => id !== attractionNo));
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/attractions/wishList`, {
          memberId: memberId,
          attractionNo: attractionNo,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setWishList([...wishList, attractionNo]);
    }
  };

  const test = () => {
    console.log("diq");
  };

  return (
    <>
      <section className={styles.attraction_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.select_where}>
            <div
              className={styles.select_where_title}
              onClick={() => {
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
              <div className={styles.select_where_content} ref={whereRef}>
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
                              setSigunguCode(0);
                              setPage(0);
                              setSearchKeyword("");
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
                <div className={styles.select_where_content_sigungus_wrap}>
                  <div className={styles.select_where_content_sigungus}>
                    {sigunguList && (
                      <>
                        <div
                          key={"sigungu-all"}
                          className={styles.select_where_content_sigungu}
                        >
                          <div>
                            <input
                              type="checkbox"
                              id={"gunguAll"}
                              checked={isAllChecked}
                              onChange={handleAllCheck}
                            />
                            <label htmlFor={"gunguAll"}>전체</label>
                          </div>
                        </div>

                        {sigunguList.map((item, index) => (
                          <div
                            key={"sigungu-" + index}
                            className={styles.select_where_content_sigungu}
                          >
                            <div>
                              <input
                                type="checkbox"
                                id={"gungu" + index}
                                checked={checkedItems.includes(item.sigunguNo)}
                                onChange={() =>
                                  handleSingleCheck(item.sigunguNo)
                                }
                              />
                              <label htmlFor={"gungu" + index}>
                                {item.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div></div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.search_bar}>
            <div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
              />
              <SearchIcon />
            </div>
          </div>
          <div className={styles.category_bar}>
            <div className={styles.category}>
              <input
                type="checkbox"
                id="category_fee"
                checked={fee === 1}
                onChange={() => {
                  setFee(fee === 1 ? 0 : 1);
                  setPage(0);
                }}
              />
              <label htmlFor="category_fee">무료</label>
            </div>

            <div className={styles.category}>
              <input
                type="checkbox"
                id="category_restroom"
                checked={restroom === 1}
                onChange={() => {
                  setRestroom(restroom === 1 ? 0 : 1);
                  setPage(0);
                }}
              />
              <label htmlFor="category_restroom">화장실</label>
            </div>

            <div className={styles.category}>
              <input
                type="checkbox"
                id="category_accessible"
                checked={accessible === 1}
                onChange={() => {
                  setAccessible(accessible === 1 ? 0 : 1);
                  setPage(0);
                }}
              />
              <label htmlFor="category_accessible">장애인편의시설</label>
            </div>

            <div className={styles.category}>
              <input
                type="checkbox"
                id="category_parking"
                checked={parking === 1}
                onChange={() => {
                  setParking(parking === 1 ? 0 : 1);
                  setPage(0);
                }}
              />
              <label htmlFor="category_parking">주차장</label>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <Map></Map>
          <div className={styles.content_right}>
            <div className={styles.content_list_wrap}>
              {attractionList.length !== 0 ? (
                attractionList.map((item, index) => {
                  const infoStr = `${item.attractionHoliday ? "휴무일: " + item.attractionHoliday + " | " : ""}${item.attractionFee ? "이용요금: " + item.attractionFee + " | " : ""}${item.attractionRestroom ? "화장실: " + item.attractionRestroom + " | " : ""}${item.attractionAccessible ? "장애인편의시설: " + item.attractionAccessible + " | " : ""}${item.attractionParking ? "주차장: " + item.attractionParking + " | " : ""}${item.tel ? "기타문의: " + item.tel : ""}`;
                  return (
                    <AttractionList
                      attractionNo={item.attractionNo}
                      title={item.title}
                      subtitle={
                        item.attractionDesignation && item.attractionDesignation
                      }
                      info={infoStr}
                      thumb={item.mainimage}
                      isLiked={wishList.includes(item.attractionNo)}
                      handleWishToggle={handleWishToggle}
                      test={test}
                      key={"attractionList-" + index}
                    />
                  );
                })
              ) : (
                <div className={styles.content_empty}>
                  관광지 정보가 존재하지 않습니다.
                </div>
              )}
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              totalPage={totalPage}
              naviSize={5}
            />
          </div>
        </div>
      </section>
      <section className={styles.attraction_detail_wrap}>
        <div className={styles.attraction_detail_popup}>
          <div className={styles.detail_menubar}>
            <div className={styles.detail_mini}>
              <div>INFO</div>
              <div>REVIEW</div>
            </div>
            <div className={styles.detail_cancle}></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AttractionSearchPage;
