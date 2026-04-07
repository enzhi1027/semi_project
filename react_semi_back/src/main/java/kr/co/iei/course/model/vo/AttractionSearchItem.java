package kr.co.iei.course.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AttractionSearchItem {
	private String keyword;
	private String category;
	private Integer order;
}
