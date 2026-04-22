import React from "react";
import styles from "./MyPaymentDetail.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MyPaymentDetail = ({ order, onBack }) => {
  return (
    <div className={styles.detail_wrap}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.back_btn}>
          <ArrowBackIcon />
        </button>
        <h2>결제 상세 내역</h2>
      </div>

      <section className={styles.section}>
        <h3>주문 정보</h3>
        <div className={styles.row}>
          <span>주문번호</span>
          <strong>{order.id}</strong>
        </div>
        <div className={styles.row}>
          <span>결제일시</span>
          <span>2024.05.01 14:30:22</span>
        </div>
        <div className={styles.row}>
          <span>결제상태</span>
          <span
            className={
              order.type === "cancel" ? styles.txt_cancel : styles.txt_done
            }
          >
            {order.status}
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h3>상품 정보</h3>
        <div className={styles.product_box}>
          <img src={order.img} alt="thumb" />
          <div>
            <p className={styles.p_name}>{order.title}</p>
            <p className={styles.p_option}>옵션: 성인 1인 / 오전 타임</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>결제 금액 상세</h3>
        <div className={styles.row}>
          <span>상품 금액</span>
          <span>{order.amount}</span>
        </div>
        <div className={styles.row}>
          <span>할인 금액</span>
          <span>-0원</span>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <span>최종 결제 금액</span>
          <strong>{order.amount}</strong>
        </div>
      </section>

      <div className={styles.bottom_actions}>
        {order.type === "done" && (
          <button className={styles.cancel_request}>결제 취소 요청</button>
        )}
        <button className={styles.list_btn} onClick={onBack}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default MyPaymentDetail;
