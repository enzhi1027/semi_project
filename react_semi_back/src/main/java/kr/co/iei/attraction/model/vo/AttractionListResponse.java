package kr.co.iei.attraction.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AttractionListResponse {
	private List<Attraction> items;
	private Integer totalPage;
}