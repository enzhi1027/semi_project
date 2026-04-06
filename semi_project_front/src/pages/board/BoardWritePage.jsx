import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import useAuthStore from '../../components/utils/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BoardWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [board, setBoard] = useState({
    boardTitle: '',
    boardContent: '',
    boardWriter: memberId,
    category: 1,
    locationName: '',
  });

  useEffect(() => {
    if (location.state && location.state.selectedPlace) {
      setBoard((prev) => ({
        ...prev,
        category: 2,
        locationName: location.state.selectedPlace,
      }));
    }
  }, [location.state]);

  const inputBoard = (e) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };

  const inputBoardContent = (data) => {
    setBoard({ ...board, boardContent: data });
  };

  const registBoard = () => {
    if (board.boardTitle === '' || board.boardContent === '') {
      Swal.fire({ title: '제목과 내용을 입력해주세요.', icon: 'warning' });
      return;
    }

    const form = new FormData();
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardWriter', board.boardWriter);
    form.append('category', board.category);

    if (board.locationName) {
      form.append('locationName', board.locationName);
    }

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

  const handleMapClick = () => {
    if (board.category === 2) {
      navigate('/boardNavermap');
    } else {
      Swal.fire({
        title: '알림',
        text: '지도는 Forum 카테고리에서만 이용 가능합니다.',
        icon: 'info',
        confirmButtonColor: 'var(--color1)',
      });
    }
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
              const loc = val === 1 ? '' : board.locationName;
              setBoard({ ...board, category: val, locationName: loc });
            }}
          >
            <option value={1}>Review</option>
            <option value={2}>Forum</option>
          </select>

          <span
            className={`${styles.location_icon} material-icons ${board.category !== 2 ? styles.disabled_icon : ''}`}
            onClick={handleMapClick}
          >
            location_on
          </span>

          {board.category === 2 && board.locationName && (
            <span className={styles.selected_place_name}>
              {board.locationName}
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
        <Button className="btn primary lg" onClick={registBoard}>
          작성하기
        </Button>
      </div>
    </section>
  );
};

export default BoardWritePage;
