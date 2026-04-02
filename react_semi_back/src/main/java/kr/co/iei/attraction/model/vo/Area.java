package kr.co.iei.attraction.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "area")
public class Area {
	private Integer areaNo;
	
	@JsonProperty("code")
	private String areaCode;
	
	@JsonProperty("name")
	private String areaName;
}
