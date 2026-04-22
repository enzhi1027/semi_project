import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import useAuthStore from '../../components/utils/useAuthStore';
import BoardFrm from '../../components/board/BoardFrm';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BoardWritePage = ({ categoryTest, setCategoryTest }) => {
  const { memberId, memberGrade, isReady } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  //페이지 진입 시 차단 유저인지 체크
  useEffect(() => {
    if (isReady) {
      if (Number(memberGrade) === 2) {
        Swal.fire({
          title: '접근 제한',
          text: '차단된 회원은 게시글 작성 페이지에 접근할 수 없습니다.',
          icon: 'error',
          confirmButtonColor: 'var(--color1)',
        }).then(() => {
          navigate('/board/list'); // 목록으로 강제 이동
        });
      }
    }
  }, [isReady, memberGrade, navigate]);

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
        ...(location.state.prevBoard || prev),
        category:
          location.state.category ||
          location.state.prevBoard?.category ||
          prev.category,
        locationName: location.state.selectedPlace,
        placeName: location.state.selectedPlace,
        attractionNo: location.state.attractionNo || null,
        addressName:
          location.state.addressName ||
          location.state.prevBoard?.addressName ||
          prev.addressName,
        locationNo: location.state.locationNo || null,
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
    // 현재 입력된 제목, 본문이 담긴 board 객체를 state에 담음
    const dataToPass = {
      fromWrite: true,
      prevBoard: board,
    };

    if (board.category === 2) {
      // 네이버 검색 페이지로 이동할 때도 데이터를 보냄
      navigate('/boardNavermap', { state: dataToPass });
    } else if (board.category === 1) {
      // 관광지 리스트 페이지로 이동할 때 데이터를 보냄
      navigate('/attraction/list', { state: dataToPass });
    }
  };

  const registBoard = () => {
    // board.placeName 이나 board.locationName 중 하나라도 있는지 확인
    const currentPlaceName = board.placeName || board.locationName;

    //제목/내용 유효성 검사
    if (board.boardTitle === '' || board.boardContent === '') {
      Swal.fire({
        title: '제목과 내용을 입력해주세요.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
      });
      return;
    }

    //장소명 유효성 검사 강화
    // null, undefined, "" 모두 체크
    if (!currentPlaceName || currentPlaceName.toString().trim() === '') {
      Swal.fire({
        title: '장소를 선택해주세요.',
        text: '지도 아이콘을 클릭하여 장소를 지정해야 합니다.',
        icon: 'warning',
        confirmButtonColor: 'var(--color1)',
        width: '600px',
      });
      return;
    }

    //카테고리가 Review(1)인데 attractionNo가 없는 경우 (자유에서 선택 후 카테고리만 바꾼 경우 방지)
    if (Number(board.category) === 1 && !board.attractionNo) {
      Swal.fire({
        title: '장소 재선택 필요',
        text: '리뷰 게시글은 정식 등록된 관광지만 선택 가능합니다. 지도 버튼을 눌러 관광지를 다시 선택해주세요.',
        icon: 'error',
        confirmButtonColor: 'var(--color1)',
      });
      return;
    }

    const form = new FormData();
    //기본정보(필수)
    form.append('boardTitle', board.boardTitle);
    form.append('boardContent', board.boardContent);
    form.append('boardWriter', board.boardWriter);
    form.append('boardCategory', Number(board.category));

    if (Number(board.category) === 1) {
      //리뷰 게시글
      // attractionNo가 null이면 안되므로 0 또는 실제 값 전송
      form.append('attractionNo', board.attractionNo || 0);
      form.append('addressName', board.addressName || '');
    } else {
      //자유 게시글
      form.append('placeName', currentPlaceName || '');
      form.append('addressName', board.addressName || '');

      if (board.locationNo) {
        form.append('locationNo', board.locationNo);
      }
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
      <div className={styles.category_wrap}>
        <div className={styles.select_wrap}>
          <select
            className={styles.select}
            name="category"
            value={board.category}
            onChange={(e) => {
              const newCategory = Number(e.target.value);

              // 카테고리를 변경하면 기존에 선택했던 모든 장소 정보 초기화
              setBoard({
                ...board,
                category: newCategory,
                locationName: '', // 화면에 표시되는 이름 초기화
                placeName: '', // DB 전송용 이름 초기화
                attractionNo: null, // 리뷰용 관광지 번호 초기화
                addressName: '', // 주소 초기화
                locationNo: null, // 자유게시판용 위치 번호 초기화
              });
            }}
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
