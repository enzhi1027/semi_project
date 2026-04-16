import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ko } from "date-fns/locale";
import styles from "./Calender.module.css";

const Calender = ({ startDate, setStartDate }) => {
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
        onChange={(selectedDate) => setStartDate(selectedDate)}
        locale={ko}
        dateFormat="yyyy.MM.dd"
        placeholderText="출발일 선택"
        className={styles.custom_input}
        minDate={new Date()}
        onFocus={(e) => e.target.blur()}
        showPopperArrow={false}
      />
    </div>
  );
};

export default Calender;
