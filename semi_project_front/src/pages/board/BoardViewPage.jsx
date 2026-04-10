import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardViewPage.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import userImage from '../../assets/img/board/user.png';
import Button from '../../components/ui/Button';
import useAuthStore from '../../components/utils/useAuthStore';
import Swal from 'sweetalert2';
import { TextArea } from '../../components/ui/Form';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const BoardViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const { memberId, memberGrade, isReady } = useAuthStore(); //memberGrade(일반 유저: 0, 관리자: 1, 차단유저: 2)
  const [board, setBoard] = useState(null);

  const isAdmin = memberGrade === 1; // 관리자: 1
  const isBlocked = memberGrade === 2; // 차단유저: 2

  // 게시글 정보 가져오기
  useEffect(() => {
    if (!isReady) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady, boardNo]); //boardNo

  // 게시글 삭제
  const deleteBoard = () => {
    Swal.fire({
      title: '게시글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--danger)',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
          .then((res) => {
            if (res.data === 1) {
              navigate('/board/list');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  // 관리자 전용: 게시글 공개/비공개 상태 변경
  const changeBoardStatus = () => {
    const newStatus = board.boardStatus === 1 ? 0 : 1; // 1이면 비공개(0)로, 0이면 공개(1)로
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/status`, {
        boardStatus: newStatus,
      })
      .then((res) => {
        if (res.data === 1) {
          setBoard({ ...board, boardStatus: newStatus });
          Swal.fire({
            title: `게시글이 ${newStatus === 1 ? '공개' : '비공개'} 처리되었습니다.`,
            icon: 'success',
            confirmButtonColor: 'var(--color1)',
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <section className={styles.board_wrap}>
      {board && (
        <>
          <div className={styles.board_view_wrap}>
            <div className={styles.board_view_header}>
              <h2 className={styles.board_title}>
                <span className={styles.category_prefix}>
                  [{board.boardCategory === 1 ? 'Review' : 'Forum'}]
                </span>
                {board.boardTitle}
                {/* 관리자에게만 보이는 상태 표시 */}
                {isAdmin && board.boardStatus === 0 && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '14px',
                      marginLeft: '10px',
                    }}
                  >
                    (비공개 상태)
                  </span>
                )}
              </h2>
              <div className={styles.board_sub_info}>
                <div className={styles.board_writer}>
                  <div
                    className={
                      board.memberThumb
                        ? styles.member_thumb_exists
                        : styles.member_thumb
                    }
                  >
                    <img
                      src={
                        board.memberThumb
                          ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${board.memberThumb}`
                          : userImage
                      }
                      alt="writer"
                    />
                  </div>
                  <span>{board.boardWriter}</span>
                </div>
                <div className={styles.board_date}>{board.boardDate}</div>
              </div>
            </div>

            {(board.placeName || board.locationName) && (
              <div className={styles.location_info_box}>
                <LocationOnIcon className={styles.location_icon} />
                <span className={styles.selected_place_name}>
                  {board.placeName || board.locationName}
                </span>
                {board.addressName && (
                  <span className={styles.address_name}>
                    ({board.addressName})
                  </span>
                )}
              </div>
            )}

            <div
              className={styles.board_view_content}
              dangerouslySetInnerHTML={{ __html: board.boardContent }}
            ></div>
          </div>

          <div className={styles.board_action_wrap}>
            <Like boardNo={boardNo} />
            <div className={styles.right_actions}>
              <Button
                className="btn secondary outline"
                onClick={() => navigate('/board/list')}
                style={{ width: '75px', fontSize: '14px' }}
              >
                목록으로
              </Button>

              {/* 차단유저(2)가 아닐 때만 노출되는 버튼 구역 */}
              {!isBlocked && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  {/* 관리자(1) 전용: 공개/비공개 전환 버튼 */}
                  {isAdmin && (
                    <Button
                      className="btn info"
                      onClick={changeBoardStatus}
                      style={{ width: '85px', fontSize: '14px' }}
                    >
                      {board.boardStatus === 1 ? '비공개처리' : '공개처리'}
                    </Button>
                  )}

                  {/* 작성자 본인: 수정 버튼 */}
                  {memberId && memberId === board.boardWriter && (
                    <Button
                      className="btn primary"
                      onClick={() => navigate(`/board/modify/${board.boardNo}`)}
                      style={{ width: '70px', fontSize: '14px' }}
                    >
                      수정
                    </Button>
                  )}

                  {/* 관리자(1) 또는 작성자 본인: 삭제 버튼 */}
                  {(isAdmin ||
                    (memberId && memberId === board.boardWriter)) && (
                    <Button
                      className="btn primary outline"
                      onClick={deleteBoard}
                      style={{ width: '70px', fontSize: '14px' }}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 댓글 컴포넌트에 관리자/차단 정보 전달 */}
          <BoardCommentComponent
            boardNo={boardNo}
            isAdmin={isAdmin}
            isBlocked={isBlocked}
            isAdmin={isAdmin}
            isBlocked={isBlocked}
          />
        </>
      )}
    </section>
  );
};

//좋아요
const Like = ({ boardNo }) => {
  const { memberId } = useAuthStore();
  const [likeInfo, setLikeInfo] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => {
        setLikeInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //좋아요 누르기
  const likeOn = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 1, //내가 좋아요 눌렀는지 => 누름:1, 안누름:0
            likeCount: likeInfo.likeCount + 1, //전체 좋아요 수
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //좋아요 취소
  const likeOff = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 0,
            likeCount: likeInfo.likeCount - 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //로그인 안했을 때
  const loginMsg = () => {
    Swal.fire({ title: '로그인 후 이용 가능합니다.', icon: 'info' });
  };

  return (
    <div>
      {likeInfo && (
        <div className={styles.board_like_wrap}>
          {likeInfo.isLike === 1 ? (
            <ThumbUpAltIcon onClick={likeOff} />
          ) : (
            <ThumbUpOffAltIcon onClick={memberId ? likeOn : loginMsg} />
          )}
          <span>{likeInfo.likeCount}</span>
        </div>
      )}
    </div>
  );
};

//댓글 전체 관리
const BoardCommentComponent = ({ boardNo, isAdmin, isBlocked }) => {
  const { memberId } = useAuthStore();
  const [boardComment, setBoardComment] = useState({
    boardCommentContent: '',
    boardCommentWriter: memberId,
    boardNo: boardNo,
  });
  //댓글 목록
  const [boardCommentList, setBoardCommentList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}/comments`)
      .then((res) => {
        setBoardCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateComment = (modifyComment, index) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKSERVER}/boards/comments/${modifyComment.boardCommentNo}`,
        modifyComment,
      )
      .then((res) => {
        if (res.data === 1) {
          const newCommentList = [...boardCommentList];
          newCommentList[index].boardCommentContent =
            modifyComment.boardCommentContent;
          setBoardCommentList(newCommentList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (boardCommentNo) => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/boards/comments/${boardCommentNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          const newBoardCommentList = boardCommentList.filter((item) => {
            return boardCommentNo !== item.boardCommentNo;
          });
          setBoardCommentList(newBoardCommentList);
        }
      });
  };

  const registComment = () => {
    if (boardComment.boardCommentContent === '') {
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards/comments`, boardComment)
      .then((res) => {
        setBoardCommentList([...boardCommentList, res.data]);
        setBoardComment({ ...boardComment, boardCommentContent: '' });
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.comment_wrap}>
      {/* 차단유저가 아닐 때만 댓글 등록창 노출 */}
      {memberId && !isBlocked && (
        <div className={styles.comment_regist_wrap}>
          <h3>댓글 등록</h3>
          <div className={styles.input_item}>
            <TextArea
              value={boardComment.boardCommentContent}
              onChange={(e) => {
                setBoardComment({
                  ...boardComment,
                  boardCommentContent: e.target.value,
                });
              }}
            ></TextArea>
            <Button className="btn primary " onClick={registComment}>
              등록
            </Button>
          </div>
        </div>
      )}
      <div className={styles.comment_list_wrap}>
        {boardCommentList.map((comment, index) => {
          return (
            <BoardComment
              key={'comment-' + comment.boardCommentNo}
              comment={comment}
              index={index}
              updateComment={updateComment}
              deleteComment={deleteComment}
              isAdmin={isAdmin}
              isBlocked={isBlocked}
            />
          );
        })}
      </div>
    </div>
  );
};

//댓글 하나
const BoardComment = ({
  comment,
  index,
  updateComment,
  deleteComment,
  isAdmin,
  isBlocked,
}) => {
  const { memberId } = useAuthStore();
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyComment, setModifyComment] = useState({
    boardCommentContent: comment.boardCommentContent,
    boardCommentNo: comment.boardCommentNo,
  });
  return (
    <ul className={styles.comment_item}>
      <li className={styles.comment_info}>
        <div className={styles.comment_writer_wrap}>
          <div
            className={comment.memberThumb ? styles.member_thumb_exists : ''}
          >
            <img
              src={
                comment.memberThumb
                  ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${comment.memberThumb}`
                  : userImage
              }
            />
          </div>
          <span>{comment.boardCommentWriter}</span>
        </div>
        <span className={styles.comment_date}>{comment.boardCommentDate}</span>
        {memberId && !isBlocked && (
          <div style={{ display: 'flex', gap: '5px' }}>
            {isModifyMode ? (
              /* 수정 모드일 때 (수정은 본인만 가능) */
              <>
                <Button
                  className="btn primary sm"
                  onClick={() => {
                    updateComment(modifyComment, index);
                    setIsModifyMode(false);
                  }}
                  style={{ width: '70px', fontSize: '14px' }}
                >
                  수정완료
                </Button>
                <Button
                  className="btn primary outline"
                  onClick={() => {
                    setModifyComment({
                      ...modifyComment,
                      boardCommentContent: comment.boardCommentContent,
                    });
                    setIsModifyMode(false);
                  }}
                  style={{ width: '70px', fontSize: '14px' }}
                >
                  수정취소
                </Button>
              </>
            ) : (
              /* 일반 모드일 때 */
              <>
                {/* 1. 수정 버튼: 오직 작성자 본인에게만 노출 */}
                {memberId === comment.boardCommentWriter && (
                  <Button
                    className="btn primary"
                    onClick={() => setIsModifyMode(true)}
                    style={{ width: '70px', fontSize: '14px' }}
                  >
                    수정
                  </Button>
                )}

                {/* 2. 삭제 버튼: 작성자 본인 이거나 관리자(isAdmin)일 때 노출 */}
                {(memberId === comment.boardCommentWriter || isAdmin) && (
                  <Button
                    className="btn primary outline sm"
                    onClick={() => {
                      Swal.fire({
                        title: '댓글을 삭제하시겠습니까?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: '삭제',
                        cancelButtonText: '취소',
                        confirmButtonColor: 'var(--primary)',
                        cancelButtonColor: 'var(--danger)',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteComment(modifyComment.boardCommentNo);
                        }
                      });
                    }}
                    style={{ width: '70px', fontSize: '14px' }}
                  >
                    삭제
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </li>
      <li className={styles.comment_content}>
        <TextArea
          value={modifyComment.boardCommentContent}
          onChange={(e) => {
            setModifyComment({
              ...modifyComment,
              boardCommentContent: e.target.value,
            });
          }}
          disabled={!isModifyMode}
        ></TextArea>
      </li>
    </ul>
  );
};

export default BoardViewPage;
