import { useEffect, useRef } from "react";
import styles from "./Map.module.css";

function Map({ addressList, currentList }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return;

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapDivRef.current, {
        center: new naver.maps.LatLng(36.5, 127.5),
        zoom: 7,
      });

      infoWindowRef.current = new naver.maps.InfoWindow({
        content: "",
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        anchorSize: new naver.maps.Size(10, 10),
        pixelOffset: new naver.maps.Point(0, -10),
      });

      naver.maps.Event.addListener(mapRef.current, "click", () => {
        if (infoWindowRef.current.getMap()) {
          infoWindowRef.current.close();
        }
      });
    }

    let isCancelled = false;

    const initMarkers = async () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      if (!addressList || addressList.length === 0) return;

      const bounds = new naver.maps.LatLngBounds();
      const newMarkers = [];

      const markerPromises = addressList.map(async (item) => {
        try {
          const coords = await getLatLng(item.addr);
          if (isCancelled) return;

          const location = new naver.maps.LatLng(coords.lat, coords.lng);
          const isHighlighted = currentList?.includes(item.addr);

          const marker = new naver.maps.Marker({
            position: location,
            map: mapRef.current,
            title: item.title,
            icon: {
              content: `
                <div style="cursor:pointer;">
                  <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" 
                          fill="${isHighlighted ? "#FF0000" : "#3366FF"}"/>
                    <circle cx="15" cy="15" r="6" fill="white"/>
                  </svg>
                </div>`,
              anchor: new naver.maps.Point(15, 40),
            },
            zIndex: isHighlighted ? 100 : 10,
          });

          naver.maps.Event.addListener(marker, "click", (e) => {
            if (e.pointerEvent) e.pointerEvent.stopPropagation();

            const contentString = `
              <div style="padding:15px; min-width:180px;">
                <strong style="display:block; font-size:16px; margin-bottom:5px; color:#333;">${item.title}</strong>
                <span style="font-size:13px; color:#666;">${item.addr}</span>
              </div>
            `;
            infoWindowRef.current.setContent(contentString);
            infoWindowRef.current.open(mapRef.current, marker);
          });

          newMarkers.push(marker);
          bounds.extend(location);
        } catch (err) {
          console.warn(`주소 변환 실패: ${item.addr}`, err);
        }
      });

      await Promise.all(markerPromises);

      if (!isCancelled && newMarkers.length > 0) {
        markersRef.current = newMarkers;
        mapRef.current.panToBounds(bounds);
      }
    };

    initMarkers();

    return () => {
      isCancelled = true;
    };
  }, [addressList, currentList]);

  return <div className={styles.map} ref={mapDivRef}></div>;
}

function getLatLng(address) {
  return new Promise((resolve, reject) => {
    if (!naver.maps.Service || !naver.maps.Service.geocode) {
      return reject("Geocoder 서비스 로드 실패");
    }
    naver.maps.Service.geocode({ query: address }, function (status, response) {
      if (status !== naver.maps.Service.Status.OK) return reject("조회 실패");
      const result = response.v2.addresses[0];
      if (!result) return reject("결과 없음");
      resolve({ lat: parseFloat(result.y), lng: parseFloat(result.x) });
    });
  });
}

export default Map;
