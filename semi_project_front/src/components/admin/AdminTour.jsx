import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import styles from "./AdminTour.module.css";
import { useState } from "react";

const AdminTour = () => {
  const navigate = useNavigate();

  const isnertItem = () => {
    navigate("/admintour/insertitem");
  };

  return (
    <div>
      <h3>투어 상품 관리(상품 목록)</h3>
      <Button className="btn" onClick={isnertItem}>
        상품 등록
      </Button>
    </div>
  );
};

export default AdminTour;
