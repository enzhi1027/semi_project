import { Link } from "react-router-dom";
import useAuthStore from "../../utils/useAuthStore";
import styles from "./MyCommentList.module.css";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { TextArea } from "../../../components/ui/Form";
import Swal from "sweetalert2";

const MyCommentList = ({ comment, index, updateComment, deleteComment }) => {
  const { memberId } = useAuthStore();
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyComment, setModifyComment] = useState({
    boardCommentContent: comment.boardCommentContent,
    boardCommentNo: comment.boardCommentNo,
  });

  //수정 후 리스트 갱신 시 내부 state 맞춰주기
  useEffect(() => {
    setModifyComment({
      boardCommentContent: comment.boardCommentContent,
      boardCommentNo: comment.boardCommentNo,
    });
  }, [comment]);

  //카테고리
  const categoryName = {
    1: "Review",
    2: "Forum",
  };

  //비공개 댓글 체크용
  const isHidden = comment.commentStatus === 0;

  return (
    <section className={styles.my_comment_list_wrap}>
      <ul className={styles.my_comment_item}>
        {/* 게시글 정보(카테고리, 제목, 작성자, 작성일) */}
        <li className={styles.board_info_header_wrap}>
          <div className={styles.board_title_wrap}>
            {/* 카테고리, 제목 */}
            <Link
              to={`/board/view/${comment.boardNo}`}
              className={styles.board_link}
            >
              [{categoryName[comment.boardCategory] || comment.boardCategory}]
              {comment.boardTitle}
            </Link>
          </div>
          {/* 작성자, 작성일 */}
          <div className={styles.date_and_writer}>
            <div className={styles.board_date}>
              작성일 : {comment.boardDate}
            </div>
            <div className={styles.board_writer}>
              작성자 : {comment.boardWriter}
            </div>
          </div>
        </li>

        {/* 댓글 정보 및 수정, 삭제 버튼 */}
        <li className={styles.comment_info}>
          <div className={styles.comment_meta}>
            <span className={styles.comment_date}>
              댓글 작성일 : {comment.boardCommentDate}
            </span>
          </div>

          <div className={styles.button_wrap}>
            {!isHidden &&
              (isModifyMode ? (
                <>
                  <Button
                    className="btn"
                    onClick={() => {
                      updateComment(modifyComment, index);
                      setIsModifyMode(false);
                    }}
                  >
                    완료
                  </Button>
                  <Button
                    className="btn"
                    onClick={() => {
                      setModifyComment({
                        ...modifyComment,
                        boardCommentContent: comment.boardCommentContent,
                      });
                      setIsModifyMode(false);
                    }}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <Button className="btn" onClick={() => setIsModifyMode(true)}>
                  수정
                </Button>
              ))}
            <Button
              className="btn cancel"
              onClick={() => {
                Swal.fire({
                  title: "댓글을 삭제하시겠습니까?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "삭제",
                  cancelButtonText: "취소",
                  confirmButtonColor: "var(--primary)",
                  cancelButtonColor: "var(--danger)",
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteComment(comment.boardCommentNo);
                  }
                });
              }}
            >
              삭제
            </Button>
          </div>
        </li>

        {/* 댓글 본문 */}
        <li className={styles.comment_content}>
          <div className={isHidden ? styles.comment_hidden_wrap : ""}>
            {isHidden && (
              <p
                className={styles.admin_notice}
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginBottom: "5px",
                  fontSize: "14px",
                }}
              >
                * 이 댓글은 관리자에 의해 비공개 처리되었습니다. (수정 불가)
              </p>
            )}
            <TextArea
              value={modifyComment.boardCommentContent}
              onChange={(e) => {
                setModifyComment({
                  ...modifyComment,
                  boardCommentContent: e.target.value,
                });
              }}
              disabled={isHidden || !isModifyMode}
              className={`${isHidden ? styles.blocked_content : ""} ${isModifyMode ? styles.editing : ""}`}
            ></TextArea>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default MyCommentList;
