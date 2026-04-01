package kr.co.iei.member.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
public class Member {
	private String memberId;
	private String memberPw;
	private String memberName;
	private String memberEmail;
	private String memberPhone;
	private String memberAddr;
	private String memberAddrDetail;
	private String memberThumb;
	private Integer memberGrade;
	private Date enrollDate;
	
}
