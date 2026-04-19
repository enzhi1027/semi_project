package kr.co.iei.tour.model.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "deleteCartItem")
public class DeleteCartItem {
	private String memberId;
	private List<Integer> cartNos;
}
