import styles from "./CourseUpdatePage.module.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import { AttractionSearchItem, InfoPage } from "./CourseWritePage";
import CourseInfo from "../../components/Course/CourseInfo";

const CourseUpdatePage = () => {
  //코스번호 가져오는 파람
  const params = useParams();
  const courseNo = params.courseNo;

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
    courseNo: "",
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

  //관광지 리스트 가져오는 GET요청
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/courses/attraction?keyword=${searchKeyword}&category=${category}&order=${order}&memberId=${memberId}`,
      )
      .then((res) => {
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [order, searchKeyword, category]);

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

  //업데이트할 코스 정보 조회
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/update/${courseNo}`)
      .then((res) => {
        setCourseInfo({
          ...courseInfo,
          courseTitle: res.data.courseTitle,
          courseContent: res.data.courseContent,
          courseNo: res.data.courseNo,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //업데이트할 코스 관광지 리스트 조회
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/courses/update/attraction/${courseNo}`,
      )
      .then((res) => {
        setCreateAttractionList(res.data);
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

  const updateCourse = () => {
    Swal.fire({
      title: "수정을 완료하겠습니까?",
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
            `${import.meta.env.VITE_BACKSERVER}/courses/update`,
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
            navigate(`/course/view/${courseNo}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
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
                설명수정
              </div>
              <div className={styles.create_btn} onClick={updateCourse}>
                수정완료
              </div>
            </div>
            {infoPage && (
              <InfoPage
                setInfoPage={setInfoPage}
                setCourseInfo={setCourseInfo}
                courseInfo={courseInfo}
                memberName={memberName}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CourseUpdatePage;
