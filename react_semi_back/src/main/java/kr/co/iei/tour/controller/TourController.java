package kr.co.iei.tour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourWishlist;
import kr.co.iei.tour.service.TourService;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/tours")
public class TourController {
	@Autowired
	private TourService service;
	
	@GetMapping(value = "/emojiList")
	public ResponseEntity<?> selectEmojiList() {
		List<Emoji> list = service.selectEmojiList();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value = "/wishlistList/{memberId}")
	public ResponseEntity<?> selectWishlistList(@PathVariable String memberId) {
		List<TourWishlist> list = service.selectWishlistList(memberId);
		return ResponseEntity.ok(list);
	}
	
	@PostMapping(value = "/wishList")
	public ResponseEntity<?> insertWishlist(@RequestBody TourWishlist list) {
		int result = service.insertWishlist(list);
		return ResponseEntity.ok(result);
	}
}
