package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("boardComment")
public class BoardComment {
	private Integer boardCommentNo;
	private String boardCommentContent;
	private String boardCommentWriter;
	private Integer boardNo;
	private String boardCommentDate;
	private Integer commentStatus;
	private String memberThumb;
	
}
