package kr.co.iei.tour.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "emoji")
public class Emoji {
	private Integer emojiNo;
	private String emojiName;
}
