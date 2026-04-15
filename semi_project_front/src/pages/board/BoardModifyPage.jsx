import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import useAuthStore from '../../components/utils/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const BoardModifyPage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => console.error(err));
  }, [boardNo]);

  const inputBoard = (e) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };

  const inputBoardContent = (data) => {
    setBoard({ ...board, boardContent: data });
  };

  const modifyBoard = () => {
    if (board.boardTitle === '' || board.boardContent === '') {
      Swal.fire({ title: '제목과 내용을 입력해주세요.', icon: 'warning' });
      return;
    }

    const form = new FormData();
    form.append('boardNo', board.boardNo);
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardCategory', board.boardCategory);

    if (Number(board.boardCategory) === 1) {
      //리뷰 게시글
      form.append('attractionNo', board.attractionNo || 0);
      form.append('addressName', board.addressName || '');
    } else {
      //자유 게시글
      form.append('placeName', board.placeName || '');
      form.append('addressName', board.addressName || '');
      form.append('locationNo', board.locationNo || '');
    }
    axios
      .put(`${import.meta.env.VITE_BACKSERVER}/boards/${boardNo}`, form)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: '게시글 수정 완료', icon: 'success' }).then(() => {
            navigate(`/board/view/${boardNo}`);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!board) return null;

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}>게시글 수정</h3>

      <div className={styles.category_wrap}>
        <div
          className={styles.select_wrap}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <select
            className={styles.select}
            name="boardCategory"
            value={board.boardCategory}
            disabled
            style={{
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed',
              marginRight: '15px',
            }}
          >
            <option value={1}>Review</option>
            <option value={2}>Forum</option>
          </select>

          <span
            className={`${styles.location_icon} material-icons`}
            style={{
              color: '#bbb',
              fontSize: '28px',
              cursor: 'default',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            location_on
          </span>

          {(board.placeName || board.locationName) && (
            <span
              className={styles.selected_place_name}
              style={{
                color: '#666',
                fontWeight: '600',
                marginLeft: '2px',
                fontSize: '1rem',
                cursor: 'default',
                pointerEvents: 'none',
              }}
            >
              {board.placeName || board.locationName}
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#aaa',
                  marginLeft: '8px',
                  fontWeight: '400',
                }}
              ></span>
            </span>
          )}
        </div>
      </div>

      <BoardFrm
        board={board}
        inputBoard={inputBoard}
        inputBoardContent={inputBoardContent}
      />

      <div className={styles.btn_wrap}>
        <Button className="btn primary lg" onClick={modifyBoard}>
          수정 완료
        </Button>
      </div>
    </section>
  );
};

export default BoardModifyPage;
