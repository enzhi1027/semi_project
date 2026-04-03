package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("board")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Board {
	private Integer boardNo;
	private Integer boardCategory;
	private String boardTitle;
	private String boardContent;
	private String boardThumb;
	private String boardWriter;
	private String boardDate;
	private Integer boardStatus;
}
