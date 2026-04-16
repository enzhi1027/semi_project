package kr.co.iei.tour.model.vo;

import java.sql.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourCartItem")
public class TourCartItem {
	private Integer tourCartNo;
	private String memberId;
	private Integer tourItemNo;
	private Date tourCartStartDate;
	private Integer tourCartAdult;
	private Integer tourCartKid;
	private String tourItemName;
	private Integer tourItemAdultPrice;
	private Integer tourItemKidPrice;
	private Integer tourItemDays;
	private String tourItemImgPath;
}
