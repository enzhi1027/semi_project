package kr.co.iei.tour.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.tour.model.dao.TourDao;
import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourWishlist;

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
}
