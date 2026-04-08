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
	private String memberId;			//아이디
	private String memberPw;			//비밀번호
	private String memberName;			//이름
	private String memberEmail;			//이메일
	private String memberPhone;			//전화번호
	private String memberAddr;			//주소
	private String memberAddrDetail;	//상세 주소
	private String memberThumb;			//유저 프로필
	private Integer memberGrade;		//회원 등급 0 : 일반, 1 : 관리자, 2: 차단
	private Date enrollDate;			//가입일
	
}
