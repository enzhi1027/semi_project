package kr.co.iei.course.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="courseAttractionList")
public class CourseAttractionList {
	private String attractionTitle;
	private String attractionSummary;
	private String attractionThumb;
	private String attractionAddr;
	private Integer courseIndex;
	private String courseWriter;
}
