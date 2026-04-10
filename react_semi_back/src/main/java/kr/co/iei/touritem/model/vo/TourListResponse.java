package kr.co.iei.touritem.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TourListResponse {
	private List<TourItem> items;
	private Integer totalPage;
}
