import { useState } from 'react';
import styles from './Board.module.css';
import useAuthStore from '../../components/utils/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// 게시글 작성 페이지
const BoardWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    boardTitle: '',
    boardContent: '',
    boardWriter: memberId,
    category: 1, //기본값 Review
  });

  // 게시글 입력 처리
  const inputBoard = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newBoard = { ...board, [name]: value };
    setBoard(newBoard);
  };

  const inputBoardContent = (data) => {
    setBoard({ ...board, boardContent: data });
  };

  // 게시글 서버 등록
  const registBoard = () => {
    if (board.boardTitle === '' || board.boardContent === '') return;

    const form = new FormData();
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardWriter', board.boardWriter);
    form.append('category', board.category);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: '게시글 작성 완료', icon: 'success' }).then(() => {
            navigate('/board/list');
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}>게시글 작성</h3>

      <div className={styles.category_wrap}>
        <div className={styles.select_wrap}>
          <select
            className={styles.select}
            value={board.category}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBoard({ ...board, category: val });
            }}
          >
            <option value={1}>Review</option>
            <option value={2}>Forum</option>
          </select>
          <span className={`material-icons ${styles.location_icon}`}>
            location_on
          </span>
        </div>
      </div>

      <BoardFrm
        board={board}
        inputBoard={inputBoard}
        inputBoardContent={inputBoardContent}
      />
      <div className={styles.btn_wrap}>
        <Button className="btn primary lg" onClick={registBoard}>
          작성하기
        </Button>
      </div>
    </section>
  );
};

export default BoardWritePage;
