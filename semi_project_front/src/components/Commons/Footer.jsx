import styles from "./Commons.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className={styles.footer_wrap}>
        <div className={styles.footer}>
          <div className={styles.site_info}>
            <h4 className={styles.footer_title}>사이트소개</h4>
            <ul className={styles.footer_ul}>
              <li>자연을 지키는 생태관광 여행</li>
              <li>함께 경험하는 생태관광 코스</li>
              <li>다같이 나누는 생태관광 이야기</li>
              <li>즐겁게 보내는 생태관광 투어</li>
            </ul>
          </div>
          <div className={styles.footer_nav}>
            <h4 className={styles.footer_title}>빠른링크</h4>
            <ul className={styles.footer_ul}>
              <li>
                <Link to="/attraction/list">생태관광지</Link>
              </li>
              <li>
                <Link to="/course/list">관광코스</Link>
              </li>
              <li>
                <Link to="/board/list">커뮤니티</Link>
              </li>
              <li>
                <Link to="/">투어상품</Link>
              </li>
            </ul>
          </div>
          <div className={styles.site_addr}>
            <p>상호 : 사이트이름 | 대표자명 : 홍길동 | 개인정보 전화번호 :</p>
            <p>전화번호 : 02-123-1234 | 이메일 :khproject@naver.com </p>
            <p>주소 : 서울시 종로구 우정국로2길 21 대왕빌딩</p>
          </div>
          <div className={styles.site_copyright}>
            <p>이용약관 개인정보취급방침</p>
            <p>KH 정보교육원 프로젝트 자료입니다</p>
            <p>무단복제를 허용하지 않습니다</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
