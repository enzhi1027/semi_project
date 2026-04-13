package kr.co.iei.tour.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourWishItem;
import kr.co.iei.tour.model.vo.TourWishlist;
import kr.co.iei.tour.service.TourService;
import kr.co.iei.touritem.model.vo.TourItem;

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

	@GetMapping(value = "/itemList/{order}")
	public ResponseEntity<?> selectTourItemList(@PathVariable String order) {
		List<TourItem> list = service.selectTourItemList(order);
		return ResponseEntity.ok(list);
	}

	@DeleteMapping(value = "/wish")
	public ResponseEntity<?> deleteTourWish(@RequestBody TourWishItem request) {
		int result = service.deleteTourWish(request);
		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/wish")
	public ResponseEntity<?> insertTourWish(@RequestBody TourWishItem request) {
		int result = service.insertTourWish(request);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/wishlistNoList/{memberId}/{tourItemNo}")
	public ResponseEntity<?> selectWishlistNoList(@PathVariable String memberId, @PathVariable Integer tourItemNo) {
		List<Integer> list = service.selectWishlistNoList(memberId, tourItemNo);
		return ResponseEntity.ok(list);
	}

	@GetMapping(value = "/priceMin")
	public ResponseEntity<?> selectPriceMin() {
		int result = service.selectPriceMin();
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/priceMax")
	public ResponseEntity<?> selectPriceMax() {
		int result = service.selectPriceMax();
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/searchItem")
	public ResponseEntity<?> searchTourItemList(@RequestParam(required = false) String searchWhere,
			@RequestParam(required = false) String searchPriceMin,
			@RequestParam(required = false) String searchPriceMax, @RequestParam(required = false) String searchWhen) {
		List<TourItem> list = service.searchTourItemList(searchWhere, searchPriceMin, searchPriceMax, searchWhen);
		return ResponseEntity.ok(list);
	}
}
