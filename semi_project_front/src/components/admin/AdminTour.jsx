import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import styles from "./AdminTour.module.css";
import { useEffect, useState } from "react";
import { Input } from "../ui/Form";
import Pagination from "../ui/Pagination";
import useAuthStore from "../utils/useAuthStore";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const AdminTour = () => {
  const navigate = useNavigate();
  const [tourItemList, setTourItemList] = useState([]); //상품 리스트
  const [totalPage, setTotalPage] = useState(0); //총 페이지 수
  const [page, setPage] = useState(0); //최초 시작 페이지 번호
  const [size, setSize] = useState(10); //상품 조회 갯수
  const [order, setOrder] = useState(1);
  //상품 정렬 조건  //1: 최신순, 2: 작성순(오래된 순)

  const [status, setStatus] = useState(0);
  //0: 공개 상품만(status가 0인 상품)
  //1: 비공개(전체 status가 1인 상품)
  //2: 비공개(이용 기간 만료)(조건: endPeriod가 오늘을 지났고 status가 1인 상품)
  //사실상 검색 조건을 겸함

  //상품 검색어
  const [keyword, setKeyword] = useState("");
  //상품 검색창
  const [searchKeyword, setSearchKeyword] = useState("");
  //검색 조건은 상품명으로만 받을 거라서 X

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admin/tour?page=${page}&size=${size}&order=${order}&status=${status}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        console.log(res);
        setTourItemList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, status, searchKeyword]);

  //상품 등록 페이지 이동 ---------------------------------------------------
  const isnertItem = () => {
    navigate("/admin/tour/insertitem");
  };

  return (
    <section className={styles.tour_item_wrap}>
      <h3>투어 상품 관리(상품 목록)</h3>
      <div className={styles.utils_bar}>
        {/*상품 검색 랩------------------------------------------------- */}
        <form className={styles.search_wrap}>
          <Input type="text"></Input>
          <SearchIcon className={styles.search_icon} />
        </form>
        <select
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
          }}
        >
          <option value={1}>최신순</option>
          <option value={2}>작성순</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <option value={0}>공개</option>
          <option value={1}>비공개</option>
          <option value={2}>기간마감</option>
        </select>
        <Button className="btn" onClick={isnertItem}>
          상품 등록
        </Button>
      </div>

      {/*상품 리스트 랩------------------------------------------------- 
      썸네일, 상품명, 가격, 이용 가능 기간(startPeriod ~ endPeriod), 공개/비공개 버튼
      수정, 삭제
      */}
      <div className={styles.tour_item_list_wrap}>
        {/*공개 상태 변경 */}
        {tourItemList.map((tourItem, index) => {
          const changeStatus = () => {
            //상태가 0일 때는 1로, 1일 때는 0으로
            const status = tourItem.tourStatus === 0 ? 1 : 0;
            const obj = {
              tourItemNo: tourItem.tourItemNo,
              tourItemStatus: status,
            };
            axios
              .patch(
                `${import.meta.env.VITE_BACKSERVER}/admin/tourItems/${tourItem.tourItemNo}`,
                obj,
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          };
        })}
      </div>

      <div className={styles.admin_tour_pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          naviSize={5}
        ></Pagination>
      </div>
    </section>
  );
};

export default AdminTour;
