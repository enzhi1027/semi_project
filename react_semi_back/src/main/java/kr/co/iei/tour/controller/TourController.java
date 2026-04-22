package kr.co.iei.tour.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import kr.co.iei.board.controller.BoardController;
import kr.co.iei.tour.model.vo.DeleteCartItem;
import kr.co.iei.tour.model.vo.Emoji;
import kr.co.iei.tour.model.vo.TourCartItem;
import kr.co.iei.tour.model.vo.TourWishItem;
import kr.co.iei.tour.model.vo.TourWishlist;
import kr.co.iei.tour.service.TourService;
import kr.co.iei.touritem.model.vo.TourItem;
import kr.co.iei.touritem.model.vo.TourItemImg;
import kr.co.iei.touritem.model.vo.TourItemInfo;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/tours")
public class TourController {

    private final BoardController boardController;
	@Autowired
	private TourService service;

    TourController(BoardController boardController) {
        this.boardController = boardController;
    }

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
	public ResponseEntity<?> searchTourItemList(
	        @RequestParam(required = false) String searchWhere,
	        @RequestParam(required = false) Integer searchPriceMin,
	        @RequestParam(required = false) Integer searchPriceMax,
	        // @DateTimeFormat을 붙여주면 문자열을 자동으로 날짜 객체로 변환해줍니다.
	        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate startDate) {
Date sqlDate = null;
		
		if (startDate != null) {
			sqlDate = Date.valueOf(startDate);
		}

	    List<TourItem> list = service.searchTourItemList(searchWhere, searchPriceMin, searchPriceMax, sqlDate);
	    
	    return ResponseEntity.ok(list);
	}
	
	@GetMapping(value = "/tourItem/{tourItemNo}")
	public ResponseEntity<?> selectTourItem(@PathVariable Integer tourItemNo) {
		TourItem item = service.selectTourItem(tourItemNo);
		return ResponseEntity.ok(item);
	}
	
	@GetMapping(value = "/tourItemInfo/{tourItemNo}")
	public ResponseEntity<?> selectTourItemInfo(@PathVariable Integer tourItemNo) {
		List<TourItemInfo> info = service.selectTourItemInfo(tourItemNo);
		return ResponseEntity.ok(info);
	}
	
	@GetMapping(value = "/tourItemImg/{tourItemNo}")
	public ResponseEntity<?> selectTourItemImg(@PathVariable Integer tourItemNo) {
		List<TourItemImg> imgs = service.selectTourItemImg(tourItemNo);
		return ResponseEntity.ok(imgs);
	}
	
	@GetMapping(value = "/wishItem/{memberId}")
	public ResponseEntity<?> selectWishItemList(@PathVariable String memberId) {
		List<TourItem> list = service.selectWishItemList(memberId);
		return ResponseEntity.ok(list);
	}
	
	@DeleteMapping(value = "/deleteWish/{wishlistNo}")
	public ResponseEntity<?> deleteWish(@PathVariable Integer wishlistNo) {
		int result = service.deleteWish(wishlistNo);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value = "/deleteWishlist/{wishlistNo}")
	public ResponseEntity<?> deleteWishlist(@PathVariable Integer wishlistNo) {
		int result = service.deleteWishlist(wishlistNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/cartList/{memberId}")
	public ResponseEntity<?> selectTourCartList(@PathVariable String memberId) {
		List<TourCartItem> list = service.selectTourCartList(memberId);
		return ResponseEntity.ok(list);
	}
	
	@PatchMapping(value = "/updateWishlistName/{memberId}/{originName}/{newName}")
	public ResponseEntity<?> updateWishlistName(@PathVariable String memberId, @PathVariable String originName, @PathVariable String newName) {
		int result = service.updateWishlistName(memberId, originName, newName);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value = "/cart")
	public ResponseEntity<?> insertTourCart(@RequestBody TourCartItem cartData) {
		int result = service.insertTourCart(cartData);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value = "/deleteCart")
	public ResponseEntity<?> deleteTourCart(@RequestBody DeleteCartItem data) {
		int result = service.deleteTourCart(data);
		return ResponseEntity.ok(result);
	}
}
