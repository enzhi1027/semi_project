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
	private Integer boardCategory; // 카테고리(1:리뷰, 2:자유)
	private String boardTitle;
	private String boardContent;
	private String boardThumb;
	private String boardWriter;
	private String boardDate;
	private Integer boardStatus;
	
	private Integer attractionNo; // 리뷰용 관광지 PK
    private String locationNo;    // 자유용 위치 번호
    private String placeName;     // 자유용 장소명
    private String addressName;   // 자유용 주소
}
