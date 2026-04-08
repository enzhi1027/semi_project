import { useEffect, useState } from "react";
import styles from "./AttractionReview.module.css";
import axios from "axios";

const AttractionReview = ({ attractionNo }) => {
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/attractions/reviewList/${attractionNo}`,
      )
      .then((res) => {
        setReviewList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <>{reviewList && <div></div>}</>;
};

export default AttractionReview;
