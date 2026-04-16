import styles from "./TourCartCalc.module.css";

const TourCartCalc = ({ selectedItems }) => {
  const totalPrice = selectedItems.reduce((acc, curr) => {
    return (
      acc +
      curr.tourCartAdult * curr.tourItemAdultPrice +
      curr.tourCartKid * curr.tourItemKidPrice
    );
  }, 0);

  const discount = 0; // 할인 로직이 있다면 여기에 추가

  return (
    <div className={styles.calc_container}>
      <div className={styles.calc_box}>
        <div className={styles.row}>
          <span>선택 상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <div className={styles.row}>
          <span>할인 예상 금액</span>
          <span className={styles.minus}>- {discount.toLocaleString()}원</span>
        </div>
        <hr />
        <div className={`${styles.row} ${styles.total}`}>
          <span>총 주문 예상 금액</span>
          <span className={styles.point}>
            {(totalPrice - discount).toLocaleString()}원
          </span>
        </div>
        <button className={styles.order_btn} disabled={totalPrice === 0}>
          {totalPrice === 0 ? "상품을 선택해주세요" : "결제하기"}
        </button>
      </div>
    </div>
  );
};

export default TourCartCalc;
