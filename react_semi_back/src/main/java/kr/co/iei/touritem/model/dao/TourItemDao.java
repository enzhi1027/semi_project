package kr.co.iei.touritem.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;

@Mapper
public interface TourItemDao {

	int getNewTourItemNo();

	int insertTourItem(TourItem tourItem);

	void insertTourItemInfo(TourItemInfo tourIteminfo);

	void insertTourItemImg(TourItemImg tourItemimg);

	Integer selectAdminTourCount(ListItem request);

	List<TourItem> selectTourItemList(ListItem request);

}
