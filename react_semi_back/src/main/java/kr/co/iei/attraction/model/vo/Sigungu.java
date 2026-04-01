package kr.co.iei.attraction.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "sigungu")
public class Sigungu {
	@JsonProperty("code")
	private String sigunguCode;
	
	@JsonProperty("name")
	private String sigunguName;
}
