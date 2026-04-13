package kr.co.iei.tour.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourWishItem")
public class TourWishItem {
	private Integer tourItemNo;
	private Integer tourWishlistNo;
	private String memberId;
	private String tourWishlistName;
}
