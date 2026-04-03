package kr.co.iei.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;

@CrossOrigin("*")
@RequestMapping("/boards")
@RestController
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Value("${file.root}") 
	private String root;
	
	//게시글 목록 조회
	@GetMapping
	public ResponseEntity<?> selectBoardList(@ModelAttribute ListItem request){
		ListResponse response = boardService.selectBoardList(request);
		return ResponseEntity.ok(response);
	}
}
