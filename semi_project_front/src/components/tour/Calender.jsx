import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ko } from "date-fns/locale"; // 한국어 설정 (선택사항)
import styles from "./Calender.module.css";

const Calender = () => {
  const [startDate, setStartDate] = useState(null);
  const datePickerRef = useRef(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className={styles.datepicker_container}>
      <CalendarMonthIcon
        className={styles.calendar_icon}
        onClick={handleIconClick}
      />
      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        locale={ko}
        dateFormat="yyyy.MM.dd"
        placeholderText="출발일 선택"
        className={styles.custom_input}
        minDate={new Date()}
        onFocus={(e) => e.target.blur()}
      />
    </div>
  );
};

export default Calender;
