package kr.co.iei.attraction.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.attraction.model.vo.Area;
import kr.co.iei.attraction.model.vo.Attraction;
import kr.co.iei.attraction.model.vo.AttractionListItem;
import kr.co.iei.attraction.model.vo.Sigungu;

@Mapper
public interface AttractionDao {

	int insertArea(Area area);

	List<String> selectAreaCode();

	int insertSigungu(Sigungu sigungu);

	Integer selectAreaNo(String areaCode);

	List<String> selectSigunguCode(Integer areaNo);

	int insertAttraction(Attraction a);

	Integer selectSigunguNo(Integer areaNo, String sigunguCode);

	List<Attraction> selectAttractionList(AttractionListItem request);

	Integer selectAttractionCount(AttractionListItem request);

	List<Area> selectAreaList();

	List<Sigungu> selectSigunguList(String areaCode);

	List<Integer> selectWishList(String memberId);

	int deleteWish(String memberId, Integer attractionNo);

	int insertWish(Map<String, Object> request);
}
