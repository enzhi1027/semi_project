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
        // state에 category가 넘어오면 해당 카테고리로, 없으면 유지
        category: location.state.category || prev.category,
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
      // Forum 카테고리(2)일 때 네이버 지도 검색으로 이동
      navigate('/boardNavermap');
    } else if (board.category === 1) {
      // Review 카테고리(1)일 때 관광지 목록으로 이동
      // fromWrite 플래그를 담아서 이동
      navigate('/attraction/list', { state: { fromWrite: true } });
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
              // 카테고리 변경 시 기존 선택된 장소 초기화 (선택 사항)
              setBoard({ ...board, category: val, locationName: '' });
            }}
          >
            <option value={1}>Review</option>
            <option value={2}>Forum</option>
          </select>

          {/* Review(1)이거나 Forum(2)일 때 모두 아이콘 활성화 
              비활성화 스타일(disabled_icon) 조건 제거
          */}
          <span
            className={`${styles.location_icon} material-icons`}
            onClick={handleMapClick}
          >
            location_on
          </span>

          {/* Review(1) 또는 Forum(2)이면서 장소명이 있을 때 이름 표시 */}
          {board.locationName && (
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
