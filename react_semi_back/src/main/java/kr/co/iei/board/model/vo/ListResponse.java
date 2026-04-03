package kr.co.iei.board.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ListResponse {
	private List<Board> items;
	private Integer totalPage;
}
