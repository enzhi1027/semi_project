package kr.co.iei.touritem.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourItemPlace")
public class TourItemPlace {
	private Integer tourItemPlaceNo;	//장소 번호
	private Integer tourItemNo;			//투어 상품 번호
	private Integer tourItemDay;		//투어 일차
	private String tourItemPlace;		//상품 설명(장소)
	private String tourItemPlan;		//상품 설명(계획)
	private Integer tourItemPlaceOrder;	
	//설명 순서 정렬(몇번째 설명인지. 조회 시 정렬 기준 tourItemDay+tourItemOrder)
	
}
