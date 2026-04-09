package kr.co.iei.board.controller;


import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.utils.FileUtils;
import kr.co.iei.utils.JwtUtils;

@CrossOrigin("*")
@RequestMapping("/boards")
@RestController
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Value("${file.root}") 
	private String root;
	@Autowired
	private FileUtils fileUtil; 
	@Autowired
    private JwtUtils jwtUtils;
	
	//게시글 목록 조회
	@GetMapping
    public ResponseEntity<?> selectBoardList(@ModelAttribute ListItem request, 
                                            @RequestHeader(required = false, name="Authorization") String token) {
        // 토큰이 있으면 유저 등급을 꺼내서 request에 세팅 (MyBatis에서 권한 체크용)
        if (token != null && !token.equals("null")) {
            kr.co.iei.member.model.vo.LoginMember loginMember = jwtUtils.checkToken(token);
            request.setMemberGrade(loginMember.getMemberGrade()); 
        } else {
            request.setMemberGrade(0); // 비회원
        }
        
        ListResponse response = boardService.selectBoardList(request);
        return ResponseEntity.ok(response);
    }
	
	//이미지 업로드
	@PostMapping("/image-upload")
	public ResponseEntity<?> imageUpload(@ModelAttribute MultipartFile image) {
	    String savepath = root + "editor/"; 
	    File dir = new File(savepath);
	    if(!dir.exists()) dir.mkdirs();
	    String filepath = fileUtil.upload(savepath, image);
	    return ResponseEntity.ok(filepath); 
	}
	
	//게시글 등록
	@PostMapping
	public ResponseEntity<?> insertBoard(@ModelAttribute Board board) {
	    Document doc = Jsoup.parse(board.getBoardContent());
	    Element firstImg = doc.selectFirst("img");
	    String boardThumb = firstImg == null ? null : firstImg.attr("src");
	    board.setBoardThumb(boardThumb);
	    int result = boardService.insertBoard(board);
	    return ResponseEntity.ok(result);
	}
	
	// 게시글 상세 조회
	@GetMapping("/{boardNo}")
    public ResponseEntity<?> selectOneBoard(@PathVariable Integer boardNo,
                                            @RequestHeader(required = false, name="Authorization") String token) {
        Board board = boardService.selectOneBoard(boardNo);
        
        // 게시글이 존재하지 않을 때
        if(board == null) return ResponseEntity.status(404).build();
        
        // 비공개 글(0)인 경우 권한 체크
        if(board.getBoardStatus() == 0) {
            if(token == null || token.equals("null")) {
                return ResponseEntity.status(403).body("비공개 게시글입니다.");
            }
            
            kr.co.iei.member.model.vo.LoginMember loginMember = jwtUtils.checkToken(token);
            boolean isAdmin = (loginMember.getMemberGrade() == 1); // 관리자 등급 확인
            boolean isWriter = loginMember.getMemberId().equals(board.getBoardWriter()); // 본인 확인
            
            if(!isAdmin && !isWriter) {
                return ResponseEntity.status(403).body("접근 권한이 없습니다.");
            }
        }
        return ResponseEntity.ok(board);
    }
    // 게시글 수정
    @PutMapping("/{boardNo}")
    public ResponseEntity<?> updateBoard(@ModelAttribute Board board, @PathVariable Integer boardNo) {
        board.setBoardNo(boardNo);
        Document doc = Jsoup.parse(board.getBoardContent());
        Element firstImg = doc.selectFirst("img");
        String boardThumb = firstImg == null ? null : firstImg.attr("src");
        board.setBoardThumb(boardThumb);
        int result = boardService.updateBoard(board);
        return ResponseEntity.ok(result);
    }

    // 게시글 삭제
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<?> deleteBoard(@PathVariable Integer boardNo) {
        int result = boardService.deleteBoard(boardNo);
        return ResponseEntity.ok(result);
    }
    
  	//좋아요 정보 조회
  	@GetMapping("/{boardNo}/likes")
  	public ResponseEntity<?> selectLikeInfo(@PathVariable Integer boardNo,
  											@RequestHeader(required = false , name="Authorization")String token){
  		Map<String, Object> result = boardService.selectLikeInfo(boardNo, token);
  		return ResponseEntity.ok(result); 
  	}
  	//좋아요 누르기
  	@PostMapping("/{boardNo}/likes")
  	//로그인 필수(required=false 없음)
  	public ResponseEntity<?> likeOn(@PathVariable Integer boardNo, 
  			                        @RequestHeader (name="Authorization")String token){
  		int result = boardService.insertLike(boardNo,token);
  		return ResponseEntity.ok(result); 
  	}
  	//좋아요 취소
  	@DeleteMapping("/{boardNo}/likes")
  	public ResponseEntity<?> likeOff(@PathVariable Integer boardNo, 
              @RequestHeader (name="Authorization")String token){
  		int result = boardService.deleteLike(boardNo,token);
  		return ResponseEntity.ok(result);
  	}
  	
  //댓글 등록
  	@PostMapping("/comments")
  	public ResponseEntity<?> insertBoardComment(@RequestBody BoardComment boardComment){
  		BoardComment newComment = boardService.insertBoardComment(boardComment);
  		return ResponseEntity.ok(newComment);
  	}
  	//댓글 조회
  	@GetMapping("/{boardNo}/comments")
  	public ResponseEntity<?> selectBoardCommentList(@PathVariable Integer boardNo){
  		List<BoardComment> commentList = boardService.selectBoardCommentList(boardNo);
  		return ResponseEntity.ok(commentList);
  	}
  	//댓글 수정
  	@PutMapping("/comments/{boardCommentNo}")
  	public ResponseEntity<?> updateBoardComment(@RequestBody BoardComment comment){
  		int result = boardService.updateBoardComment(comment);
  		return ResponseEntity.ok(result);
  	}
  	//댓글 삭제
  	@DeleteMapping("/comments/{boardCommentNo}")
  	public ResponseEntity<?> deleteBoardComment(@PathVariable Integer boardCommentNo) {
  	    int result = boardService.deleteBoardComment(boardCommentNo);
  	    return ResponseEntity.ok(result);
  	}
  
 // BoardController.java에 추가

  	@PatchMapping("/{boardNo}/status")
  	public ResponseEntity<?> changeBoardStatus(@PathVariable Integer boardNo, @RequestBody Board board) {
  	    // 리액트에서 보낸 boardStatus 값을 객체에 세팅
  	    board.setBoardNo(boardNo);
  	    int result = boardService.changeBoardStatus(board);
  	    return ResponseEntity.ok(result);
  	}
  	/*
  	 // 사용자 관련 기능(마이페이지용): 내가 좋아요 한 글 보기
  	@GetMapping("/{memberId}/like-board")
	public ResponseEntity<?> selectLikeBoardList(@PathVariable String memberId, @ModelAttribute ListItem request){
		System.out.println(memberId);
		System.out.println(request);
        ListResponse response = boardService.selectLikeBoardList(memberId, request);
		return ResponseEntity.ok(response);
	}
  	*/
}
