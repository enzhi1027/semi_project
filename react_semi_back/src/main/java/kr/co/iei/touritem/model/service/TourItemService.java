package kr.co.iei.touritem.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

	public TourListResponse selectTourItemList(ListItem request) {
		Integer totalCount = tourItemDao.selectAdminTourCount(request);
		int totalPage = (int)Math.ceil(totalCount/(double)request.getSize());
		
		List<TourItem> list = tourItemDao.selectTourItemList(request);
		TourListResponse response = new TourListResponse(list, totalPage);
		return response;
	}
	
	
}
