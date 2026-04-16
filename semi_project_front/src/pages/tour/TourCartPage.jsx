import { useEffect, useState } from "react";
import styles from "./TourCartPage.module.css";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";
import TourCartList from "../../components/tour/TourCartList";
import TourCartCalc from "../../components/tour/TourCartCalc";
import Swal from "sweetalert2";

const TourCartPage = () => {
  const { memberId, isReady } = useAuthStore();
  const [tourCartList, setTourCartList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isReady && memberId) {
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/tours/cartList/${memberId}`)
        .then((res) => {
          setTourCartList(res.data);
          // 처음에 전체 선택 상태로 시작
          setSelectedIds(res.data.map((item) => item.tourCartNo));
        })
        .catch((err) => console.log(err));
    }
  }, [isReady, memberId]);

  // 수량 변경 함수 (type: 'adult' or 'kid', delta: 1 or -1)
  const updateQuantity = (cartNo, type, delta) => {
    setTourCartList((prev) =>
      prev.map((item) => {
        if (item.tourCartNo === cartNo) {
          const currentVal =
            type === "adult" ? item.tourCartAdult : item.tourCartKid;
          if (currentVal + delta < 0) return item; // 0 미만 방지
          if (type === "adult" && currentVal + delta < 1) return item; // 성인은 최소 1명
          return {
            ...item,
            [type === "adult" ? "tourCartAdult" : "tourCartKid"]:
              currentVal + delta,
          };
        }
        return item;
      }),
    );
  };

  // 선택 삭제
  const deleteSelected = () => {
    if (selectedIds.length === 0) return;

    Swal.fire({
      title: "선택한 상품을 삭제할까요?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color1)",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        // 실제로는 axios.delete(URL, { data: selectedIds }) 호출 필요
        setTourCartList((prev) =>
          prev.filter((item) => !selectedIds.includes(item.tourCartNo)),
        );
        setSelectedIds([]);
      }
    });
  };

  return (
    <div className={styles.cart_page_container}>
      <h2 className={styles.page_title}>장바구니</h2>
      <div className={styles.cart_content_wrap}>
        <TourCartList
          tourCartList={tourCartList}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          updateQuantity={updateQuantity}
          deleteSelected={deleteSelected}
        />
        <TourCartCalc
          selectedItems={tourCartList.filter((item) =>
            selectedIds.includes(item.tourCartNo),
          )}
        />
      </div>
    </div>
  );
};

export default TourCartPage;
