package kr.co.iei.course.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CourseListResponse {
	private List<?> items;
	private Integer totalPage;
}
