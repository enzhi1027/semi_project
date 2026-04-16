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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.attraction.model.vo.AttractionListItem;
import kr.co.iei.attraction.model.vo.AttractionListResponse;
import kr.co.iei.attraction.service.AttractionService;
import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.board.model.vo.MyCommentResponse;
import kr.co.iei.course.model.service.CourseService;
import kr.co.iei.course.model.vo.CourseList;
import kr.co.iei.course.model.vo.CourseListItem;
import kr.co.iei.course.model.vo.CourseListResponse;
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
	private CourseService courseService;
	
	@Autowired
	private AttractionService attractionService;
	
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
		if (member != null) {
	        member.setMemberPw(null); // 정보가 있을 때만 비밀번호 가리기
	        return ResponseEntity.ok(member);
	    } else {
	        // 회원이 없을 경우 404 에러를 반환
	        return ResponseEntity.status(404).body("존재하지 않는 회원 정보입니다.");
	    }
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
	
	//좋아요 표시한 관광지 목록 조회 -----------------------------------------------
	@GetMapping(value = "/like-attraction")
	public ResponseEntity<?> 
		selectLikeAttractionList(@ModelAttribute AttractionListItem request){
		AttractionListResponse response = 
					attractionService.selectLikeAttractionList(request);
		return ResponseEntity.ok(response);
	}
	
	//좋아요 표시한 게시글 목록 조회 ------------------------------------------------
	@GetMapping(value = "/like-board")
	public ResponseEntity<?> selectLikeBoardList(@ModelAttribute ListItem request){
		ListResponse response = boardService.selectLikeBoardList(request);
		return ResponseEntity.ok(response);
	}
	
	//좋아요 표시한 코스 목록 조회 ------------------------------------------------
	@GetMapping(value = "/like-course")
	public ResponseEntity<?> selectLikeCourseList(@ModelAttribute CourseListItem request){
		CourseListResponse response = courseService.selectLikeCourseList(request);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}

	//내가 작성한 게시글 조회 ---------------------------------------------------
	@GetMapping(value = "/my-board")
	public ResponseEntity<?> selectMyBoardList(@ModelAttribute ListItem request){
		ListResponse response = boardService.selectMyBoardList(request);
		return ResponseEntity.ok(response);
	}
	
	//내가 작성한 댓글 조회 -----------------------------------------------------
	@GetMapping(value = "/my-comment")
	public ResponseEntity<?> selectMyCommentList(@ModelAttribute ListItem request){
		MyCommentResponse response = boardService.selectMyCommentList(request);
		return ResponseEntity.ok(response);
	}
	
	//내가 작성한 코스 조회 -----------------------------------------------------
	@GetMapping(value = "/my-course")
	public ResponseEntity<?> selectMyCourseList(@ModelAttribute CourseListItem request){
		CourseListResponse response = courseService.selectMyCourseList(request);
		return ResponseEntity.ok(response);
	}
	
	//내가 작성한 댓글 수정
	@PutMapping("/comments/{boardCommentNo}")
  	public ResponseEntity<?> updateBoardComment(@RequestBody BoardComment comment){
  		int result = boardService.updateBoardComment(comment);
  		return ResponseEntity.ok(result);
  	}
	
	//내가 작성한 댓글 삭제
	@DeleteMapping(value = "/comments/{boardCommentNo}")
	public ResponseEntity<?> deleteBoardComment(@PathVariable Integer boardCommentNo){
		int result = boardService.deleteBoardComment(boardCommentNo);
  	    return ResponseEntity.ok(result);
	}
	
	//아이디 찾기 이메일 발송
	@PostMapping(value = "/email-search")
	public ResponseEntity<?> emailSearch(@RequestBody Member m) {
		// 1. 이름, 전화번호, 이메일이 일치하는 회원이 있는지 먼저 조회
		Member member = memberService.selectMemberIdSearch(m);
		
		if(member == null) {
			return ResponseEntity.status(404).body("일치하는 회원 정보가 없습니다.");
		}
		
		String emailTitle = "LeafyGo 아이디 찾기 인증 메일입니다.";
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<6; i++) {
			int flag = r.nextInt(3);
			if(flag == 0) {
				int randomCode = r.nextInt(10);
				sb.append(randomCode);
			} else if(flag == 1) {
				char randomCode = (char)(r.nextInt(26)+65);
				sb.append(randomCode);
			} else if(flag == 2) {
				char randomCode = (char)(r.nextInt(26)+97);
				sb.append(randomCode);
			}	
		}
		String authCode = sb.toString();
		
		String emailContent = "<h1>안녕하세요. LeafyGo입니다.</h1>"
							+ "<h3>아이디 찾기 인증번호는 "
							+ "[<b>" + authCode + "</b>] 입니다.</h3>";
		
		sender.sendMail(emailTitle, m.getMemberEmail(), emailContent);
		
		return ResponseEntity.ok(authCode);
	}

	//아이디 조회 ----------------------------------------------
	@GetMapping(value = "/searchId")
	public ResponseEntity<?> searchId(@ModelAttribute Member m) {
		String memberId = memberService.searchId(m);
		return ResponseEntity.ok(memberId);
	}
	
	//비밀번호 조회 이메일 발송
	@PostMapping(value = "/email-search-pw")
	public ResponseEntity<?> pwEmailSearch(@RequestBody Member m){
		Member member = memberService.selectMemberPwSearch(m);
		if(member == null) {
			return ResponseEntity.status(404).body("일치하는 회원 정보가 없습니다.");
		}
		
		String emailTitle = "LeafyGo 비밀번호 재설정 인증 메일입니다.";
	    Random r = new Random();
	    StringBuffer sb = new StringBuffer();
	    for(int i=0; i<6; i++) {
	        int flag = r.nextInt(3);
	        if(flag == 0) {
	            sb.append(r.nextInt(10));
	        } else if(flag == 1) {
	            sb.append((char)(r.nextInt(26)+65));
	        } else if(flag == 2) {
	            sb.append((char)(r.nextInt(26)+97));
	        }	
	    }
	    String authCode = sb.toString();
	    
	    String emailContent = "<h1>안녕하세요. LeafyGo입니다.</h1>"
	                        + "<h3>비밀번호 재설정을 위한 인증번호는 "
	                        + "[<b>" + authCode + "</b>] 입니다.</h3>";
	    
	    // 메일 발송
	    sender.sendMail(emailTitle, member.getMemberEmail(), emailContent);
	    
	    // 인증코드 반환
	    return ResponseEntity.ok(authCode);
	}
	
	
	
}
