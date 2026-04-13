package kr.co.iei.member.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemberListItem {
	private Integer page;
	private Integer size;
	private String searchKeyword;
	private Integer grade; //0 : 전체 조회, 1 : 일반 회원, 2 : 관리자, 3 : 차단 회원
	private Integer order; //0 : 이름 오름차순, 1 : 이름 내림차순, 2 : 최근 가입순, 3 : 가입순
}
