import { useEffect, useState } from "react";
import styles from "./AdminContent.module.css";
import axios from "axios";
import AdminMember from "./AdminMember";
import AdminBoard from "./AdminBoard";

const AdminContent = () => {
  const [tab, setTab] = useState("board");

  return (
    <section className={styles.admin_content_wrap}>
      <h3 className={styles.page_title}>회원, 게시판 관리</h3>
      <div className={styles.board_and_member_tap}>
        <span
          className={tab === "board" ? styles.active_tab : ""}
          onClick={() => {
            setTab("board");
          }}
        >
          게시글 관리
        </span>
        <span
          className={tab === "member" ? styles.active_tab : ""}
          onClick={() => {
            setTab("member");
          }}
        >
          회원 관리
        </span>
      </div>

      <div>
        {tab === "board" && <AdminBoard />}
        {tab === "member" && <AdminMember />}
      </div>
    </section>
  );
};

export default AdminContent;
