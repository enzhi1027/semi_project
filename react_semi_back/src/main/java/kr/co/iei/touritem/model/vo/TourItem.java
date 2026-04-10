package kr.co.iei.touritem.model.vo;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourItem")
public class TourItem {
	private Integer tourItemNo;				//상품 번호 (시퀸스 tour_item_seq)
	private String tourItemName;			//상품 이름
	private Integer tourItemAdultPrice;		//성인 가격
	private Integer tourItemKidPrice;		//아동 가격
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private String startPeriod;		//예약 가능 기간(시작)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private String endPeriod;			//예약 가능 기간(종료)
	private Integer tourItemDays;			//몇박 며칠
	private Integer tourItemStatus;			//공개/비공개(0, 1)
	
	private String tourItemImgPath;			//썸네일 이미지 경로
	
	private List<TourItemInfo> placeList;	//장소, 계획 저장 리스트
}
