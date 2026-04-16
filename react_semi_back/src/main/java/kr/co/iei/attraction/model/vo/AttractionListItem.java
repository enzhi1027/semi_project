package kr.co.iei.attraction.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AttractionListItem {
	private Integer page;
	private Integer size;
	private String areaCode;
	private String sigunguCode;
	private String searchKeyword;
	private String holiday;
	private Integer fee;
	private Integer restroom;
	private Integer accessible;
	private Integer parking;
	private List<String> checkedItems;
	
	//좋아요 표시 목록 조회용
	private String memberId;
	private Integer order;
}
