package kr.co.iei.course.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="attractionList")
public class AttractionList {
	private Integer attractionNo;
	private String attractionTitle;
	private String attractionSummary;
	private String attractionThumb;
	private String attractionAddr;
	private String attractionPhone;
}
