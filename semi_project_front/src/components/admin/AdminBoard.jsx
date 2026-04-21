import { useNavigate } from "react-router-dom";
import styles from "./AdminBoard.module.css";
import useAuthStore from "../utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Pagination from "../ui/Pagination";
import { Input } from "../ui/Form";
import AdminBoardList from "./AdminBoardList";

const AdminBoard = () => {
  const navigate = useNavigate();
  const { memberId, memberGrade } = useAuthStore();

  const [boardList, setBoardList] = useState([]); //게시글 목록 저장
  const [page, setPage] = useState(0); //현재 페이지 번호
  const [size, setSize] = useState(8); //한 페이지에 몇 개 보여줄지(8개)
  const [totalPage, setTotalPage] = useState(null); //전체 페이지 개수
  const [order, setOrder] = useState(1); //정렬 방식(1: 최신순, 2: 작성순)

  // 카테고리
  const [category, setCategory] = useState(0); //(0:전체, 1:리뷰, 2:자유)

  // 검색 입력값
  const [type, setType] = useState(1); //검색(1:제목, 2:작성자)
  const [keyword, setKeyword] = useState("");

  // 실제 검색값
  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  //회원옵션(AdminBoard에서는 필요 X)
  const handleWriteClick = () => {
    if (memberGrade === 2) {
      Swal.fire({
        title: "차단된 회원은 게시글을 작성할 수 없습니다.",
        icon: "warning",
        confirmButtonColor: "var(--color1)",
        width: "600px",
      });
    } else {
      navigate("/board/write");
    }
  };

  //조회 조건(전체 : 0, 공개 : 1, 비공개 : 2)
  const [statusFilter, setStatusFilter] = useState(0);

  // 게시글 목록 조회 ----------------------------------------------
  const getBoardList = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards?page=${page}&size=${size}&status=${statusFilter}&order=${order}&searchType=${searchType}&searchKeyword=${searchKeyword}&category=${category}`,
      )
      .then((res) => {
        setBoardList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getBoardList();
  }, [page, order, searchType, searchKeyword, category, statusFilter]);

  return (
    <section className={styles.board_wrap}>
      {/* 검색 -------------------------------------------- */}
      <form
        className={styles.search_wrap}
        onSubmit={(e) => {
          e.preventDefault();
          setSearchType(type);
          setSearchKeyword(keyword);

          // 빈 문자열 검색 시 방어 로직 추가
          if (keyword.trim() === "") {
            setSearchType(1); // 기본 검색 타입(제목)으로 초기화
            setSearchKeyword("");
          } else {
            setSearchType(type);
            setSearchKeyword(keyword);
          }

          setPage(0);
        }}
      >
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
        >
          <option value={1}>제목</option>
          <option value={2}>작성자</option>
        </select>

        <Input
          type="text"
          value={keyword}
          placeholder="게시글 검색"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button type="submit" className="btn">
          검색
        </Button>
      </form>
      <div className={styles.list_option_wrap}>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => {
            setCategory(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={0}>카테고리 전체</option>
          <option value={1}>Review</option>
          <option value={2}>Forum</option>
        </select>
        <select
          className={styles.select}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        >
          <option value={1}>최신순</option>
          <option value={2}>작성순</option>
        </select>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={0}>상태 전체</option>
          <option value={1}>공개</option>
          <option value={2}>비공개</option>
        </select>
      </div>

      <AdminBoardList boardList={boardList} getBoardList={getBoardList} />

      <div className={styles.board_list_pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          naviSize={5}
        />
      </div>
    </section>
  );
};

export default AdminBoard;
