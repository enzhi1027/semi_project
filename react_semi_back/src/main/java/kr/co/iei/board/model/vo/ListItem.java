package kr.co.iei.board.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ListItem {
	private Integer page;
	private Integer size;
	private Integer status;
	private Integer order;
	private Integer searchType;
	private String searchKeyword;
	private Integer category;
	private String memberId;
	private int memberGrade;
}
