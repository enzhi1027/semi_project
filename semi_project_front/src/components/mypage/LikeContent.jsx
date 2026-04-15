import { useEffect, useState } from "react";
import styles from "./LikeContent.module.css";
import LikeAttraction from "./LikeConponents/LikeAttraction";
import LikeCourse from "./LikeConponents/LikeCourse";
import BoardList from "../board/BoardList";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";

const LikeContent = () => {
  const [tab, setTab] = useState("likeAttraction");
  const { memberId } = useAuthStore();
  const [likeBoardList, setLikeBoardList] = useState([]);

  useEffect(() => {
    if (tab === "likeBoard" && memberId) {
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/members/like-list/${memberId}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return (
    <section className={styles.like_content_wrap}>
      <h3 className={styles.page_title}>좋아요 표시한 컨텐츠</h3>
      <div className={styles.like_content_tap}>
        <span
          className={tab === "likeAttraction" ? styles.active_tab : ""}
          onClick={() => {
            setTab("likeAttraction");
          }}
        >
          관광지
        </span>
        <span
          className={tab === "likeBoard" ? styles.active_tab : ""}
          onClick={() => {
            setTab("likeBoard");
          }}
        >
          게시글
        </span>
        <span
          className={tab === "likeCourse" ? styles.active_tab : ""}
          onClick={() => {
            setTab("likeCourse");
          }}
        >
          관광 코스
        </span>
      </div>

      <div>
        {tab === "likeAttraction" && <LikeAttraction />}
        {tab === "likeBoard" && <BoardList />}
        {tab === "likeCourse" && <LikeCourse />}
      </div>
    </section>
  );
};

export default LikeContent;
