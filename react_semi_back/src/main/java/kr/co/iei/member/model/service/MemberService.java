package kr.co.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.JwtUtils;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bcrypt;
	@Autowired
	private JwtUtils jwtUtil;
	
	//아이디 조회------------------------------------------------------------
	public Member selectOneMember(String memberId) {
		Member m = memberDao.selectOneMember(memberId);
		return m;
	}
	//아이디 조회------------------------------------------------------------
	
	//로그인----------------------------------------------------------------
	//아이디 조회 먼저 하고
	public LoginMember login(Member member) {
		Member loginMember = memberDao.selectOneMember(member.getMemberId());
		if(loginMember != null && bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw())) {
			LoginMember login = jwtUtil.createToken(loginMember.getMemberId(), loginMember.getMemberGrade());
			login.setMemberThumb(loginMember.getMemberThumb());
			return login;
		}
		return null;
	}
	//로그인----------------------------------------------------------------
	
	//회원가입----------------------------------------------------------------
	@Transactional
	public int insertMember(Member member) {
		String memberPw = member.getMemberPw();
		//암호화 먼저 실행
		String encPw = bcrypt.encode(memberPw);
		member.setMemberPw(encPw);//암호화된 Pw를 배치(암호화 끝나는 시점)
		int result = memberDao.insertMember(member);
		return result;
	}
	//회원가입----------------------------------------------------------------

	public int updateMemberThumb(Member m) {
		int result = memberDao.updateMemberThumb(m);
		return result;
	}

	public int updateMember(Member member) {
		int result = memberDao.updateMember(member);
		return result;
	}
	
	
	
	
}
