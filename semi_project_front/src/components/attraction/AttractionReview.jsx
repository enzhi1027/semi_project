import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AttractionReview.module.css";
import axios from "axios";

const AttractionReview = ({ attractionNo, reviewCategory }) => {
  const [reviewList, setReviewList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/attractions/reviewList/${attractionNo}/${reviewCategory}`,
      )
      .then((res) => {
        setReviewList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewCategory]);

  return (
    <div className={styles.attraction_review_wrap}>
      {reviewList.length !== 0 ? (
        <>
          <div className={styles.attraction_reviews}>
            <div>
              {reviewList.map((review, index) => {
                return (
                  <div
                    className={styles.attraction_review}
                    key={"review" + index}
                    onClick={() => {
                      console.log("dpd");
                      navigate(`/board/view/${review.boardNo}`);
                    }}
                  >
                    <div className={styles.review_img}>
                      <img
                        src={
                          review.boardThumb
                            ? review.boardThumb
                            : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                        }
                      />
                    </div>
                    <div className={styles.review_title}>
                      {review.boardTitle}
                    </div>
                    <div className={styles.review_footer}>
                      <div className={styles.review_writer}>
                        {review.boardWriter}
                      </div>
                      <div className={styles.review_date}>
                        {review.boardDate}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.attraction_review_empty_space}></div>
          </div>
        </>
      ) : (
        <div>등록된 리뷰가 없습니다.</div>
      )}
    </div>
  );
};

export default AttractionReview;
