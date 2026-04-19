package kr.co.iei.attraction.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.attraction.model.dao.AttractionDao;
import kr.co.iei.attraction.model.vo.Area;
import kr.co.iei.attraction.model.vo.Attraction;
import kr.co.iei.attraction.model.vo.AttractionListItem;
import kr.co.iei.attraction.model.vo.AttractionListResponse;
import kr.co.iei.attraction.model.vo.Sigungu;
import kr.co.iei.board.model.vo.Board;

@Service
public class AttractionService {
	@Autowired
	private AttractionDao dao;

	@Transactional
	public int insertArea(List<Area> list) {
		int result = 0;

		for (Area area : list) {
			result += dao.insertArea(area);
		}

		return result;
	}

	public List<String> selectAreaCode() {
		List<String> areaCodeList = dao.selectAreaCode();
		return areaCodeList;
	}

	@Transactional
	public int insertSigungu(String areaCode, List<Sigungu> list) {
		int result = 0;

		for (Sigungu sigungu : list) {
			sigungu.setAreaNo(dao.selectAreaNo(areaCode));
			result += dao.insertSigungu(sigungu);
		}

		return result;
	}

	public List<String> selectSigunguCode(String areaCode) {
		List<String> sigunguCodeList = dao.selectSigunguCode(dao.selectAreaNo(areaCode));
		return sigunguCodeList;
	}

	@Transactional
	public int insertAttraction(List<Attraction> list) {
		int result = 0;

		for (Attraction a : list) {
			a.setSigunguNo(dao.selectSigunguNo(dao.selectAreaNo(a.getAreaCode()), a.getSigunguCode()));
			result += dao.insertAttraction(a);
		}
		return result;
	}

	public AttractionListResponse selectAttractionList(AttractionListItem request) {
		Integer totalCount = dao.selectAttractionCount(request);
		int totalPage = (int) Math.ceil(totalCount / (double) request.getSize());
		AttractionListResponse response = new AttractionListResponse(dao.selectAttractionList(request), totalPage);
		return response;
	}

	public List<Area> selectAreaList() {
		List<Area> list = dao.selectAreaList();
		return list;
	}

	public List<Sigungu> selectSigunguList(String areaCode) {
		List<Sigungu> list = dao.selectSigunguList(areaCode);
		return list;
	}

	public List<Integer> selectWishList(String memberId) {
		List<Integer> list = dao.selectWishList(memberId);
		return list;
	}

	@Transactional
	public int deleteWish(String memberId, Integer attractionNo) {
		int result = dao.deleteWish(memberId, attractionNo);
		return result;
	}

	@Transactional
	public int insertWish(Map<String, Object> request) {
		int result = dao.insertWish(request);
		return result;
	}

	public List<Board> selectReviewList(Integer attractionNo, String reviewCategory) {
		List<Board> list = dao.selectReviewList(attractionNo, reviewCategory);
		return list;
	}

	
	
	//좋아요 표시한 관광지 목록 조회 -------------------------------------------------
	public AttractionListResponse selectLikeAttractionList(AttractionListItem request) {
		Integer likeCount = dao.selectLikeAttractionCount(request);
		int likePage = (int) Math.ceil(likeCount / (double) request.getSize());
		AttractionListResponse response = new AttractionListResponse(dao.selectLikeAttractionList(request), likePage);
		return response;
	}

	public List<Attraction> selecttAddressList(AttractionListItem request) {
		List<Attraction> list = dao.selecttAddressList(request);
		return list;
	}
}
