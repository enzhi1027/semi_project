package kr.co.iei.attraction.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "attraction")
public class Attraction {
	@JsonProperty("code")
	private Integer attractionNo;            // 관광지 번호
	
	@JsonProperty("code")
	private String attractionAddr;           // 주소
	
	@JsonProperty("code")
	private String attractionThumbnail;      // 관광지 썸네일
	
	@JsonProperty("code")
	private String attractionModifiedTime;   // 수정 시간
	
	@JsonProperty("code")
	private String attractionSummary;        // 관광지 설명
	
	@JsonProperty("code")
	private String attractionHoliday;        // 휴무일
	
	@JsonProperty("code")
	private String attractionDesignation;    // 지정 현황
	
	@JsonProperty("code")
	private String attractionFee;            // 이용 요금
	
	@JsonProperty("code")
	private String attractionRestroom;       // 화장실
	
	@JsonProperty("code")
	private String attractionAccessible;     // 장애인 편의 시설
	
	@JsonProperty("code")
	private String attractionParking;        // 주차 시설
	
	@JsonProperty("code")
	private String attractionPhone;          // 전화번호
	
	@JsonProperty("code")
	private String attractionTitle;          // 관광지명
	
	@JsonProperty("code")
	private Integer areaNo;                  // 지역 번호
	
	@JsonProperty("code")
	private Integer sigunguNo;               // 시군구 번호
}
