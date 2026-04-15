package kr.co.iei.member.controller;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.EmailSender;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="members")
public class MemberController {
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private BoardService boardService;
	
	@Autowired
	private EmailSender sender;
	
	@Autowired
	private FileUtils fileUtils;
	
	@Value("${file.root}")
	private String root;
	
	//아이디 중복 체크-------------------------------------------------------------------
	@GetMapping(value = "/exists")
	public ResponseEntity<?> dupCheckId(@RequestParam String memberId) {
		Member m = memberService.selectOneMember(memberId);
		return ResponseEntity.ok(m == null);
	}
	//아이디 중복 체크-------------------------------------------------------------------
	
	
	
	//인증 메일 발송-------------------------------------------------------------------
	@PostMapping(value="/email-verification")
	public ResponseEntity<?> sendMail(@RequestBody Member m) {
		//인증 메일 제목
		String emailTitle = "LeafyGo 가입 인증 메일입니다.";
		//인증 메일용 인증 코드 생성
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<6; i++) {
			//영어 대문자 / 영어 소문자 / 숫자 조합해서 6자리 랜덤코드 생성
			//숫자(0~9) : r.nextInt(10);
			//대문자(A~Z) : r.nextInt(26)+65
			//소문자(a~z) : r.nextInt(26)+97
			int flag = r.nextInt(3);//0,1,2, -> 숫자, 대문자, 소문자 어떤 걸 추출할 지 랜덤으로 결정
			if(flag == 0) {
				int randomCode = r.nextInt(10);
				sb.append(randomCode);
			}else if(flag == 1) {
				char randomCode = (char)(r.nextInt(26)+65);
				sb.append(randomCode);
			}else if(flag == 2) {
				char randomCode = (char)(r.nextInt(26)+97);
				sb.append(randomCode);
			}	
		}
		String authCode = sb.toString();
		String emailContent = "<h1>안녕하세요. LeafyGo입니다.</h1>"
							+"인증번호는 "
							+ "[<b>"+authCode+"</b>] 입니다.</h3>";
		sender.sendMail(emailTitle, m.getMemberEmail(), emailContent);
		return ResponseEntity.ok(authCode);
	}
	//인증 메일 발송-------------------------------------------------------------------
	
	
	//로그인------------------------------------------------------------------------
	@PostMapping(value = "login")
	public ResponseEntity<?> login(@RequestBody Member member) {
		LoginMember loginMember = memberService.login(member);
		if(loginMember == null) {
			return ResponseEntity.status(404).build();
		}else {
			return ResponseEntity.ok(loginMember);			
		}
	}
	//로그인------------------------------------------------------------------------
	
	
	//회원가입----------------------------------------------------------------------
	@PostMapping
	public ResponseEntity<?> joinMember(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}
	//회원가입----------------------------------------------------------------------
	
	//유저 썸네일--------------------------------------------------------------------
	@PatchMapping(value="{memberId}/thumbnail")//일부 정보 수정 @PatchMapping
	public ResponseEntity<?> updateThumbnail(@PathVariable String memberId,
												@ModelAttribute MultipartFile file) {
		String savepath = root + "member/";
		String memberThumb = fileUtils.upload(savepath, file);
		Member m = new Member();
		m.setMemberId(memberId);
		m.setMemberThumb(memberThumb);
		int result = memberService.updateMemberThumb(m);
		return ResponseEntity.ok(memberThumb);
	}
	
	//유저 조회 ------------------------------------------------------------------
	@GetMapping(value = "/{memberId}")
	public ResponseEntity<?> selectOneMember(@PathVariable String memberId) {
		Member member = memberService.selectOneMember(memberId);
		member.setMemberPw(null);//비밀번호는 제외
		return ResponseEntity.ok(member);
	}
	
	//유저 정보 수정 ---------------------------------------------------------------
	@PatchMapping(value = "/{memberId}")
	public ResponseEntity<?> updateMember(@RequestBody Member member){
		int result = memberService.updateMember(member);
		return ResponseEntity.ok(result);
	}
	
	//유저 정보 삭제 ---------------------------------------------------------------
	@DeleteMapping(value = "/{memberId}")
	public ResponseEntity<?> deleteMember(@PathVariable String memberId){
		int result = memberService.deleteMember(memberId);
		return ResponseEntity.ok(result);
	}
	
	//유저 비밀번호 체크 -------------------------------------------------------------
	@PostMapping(value = "/check-pw")
	public ResponseEntity<?> checkPw(@RequestBody Member m){
		//비밀번호 일치 여부만 따지면 되니까 bollean타입
		boolean result = memberService.checkPw(m);
		return ResponseEntity.ok(result);
	}
	//유저 비밀번호 변경 -------------------------------------------------------------
	@PatchMapping(value = "/pw")
	public ResponseEntity<?> changePw(@RequestBody Member m) {
		int result = memberService.updateMemberPw(m);
		return ResponseEntity.ok(result);
	}
	//이메일 중복 체크 -------------------------------------------------------------
	@GetMapping(value = "/exists/email")
	public ResponseEntity<?> dupCheckEmail(@RequestParam String memberEmail){
		Member m = memberService.selectOneMemberEmail(memberEmail);
		return ResponseEntity.ok(m);
	}
	// 핸드폰 번호 중복 체크 --------------------------------------------------------
	@GetMapping(value = "/exists/phone")
	public ResponseEntity<?> dupCheckPhone(@RequestParam String memberPhone){
		Member m = memberService.selectOneMemberPhone(memberPhone);
		return ResponseEntity.ok(m);
	}
	
	//좋아요 표시한 게시글 조회 -------------------------------------------------------
	@GetMapping(value = "/like-list/{memberId}")
	public ResponseEntity<?> selectLikeBoardList(@PathVariable String memberId){
		List<Board> list = boardService.selectLikeBoardList(memberId);
		return ResponseEntity.ok(list);
	}
	
	
}
