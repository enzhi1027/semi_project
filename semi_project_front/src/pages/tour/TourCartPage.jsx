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
          setSelectedIds(res.data.map((item) => item.tourCartNo));
        })
        .catch((err) => console.log(err));
    }
  }, [isReady, memberId]);

  const updateQuantity = (cartNo, type, delta) => {
    setTourCartList((prev) =>
      prev.map((item) => {
        if (item.tourCartNo === cartNo) {
          const currentVal =
            type === "adult" ? item.tourCartAdult : item.tourCartKid;
          if (currentVal + delta < 0) return item;
          if (type === "adult" && currentVal + delta < 1) return item;
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
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/tours/deleteCart`, {
            data: {
              memberId: memberId,
              cartNos: selectedIds,
            },
          })
          .then((res) => {
            setTourCartList((prev) =>
              prev.filter((item) => !selectedIds.includes(item.tourCartNo)),
            );
            setSelectedIds([]);
          })
          .catch((err) => {
            console.log(err);
          });
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
