package kr.co.iei.course.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="courseList")
public class CourseList {
	private Integer courseNo;
	private String courseTitle;
	private String courseContent;
	private String courseWriter;
	private Integer courseCount;
	private String courseThumb;
	private Integer	isLike;
	private String memberId;
}
