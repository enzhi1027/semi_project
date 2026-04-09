package kr.co.iei.touritem.model.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourItemInfo")
public class TourItemInfo {
	private Integer tourItemInfoNo;	//장소 번호 (시퀸스 tour_item_info_seq)
	private Integer tourItemNo;			//투어 상품 번호
	private Integer tourItemDay;		//투어 일차
	private String tourItemPlace;		//상품 설명(장소)
	private String tourItemPlan;		//상품 설명(계획)
	private Integer tourItemPlaceOrder;	//장소 번호(정렬 기준)
	
}
