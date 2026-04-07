package kr.co.iei.board.controller;


import java.io.File;
import java.util.ArrayList;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.utils.FileUtils;

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
	
	//게시글 목록 조회
	@GetMapping
	public ResponseEntity<?> selectBoardList(@ModelAttribute ListItem request){
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
}
