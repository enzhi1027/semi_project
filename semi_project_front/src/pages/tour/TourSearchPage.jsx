import styles from "./TourSearchPage.module.css";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import Swal from "sweetalert2";
import TourProductList from "../../components/tour/TourProductList";
import axios from "axios";
import OwnCalendar from "../../components/tour/Calender";

const TourSearchPage = () => {
  const navigate = useNavigate();
  const { memberId, isReady } = useAuthStore();

  const [searchWhere, setSearchWhere] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");
  const [searchWhen, setSearchWhen] = useState("");

  const [wishlistList, setWishlistList] = useState([]);

  const [recommendItemList, setRecommendItemList] = useState([]);
  const [allItemList, setAllItemList] = useState([]);

  const [searchItemList, setSearchItemList] = useState([]);

  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();

  const [allClickedItems, setAllClickedItems] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/wishlistList/${memberId}`)
      .then((res) => {
        setWishlistList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/priceMin`)
      .then((res) => {
        setPriceMin(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/priceMax`)
      .then((res) => {
        setPriceMax(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/searchItem`, {
        params: {
          searchWhere: searchWhere,
          searchPriceMin: searchPriceMin,
          searchPriceMax: searchPriceMax,
          searchWhen: searchWhen,
        },
      })
      .then((res) => {
        setSearchItemList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchWhere, searchPriceMin, searchPriceMax, searchWhen]);

  useEffect(() => {
    console.log(searchPriceMin);
  }, [searchPriceMin]);
  return (
    <>
      <section className={styles.tour_search_wrap}>
        <div className={styles.menubar}>
          <div className={styles.menubar_search_wrap}>
            <div className={styles.search_where}>
              <input
                type="text"
                placeholder="어디로 여행 가세요?"
                value={searchWhere}
                onChange={(e) => {
                  setSearchWhere(e.target.value);
                }}
              />
              <SearchIcon />
            </div>
            <div className={styles.search_price}>
              <SellIcon />
              <input
                type="text"
                placeholder={priceMin && priceMin.toLocaleString()}
                value={searchPriceMin}
                onChange={(e) => {
                  setSearchPriceMin(e.target.value.replace(/\D/g, ""));
                }}
                className={styles.price_min}
              />
              <div>~</div>
              <input
                type="text"
                placeholder={priceMax && priceMax.toLocaleString()}
                value={searchPriceMax}
                onChange={(e) => {
                  setSearchPriceMax(e.target.value.replace(/\D/g, ""));
                }}
                className={styles.price_max}
              />
              <SearchIcon />
            </div>
            <div className={styles.search_when}>
              <OwnCalendar />
            </div>
          </div>
          <div className={styles.menubar_icon_wrap}>
            <div
              className={styles.icon_mypage}
              onClick={() => {
                if (isReady && memberId == null) {
                  Swal.fire({
                    title: "로그인 후 이용 가능합니다.",
                    icon: "warning",
                  });
                } else {
                  navigate("/tour/mypage");
                }
              }}
            >
              <AccountCircleIcon />
            </div>
            <div
              className={styles.icon_cart}
              onClick={() => {
                if (isReady && memberId == null) {
                  Swal.fire({
                    title: "로그인 후 이용 가능합니다.",
                    icon: "warning",
                  });
                } else {
                  navigate("/tour/mypage");
                }
              }}
            >
              <ShoppingCartIcon />
            </div>
          </div>
        </div>

        <div className={styles.tour_product_wrap}>
          {searchWhere === "" &&
          searchPriceMin === "" &&
          searchPriceMax === "" ? (
            <TourProductList
              memberId={memberId}
              isReady={isReady}
              wishlistList={wishlistList}
              setWishlistList={setWishlistList}
              recommendItemList={recommendItemList}
              setRecommendItemList={setRecommendItemList}
              allItemList={allItemList}
              setAllItemList={setAllItemList}
              type="list"
              allClickedItems={allClickedItems}
              setAllClickedItems={setAllClickedItems}
            />
          ) : (
            <TourProductList
              memberId={memberId}
              isReady={isReady}
              wishlistList={wishlistList}
              setWishlistList={setWishlistList}
              searchItemList={searchItemList}
              setSearchItemList={setSearchItemList}
              type="search"
              allClickedItems={allClickedItems}
              setAllClickedItems={setAllClickedItems}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default TourSearchPage;
