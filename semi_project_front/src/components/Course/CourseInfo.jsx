import styles from "./CourseInfo.module.css";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation } from "react-router-dom";

const CourseInfo = ({ attractionList, listLength }) => {
  const mapDivRef = useRef(null);
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }

    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(37.5696734, 126.9843022),
      zoom: 10,
    });

    var polyline = new naver.maps.Polyline({
      map: map,
      path: [],
      strokeColor: "#ff6f61",
      strokeWeight: 2,
    });

    const bounds = new naver.maps.LatLngBounds();
    const coords = [];

    attractionList.forEach((spot) => {
      naver.maps.Service.geocode(
        { query: spot.attractionAddr },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) return;
          if (!response.v2 || response.v2.addresses.length === 0) return;

          const result = response.v2.addresses[0];
          const latlng = new naver.maps.LatLng(result.y, result.x);

          bounds.extend(latlng);

          const marker = new naver.maps.Marker({
            position: latlng,
            map: map,
            icon: {
              content: `
                    <div style="
                      background-color:#ffffff;
                      color:#ff6f61;
                      font-weight:bold;
                      border-radius:50%;
                      border : 3px solid #ff6f61;
                      width:30px;
                      height:30px;
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      font-size:14px;
                    ">
                      ${spot.courseIndex}
                    </div>
                  `,
              size: new naver.maps.Size(10, 10),
              anchor: new naver.maps.Point(13, 16),
            },
          });

          coords.push({ index: spot.courseIndex, latlng });

          if (coords.length === attractionList.length) {
            coords.sort((a, b) => a.index - b.index);

            polyline.setPath(coords.map((c) => c.latlng));
          }
          map.fitBounds(bounds, {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          });
        },
      );
    });
  }, [attractionList]);
  return (
    <>
      <div className={styles.course_info_wrap}>
        <div className={styles.course_info}>
          {attractionList.map((attraction, index) => {
            return (
              <AttractionInfoItem
                key={"key-" + index}
                attraction={attraction}
                listLength={listLength}
              />
            );
          })}
        </div>
        <div className={styles.course_map} ref={mapDivRef}></div>
      </div>
    </>
  );
};

const AttractionInfoItem = ({ attraction, listLength }) => {
  const location = useLocation();
  const courseWritePage = location.pathname === "/course/write";
  const listIndexDown = () => {};
  const listIndexUp = () => {};
  return (
    <>
      <div className={styles.info_item_wrap}>
        <div className={styles.attraction_index}>
          <div
            className={
              courseWritePage ? styles.index_num_write : styles.index_num
            }
          >
            <p>{attraction.courseIndex}</p>
          </div>
          <div className={styles.index_bar}></div>
        </div>
        {courseWritePage && (
          <div className={styles.course_write_index}>
            {listLength !== 1 && attraction.courseIndex === 1 && (
              <KeyboardArrowDownIcon onClick={listIndexDown()} />
            )}
            {attraction.courseIndex !== 1 &&
              attraction.courseIndex !== listLength && (
                <>
                  <KeyboardArrowUpIcon onClick={listIndexUp()} />{" "}
                  <KeyboardArrowDownIcon onClick={listIndexDown()} />{" "}
                </>
              )}
            {listLength !== 1 && attraction.courseIndex === listLength && (
              <KeyboardArrowUpIcon onClick={listIndexUp()} />
            )}
          </div>
        )}
        <div className={styles.attraction_img_wrap}>
          <img src={attraction.attractionThumb} />
          <div className={styles.img_back}></div>
          <p className={styles.info_attraction_title}>
            {attraction.attractionTitle}
          </p>
        </div>
        {courseWritePage && <div className={styles.course_write_delete}></div>}
      </div>
    </>
  );
};

export default CourseInfo;
