import { useEffect, useRef, useState } from "react";
import styles from "./CourseWritePage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import testImg from "../../assets/img/mainPage/main.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CourseInfo from "../../components/Course/CourseInfo";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";

const CourseWritePage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [category, setCategory] = useState("서울");
  const [order, setOrder] = useState(0);

  //가져온 리스트 중 추가할 관광지 리스트 저장 할 스테이트
  const [addAttractionList, setAddAttractionList] = useState([]);
  //관광지 리스트 조회해서 넣어두는 스테이트
  const [attractionList, setAttractionList] = useState([]);
  //실제 코스 목록으로 출력되는 관광지 리스트 스테이트
  const [createAttractionList, setCreateAttractionList] = useState([]);

  const { memberId } = useAuthStore();
  const [memberName, setMemberName] = useState(null);
  const [courseInfo, setCourseInfo] = useState({
    courseTitle: "",
    courseSummary: "",
    courseWriter: memberName,
  });
  const [infoPage, setInfoPage] = useState(false);

  const [checkState, setCheckState] = useState([]);
  const createCourse = () => {
    if (courseInfo.courseTitle === "" || courseInfo.courseSummary === "") {
      Swal.fire({
        title: "코스설명을 작성해주세요",
        icon: "warning",
      });
    }
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/courses/attraction?keyword=${searchKeyword}&category=${category}&order=${order}`,
      )
      .then((res) => {
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [order, searchKeyword, category]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/member/${memberId}`)
      .then((res) => {
        setMemberName(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addCourseList = () => {
    setCreateAttractionList((prev) => [...prev, ...addAttractionList]);
    setAddAttractionList([]);
  };
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
                  index={index}
                  checkState={checkState}
                  setCheckState={setCheckState}
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
            <div className={styles.button_wrap} onClick={addCourseList}>
              <div>추가하기</div>
            </div>
          </div>
        </section>
        {createAttractionList.length !== 0 && (
          <>
            <section className={styles.courseInfo_wrap}>
              <CourseInfo
                attractionList={createAttractionList}
                setCreateAttractionList={setCreateAttractionList}
                listLength={createAttractionList.length}
                setAddAttractionList={setAddAttractionList}
              />
            </section>
            <div className={styles.create_btn_wrap}>
              <div
                className={styles.summary_btn}
                onClick={() => {
                  setInfoPage(true);
                }}
              >
                설명작성
              </div>
              <div className={styles.create_btn} onClick={createCourse}>
                생성하기
              </div>
            </div>
            {infoPage && (
              <div className={styles.course_info_page_wrap}>
                <div className={styles.course_info_page}>
                  <h3>설명작성</h3>
                  <div className={styles.info_input_wrap}>
                    <label>코스제목</label>
                    <input type="text" />
                  </div>
                  <div className={styles.info_input_wrap}>
                    <label>작성자</label>
                    <input
                      type="text"
                      value={courseInfo.courseWriter}
                      readOnly
                    />
                  </div>
                  <div className={styles.info_course_summary}>
                    <p>코스설명</p>
                    <textarea></textarea>
                  </div>
                  <div
                    className={styles.info_create_btn}
                    onClick={() => {
                      setInfoPage(false);
                    }}
                  >
                    작성완료
                  </div>
                </div>
              </div>
            )}
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
  index,
  checkState,
  setCheckState,
}) => {
  const checkbox = (e) => {
    if (e.target.checked) {
      setAddAttractionList((prev) => [...prev, attraction]);
    } else {
      setAddAttractionList((prev) =>
        prev.filter((item) => item !== attraction),
      );
    }
  };

  const checkRef = useRef();
  const check = () => {
    checkRef.current.click();
  };

  return (
    <>
      <div className={styles.attraction_wrap}>
        <div className={styles.attraction_select}>
          <input type="checkbox" onChange={checkbox} ref={checkRef} />
        </div>
        <div className={styles.attraction_img}>
          <img
            src={
              attraction.attractionThumb
                ? attraction.attractionThumb
                : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
            }
          />
        </div>
        <div className={styles.attraction_content} onClick={check}>
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
