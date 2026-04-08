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

const BoardViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const { memberId, isReady } = useAuthStore();
  const [board, setBoard] = useState(null);

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
                <span className={`material-icons ${styles.location_icon}`}>
                  location_on
                </span>
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
              >
                목록으로
              </Button>

              {memberId && memberId === board.boardWriter && (
                <div>
                  <Button
                    className="btn primary sm"
                    onClick={() => navigate(`/board/modify/${board.boardNo}`)}
                  >
                    수정
                  </Button>
                  <Button
                    className="btn primary outline sm"
                    onClick={deleteBoard}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>
          </div>
          <BoardCommentComponent boardNo={boardNo} />
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
const BoardCommentComponent = ({ boardNo }) => {
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
      {memberId && (
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
            />
          );
        })}
      </div>
    </div>
  );
};

//댓글 하나
const BoardComment = ({ comment, index, updateComment, deleteComment }) => {
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
        {memberId &&
          memberId === comment.boardCommentWriter &&
          (isModifyMode ? (
            <>
              <Button
                className="btn primary sm"
                onClick={() => {
                  updateComment(modifyComment, index);
                  setIsModifyMode(false);
                }}
              >
                수정완료
              </Button>
              <Button
                className="btn primary outline sm"
                onClick={() => {
                  setModifyComment({
                    ...modifyComment,
                    boardCommentContent: comment.boardCommentContent,
                  });
                  setIsModifyMode(false);
                }}
              >
                수정취소
              </Button>
            </>
          ) : (
            <>
              <Button
                className="btn primary sm"
                onClick={() => {
                  setIsModifyMode(true);
                }}
              >
                수정
              </Button>
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
              >
                삭제
              </Button>
            </>
          ))}
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
