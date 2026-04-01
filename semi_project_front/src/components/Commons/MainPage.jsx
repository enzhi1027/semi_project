import styles from "./Commons.module.css";
import introImg1 from "../../assets/img/mainPage/intro1.jpg";
import community from "../../assets/img/mainPage/community.jpg";
import tour from "../../assets/img/mainPage/tour.jpg";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.main_wrap}>
          <section className={styles.main_content}>
            <div className={styles.content_wrap}>
              <h3 className={styles.content_title}>생태 관광 서비스</h3>
              <div className={styles.content}>
                <p>자연을 지키는 여행</p>
                <p>함께 만드는 생태관광 커뮤니티</p>
              </div>
              <Link to="/" className={styles.attraction_btn}>
                관광지 목록보기
              </Link>
            </div>
          </section>
          <section className={styles.site_intro}>
            <div className={styles.intro_top}>
              <h3 className={styles.intro_title}>사이트 소개</h3>
              <div className={styles.intro_title_content}>
                <p>
                  LeafyGo는 자연을 지키는 생태 관광 이야기를 함께 나누는
                  커뮤니티입니다.
                </p>
                <p>
                  각종 생태 관광지 안내부터 관광지 리뷰, 정보와 경험을 나무며
                  생태 관광에 관심을 가지는 공간입니다
                </p>
              </div>
            </div>
            <div className={styles.intro_bottom}>
              <div className={styles.intro_content}>
                <div className={styles.content_img}>
                  <img src={introImg1} />
                </div>
                <div className={styles.content_text}>
                  <h3>생태관광</h3>
                  <div>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                  </div>
                </div>
              </div>
              <div className={styles.intro_content}>
                <div className={styles.content_img}>
                  <img src={community} />
                </div>
                <div className={styles.content_text}>
                  <h3>커뮤니티</h3>
                  <div>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                  </div>
                </div>
              </div>
              <div className={styles.intro_content}>
                <div className={styles.content_img}>
                  <img src={tour} />
                </div>
                <div className={styles.content_text}>
                  <h3>투어상품</h3>
                  <div>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                    <p>컨텐츠 내용에 들어가야할 텍스트~~~</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MainPage;
