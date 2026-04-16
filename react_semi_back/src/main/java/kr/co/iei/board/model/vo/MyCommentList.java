package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("myCommentList")
public class MyCommentList {
	private Integer boardCommentNo;
	private String boardCommentContent;
	private String boardCommentWriter;
	private String boardCommentDate;
	private Integer commentStatus;
	
	private Integer boardNo;
	private String boardTitle;
	private String boardWriter;
	private Integer boardStatus;
	private String boardDate;
	private String boardCategory;
	
}
