import styles from "./TourCartList.module.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";

const TourCartList = ({
  tourCartList,
  selectedIds,
  setSelectedIds,
  updateQuantity,
  deleteSelected,
}) => {
  const isAllSelected =
    tourCartList.length > 0 && selectedIds.length === tourCartList.length;

  const toggleAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(tourCartList.map((item) => item.tourCartNo));
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const getDayString = (startDate, days) => {
    const start = new Date(startDate);
    const end = addDays(start, days - 1);
    const formatStr = "yyyy.MM.dd(eee)";
    const dateRange = `${format(start, formatStr, { locale: ko })} ~ ${format(end, formatStr, { locale: ko })}`;
    const night = days > 1 ? `${days - 1}박 ${days}일` : "당일 치기";
    return `${dateRange} | ${night}`;
  };

  return (
    <div className={styles.list_container}>
      <div className={styles.list_header}>
        <label className={styles.check_label}>
          <input type="checkbox" checked={isAllSelected} onChange={toggleAll} />
          <span>
            전체 선택 ({selectedIds.length}/{tourCartList.length})
          </span>
        </label>
        <button className={styles.delete_btn} onClick={deleteSelected}>
          선택 삭제
        </button>
      </div>

      <div className={styles.list_content}>
        {tourCartList.length === 0 ? (
          <div className={styles.empty_msg}>
            장바구니에 담긴 상품이 없습니다.
          </div>
        ) : (
          tourCartList.map((item) => (
            <div key={item.tourCartNo} className={styles.cart_item}>
              <input
                type="checkbox"
                className={styles.item_check}
                checked={selectedIds.includes(item.tourCartNo)}
                onChange={() => toggleSelect(item.tourCartNo)}
              />
              <div className={styles.img_box}>
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}/tourItemImg/${item.tourItemImgPath}`}
                  alt="tour"
                />
              </div>
              <div className={styles.info_box}>
                <div className={styles.item_name}>{item.tourItemName}</div>
                <div className={styles.item_date}>
                  {getDayString(item.tourCartStartDate, item.tourItemDays)}
                </div>
                <div className={styles.count_control_wrap}>
                  <div className={styles.count_group}>
                    <span className={styles.label}>성인</span>
                    <div className={styles.counter}>
                      <button
                        onClick={() =>
                          updateQuantity(item.tourCartNo, "adult", -1)
                        }
                      >
                        <RemoveIcon />
                      </button>
                      <span>{item.tourCartAdult}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.tourCartNo, "adult", 1)
                        }
                      >
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.count_group}>
                    <span className={styles.label}>
                      소아 <small>(만 12세 미만)</small>
                    </span>
                    <div className={styles.counter}>
                      <button
                        onClick={() =>
                          updateQuantity(item.tourCartNo, "kid", -1)
                        }
                      >
                        <RemoveIcon />
                      </button>
                      <span>{item.tourCartKid}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.tourCartNo, "kid", 1)
                        }
                      >
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.price_box}>
                {(
                  item.tourCartAdult * item.tourItemAdultPrice +
                  item.tourCartKid * item.tourItemKidPrice
                ).toLocaleString()}
                원
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TourCartList;
