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
              <Link to="/attraction/list" className={styles.attraction_btn}>
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
                  각종 생태 관광지 안내부터 관광지 리뷰, 정보와 경험을 나누며
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
                    <p>
                      <span className={styles.text_bold}>생태관광이란? </span>
                      단순히 자연경관을 구경하는 것을
                    </p>
                    <p>넘어, 지역의 생태계와 문화를 보존하고 지역 주민</p>
                    <p>
                      에게 도움을 주는{" "}
                      <span className={styles.text_bold}>
                        **책임감 있는 여행**{" "}
                      </span>
                      입니다.
                    </p>
                    <p>
                      <span className={styles.text_bold_point}>LeafyGo</span>는
                      전국의 각종 생태 관광지 안내부터
                    </p>
                    <p>사용자가 직접 만든 생태관광 코스까지 다양한</p>
                    <p>생태관광 관련 서비스를 제공합니다.</p>
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
                    <p>
                      <span className={styles.text_bold_point}>LeafyGo</span>는
                      생태관광 기반의 커뮤니티입니다.
                    </p>
                    <p>각종 생태관광지에 다녀온 후기글 부터 </p>
                    <p>생태관광과 관련한 정보들을 공유하고 나누며,</p>
                    <p>그 외 다양한 이야기를 볼 수 있는 커뮤니티입니다.</p>
                    <p>에코 라이프스타일을 실천하는 멤버들과 함게</p>
                    <p>지속 가능한 깨끗한 미래를 함께 만들어갑시다.</p>
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
