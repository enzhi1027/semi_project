package kr.co.iei.touritem.controller;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.touritem.model.service.TourItemService;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "tourItems")
public class TourItemController {
	@Autowired
	private TourItemService tourItemService;
	@Value("${file.root}")
	private String root;
	@Autowired
	private FileUtils fileUtils;
	
	@PostMapping
	public ResponseEntity<?> insertTourItem(@ModelAttribute TourItem tourItem, @ModelAttribute List<MultipartFile> files){
		
		
		return ResponseEntity.ok(null);
	}
	
}
