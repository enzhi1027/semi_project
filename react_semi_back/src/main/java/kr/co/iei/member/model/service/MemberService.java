package kr.co.iei.member.model.service;

import org.springframework.stereotype.Service;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;

@Service
public class MemberService {
	private MemberDao memberDao;

	public LoginMember login(Member member) {
		Member loginMember = memberDao.selectOneMember(member);
		
		return null;
	}
}
