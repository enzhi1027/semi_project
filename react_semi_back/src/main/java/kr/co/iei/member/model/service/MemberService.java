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
	
	//유저 썸네일 변경----------------------------------------------------------------
	@Transactional
	public int updateMemberThumb(Member m) {
		int result = memberDao.updateMemberThumb(m);
		return result;
	}
	
	//유저 정보 변경-----------------------------------------------------------------
	@Transactional
	public int updateMember(Member member) {
		int result = memberDao.updateMember(member);
		return result;
	}
	//유저 정보 삭제(탈퇴)-------------------------------------------------------------
	@Transactional
	public int deleteMember(String memberId) {
		int result = memberDao.deleteMember(memberId);
		return result;
	}
	
	//기존 비밀번호 확인----------------------------------------------------------------
	public boolean checkPw(Member m) {
		//비밀번호 암호화 되어 있어서 로직 다름
		//아이디 먼저 조회
		Member member = memberDao.selectOneMember(m.getMemberId());
		return bcrypt.matches(m.getMemberPw(), member.getMemberPw());
							//입력받은 패스워드			//암호화된 패스워드
	}
	//비밀번호 변경--------------------------------------------------------------
	@Transactional
	public int updateMemberPw(Member m) {
		//그냥 업데이트 X	반드시 암호화해서 업데이트 해야 함.
		String encPw = bcrypt.encode(m.getMemberPw());
		m.setMemberPw(encPw);
		int result = memberDao.updateMemberPw(m);
		return result;
	}
	
	//이메일 중복 체크--------------------------------------------------------------
	public Member selectOneMemberEmail(String memberEmail) {
		Member m = memberDao.selectOneMemberEmail(memberEmail);
		return m;
	}

	//전화번호 중복 체크------------------------------------------------------------
	public Member selectOneMemberPhone(String memberPhone) {
		Member m = memberDao.selectOneMemberPhone(memberPhone);
		return m;
	}
	
	
	
	
}
