package kr.co.iei.touritem.model.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.touritem.model.dao.TourItemDao;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;
import kr.co.iei.touritem.model.vo.TourListResponse;

@Service
public class TourItemService {
	@Autowired
	private TourItemDao tourItemDao;

	//상품 등록------------------------------------------------------------------
	@Transactional
	public int insertTourItem(TourItem tourItem, List<TourItemImg> imgList) {
		//상품 번호 먼저 발급
		int tourItemNo = tourItemDao.getNewTourItemNo();
		tourItem.setTourItemNo(tourItemNo); // TourItem 객체에 번호 주입
		
		//상품 정보 저장
		int result = tourItemDao.insertTourItem(tourItem);
		
		//상품 정보를 저장했을 때만 동작
		if(result > 0) {
			//받아온 상품 설명 : placeList
			List<TourItemInfo> placeList = tourItem.getPlaceList();
			//placeList가 있을 때만 실행
			if(placeList != null) {
				for(TourItemInfo tourIteminfo : placeList) {
					tourIteminfo.setTourItemNo(tourItemNo);
					tourItemDao.insertTourItemInfo(tourIteminfo);
				}
			}
			//상품 번호, 이미지 번호, 경로, 순서 저장
			if(imgList != null) {
				for(TourItemImg tourItemimg : imgList) {
					tourItemimg.setTourItemNo(tourItemNo);
					tourItemDao.insertTourItemImg(tourItemimg);
				}
			}
		}
		return result;
	}
	
	//상품 조회 리스트(관리자 페이지 출력)
	public TourListResponse selectTourItemList(ListItem request) {
		Integer totalCount = tourItemDao.selectAdminTourCount(request);
		int totalPage = (int)Math.ceil(totalCount/(double)request.getSize());
		
		List<TourItem> list = tourItemDao.selectTourItemList(request);
		TourListResponse response = new TourListResponse(list, totalPage);
		return response;
	}
	
	//상품 상태 변경 ---------------------------------------------------
	@Transactional
	public int changeTourItemStatus(TourItem tourItem) {
		int result = tourItemDao.changeTourItemStatus(tourItem);
		return result;
	}

	public TourItem selectOneTourItem(Integer tourItemNo) {
		TourItem tourItem = tourItemDao.selectOneTourItem(tourItemNo);
		return tourItem;
	}
	
	
	public List<TourItemInfo> selectPlaceList(Integer tourItemNo) {
		List<TourItemInfo> placeList = tourItemDao.selectPlaceList(tourItemNo);
		return placeList;
	}

	public List<TourItemImg> selectImgList(Integer tourItemNo) {
		List<TourItemImg> fileList = tourItemDao.selectImgList(tourItemNo);
		return fileList;
	}
	
	//상품 정보 수정 ----------------------------------------------------
	@Transactional
	public int updateTourItem(TourItem tourItem, List<TourItemImg> addImgList) {
		//제목, 가격(성인, 아동), 이용 가능 기간(시작, 종료), 몇박 일정 수정
		int result = tourItemDao.updateTourItem(tourItem);
		
		if(result > 0) {
			//장소 정보(장소, 계획) 수정: 기존 리스트 지우고 새 리스트 삽입
			tourItemDao.deleteTourItemInfo(tourItem.getTourItemNo());
			if (tourItem.getPlaceList() != null) {
				for(TourItemInfo info : tourItem.getPlaceList()) {
					info.setTourItemNo(tourItem.getTourItemNo());
					tourItemDao.insertTourItemInfo(info);
				}
				// 기존 이미지 중 삭제 선택된 파일 DB에서 삭제
				if(tourItem.getDeleteFilePath() != null && !tourItem.getDeleteFilePath().isEmpty()) {
					tourItemDao.deleteTourItemImg(tourItem.getDeleteFilePath());
				}
				if(addImgList != null && !addImgList.isEmpty()) {
					for(TourItemImg img : addImgList) {
						img.setTourItemNo(tourItem.getTourItemNo());
						tourItemDao.insertTourItemImg(img);
					}
				}
				
			}
		}
		
		return result;
	}

	//상품 삭제 -------------------------------------------------------
	@Transactional
	public List<TourItemImg> deleteTourItemImg(Integer tourItemNo) {
		//이미지
		List<TourItemImg> deleteTourItemImg = tourItemDao.selectImgList(tourItemNo);
		//상세 일정 삭제
		tourItemDao.deleteTourItemInfo(tourItemNo);
		//이미지 삭제
		List<String> pathList = new ArrayList<>();
		for(TourItemImg img : deleteTourItemImg) {
			pathList.add(img.getTourItemImgPath());
		}
		if(!pathList.isEmpty()) {
			tourItemDao.deleteTourItemImg(pathList);
		}
		//조회 먼저 하고 그 다음에 삭제
		int result = tourItemDao.deleteTourItem(tourItemNo); //상품 삭제
		if(result > 0) {
			return deleteTourItemImg;
		}
		return null;
	}
	
	//예약 가능 기간 지난 상품 상태 자동 업데이트(Scheduled 사용)
	//자정이 되면 자동으로 업데이트(0초에 실행, 0분에 실행, 00시에 실행, 매일, 매달, 요일 무관)
	@Scheduled(cron = "0 0 0 * * *")
	@Transactional
	public void autoUpdateTourItems() {
		int result = tourItemDao.autoUpdateTourItemStatus();
	}
	
	
	
}
