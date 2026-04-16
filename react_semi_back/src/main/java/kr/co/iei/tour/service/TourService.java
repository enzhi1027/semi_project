package kr.co.iei.tour.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.tour.model.dao.TourDao;
import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourCartItem;
import kr.co.iei.tour.model.vo.TourWishItem;
import kr.co.iei.tour.model.vo.TourWishlist;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;

@Service
public class TourService {
	@Autowired
	private TourDao dao;

	public List<Emoji> selectEmojiList() {
		List<Emoji> list = dao.selectEmojiList();
		return list;
	}

	public List<TourWishlist> selectWishlistList(String memberId) {
		List<TourWishlist> list = dao.selectWishlistList(memberId);
		return list;
	}

	@Transactional
	public int insertWishlist(TourWishlist list) {
		int result = dao.insertWishlist(list);
		return result;
	}

	public List<TourItem> selectTourItemList(String order) {
		List<TourItem> list = dao.selectTourItemList(order);
		return list;
	}

	@Transactional
	public int deleteTourWish(TourWishItem request) {
		if (request.getTourWishlistNo() == 0) {
			request.setTourWishlistNo(dao.selectTourWishlistNo(request));
		}
		
		int result = dao.deleteTourWish(request);
		return result;
	}

	@Transactional
	public int insertTourWish(TourWishItem request) {
		if (request.getTourWishlistNo() == 0) {
			request.setTourWishlistNo(dao.selectTourWishlistNo(request));
		}
		
		int tourWishlistNo = dao.selectTourWishlistNo(request);
		int result = dao.insertTourWish(request);
		return 1;
	}

	public List<Integer> selectWishlistNoList(String memberId, Integer tourItemNo) {
		List<Integer> list = dao.selectWishlistNoList(memberId, tourItemNo);
		return list;
	}

	public int selectPriceMin() {
		int result = dao.selectPriceMin();
		return result;
	}

	public int selectPriceMax() {
		int result = dao.selectPriceMax();
		return result;
	}

	public List<TourItem> searchTourItemList(String searchWhere, String searchPriceMin, String searchPriceMax,
			String searchWhen) {
		List<TourItem> list = dao.searchTourItemList(searchWhere, searchPriceMin, searchPriceMax, searchWhen);
		return list;
	}

	public TourItem selectTourItem(Integer tourItemNo) {
		TourItem item = dao.selectTourItem(tourItemNo);
		return item;
	}
	
	public List<TourItemInfo> selectTourItemInfo(Integer tourItemNo) {
		List<TourItemInfo> item = dao.selectTourItemInfo(tourItemNo);
		return item;
	}

	public List<TourItemImg> selectTourItemImg(Integer tourItemNo) {
		List<TourItemImg> imgs = dao.selectTourItemImg(tourItemNo);
		return imgs;
	}

	public List<TourItem> selectWishItemList(String memberId) {
		List<TourItem> list = dao.selectWishItemList(memberId);
		return list;
	}

	@Transactional
	public int deleteWish(Integer wishlistNo) {
		int result = dao.deleteWish(wishlistNo);
		return result;
	}

	@Transactional
	public int deleteWishlist(Integer wishlistNo) {
		int result = dao.deleteWishlist(wishlistNo);
		return result;
	}

	public List<TourCartItem> selectTourCartList(String memberId) {
		List<TourCartItem> list = dao.selectTourCartList(memberId);
		return list;
	}
}
