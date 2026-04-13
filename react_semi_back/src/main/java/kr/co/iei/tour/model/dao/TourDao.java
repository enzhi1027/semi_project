package kr.co.iei.tour.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourWishItem;
import kr.co.iei.tour.model.vo.TourWishlist;
import kr.co.iei.touritem.model.vo.TourItem;

@Mapper
public interface TourDao {

	List<Emoji> selectEmojiList();

	List<TourWishlist> selectWishlistList(String memberId);

	int insertWishlist(TourWishlist list);

	List<TourItem> selectTourItemList(String order);

	int deleteTourWish(TourWishItem request);

	int selectTourWishlistNo(TourWishItem request);

	int insertTourWish(TourWishItem request);

	List<Integer> selectWishlistNoList(String memberId, Integer tourItemNo);

	int selectPriceMin();
	
	int selectPriceMax();

	List<TourItem> searchTourItemList(String searchWhere, String searchPriceMin, String searchPriceMax,
			String searchWhen);

}
