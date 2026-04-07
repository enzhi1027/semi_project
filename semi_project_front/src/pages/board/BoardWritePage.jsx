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

  // 게시글 상태 (카테고리 및 장소명 추가)
  const [board, setBoard] = useState({
    boardTitle: '',
    boardContent: '',
    boardWriter: memberId,
    category: 1, // 1: Review, 2: Forum
    locationName: '', // 지도에서 선택한 장소명
  });

  // 지도 페이지에서 돌아왔을 때 데이터 수신
  useEffect(() => {
    if (location.state && location.state.selectedPlace) {
      setBoard((prev) => ({
        ...prev,
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

  // 지도 아이콘 클릭 시 카테고리에 맞는 검색 페이지로 이동
  const handleMapClick = () => {
    if (board.category === 2) {
      navigate('/boardNavermap');
    } else if (board.category === 1) {
      navigate('/attraction/list', { state: { fromWrite: true } });
    }
  };

  const registBoard = () => {
    if (board.boardTitle === '' || board.boardContent === '') {
      Swal.fire({ title: '제목과 내용을 입력해주세요.', icon: 'warning' });
      return;
    }

    const form = new FormData();
    //기본정보(필수)
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardWriter', board.boardWriter);
    form.append('boardCategory', board.category);
    //장소 관련 정보 (Review나 Forum에서 선택된 경우)
    if (board.locationName) {
      form.append('locationName', board.locationName);
    }
    form.append('addressName', board.addressName || '');
    if (board.attractionNo) {
      form.append('attractionNo', board.attractionNo);
    }
    if (board.locationNo) {
      form.append('locationNo', board.locationNo);
    }

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/boards`, form)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: '게시글 작성 완료', icon: 'success' }).then(() => {
            navigate('/board/list');
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <section className={styles.board_wrap}>
      <h3 className={styles.page_title}>게시글 작성</h3>

      {/* 카테고리 및 장소 선택 UI */}
      <div className={styles.category_wrap}>
        <div className={styles.select_wrap}>
          <select
            className={styles.select}
            name="category"
            value={board.category}
            onChange={(e) =>
              setBoard({
                ...board,
                category: Number(e.target.value),
                locationName: '',
              })
            }
          >
            <option value={1}>Review</option>
            <option value={2}>Forum</option>
          </select>
          <span
            className={`${styles.location_icon} material-icons`}
            onClick={handleMapClick}
            style={{
              cursor: 'pointer',
              color: 'var(--color1)',
              fontSize: '30px',
            }}
          >
            location_on
          </span>
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
