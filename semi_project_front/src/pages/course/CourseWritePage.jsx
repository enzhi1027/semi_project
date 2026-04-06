import { useEffect, useState } from "react";
import styles from "./CourseWritePage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import testImg from "../../assets/img/mainPage/main.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CourseInfo from "../../components/Course/CourseInfo";

const CourseWritePage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [category, setCategory] = useState("서울");
  const [order, setOrder] = useState(0);
  //가져온 리스트 중 추가할 관광지 리스트 저장 할 스테이트
  const [addAttractionList, setAddAttractionList] = useState([]);
  //관광지 리스트 조회해서 넣어두는 스테이트
  const [attractionList, setAttractionList] = useState([
    {
      attractionNo: 1,
      courseIndex: 1,
      attractionAddr: "서울특별시 도봉구 도봉산길 86",
      attractionThumb:
        "http://tong.visitkorea.or.kr/cms/resource/43/2547043_image2_1.jpg",
      attractionSummary:
        "관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~관광지 설명~~",
      attractionPhone: "02-901-0700",
      attractionTitle: "북한산 생태탐방연수원",
    },
    {
      attractionNo: 2,
      courseIndex: 2,
      attractionAddr: "서울특별시 성북구 보국문로 262 (정릉동)",
      attractionThumb:
        "http://tong.visitkorea.or.kr/cms/resource/72/2526672_image2_1.jpg",
      attractionSummary: "관광지 설명~~",
      attractionPhone: "02-901-0700",
      attractionTitle: "북한산국립공원",
    },
    {
      attractionNo: 3,
      courseIndex: 3,
      attractionAddr: "서울특별시 송파구 올림픽로 383",
      attractionThumb:
        "http://tong.visitkorea.or.kr/cms/resource/42/2547042_image2_1.jpg",
      attractionSummary: "관광지 설명~~",
      attractionPhone: "02-901-0700",
      attractionTitle: "토성산성 어울길",
    },
  ]);

  const addCourseList = () => {};
  return (
    <>
      <div className={styles.main_wrap}>
        <section className={styles.attraction_search_wrap}>
          <div className={styles.attraction_list}>
            {attractionList.map((attraction, index) => {
              return (
                <AttractionItem
                  key={"key-" + index}
                  attraction={attraction}
                  setAddAttractionList={setAddAttractionList}
                  addAttractionList={addAttractionList}
                />
              );
            })}
          </div>
          <div className={styles.attraction_search}>
            <div className={styles.search_content_wrap}>
              <div className={styles.search_wrap}>
                <form
                  className={styles.input_wrap}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearchKeyword(keyword);
                    console.log(searchKeyword);
                  }}
                >
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                  <button className={styles.search_btn} type="submit">
                    <SearchIcon />
                  </button>
                </form>
              </div>
              <div className={styles.category_wrap}>
                <p
                  className={category === "서울" ? styles.active : ""}
                  onClick={() => {
                    setCategory("서울");
                  }}
                >
                  #서울
                </p>
                <p
                  className={category === "부산" ? styles.active : ""}
                  onClick={() => {
                    setCategory("부산");
                  }}
                >
                  #부산
                </p>
                <p
                  className={category === "대구" ? styles.active : ""}
                  onClick={() => {
                    setCategory("대구");
                  }}
                >
                  #대구
                </p>
                <p
                  className={category === "인천" ? styles.active : ""}
                  onClick={() => {
                    setCategory("인천");
                  }}
                >
                  #인천
                </p>

                <p
                  className={category === "광주" ? styles.active : ""}
                  onClick={() => {
                    setCategory("광주");
                  }}
                >
                  #광주
                </p>
                <p
                  className={category === "대전" ? styles.active : ""}
                  onClick={() => {
                    setCategory("대전");
                  }}
                >
                  #대전
                </p>
                <p
                  className={category === "울산" ? styles.active : ""}
                  onClick={() => {
                    setCategory("울산");
                  }}
                >
                  #울산
                </p>
                <p
                  className={category === "세종특별자치시" ? styles.active : ""}
                  onClick={() => {
                    setCategory("세종특별자치시");
                  }}
                >
                  #세종
                </p>
                <p
                  className={category === "경기도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("경기도");
                  }}
                >
                  #경기
                </p>
                <p
                  className={category === "강원특별자치도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("강원특별자치도");
                  }}
                >
                  #강원
                </p>
                <p
                  className={category === "충청북도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("충청북도");
                  }}
                >
                  #충북
                </p>
                <p
                  className={category === "충청남도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("충청남도");
                  }}
                >
                  #충남
                </p>
                <p
                  className={category === "경상북도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("경상북도");
                  }}
                >
                  #경북
                </p>
                <p
                  className={category === "경상남도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("경상남도");
                  }}
                >
                  #경남
                </p>
                <p
                  className={category === "전북특별자치도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("전북특별자치도");
                  }}
                >
                  #전북
                </p>
                <p
                  className={category === "전라남도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("전라남도");
                  }}
                >
                  #전남
                </p>
                <p
                  className={category === "제주특별자치도" ? styles.active : ""}
                  onClick={() => {
                    setCategory("제주특별자치도");
                  }}
                >
                  #제주
                </p>
              </div>
              <div className={styles.order_wrap}>
                <div
                  className={order === 0 ? styles.order_active : ""}
                  onClick={() => {
                    setOrder(0);
                  }}
                >
                  전체목록
                </div>
                <div
                  className={order === 1 ? styles.order_active : ""}
                  onClick={() => {
                    setOrder(1);
                  }}
                >
                  찜목록
                </div>
              </div>
            </div>
            <div className={styles.button_wrap} onClick={addCourseList()}>
              <div>추가하기</div>
            </div>
          </div>
        </section>
        {attractionList.length !== 0 && (
          <>
            <section className={styles.courseInfo_wrap}>
              <CourseInfo
                attractionList={attractionList}
                listLength={attractionList.length}
              />
            </section>
            <div className={styles.create_btn_wrap}>
              <div className={styles.summary_btn}>설명작성</div>
              <div className={styles.create_btn}>생성하기</div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const AttractionItem = ({
  attraction,
  setAddAttractionList,
  addAttractionList,
}) => {
  const checkbox = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setAddAttractionList((prev) => [...prev, value]);
    } else {
      setAddAttractionList((prev) => prev.filter((item) => item !== value));
    }
  };

  return (
    <>
      <div className={styles.attraction_wrap}>
        <div className={styles.attraction_select}>
          <input
            type="checkbox"
            value={attraction.attractionNo}
            onChange={checkbox}
          />
        </div>
        <div className={styles.attraction_img}>
          <img src={attraction.attractionThumb} />
        </div>
        <div className={styles.attraction_content}>
          <h3>{attraction.attractionTitle}</h3>
          <p>기타문의 : {attraction.attractionPhone}</p>
          <p>{attraction.attractionAddr}</p>
        </div>
        <div className={styles.attraction_like}>
          <FavoriteBorderIcon />
        </div>
      </div>
    </>
  );
};

export default CourseWritePage;
