package kr.co.iei.tour.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourWishlist;

@Mapper
public interface TourDao {

	List<Emoji> selectEmojiList();

	List<TourWishlist> selectWishlistList(String memberId);

	int insertWishlist(TourWishlist list);

}
