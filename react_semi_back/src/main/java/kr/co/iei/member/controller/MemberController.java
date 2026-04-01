package kr.co.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;

@CrossOrigin
@RestController
@RequestMapping(value="members")
public class MemberController {
	@Autowired
	private MemberService memberService;
	
	@PostMapping(value = "login")
	public ResponseEntity<?> login(@RequestBody Member member) {
		LoginMember loginMember = memberService.login(member);
		return ResponseEntity.ok(loginMember);
	}
}
