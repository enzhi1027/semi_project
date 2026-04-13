import styles from "./Commons.module.css";
import introImg1 from "../../assets/img/mainPage/intro1.jpg";
import community from "../../assets/img/mainPage/community.jpg";
import tour from "../../assets/img/mainPage/tour.jpg";
import { Link, useNavigate } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";

const MainPage = () => {
  const navigate = useNavigate();
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
              <div className={styles.intro_title_wrap}>
                <h3 className={styles.intro_title}>Welcome</h3>
                <h3 className={styles.intro_title_logo}>LeafyGo</h3>
              </div>
              <div className={styles.intro_title_content}>
                <p>
                  <span className={styles.text_bold_point}>LeafyGo는</span>{" "}
                  자연을 지키는 생태 관광 이야기를 함께 나누는 커뮤니티입니다.
                </p>
                <p>
                  각종 생태 관광지 안내부터 관광지 리뷰, 정보와 경험을 함께
                  나누며 생태 관광에 관심을 가지는 공간입니다
                </p>
              </div>
            </div>
            <div className={styles.intro_bottom_wrap}>
              <div className={styles.intro_bottom}>
                <div className={styles.service_title}>
                  <div className={styles.service_line}></div>
                  <h3>Service</h3>
                  <div className={styles.service_line}></div>
                </div>
                <div className={styles.intro_content_wrap}>
                  <div className={styles.intro_content}>
                    <div className={styles.content_img}>
                      <img src={introImg1} />
                    </div>
                    <div className={styles.content_text}>
                      <h3>생태관광</h3>
                      <div>
                        <p>
                          <span className={styles.text_bold}>
                            생태관광이란 무엇일까요?{" "}
                          </span>
                        </p>
                        <p>
                          생태계와 문화를 지키는
                          <span className={styles.text_bold}>
                            {" "}
                            책임감 있는 여행{" "}
                          </span>
                        </p>
                        <p>
                          <span className={styles.text_bold_point}>
                            LeafyGo
                          </span>
                          는 전국의 생태 관광지 안내부터
                        </p>
                        <p>직접 만드는 생태관광 코스를 서비스합니다</p>

                        <EastIcon
                          className={styles.eastIcon_wrap}
                          sx={{ fontSize: "40px", fill: "var(--gray8)" }}
                          onClick={() => {
                            navigate("/attraction/list");
                          }}
                        />
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
                          <span className={styles.text_bold_point}>
                            LeafyGo
                          </span>
                          는 생태관광 기반의{" "}
                          <span className={styles.text_bold}>커뮤니티</span>
                          입니다.
                        </p>
                        <p>각종 생태관광지에 다녀온 후기글 부터 </p>
                        <p>생태관광과 관련 정보들을 공유하고 나누며,</p>
                        <p>다양한 이야기들을 볼 수 있는 커뮤니티입니다</p>
                        <EastIcon
                          className={styles.eastIcon_wrap}
                          sx={{ fontSize: "40px", fill: "var(--gray8)" }}
                          onClick={() => {
                            navigate("/board/list");
                          }}
                        />
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
                        <EastIcon
                          className={styles.eastIcon_wrap}
                          sx={{ fontSize: "40px", fill: "var(--gray8)" }}
                          onClick={() => {
                            navigate("/tour/list");
                          }}
                        />
                      </div>
                    </div>
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
