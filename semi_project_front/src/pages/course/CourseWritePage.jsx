import { useEffect, useRef, useState } from "react";
import styles from "./CourseWritePage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CourseInfo from "../../components/Course/CourseInfo";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const CourseWritePage = () => {
  //관광지 검색할때 인풋에 들어가는 벨류 스테이트
  const [keyword, setKeyword] = useState("");

  //인풋에 입력하고 폼이 서브밋 될때 요청에 실제로 들어가는 스테이트
  const [searchKeyword, setSearchKeyword] = useState("");

  //관광지의 지역 정하는 스테이트
  const [category, setCategory] = useState("서울");

  //전체목록이랑 찜목록 - 0:전체, 1:찜
  const [order, setOrder] = useState(0);

  //가져온 리스트 중 추가할 관광지 리스트 저장 할 스테이트
  const [addAttractionList, setAddAttractionList] = useState([]);

  //관광지 리스트 조회해서 넣어두는 스테이트
  const [attractionList, setAttractionList] = useState([]);

  //실제 코스 목록으로 출력되는 관광지 리스트 스테이트
  const [createAttractionList, setCreateAttractionList] = useState([]);

  //로그인상태
  const { memberId, isReady } = useAuthStore();

  //코스 설명에 들어가는 작성자이름
  const [memberName, setMemberName] = useState(null);

  //코스 설명 저장할 스테이트
  const [courseInfo, setCourseInfo] = useState({
    courseTitle: "",
    courseContent: "",
    courseWriter: memberId,
  });

  //설명 창 띄우고 닫기 위한 스테이트
  const [infoPage, setInfoPage] = useState(false);

  //페이지이동을 위한 네비게이트
  const navigate = useNavigate();

  //로그인한 상태에서만 코스생성 가능
  useEffect(() => {
    if (isReady && memberId == null) {
      Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "warning" }).then(
        () => {
          navigate("/login");
        },
      );
    }
  }, [isReady, memberId]);

  //생성하기 버튼 클릭시 설명 작성여부 확인, 확인 후 코스 생성 여부 묻고 확인 시 POST요청
  const createCourse = () => {
    if (courseInfo.courseTitle === "" || courseInfo.courseContent === "") {
      Swal.fire({
        title: "코스설명을 작성해주세요",
        icon: "warning",
      });
      return;
    }
    Swal.fire({
      title: "코스를 생성하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color2)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_BACKSERVER}/courses/insert`,
            {
              courseInfo: courseInfo,
              attractionList: createAttractionList,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          )
          .then((res) => {
            if (res.data === 0) {
              return;
            }
            navigate(`/course/view/${res.data}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  //관광지 리스트 가져오는 GET요청
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/courses/attraction?keyword=${keyword}&category=${category}&order=${order}&memberId=${memberId}`,
      )
      .then((res) => {
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [order, searchKeyword, category, keyword]);

  //현재 접속한 멤버의 유저이름 가져오는 GET요청
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

  //추가하기 버튼 눌렀을때 밑에 코스 출력
  const addCourseList = () => {
    setCreateAttractionList((prev) => {
      const merged = [...prev, ...addAttractionList];
      const unique = merged.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.attractionNo === item.attractionNo),
      );
      return unique;
    });
    setAddAttractionList([]);
  };

  return (
    <>
      <div className={styles.main_wrap}>
        <AttractionSearchItem
          attractionList={attractionList}
          addAttractionList={addAttractionList}
          setAddAttractionList={setAddAttractionList}
          setCreateAttractionList={setCreateAttractionList}
          addCourseList={addCourseList}
          keyword={keyword}
          setKeyword={setKeyword}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          category={category}
          setCategory={setCategory}
          order={order}
          setOrder={setOrder}
        />

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
              <InfoPage
                setInfoPage={setInfoPage}
                setCourseInfo={setCourseInfo}
                courseInfo={courseInfo}
                memberName={memberName}
                infoPage={infoPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

const AttractionSearchItem = ({
  attractionList,
  addAttractionList,
  setAddAttractionList,
  setCreateAttractionList,
  addCourseList,
  keyword,
  setKeyword,
  searchKeyword,
  setSearchKeyword,
  category,
  setCategory,
  order,
  setOrder,
}) => {
  const [toggleBtn, setToggleBtn] = useState(false);
  return (
    <>
      <section
        className={
          toggleBtn
            ? `${styles.attraction_search_wrap} ${styles.big}`
            : styles.attraction_search_wrap
        }
      >
        <div className={styles.attraction_list_wrap}>
          <div className={styles.attraction_list}>
            {attractionList.length === 0 && (
              <div
                className={
                  toggleBtn
                    ? styles.search_none_text_big
                    : styles.search_none_text
                }
              >
                <p>일치하는 검색 결과를 찾을 수 없습니다.</p>
              </div>
            )}
            {attractionList.map((attraction, index) => {
              return (
                <AttractionItem
                  key={"key-" + attraction.attractionNo}
                  attraction={attraction}
                  setAddAttractionList={setAddAttractionList}
                  addAttractionList={addAttractionList}
                />
              );
            })}
          </div>
          <button
            className={styles.toggle_btn}
            onClick={() => {
              setToggleBtn(!toggleBtn);
            }}
          >
            {toggleBtn ? "▲ 줄이기" : "▼ 늘리기"}
          </button>
        </div>
        <div className={styles.attraction_search}>
          <div className={styles.search_content_wrap}>
            <div className={styles.search_wrap}>
              <form
                className={styles.input_wrap}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchKeyword(keyword);
                  setKeyword("");
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
    </>
  );
};

const InfoPage = ({
  setInfoPage,
  setCourseInfo,
  courseInfo,
  memberName,
  infoPage,
}) => {
  return (
    <>
      <div className={styles.course_info_page_wrap}>
        <div className={styles.course_info_page}>
          <h3>설명작성</h3>
          <CloseIcon
            className={styles.close_icon}
            onClick={() => {
              setInfoPage(false);
            }}
          />
          <div className={styles.info_input_wrap}>
            <label htmlFor="courseTitle">코스제목</label>
            <input
              type="text"
              id="courseTitle"
              value={courseInfo.courseTitle}
              maxLength={30}
              placeholder="최대 30자 입력"
              onChange={(e) => {
                if (e.target.value.length <= 30) {
                  setCourseInfo({
                    ...courseInfo,
                    courseTitle: e.target.value,
                  });
                }
              }}
            />
          </div>
          <div className={styles.info_input_wrap}>
            <label>작성자</label>
            <input type="text" value={memberName} disabled={true} />
          </div>
          <div className={styles.info_course_summary}>
            <label htmlFor="courseSummary">코스설명</label>
            <textarea
              id="courseSummary"
              value={courseInfo.courseContent}
              maxLength={300}
              placeholder="최대 300자 입력"
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setCourseInfo({
                    ...courseInfo,
                    courseContent: e.target.value,
                  });
                }
              }}
            ></textarea>
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
    </>
  );
};

const AttractionItem = ({
  attraction,
  setAddAttractionList,
  addAttractionList,
}) => {
  //체크박스가 체크될때랑 안될때 리스트에 추가하고 삭제하는 함수
  const checkbox = (e) => {
    if (e.target.checked) {
      setAddAttractionList((prev) => [...prev, attraction]);
    } else {
      setAddAttractionList((prev) =>
        prev.filter((item) => item !== attraction),
      );
    }
  };

  //체크박스 지정하는 REF
  const checkRef = useRef();

  //관광지 리스트 눌렀을때 체크박스 눌리는 함수
  const check = () => {
    checkRef.current.click();
  };

  //체크박스의 체크 상태를 정하는 함수
  const existsCheck = () => {
    let data = false;
    for (let i = 0; i < addAttractionList.length; i++) {
      if (addAttractionList[i].attractionNo === attraction.attractionNo) {
        data = true;
        break;
      }
    }
    return data;
  };
  return (
    <>
      <div className={styles.attraction_wrap}>
        <div className={styles.attraction_select}>
          <input
            type="checkbox"
            onChange={checkbox}
            ref={checkRef}
            checked={existsCheck()}
          />
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
          <p>
            기타문의 :{" "}
            {attraction.attractionPhone ? attraction.attractionPhone : "없음"}
          </p>
          <p>{attraction.attractionAddr}</p>
        </div>
        <div className={styles.attraction_like}>
          {attraction.isLike === 1 ? (
            <FavoriteIcon sx={{ fill: "var(--color1)" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
      </div>
    </>
  );
};

export { AttractionItem, AttractionSearchItem, InfoPage };
export default CourseWritePage;
