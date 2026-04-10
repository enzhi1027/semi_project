import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import useAuthStore from '../../components/utils/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BoardWritePage = ({ categoryTest, setCategoryTest }) => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCategoryTest(1);
  }, [setCategoryTest]);

  //게시글 상세보기
  const placeName = location.state?.placeName || location.state?.selectedPlace;

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

        placeName: location.state.selectedPlace, // 자유 관광지명
        attractionNo: location.state.attractionNo || null, // 리뷰 게시글용 PK
        addressName: location.state.addressName || prev.addressName, // 자유 관광지 주소
        locationNo: location.state.locationNo || null, // 자유 게시글용 위치 번호
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
    const finalPlaceName = board.placeName || board.locationName || '';

    //유효성 검사
    if (board.boardTitle === '' || board.boardContent === '') {
      Swal.fire({
        title: '제목과 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
      });
      return;
    }

    if (finalPlaceName === '') {
      Swal.fire({
        title: '장소를 선택해주세요.',
        text: '지도 아이콘을 클릭하여 장소를 지정해야 합니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
      });
      return;
    }

    const form = new FormData();
    //기본정보(필수)
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardWriter', board.boardWriter);
    form.append('boardCategory', board.category);

    form.append('placeName', finalPlaceName);
    form.append('addressName', board.addressName || '');

    // 카테고리별 추가 데이터 (값이 있을 때만 전송)
    if (board.attractionNo) {
      form.append('attractionNo', board.attractionNo); // 리뷰용
    }
    if (board.locationNo) {
      form.append('locationNo', board.locationNo); // 자유용
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
