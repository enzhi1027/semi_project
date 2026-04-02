package kr.co.iei.utils;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import kr.co.iei.member.model.vo.LoginMember;

@Component
public class JwtUtils {
	@Value("${jwt.secret-key}")
	//프로퍼티스에 있는 정보를 가져오는 어노테이션
	private String secretKey;
	@Value("${jwt.expire-hour}")
	private int expireHour;
	//
	
	//유효 시간 1시간 토큰 생성
	public LoginMember createToken(String memberId, Integer memberGrade) {
		//1. 작성해둔 키 값을 이용해서 암호화 코드 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHour);
		Date endTime = c.getTime();
		String token = Jwts.builder()
							.issuedAt(startTime)	//토큰 발행 시간
							.expiration(endTime)	//토큰 만료 시간
							.signWith(key)			//암호화 서명
							.claim("memberId", memberId)		
							//토큰에 포함될 부가 정보(회원 아이디)
							.claim("memberGrade", memberGrade)	
							//토큰에 포함될 부가 정보(회원 등급)
							.compact();		//생성
		LoginMember login = new LoginMember();
		login.setMemberGrade(memberGrade);
		login.setMemberId(memberId);
		login.setToken(token);
		login.setEndTime(c.getTimeInMillis());
		return login;
	}
	
	public LoginMember checkToken(String token) {
		// 토큰 해석을 위한 암호화 키 세팅
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Claims claims = (Claims)Jwts.parser()
									.verifyWith(key)
									.build()
									.parse(token)
									.getPayload();
		String memberId = (String)claims.get("memberId");
		Integer memberGrade = (Integer)claims.get("memberGrade");
		LoginMember login = new LoginMember();
		login.setMemberId(memberId);
		login.setMemberGrade(memberGrade);
		return login;
	}
}
