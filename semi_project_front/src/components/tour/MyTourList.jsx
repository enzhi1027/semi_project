import { useEffect, useState } from "react";
import styles from "./MyTourList.module.css";
import axios from "axios";

const MyTourList = ({ wishlistList, setWishlistList, memberId }) => {
  const [wishItemList, setWishItemList] = useState([]);
  const [wishlistNo, setWishlistNo] = useState([]);

  useEffect(() => {
    if (wishlistList.length > 0) {
      setWishlistNo(wishlistList[0].tourWishlistNo);
    }
  }, [wishlistList]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/wishItem/${memberId}`)
      .then((res) => {
        console.log(res.data);
        setWishItemList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.my_tour_list_wrap}>
      <div className={styles.my_tour_list_sidebar}>
        {wishlistList.map((list, index) => {
          return (
            <div
              className={`${styles.my_tour_list_name} ${wishlistNo === list.tourWishlistNo && styles.active_list}`}
              onClick={() => {
                setWishlistNo(list.tourWishlistNo);
              }}
              key={"wishlistName-" + index}
            >
              {list.tourWishlistName}
            </div>
          );
        })}
      </div>

      <div className={styles.my_tour_list_content}>
        {wishlistList.map((list, index) => {
          if (wishlistNo === list.tourWishlistNo) {
            {
              wishItemList.map((item, index) => {
                if (wishlistNo === item.tourWishlistNo) {
                  console.log(index + "번쨰");
                  console.log(item);
                  return (
                    <div>
                      <div>{item.tourItemName}</div>
                    </div>
                  );
                }
              });
            }
          }
        })}
      </div>
    </div>
  );
};

export default MyTourList;
