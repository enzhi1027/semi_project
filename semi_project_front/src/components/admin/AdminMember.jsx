import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import styles from "./AdminMember.module.css";
import axios from "axios";
import { Input } from "../ui/Form";
import Button from "../ui/Button";
import MemberList from "./MemberList";

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  //(회원)정렬 기준: 0 : 이름 오름차순, 1 : 이름 내림차순, 2 : 최근 가입순, 3 : 가입순
  const [order, setOrder] = useState(0);
  const changeOrder = (e) => {
    setOrder(e.target.value);
  };
  //0 : 전체 조회, 1 : 일반 회원, 2 : 관리자, 3 : 차단 회원
  const [grade, setGrade] = useState(0);
  //검색어
  const [keyword, setKeyword] = useState("");
  //실제 검색어
  const [searchKeyword, setSearchKeyword] = useState("");
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admin/memberList?page=${page}&size=${size}&order=${order}&grade=${grade}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        setMemberList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {});
  }, [page, order, grade, searchKeyword]);

  return (
    <section>
      <div>
        <form
          className={styles.search_wrap}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchKeyword(keyword);
            setPage(0);
          }}
        >
          <div className={styles.search_keyword_wrap}>
            <Input
              type="text"
              value={keyword}
              placeholder="아이디 or 이름 검색"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
            <Button type="submit" className="btn">
              검색
            </Button>
          </div>
        </form>
        <div className={styles.select_wrap}>
          <select
            className={styles.order_select}
            value={order}
            onChange={changeOrder}
          >
            <option value={0}>이름 오름차순</option>
            <option value={1}>이름 내림차순</option>
            <option value={2}>최근 가입순</option>
            <option value={3}>가입순</option>
          </select>
          <select
            className={styles.grade_select}
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
            }}
          >
            <option value={0}>전체 조회</option>
            <option value={1}>일반 회원</option>
            <option value={2}>관리자</option>
            <option value={3}>차단 회원</option>
          </select>
        </div>
      </div>
      <MemberList memberList={memberList} />
      <div className={styles.member_list_pagination}>
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

export default AdminMember;
