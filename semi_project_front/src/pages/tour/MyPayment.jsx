import React, { useState } from "react";
import styles from "./MyPaymentList.module.css";
import MyPaymentDetail from "./MyPaymentDetail"; // 상세 페이지 컴포넌트

const MyPaymentList = () => {
  const [filter, setFilter] = useState("all"); // all, done, cancel
  const [selectedOrder, setSelectedOrder] = useState(null); // 상세보기 선택

  const paymentData = [
    {
      id: "ORD-20240501-A1",
      title: "제주도 서귀포 스쿠버다이빙",
      date: "2024.05.01",
      amount: "85,000원",
      status: "결제완료",
      type: "done",
      img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    },
    {
      id: "ORD-20240428-B2",
      title: "남산타워 전망대 & 디너",
      date: "2024.04.28",
      amount: "120,000원",
      status: "결제완료",
      type: "done",
      img: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400",
    },
    {
      id: "ORD-20240415-C3",
      title: "강릉 정동진 해변 승마",
      date: "2024.04.15",
      amount: "55,000원",
      status: "취소완료",
      type: "cancel",
      img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400", // 승마 이미지 재매칭
    },
    {
      id: "ORD-20240410-D4",
      title: "부산 해운대 요트 투어 (선셋 타임)",
      date: "2024.04.10",
      amount: "45,000원",
      status: "결제완료",
      type: "done",
      img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400",
    },
    {
      id: "ORD-20240405-E5",
      title: "전주 한옥마을 한복 대여 1일권",
      date: "2024.04.05",
      amount: "25,000원",
      status: "이용완료",
      type: "done",
      img: "https://picsum.photos/id/50/400/400",
    },
    {
      id: "ORD-20240328-F6",
      title: "제주 오설록 티 클래스 & 브런치",
      date: "2024.03.28",
      amount: "38,000원",
      status: "취소완료",
      type: "cancel",
      img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400",
    },
    {
      id: "ORD-20240315-G7",
      title: "경주 야경 달빛 투어 (전문 가이드)",
      date: "2024.03.15",
      amount: "22,000원",
      status: "결제완료",
      type: "done",
      img: "https://picsum.photos/id/70/400/400",
    },
    {
      id: "ORD-20240302-H8",
      title: "강원도 평창 패러글라이딩 체험",
      date: "2024.03.02",
      amount: "110,000원",
      status: "취소완료",
      type: "cancel",
      img: "https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?w=400",
    },
    {
      id: "ORD-20240220-I9",
      title: "여수 해상 케이블카 왕복권 (크리스탈)",
      date: "2024.02.20",
      amount: "24,000원",
      status: "결제완료",
      type: "done",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400", // 케이블카/전망 테마 수정
    },
    {
      id: "ORD-20240214-J0",
      title: "가평 남이섬 & 아침고요수목원 투어",
      date: "2024.02.14",
      amount: "68,000원",
      status: "취소완료",
      type: "cancel",
      img: "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=400",
    },
  ];

  const filteredData =
    filter === "all"
      ? paymentData
      : paymentData.filter((item) => item.type === filter);

  // 상세보기로 넘어가기
  if (selectedOrder) {
    return (
      <MyPaymentDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className={styles.payment_container}>
      {/* 필터 탭 */}
      <div className={styles.filter_tabs}>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          모두 보기
        </button>
        <button
          className={filter === "done" ? styles.active : ""}
          onClick={() => setFilter("done")}
        >
          결제 완료
        </button>
        <button
          className={filter === "cancel" ? styles.active : ""}
          onClick={() => setFilter("cancel")}
        >
          취소 내역
        </button>
      </div>

      <div className={styles.list_wrap}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className={styles.payment_card}>
              <div className={styles.card_header}>
                <span className={styles.order_date}>{item.date}</span>
                <span className={styles.order_id}>{item.id}</span>
              </div>
              <div className={styles.card_body}>
                <img src={item.img} alt="thumb" className={styles.thumb} />
                <div className={styles.info}>
                  <div
                    className={`${styles.status} ${item.type === "cancel" ? styles.cancel : ""}`}
                  >
                    {item.status}
                  </div>
                  <div className={styles.product_name}>{item.title}</div>
                  <div className={styles.price}>{item.amount}</div>
                </div>
                <button
                  className={styles.detail_btn}
                  onClick={() => setSelectedOrder(item)}
                >
                  상세보기
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>해당 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MyPaymentList;
