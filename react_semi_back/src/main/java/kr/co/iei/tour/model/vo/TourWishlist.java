package kr.co.iei.tour.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "wishlist")
public class TourWishlist {
	private Integer tourWishlistNo;
	private String tourWishlistName;
	private String memberId;
	private Integer emojiNo;
}
