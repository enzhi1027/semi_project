package kr.co.iei.etc.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
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
import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.member.model.vo.MemberListItem;
import kr.co.iei.member.model.vo.MemberListResponse;
import kr.co.iei.touritem.model.service.TourItemService;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;
import kr.co.iei.touritem.model.vo.TourListResponse;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "admin")
public class AdminController {
	@Autowired
	private TourItemService tourItemService;
	@Value("${file.root}")
	private String root;
	@Autowired
	private FileUtils fileUtils;
	@Autowired
	private MemberService memberService;
	@Autowired
	private BoardService boardService;
	
	//상품 등록--------------------------------------------------------
	@PostMapping
	public ResponseEntity<?> insertTourItem(
			//객체
			@ModelAttribute TourItem tourItem, 
			//파일 리스트
			@RequestParam(value = "files", required = false)
				// required = false : 필수 요소가 아님을 명시
				List<MultipartFile> files,
			// 순서 번호 리스트
			@RequestParam(value = "tourItemImgOrder", required = false) 
				List<Integer> tourItemImgOrder
			) {
		
		//첨부파일(이미지) 저장 + 순서 저장(tourItemImgOrder)
		List<TourItemImg> imgList = new ArrayList<TourItemImg>();
		if(files != null) {//첨부파일(이미지) 있을 때만 작업
			String savepath = root+"tourItemImg/";
			for(int i = 0; i < files.size(); i++) {
				String tourItemImgPath = fileUtils.upload(savepath, files.get(i));
				
				//이미지 경로 저장
				TourItemImg tourItemImg = new TourItemImg();
				tourItemImg.setTourItemImgPath(tourItemImgPath);
				
				//이미지 순서 세팅
				if(tourItemImgOrder != null && tourItemImgOrder.size() > i) {
					tourItemImg.setTourItemImgOrder(tourItemImgOrder.get(i));
				}
				imgList.add(tourItemImg);
			}
		}
		int result = tourItemService.insertTourItem(tourItem, imgList);
		return ResponseEntity.ok(result);
	}
	
	//상품 조회 ----------------------------------------------------------------
	@GetMapping(value = "/tour")
	public ResponseEntity<?> selectTourItemList(@ModelAttribute ListItem request) {
		TourListResponse response = tourItemService.selectTourItemList(request);
		return ResponseEntity.ok(response);
	}
	//상품 상태 전환 -------------------------------------------------------------
	@PatchMapping(value = "/tourItems/{tourItemNo}")
	public ResponseEntity<?> changeTourItemStatus(@RequestBody TourItem tourItem){
		int result = tourItemService.changeTourItemStatus(tourItem);
		return ResponseEntity.ok(result);
	}
	
	//상품 1개 조회 --------------------------------------------------------------
	@GetMapping(value = "{tourItemNo}")
	public ResponseEntity<?> selectOneTourItem(@PathVariable Integer tourItemNo){
		TourItem tourItem = tourItemService.selectOneTourItem(tourItemNo);
		
		if(tourItem != null) {
			List<TourItemInfo> placeList = tourItemService.selectPlaceList(tourItemNo);
			tourItem.setPlaceList(placeList);
			
			List<TourItemImg> fileList = tourItemService.selectImgList(tourItemNo);
			tourItem.setFileList(fileList);
		}
		return ResponseEntity.ok(tourItem);
	}
	//상품 수정 -----------------------------------------------------------------
	@PutMapping(value="/{tourItemNo}")
	public ResponseEntity<?> updateTourItem(@PathVariable Integer tourItemNo,
											@ModelAttribute TourItem tourItem,
											@RequestParam(value = "files",required = false) 
											List<MultipartFile> files){
		//경로로 들어온 tourItemNo를 tourItem객체에 대입
		tourItem.setTourItemNo(tourItemNo);
		
		//이미지 파일 처리
		List<TourItemImg> addImgList = new ArrayList<>();
		if(files != null) {
			String savepath = root + "tourItemImg/";
			for(MultipartFile file : files) {
				if(!file.isEmpty()) {
					String tourItemImgPath = fileUtils.upload(savepath, file);
					TourItemImg img = new TourItemImg();
					img.setTourItemImgPath(tourItemImgPath);
					img.setTourItemNo(tourItemNo);
					addImgList.add(img);
				}
			}
		}
		// 수정 결과
		int result = tourItemService.updateTourItem(tourItem, addImgList);
		
		if(result > 0 && tourItem.getDeleteFilePath() != null) {
			String savepath = root + "tourItemImg/";
			for(String deletePath : tourItem.getDeleteFilePath()) {
				File deleteFile = new File(savepath + deletePath);
				if (deleteFile.exists()) {
					deleteFile.delete();
				}
			}
		}
		return ResponseEntity.ok(result);
	}
	
	//상품 삭제 ----------------------------------------------------------------
	@DeleteMapping(value="{tourItemNo}")
	public ResponseEntity<?> deleteTourItem(@PathVariable Integer tourItemNo){
		List<TourItemImg> deleteImgList = tourItemService.deleteTourItemImg(tourItemNo);
		//파일 지워야 하니 List로 받기
		if(deleteImgList != null) {
			String savepath = root + "tourItemImg/";
			for(TourItemImg tourItemImg : deleteImgList) {
				File deleteImg = new File(savepath + tourItemImg.getTourItemImgPath());
				//존재 여부 확인
				if(deleteImg.exists()) {					
					deleteImg.delete();
				}
			}
			return ResponseEntity.ok(1);
		}
		return ResponseEntity.ok(0);
	}
	
	//회원 전체 조회 -----------------------------------------------------------
	@GetMapping(value = "memberList")
	public ResponseEntity<?> selectMemberList(@ModelAttribute MemberListItem request) {
		MemberListResponse response = memberService.selectMemberList(request);
		return ResponseEntity.ok(response);
	}
	
	//회원 등급 변경 ----------------------------------------------------------
	@PatchMapping(value = "/changeMemberGrade")
	public ResponseEntity<?> changeMemberGrade(@RequestBody Member member){
		int result = memberService.changeMemberGrade(member);
		return ResponseEntity.ok(result);
	}
	
	//게시글 본문 조회 -------------------------------------------------------
	@GetMapping(value = "/board/content/{boardNo}")
	public ResponseEntity<?> selectBoardContent(@PathVariable Integer boardNo){
		String boardContent = boardService.selectBoardContent(boardNo);
		
		if(boardContent == null) {
			return ResponseEntity.ok("내용이 없습니다.");
		}
		return ResponseEntity.ok(boardContent);
	}
	
	//게시글 상태 전환 -----------------------------------------------------
	@PatchMapping(value = "/board/status")
	public ResponseEntity<?> changeBoardStatus(@RequestBody Board board) {
		int result = boardService.changeBoardStatus(board);
		return ResponseEntity.ok(result);
	}
	
	//관리자) 게시글 삭제 ----------------------------------------------
	@DeleteMapping(value = "/board/{boardNo}")
	public ResponseEntity<?> deleteBoard(@PathVariable Integer boardNo){
		int result = boardService.deleteBoard(boardNo);
		return ResponseEntity.ok(result);
	}
}
