package kr.co.iei.etc.controller;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.touritem.model.service.TourItemService;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
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
	@GetMapping
	public ResponseEntity<?> selectTourItemList(@ModelAttribute ListItem request) {
		TourListResponse response = tourItemService.selectTourItemList(request);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}
	
	
}
