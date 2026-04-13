package kr.co.iei.touritem.model.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "tourItemImg")
public class TourItemImg {
	private Integer tourItemImgNo;		//이미지 번호 (시퀸스 tour_item_img_seq)
	private Integer tourItemNo;			//상품 번호 외래키
	private String tourItemImgPath;		//이미지 저장 경로
	private Integer tourItemImgOrder;	//이미지 정렬(처음으로 들어오는 이미지 썸네일로 사용)
	

}
