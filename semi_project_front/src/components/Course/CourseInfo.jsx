import styles from "./CourseInfo.module.css";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClearIcon from "@mui/icons-material/Clear";
import { useLocation, useMatch } from "react-router-dom";

const CourseInfo = ({
  attractionList,
  listLength,
  setCreateAttractionList,
  setAddAttractionList,
}) => {
  //네이버맵 지정하는 REF
  const mapDivRef = useRef(null);

  //네이버맵 실행을 위한 useEffect
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
                      width:28px;
                      height:28px;
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
                index={index}
                attractionList={attractionList}
                setCreateAttractionList={setCreateAttractionList}
                setAddAttractionList={setAddAttractionList}
              />
            );
          })}
        </div>
        <div className={styles.course_map} ref={mapDivRef}></div>
      </div>
    </>
  );
};

const AttractionInfoItem = ({
  attraction,
  listLength,
  index,
  attractionList,
  setCreateAttractionList,
  setAddAttractionList,
}) => {
  //코스 상세보기 페이지랑 작성페이지 구분을 위한 로케이션
  const location = useLocation();
  const courseWritePage = location.pathname === "/course/write";
  const courseUpdatePage = location.pathname === "/course/update/*";
  const match = useMatch("/course/update/*");

  //어트랙션 리스트에 관광지 코스 순서 추가
  if (courseWritePage || match) {
    attraction.courseIndex = index + 1;
  }

  //관광지 코스순서 앞당기는 함수
  const attractionIndexDown = () => {
    if (index >= attractionList.length - 1) {
      return;
    }
    setCreateAttractionList((prev) => {
      const newList = [...prev];
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
      return newList;
    });
  };

  //관광지 코스순서 뒤로 미는 함수
  const attractionIndexUp = () => {
    if (index <= 0) {
      return;
    }
    setCreateAttractionList((prev) => {
      const newList = [...prev];
      [newList[index - 1], newList[index]] = [
        newList[index],
        newList[index - 1],
      ];
      return newList;
    });
  };

  //코스 생성에서 관광지 제거하는 함수
  const deleteAttraction = () => {
    setCreateAttractionList((prev) =>
      prev.filter((item) => item !== attraction),
    );
  };
  return (
    <>
      <div
        className={
          courseWritePage || match
            ? styles.info_item_wrap_write
            : styles.info_item_wrap
        }
      >
        <div className={styles.attraction_index}>
          <div
            className={
              courseWritePage || match
                ? styles.index_num_write
                : styles.index_num
            }
          >
            <p>{attraction.courseIndex}</p>
          </div>
          <div
            className={
              courseWritePage || match
                ? styles.index_bar_write
                : styles.index_bar
            }
          ></div>
        </div>
        {(courseWritePage || match) && (
          <div className={styles.course_write_index}>
            {listLength !== 1 && attraction.courseIndex === 1 && (
              <KeyboardArrowDownIcon onClick={attractionIndexDown} />
            )}
            {attraction.courseIndex !== 1 &&
              attraction.courseIndex !== listLength && (
                <>
                  <KeyboardArrowUpIcon onClick={attractionIndexUp} />{" "}
                  <KeyboardArrowDownIcon onClick={attractionIndexDown} />{" "}
                </>
              )}
            {listLength !== 1 && attraction.courseIndex === listLength && (
              <KeyboardArrowUpIcon onClick={attractionIndexUp} />
            )}
          </div>
        )}
        <div className={styles.attraction_img_wrap}>
          <img
            src={
              attraction.attractionThumb
                ? attraction.attractionThumb
                : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
            }
          />
          <div className={styles.img_back}></div>
          <p className={styles.info_attraction_title}>
            {attraction.attractionTitle}
          </p>
        </div>
        {(courseWritePage || match) && (
          <div className={styles.course_write_delete}>
            <ClearIcon onClick={deleteAttraction} />
          </div>
        )}
      </div>
    </>
  );
};

export default CourseInfo;
