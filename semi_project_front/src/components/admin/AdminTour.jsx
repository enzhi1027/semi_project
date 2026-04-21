import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import styles from "./AdminTour.module.css";
import { useEffect, useState } from "react";
import { Input } from "../ui/Form";
import Pagination from "../ui/Pagination";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import imgNone from "../../assets/img/insertTourItem/image_none.png";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import searchIcon from "../../assets/img/insertTourItem/search.png";

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
  // 사실상 검색 조건을 겸함

  //상품 검색어
  const [keyword, setKeyword] = useState("");
  //상품 검색창
  const [searchKeyword, setSearchKeyword] = useState("");
  //검색 조건은 상품명으로만 받을 거라서 X

  //삭제 상태 확인용
  const [delCheck, setDelCheck] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admin/tour?page=${page}&size=${size}&order=${order}&status=${status}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        setTourItemList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {});
  }, [page, order, status, searchKeyword, delCheck]);

  //상품 등록 페이지 이동 ------------------------------------------------
  const isnertItem = () => {
    navigate("/admin/tour/insertitem");
  };
  //상품 수정 페이지 이동 ------------------------------------------------
  const modifyTour = (tourItemNo) => {
    navigate(`/admin/tour/modifytour/${tourItemNo}`);
  };
  //상품 삭제
  const deleteTour = (tourItemNo) => {
    Swal.fire({
      title: "상품을 삭제하시겠습니까?",
      text: "삭제한 상품은 복구할 수 없습니다.",
      icon: "warning",
      confirmButtonColor: "var(--color5)",
      confirmButtonText: "삭제하기",
      showCancelButton: true,
      cancelButtonColor: "var(--color1)",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/admin/${tourItemNo}`)
          .then((res) => {
            Swal.fire({
              title: "상품이 삭제되었습니다!",
              icon: "success",
              confirmButtonColor: "var(--color1)",
            }).then((res) => {
              setDelCheck(!delCheck);
            });
          })
          .catch((err) => {
            Swal.fire({
              title: "삭제가 실패했습니다.",
              text: "다시 시도해주세요.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <section className={styles.tour_item_wrap}>
      <h3 className={styles.admin_tour_list_title}>
        투어 상품 관리(상품 목록)
      </h3>
      <div className={styles.utils_bar}>
        {/*상품 검색 랩------------------------------------------------- */}
        <form
          className={styles.search_wrap}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchKeyword(keyword);
            setPage(0); //검색할 때마다 첫 페이지로 이동
          }}
        >
          <Input
            type="text"
            value={keyword}
            placeholder="검색 상품을 입력하세요."
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          ></Input>
          <img
            src={searchIcon}
            className={styles.search_icon}
            onClick={() => {
              setSearchKeyword(keyword);
            }}
          />
        </form>
        <div className={styles.option_and_insert}>
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
            <option value={3}>전체</option>
          </select>
          <Button className="btn" onClick={isnertItem}>
            상품 등록
          </Button>
        </div>
      </div>

      {/*상품 리스트 랩------------------------------------------------- 
      썸네일, 상품명, 가격, 이용 가능 기간(startPeriod ~ endPeriod), 공개/비공개 버튼
      수정, 삭제
      */}
      <div className={styles.tour_item_list_wrap}>
        {/*공개 상태 변경 -------------------------------------*/}
        {tourItemList.length > 0 ? (
          tourItemList.map((tourItem, index) => {
            const changeStatus = () => {
              Swal.fire({
                title: "공개 상태를 변경하시겠습니까?",
                icon: "question",
                confirmButtonText: "전환",
                confirmButtonColor: "var(--color1)",
                showCancelButton: true,
                cancelButtonColor: "var(--color5)",
                cancelButtonText: "취소",
              }).then((res) => {
                if (res.isConfirmed) {
                  //상태가 0일 때는 1로, 1일 때는 0으로
                  const newStatus =
                    Number(tourItem.tourItemStatus) === 0 ? 1 : 0;
                  const obj = {
                    tourItemNo: tourItem.tourItemNo,
                    tourItemStatus: newStatus,
                  };
                  axios
                    .patch(
                      `${import.meta.env.VITE_BACKSERVER}/admin/tourItems/${tourItem.tourItemNo}`,
                      obj,
                    )
                    .then((res) => {
                      if (res.data === 1) {
                        const newTourItemList = [...tourItemList];
                        newTourItemList[index].tourItemStatus =
                          tourItem.tourItemStatus === 0 ? 1 : 0;
                        setTourItemList(newTourItemList);
                      }
                    })
                    .catch((err) => {});
                }
              });
            };

            return (
              <div
                className={`${styles.admin_tour_list}`}
                key={"tour-" + tourItem.tourItemNo}
              >
                <div className={styles.thumb_and_info_wrap}>
                  <div className={styles.tour_item_thumb}>
                    <img
                      src={
                        tourItem.tourItemImgPath
                          ? tourItem.tourItemImgPath
                          : imgNone
                      }
                      alt="상품 썸네일"
                    />
                  </div>
                  <div className={styles.item_info}>
                    <div className={styles.tour_item_name}>
                      <span
                        className={styles.item_name}
                        onClick={() => {
                          navigate(`/tour/detail/${tourItem.tourItemNo}`);
                        }}
                      >
                        상품명 : {tourItem.tourItemName}
                      </span>
                    </div>
                    <div className={styles.tour_item_period}>
                      예약 가능 기간 : {tourItem.startPeriod} ~{" "}
                      {tourItem.endPeriod}
                    </div>
                    <div className={styles.tour_item_price}>
                      {/*.toLocaleString() : 000,000,000원 (, 표시용) */}
                      가격(성인) :{" "}
                      {tourItem.tourItemAdultPrice.toLocaleString()}원
                    </div>

                    <div className={styles.tour_item_bottom_wrap}>
                      <span className={styles.tour_item_days}>
                        일정 :{" "}
                        {Number(tourItem.tourItemDays) === 1
                          ? "당일치기"
                          : `${tourItem.tourItemDays - 1}박${" "}
                      ${tourItem.tourItemDays}일`}
                      </span>
                      <div className={styles.tour_item_status}>
                        <div>
                          {tourItem.tourItemStatus === 0 ? "공개" : "비공개"}
                          <Switch
                            sx={{
                              "& input": {
                                height: "100%",
                                position: "absolute",
                              },
                              // 비공개 상태 스위치 색상
                              "& .MuiSwitch-thumb": {
                                backgroundColor: "white", // 원하는 색상으로 변경
                              },
                              // 공개 상태 스위치 색상
                              "& .Mui-checked .MuiSwitch-thumb": {
                                backgroundColor: "var(--color1)",
                              },
                              // 스위치가 켜졌을 때 배경 트랙 색상
                              "& .Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "var(--color1) !important",
                                opacity: "0.5 !important",
                              },
                            }}
                            checked={tourItem.tourItemStatus === 0}
                            onClick={() => {
                              changeStatus();
                            }}
                          />
                        </div>
                        <div className={styles.item_no_up_del}>
                          <span>상품 번호 : {tourItem.tourItemNo}</span>
                          <div>
                            <span
                              className={`${styles.modify} ${styles.btn}`}
                              onClick={() => modifyTour(tourItem.tourItemNo)}
                            >
                              수정
                            </span>
                            <span
                              className={`${styles.delete} ${styles.btn}`}
                              onClick={() => deleteTour(tourItem.tourItemNo)}
                            >
                              삭제
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // 상품이 없을 때: 안내 문구 출력
          <div className={styles.no_item_message}>등록된 상품이 없습니다.</div>
        )}
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
