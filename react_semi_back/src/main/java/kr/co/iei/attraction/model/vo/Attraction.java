package kr.co.iei.attraction.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "attraction")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Attraction {
	private Integer attractionNo;			// 관광지 번호
	
	@JsonProperty("addr")
	private String attractionAddr;          // 주소
	
	@JsonProperty("contentid")
	private String attractionContentId;     // 주소
	
	@JsonProperty("mainimage")
	private String attractionThumbnail;     // 관광지 썸네일
	
	@JsonProperty("modifiedtime")
	private String attractionModifiedTime;  // 수정 시간
	
	@JsonProperty("summary")
	private String attractionSummary;       // 관광지 설명

	private String attractionHoliday;       // 휴무일

	private String attractionDesignation;   // 지정 현황
	
	private String attractionFee;           // 이용 요금
	
	private String attractionRestroom;      // 화장실

	private String attractionAccessible;    // 장애인 편의 시설

	private String attractionParking;       // 주차 시설
	
	@JsonProperty("tel")
	private String attractionPhone;         // 전화번호
	
	@JsonProperty("title")
	private String attractionTitle;         // 관광지명
	
	@JsonProperty("areacode")
	private String areaCode;               // 지역 코드
	
	@JsonProperty("sigungucode")
	private String sigunguCode;            // 시군구 코드
	
	private Integer sigunguNo;				// 시군구 번호
}
