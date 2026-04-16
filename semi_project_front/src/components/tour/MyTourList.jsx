import { useEffect, useState, useRef } from "react";
import styles from "./MyTourList.module.css";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

const MyTourList = ({
  wishlistList,
  setWishlistList,
  memberId,
  emojiList,
  EMOJI_COMPONENTS,
}) => {
  const [wishItemList, setWishItemList] = useState([]);
  const [wishlistNo, setWishlistNo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cleaningListResult, setCleaningListResult] = useState(0);
  const [deleteListResult, setDeleteListResult] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const currentWishlist = wishlistList.find(
    (l) => l.tourWishlistNo === wishlistNo,
  );
  const [newName, setNewName] = useState(currentWishlist?.tourWishlistName);

  useEffect(() => {
    if (wishlistList.length > 0) {
      setWishlistNo(wishlistList[0].tourWishlistNo);
    }
  }, [wishlistList]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/tours/wishItem/${memberId}`)
      .then((res) => {
        setWishItemList(res.data);
      })
      .catch((err) => console.log(err));
  }, [memberId, cleaningListResult]);

  useEffect(() => {
    setNewName(currentWishlist?.tourWishlistName);
    setIsEditing(false);
  }, [wishlistNo]);

  const filteredItems = wishItemList.filter(
    (item) => item.tourWishlistNo === wishlistNo,
  );

  const isListEmpty = filteredItems.length === 0;

  const cleaningList = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/tours/deleteWish/${wishlistNo}`,
      )
      .then((res) => {
        setCleaningListResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteList = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/tours/deleteWishlist/${wishlistNo}`,
      )
      .then((res) => {
        setDeleteListResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditStart = () => setIsEditing(true);

  const handleEditSave = () => {
    // 여기서 axios.patch 등으로 서버에 이름 수정 요청을 보내면 됩니다!
    console.log("새 이름 저장:", newName);
    setIsEditing(false);
  };

  useEffect(() => {
    console.log(deleteListResult);
  }, [deleteListResult]);
  return (
    <div className={styles.my_tour_list_wrap}>
      <div className={styles.my_tour_list_sidebar}>
        {wishlistList.map((list, index) => {
          const targetEmoji = emojiList.find((e) => e.emojiNo === list.emojiNo);
          const IconComponent = EMOJI_COMPONENTS[targetEmoji?.emojiName];
          return (
            <div
              key={"wishlistName-" + index}
              className={styles.my_tour_list_menu}
              onClick={() => {
                setWishlistNo(list.tourWishlistNo);
                setIsMenuOpen(false);
              }}
            >
              {IconComponent ? <IconComponent /> : <StarIcon />}
              <div
                className={`${styles.my_tour_list_name} ${
                  wishlistNo === list.tourWishlistNo && styles.active_list
                }`}
              >
                {list.tourWishlistName}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`${styles.my_tour_list_content} ${isListEmpty ? styles.my_tour_list_empty : ""}`}
      >
        <div className={styles.content_header}>
          <h3 className={styles.content_title}>
            <input
              type="text"
              className={`${styles.title_input} ${isEditing ? styles.editing : ""}`}
              value={newName || ""}
              onChange={(e) => setNewName(e.target.value)}
              readOnly={!isEditing}
              onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
              autoFocus={isEditing}
            />
            {isEditing ? (
              <CheckIcon
                className={styles.save_icon}
                onClick={handleEditSave}
              />
            ) : (
              <EditIcon
                className={styles.edit_icon}
                onClick={handleEditStart}
              />
            )}
          </h3>
          <div className={styles.more_menu_container}>
            <button
              className={styles.more_button}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreVertIcon />
            </button>

            {isMenuOpen && (
              <div className={styles.menu_popup}>
                <button
                  className={styles.popup_item}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (isListEmpty) {
                      Swal.fire({
                        title: "현재 리스트에 담긴 상품이 없습니다",
                        icon: "info",
                      });
                    } else {
                      Swal.fire({
                        title: "리스트를 비우시겠습니까?",
                        text: "이전 상태로 되돌릴 수 없습니다",
                        icon: "question",
                        confirmButtonColor: "var(--color1)",
                        confirmButtonText: "비우기",
                        showCancelButton: true,
                        cancelButtonColor: "var(--gray4)",
                        cancelButtonText: "취소",
                      }).then((result) => {
                        if (result.isConfirmed) cleaningList();
                      });
                    }
                  }}
                >
                  <CleaningServicesIcon fontSize="small" />
                  <span>리스트 비우기</span>
                </button>
                <button
                  className={`${styles.popup_item} ${styles.delete_item}`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    Swal.fire({
                      title: "리스트를 삭제하시겠습니까?",
                      text: "삭제된 리스트는 되살릴 수 없습니다",
                      icon: "question",
                      confirmButtonColor: "var(--color1)",
                      confirmButtonText: "삭제",
                      showCancelButton: true,
                      cancelButtonColor: "var(--gray4)",
                      cancelButtonText: "취소",
                    }).then((result) => {
                      if (result.isConfirmed) deleteList();
                    });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                  <span>리스트 삭제</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {isListEmpty ? (
          <div className={styles.empty_list_message}>
            <p>리스트가 비어있습니다</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={`wish-item-${index}`} className={styles.wish_item_card}>
              <div className={styles.image_container}>
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}/tourItemImg/${item.tourItemImgPath}`}
                  alt={item.tourItemName}
                />
                <button className={styles.heart_button}>
                  <FavoriteIcon className={styles.heart_icon} />
                </button>
              </div>

              <div className={styles.item_info_wrap}>
                <div className={styles.item_name}>{item.tourItemName}</div>
                <div className={styles.item_period}>
                  📅 {item.startPeriod} ~ {item.endPeriod}
                </div>
              </div>

              <div className={styles.item_price_wrap}>
                <div className={styles.price_adult}>
                  <span className={styles.price_label}>성인 </span>
                  {item.tourItemAdultPrice?.toLocaleString()}원
                </div>
                <div className={styles.price_kid}>
                  <span className={styles.price_label}>아동 </span>
                  {item.tourItemKidPrice?.toLocaleString()}원
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTourList;
