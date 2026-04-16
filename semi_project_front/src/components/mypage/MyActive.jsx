import { useEffect, useState } from "react";
import styles from "./MyActive.module.css";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import MyBoardList from "./mycontentcomponents/MyBoardList";
import Pagination from "../ui/Pagination";
import CourseList from "../Course/CourseList";
import MyCommentList from "./mycontentcomponents/MyCommentList";
import Swal from "sweetalert2";

const MyActive = () => {
  const [tab, setTab] = useState("myBoard");
  const { memberId } = useAuthStore();

  const [myBoardList, setMyBoardList] = useState([]);
  const [myCommentList, setMyCommentList] = useState([]);
  const [myCourseList, setMyCourseList] = useState([]);

  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(1);
  const [size, setSize] = useState(9);

  const orderChange = (e) => {
    setOrder(Number(e.target.value));
    setPage(0); //정렬 바뀌면 첫 페이지부터
  };

  useEffect(() => {
    //내 게시글 조회
    if (tab === "myBoard" && { memberId }) {
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/members/my-board?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
        )
        .then((res) => {
          console.log(res);
          setMyBoardList(res.data.items);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //내 댓글 조회
    if (tab === "myComment" && { memberId }) {
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/members/my-comment?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
        )
        .then((res) => {
          console.log(res);
          setMyCommentList(res.data.items);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //내 코스 조회
    if (tab === "myCourse" && { memberId }) {
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/members/my-course?order=${order}&memberId=${memberId}&page=${page}&size=${size}`,
        )
        .then((res) => {
          console.log(res);
          setMyCourseList(res.data.items);
          setTotalPage(res.data.totalPage);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tab, order, page, size, memberId]);

  // 댓글 수정 함수
  const updateComment = (modifyComment, index) => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/comments`,
        modifyComment,
      )
      .then((res) => {
        if (res.data > 0) {
          const newList = [...myCommentList];
          newList[index].boardCommentContent =
            modifyComment.boardCommentContent;
          setMyCommentList(newList);
          Swal.fire({
            icon: "success",
            title: "수정 완료",
            confirmButtonColor: "var(color1)",
          });
        }
      });
  };

  // 댓글 삭제 함수
  const deleteComment = (commentNo) => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/members/comments/${commentNo}`,
      )
      .then((res) => {
        if (res.data > 0) {
          setMyCommentList(
            myCommentList.filter((c) => c.boardCommentNo !== commentNo),
          );
          Swal.fire({
            icon: "success",
            title: "삭제 완료",
            confirmButtonColor: "var(color1)",
          });
        }
      });
  };

  return (
    <section className={styles.active_wrap}>
      <h3 className={styles.page_title}>내 활동 관리</h3>
      <div className={styles.my_active_wrap}>
        <div className={styles.active_tab_wrap}>
          <span
            className={tab === "myBoard" ? styles.active_tab : ""}
            onClick={() => {
              setTab("myBoard");
              setPage(0);
            }}
          >
            내 게시글
          </span>
          <span
            className={tab === "myComment" ? styles.active_tab : ""}
            onClick={() => {
              setTab("myComment");
              setPage(0);
            }}
          >
            내 댓글
          </span>
          <span
            className={tab === "myCourse" ? styles.active_tab : ""}
            onClick={() => {
              setTab("myCourse");
              setPage(0);
            }}
          >
            내 관광 코스
          </span>
        </div>

        <div className={styles.order_select_wrap}>
          <select
            className={styles.order_select}
            value={order}
            onChange={orderChange}
          >
            <option value={1}>최신순</option>
            <option value={2}>작성순</option>
          </select>
        </div>
      </div>

      <div className={styles.my_content_wrap}>
        {/* 내 게시글 */}
        {tab === "myBoard" &&
          (myBoardList.length > 0 ? (
            <MyBoardList boardList={myBoardList} />
          ) : (
            <div className={styles.content_empty}>
              작성한 게시글이 없습니다.
            </div>
          ))}

        {/* 내 댓글 */}
        {tab === "myComment" &&
          (myCommentList.length > 0 ? (
            <div className={styles.comment_list_container}>
              {myCommentList.map((comment, index) => (
                <MyCommentList
                  key={"comment-" + comment.boardCommentNo}
                  comment={comment}
                  index={index}
                  updateComment={updateComment}
                  deleteComment={deleteComment}
                />
              ))}
            </div>
          ) : (
            <div className={styles.content_empty}>작성한 댓글이 없습니다.</div>
          ))}

        {/* 내 관광 코스 */}
        {tab === "myCourse" &&
          (myCourseList.length > 0 ? (
            <CourseList courseList={myCourseList} />
          ) : (
            <div className={styles.content_empty}>작성한 코스가 없습니다.</div>
          ))}
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          naviSize={5}
        />
      </div>
    </section>
  );
};

export default MyActive;
