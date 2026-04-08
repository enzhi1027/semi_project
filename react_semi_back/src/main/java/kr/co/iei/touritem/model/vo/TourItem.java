package kr.co.iei.touritem.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourItem")
public class TourItem {
	private Integer tourItemNo;				//상품 번호
	private String tourItemName;			//상품 이름
	private Integer tourItemAdultPrice;		//성인 가격
	private Integer tourItemKidPrice;		//아동 가격
	private Date startPeriod;		//예약 가능 기간(시작)
	private Date endPeriod;			//예약 가능 기간(종료)
	private Integer tourItemDays;			//몇박 며칠
	private Integer tourItemStatus;			//공개/비공개(0, 1)
}
