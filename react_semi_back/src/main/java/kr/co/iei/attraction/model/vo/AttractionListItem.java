package kr.co.iei.attraction.model.vo;

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
	private Integer fee;
	private Integer restroom;
	private Integer accessible;
	private Integer parking;
}
