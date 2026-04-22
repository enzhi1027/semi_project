import styles from "./Commons.module.css";
import { Link } from "react-router-dom";
import insta from "../../assets/img/footer/instagram.png";
import facebook from "../../assets/img/footer/facebook.png";
import twitter from "../../assets/img/footer/twitter.png";
import youtube from "../../assets/img/footer/youtube.png";

const Footer = () => {
  return (
    <>
      <div className={styles.footer_wrap}>
        <div className={styles.footer}>
          <div className={styles.content_top}>
            <div className={styles.site_info}>
              <h4 className={styles.footer_title}>LeafyGo</h4>
              <ul className={styles.footer_ul}>
                <li>자연을 지키는 생태관광</li>
                <li>함께 만드는 생태관광 커뮤니티</li>
                <li>Natural Ecotourism Platform</li>
              </ul>
            </div>
            <div className={styles.footer_nav}>
              <h2 className={styles.nav_menu}>Menu</h2>
              <ul className={styles.footer_nav_ul}>
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
                  <Link to="/tour/list">투어상품</Link>
                </li>
              </ul>
            </div>
            <div className={styles.site_contacts}>
              <h3 className={styles.contacts}>Contacts</h3>
              <p className={styles.contacts_phone}>사업자번호 : 02-123-1234</p>
              <p>이메일 : leafygo@gmail.com</p>
              <div className={styles.sns_img_wrap}>
                <div className={styles.sns_img}>
                  <img src={facebook} />
                </div>
                <div className={styles.sns_img}>
                  <img src={insta} />
                </div>
                <div className={styles.sns_img}>
                  <img src={twitter} />
                </div>
                <div className={styles.sns_img_youtube}>
                  <img src={youtube} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.content_bottom}>
            <div className={styles.site_addr}>
              <p>상호 : LeafyGo | 대표자명 : 홍길동</p>
              <p>주소 : 서울시 종로구 우정국로2길 21 대왕빌딩</p>
            </div>
            <div className={styles.site_copyright}>
              <div className={styles.copyright_top}>
                <p>이용약관 </p>
                <p>개인정보취급방침</p>
              </div>
              <p>무단복제를 허용하지 않습니다</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
