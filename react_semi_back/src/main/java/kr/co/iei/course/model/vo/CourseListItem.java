package kr.co.iei.course.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CourseListItem {
	private String memberId;
	private Integer order;
	private Integer page;
	private Integer size;
}
