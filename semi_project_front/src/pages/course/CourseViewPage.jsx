import { useEffect, useRef, useState } from "react";
import styles from "./CourseViewPage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import CourseInfo from "../../components/Course/CourseInfo";
import Swal from "sweetalert2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const CourseViewPage = () => {
  //주소에 있는 코스번호 가저오는 파람
  const params = useParams();
  const courseNo = params.courseNo;

  //로그인정보
  const { memberId } = useAuthStore();

  //코스제목 저장하는 스테이트
  const [courseTitle, setCourseTitle] = useState(null);

  //코스의 관광지 리스트 저장하는 스테이트
  const [attractionList, setAttractionList] = useState([]);

  //페이지이동을 위한 네비게이트
  const navigate = useNavigate();

  //코스 좋아요 스테이트
  const [like, setLike] = useState(0);

  //코스 관광지 리스트 가져오는 GET요청
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/${courseNo}`)
      .then((res) => {
        setAttractionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [like]);

  //코스 제목 가져오는 GET요청
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/courses/courseTitle/${courseNo}`)
      .then((res) => {
        setCourseTitle(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //코스 삭제 버튼 클릭시 뜨는 알림 -> 확인 시 코스 삭제하는 DELETE요청
  const deleteCourse = () => {
    Swal.fire({
      title: "코스를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color2)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/courses/${courseNo}`)
          .then((res) => {
            if (res.data !== 0) {
              navigate(`/course/list`);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  //코스 수정 버튼 클릭시 뜨는 알림 -> 확인 시 코스 수정페이지로 이동
  const courseUpdate = () => {
    Swal.fire({
      title: "코스를 수정하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color2)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/course/update/${courseNo}`);
      }
    });
  };

  //코스 좋아요 여부 확인하는 요청
  useEffect(() => {
    if (
      memberId &&
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/courses/courseView?memberId=${memberId}&courseNo=${courseNo}`,
        )
        .then((res) => {
          setLike(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }, []);

  //좋아요 해제하는 함수 - 좋아요 삭제하는 DELETE요청
  const likeOff = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/courses?memberId=${memberId}&courseNo=${courseNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          setLike(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //좋아요 하는 함수 - 좋아요 추가하는 POST요청
  const likeOn = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/courses?memberId=${memberId}&courseNo=${courseNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          setLike(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //로그인 했을때만 좋아요 누를 수 있도록 알림
  const loginMsg = () => {
    Swal.fire({
      title: "로그인 후 이용 가능합니다.",
      icon: "info",
    });
  };

  return (
    <section className={styles.course_view_wrap}>
      {attractionList.length !== 0 && (
        <>
          <div className={styles.page_title_wrap}>
            <div className={styles.title_wrap}>
              <h3 className={styles.page_title_index}>
                {attractionList.length + "코스"}
              </h3>
              <h3 className={styles.page_title}>{courseTitle}</h3>
            </div>

            <div className={styles.title_content}>
              <div className={styles.course_like_count}>
                {like === 0 ? (
                  <>
                    <FavoriteBorderIcon
                      onClick={memberId ? likeOn : loginMsg}
                    />
                    <p>{attractionList[0].likeCount}</p>
                  </>
                ) : (
                  <>
                    <FavoriteIcon
                      onClick={memberId ? likeOff : loginMsg}
                      sx={{ fill: "var(--color1)" }}
                    />
                    <p>{attractionList[0].likeCount}</p>
                  </>
                )}
              </div>

              <div className={styles.course_writer}>
                <p>{"작성자 | " + attractionList[0].courseWriterName}</p>
              </div>
            </div>
          </div>
          <div className={styles.summary_wrap}>
            <div className={styles.course_summary}>
              {attractionList[0].courseContent}
            </div>
          </div>
        </>
      )}
      <div className={styles.attraction_item_wrap}>
        {attractionList.map((attraction, index) => {
          return (
            <AttractionItem key={"key-" + index} attraction={attraction} />
          );
        })}
      </div>
      <CourseInfo
        attractionList={attractionList}
        listLength={attractionList.length}
      />
      {attractionList.length !== 0 && (
        <div className={styles.delete_btn}>
          {memberId === attractionList[0].courseWriter && (
            <>
              <Button className="btn cancel" onClick={deleteCourse}>
                코스 삭제하기
              </Button>
              <Button className="btn" onClick={courseUpdate}>
                코스 수정하기
              </Button>
            </>
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
            <div className={styles.attraction_addr}>
              {"[ " + attraction.attractionAddr + " ]"}
            </div>
            <div
              className={styles.attraction_content}
              dangerouslySetInnerHTML={{
                __html: attraction.attractionSummary,
              }}
            ></div>
          </div>
          <div className={styles.img_wrap}>
            <img
              src={
                attraction.attractionThumb
                  ? attraction.attractionThumb
                  : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              }
            />
          </div>
        </div>
      ) : (
        <div className={styles.attraction_wrap}>
          <div className={styles.img_wrap}>
            <img
              src={
                attraction.attractionThumb
                  ? attraction.attractionThumb
                  : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              }
            />
          </div>
          <div className={styles.content_wrap}>
            <div className={styles.content_title}>
              <div>
                <p>{attraction.courseIndex}</p>
              </div>
              <h3>{attraction.attractionTitle}</h3>
            </div>
            <div className={styles.attraction_addr}>
              {"[ " + attraction.attractionAddr + " ]"}
            </div>
            <div
              className={styles.attraction_content}
              dangerouslySetInnerHTML={{
                __html: attraction.attractionSummary,
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseViewPage;
export { AttractionItem };
