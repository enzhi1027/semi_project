import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TourBookingPage.module.css";
import Swal from "sweetalert2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const TourBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { item, startDate, adultCount, kidCount, img, totalPrice } =
    state || {};

  const [bookerInfo, setBookerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    requests: "",
  });

  if (!item) {
    Swal.fire("알림", "잘못된 접근입니다.", "error").then(() => navigate(-1));
    return null;
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (date) => {
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .slice(0, -1);
  };

  useEffect(() => {
    console.log(item);
  }, []);

  const handlePayment = () => {
    if (!bookerInfo.name || !bookerInfo.phone || !bookerInfo.email) {
      Swal.fire("알림", "예약자 필수 정보를 모두 입력해주세요.", "warning");
      return;
    }

    Swal.fire({
      title: "결제를 진행하시겠습니까?",
      html: `<b>${item.tourItemName}</b><br/>총 ${totalPrice.toLocaleString()}원이 결제됩니다.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "결제하기",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color1)",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "예약 완료!",
          text: "결제가 성공적으로 처리되었습니다.",
          icon: "success",
          confirmButtonColor: "var(--color1)",
        }).then(() => {
          navigate("/tour/mypage");
        });
      }
    });
  };

  return (
    <div className={styles.booking_container}>
      <header className={styles.booking_header}>
        <button onClick={() => navigate(-1)} className={styles.back_btn}>
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
        <h1 className={styles.header_title}>예약하기</h1>
        <div style={{ width: 24 }}></div>
      </header>

      <div className={styles.booking_content}>
        <div className={styles.main_info}>
          <section className={styles.info_section}>
            <div className={styles.product_summary}>
              <img
                src={img}
                alt={item.tourItemName}
                className={styles.product_thumb}
              />
              <div className={styles.product_txt}>
                <span className={styles.tour_type}>
                  {item.tourItemDays - 1 === 0
                    ? "당일치기"
                    : `${item.tourItemDays - 1}박 ${item.tourItemDays}일`}
                </span>
                <h2 className={styles.tour_title}>{item.tourItemName}</h2>
                <p className={styles.tour_date}>
                  출발일: <b>{formatDate(startDate)}</b>
                </p>
              </div>
            </div>
          </section>

          <section className={styles.info_section}>
            <h3 className={styles.section_title}>예약자 정보</h3>
            <div className={styles.input_group}>
              <div className={styles.input_row}>
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  value={bookerInfo.name}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className={styles.input_row}>
                <label>휴대전화</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              <div className={styles.input_row}>
                <label>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={bookerInfo.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className={styles.input_row}>
                <label>요청사항 (선택)</label>
                <textarea
                  name="requests"
                  value={bookerInfo.requests}
                  onChange={handleInputChange}
                  placeholder="특별한 요청사항이 있으시면 입력해주세요."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </section>

          <section className={styles.info_section}>
            <h3 className={styles.section_title}>취소 및 환불 규정</h3>
            <div className={styles.policy_box}>
              <p>• 여행 출발 7일 전 취소 시: 전액 환불</p>
              <p>• 여행 출발 3일 전 취소 시: 여행 요금의 50% 배상</p>
              <p className={styles.policy_warn}>
                • 여행 출발 당일 취소 시: 환불 불가
              </p>
              <p className={styles.policy_sub}>
                * 기상악화로 인한 진행 불가 시 전액 환불됩니다.
              </p>
            </div>
          </section>
        </div>

        <aside className={styles.payment_sidebar}>
          <div className={styles.payment_sticky_box}>
            <h3 className={styles.payment_title}>결제 상세</h3>

            <div className={styles.payment_calc}>
              <div className={styles.calc_row}>
                <span>성인 {adultCount}명</span>
                <span>
                  {(item.tourItemAdultPrice * adultCount).toLocaleString()}₩
                </span>
              </div>
              {kidCount > 0 && (
                <div className={styles.calc_row}>
                  <span>아동 {kidCount}명</span>
                  <span>
                    {(item.tourItemKidPrice * kidCount).toLocaleString()}₩
                  </span>
                </div>
              )}
              <div className={styles.calc_row}>
                <span>할인 금액</span>
                <span className={styles.discount_txt}>-0₩</span>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.total_row}>
              <span>총 결제 금액</span>
              <strong className={styles.total_price}>
                {totalPrice.toLocaleString()}₩
              </strong>
            </div>

            <button className={styles.pay_btn} onClick={handlePayment}>
              {totalPrice.toLocaleString()}원 결제하기
            </button>
            <p className={styles.pay_notice}>
              위 내용을 확인하였으며 결제에 동의합니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TourBookingPage;
