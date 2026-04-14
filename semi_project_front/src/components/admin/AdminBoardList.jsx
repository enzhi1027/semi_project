import styles from "./AdminBoardList.module.css";
import defaultImage from "../../assets/img/board/image.png";
import userImage from "../../assets/img/board/user.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Swal from "sweetalert2";

const AdminBoardList = ({ boardList }) => {
  return (
    <ul className={styles.board_list_wrap}>
      {boardList.map((board) => {
        return <BoardItem key={`board-list-${board.boardNo}`} board={board} />;
      })}
    </ul>
  );
};

const BoardItem = ({ board }) => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false); // 게시글 내용 토글 상태
  const [content, setContent] = useState(""); // 본문 내용
  const [isLoading, setIsLoading] = useState(false); //로딩 상태 관리

  const [boardStatus, setBoardStatus] = useState(board.boardStatus);

  const changeStatus = () => {
    const newStatus = boardStatus === 1 ? 2 : 1;

    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/admin/board/status`, {
        boardNo: board.boardNo,
        boardStatus: board.boardStatus,
      })
      .then((res) => {
        Swal.fire({
          title: "게시글 상태를 변경하시겠습니까?",
          icon: "question",
          confirmButtonColor: "var(--color1)",
          confirmButtonText: "변경하기",
          showCancelButton: true,
          cancelButtonColor: "var(--gray4)",
          cancelButtonText: "취소",
        }).then((res) => {
          if (res.isConfirmed) {
            setBoardStatus(newStatus);
            Swal.fire({
              title: "상태가 변경되었습니다.",
              icon: "success",
            });
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "변경이 실패했습니다.",
          icon: "error",
        });
      });
  };

  const getCategoryName = (category) => {
    if (category === 1) return "Review";
    if (category === 2) return "Forum";
    return "";
  };

  //본문 요약 클릭 시 해당 게시글 본문 조회(1회 클릭 시 이후에는 불러오지 않음)
  const toggleContent = () => {
    setIsShow(!isShow); // 본문 접기, 펼치기

    //펼칠 때만 실행
    if (!isShow) {
      //content에 값이 없을 때만 실행
      if (!content) {
        setIsLoading(true);
        axios
          .get(
            `${import.meta.env.VITE_BACKSERVER}/admin/board/content/${board.boardNo}`,
          )
          .then((res) => {
            //불러온 content 저장
            setContent(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setContent("내용을 불러오지 못했습니다.");
            setIsLoading(false);
          });
      }
    }
  };

  // HTML 태그 제거 및 텍스트 요약 함수
  const getSummary = (content) => {
    if (!content) return "내용이 없습니다.";
    const pureText = content.replace(/<[^>]*>?/gm, ""); // 정규식으로 태그 제거
    return pureText.length > 200
      ? pureText.substring(0, 200) + "..."
      : pureText;
  };

  return (
    <li className={styles.board_item}>
      <div className={styles.board_main_info_wrap}>
        {" "}
        {/* [추가] 레이아웃 구분을 위한 감싸기 */}
        <div
          className={styles.board_img_wrap}
          onClick={() => navigate(`/board/view/${board.boardNo}`)} // [변경] 클릭 범위 조정
        >
          <img src={board.boardThumb ? board.boardThumb : defaultImage} />
        </div>
        <div className={styles.board_info}>
          <p
            className={styles.board_title}
            onClick={() => navigate(`/board/view/${board.boardNo}`)}
          >
            [{getCategoryName(board.boardCategory)}] {board.boardTitle}
          </p>
          <div className={styles.board_sub_info}>
            <div className={styles.board_writer}>
              <div
                className={board.memberThumb ? styles.member_thumb_exists : ""}
              >
                <img
                  src={
                    board.memberThumb
                      ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${board.memberThumb}`
                      : userImage
                  }
                />
              </div>
              <p>{board.boardWriter}</p>
            </div>
            <p>{board.boardDate}</p>
            <div className={styles.admin_board_status_wrap}>
              <Button
                className={`btn ${boardStatus === 1 ? "" : "cancle"}`} //1이 아니면 회색 버튼
                onClick={changeStatus}
              >
                {boardStatus === 1 ? "공개" : "비공개"}
              </Button>
            </div>
          </div>

          {/* 상세 내용 토글 버튼 영역 */}
          <div className={styles.toggle_btn_wrap}>
            <p onClick={toggleContent}>
              {isShow ? "클릭 시 접기 ↑" : "클릭 시 펼치기 ↓"}
            </p>
          </div>
        </div>
      </div>

      {/* 토글 상태에 따른 본문 요약 출력 */}
      {isShow && (
        <div className={styles.board_content_summary}>
          {/* 로딩 중이거나 본문이 있을 때 대응 */}
          {isLoading ? <p>불러오는 중...</p> : <p>{getSummary(content)}</p>}
        </div>
      )}
    </li>
  );
};

export default AdminBoardList;
