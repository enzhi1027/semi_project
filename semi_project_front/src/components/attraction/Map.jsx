import { useEffect, useRef } from "react";
import styles from "./Map.module.css";

function Map() {
  const mapDivRef = useRef(null);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return;

    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(33.486284, 126.715366),
      zoom: 14,
      minZoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

    async function initMarker() {
      try {
        // const coords = await getLatLng(
        //   "제주특별자치도 제주시 조천읍 동백로 77",
        // );

        new naver.maps.Marker({
          position: new naver.maps.LatLng(37.2625, 126.8436),
          map: map,
        });

        new naver.maps.Marker({
          position: new naver.maps.LatLng(33.52360988, 126.8634256),
          map: map,
        });
      } catch (err) {
        console.error("좌표 변환 실패:", err);
      }
    }

    initMarker();
  }, []);

  return <div className={styles.map} ref={mapDivRef}></div>;
}

async function getLatLng(address) {
  const res = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
      address,
    )}`,
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": "YOUR_CLIENT_ID",
        "X-NCP-APIGW-API-KEY": "YOUR_CLIENT_SECRET",
      },
    },
  );

  if (!res.ok) {
    throw new Error("API 요청 실패");
  }

  const data = await res.json();

  if (!data.addresses || data.addresses.length === 0) {
    throw new Error("주소 결과 없음");
  }

  const { x, y } = data.addresses[0];

  return {
    lat: parseFloat(y),
    lng: parseFloat(x),
  };
}

export default Map;
