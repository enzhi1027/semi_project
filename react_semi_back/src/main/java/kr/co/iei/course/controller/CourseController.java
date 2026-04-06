package kr.co.iei.course.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.course.model.service.CourseService;
import kr.co.iei.course.model.vo.CourseAttractionList;
import kr.co.iei.course.model.vo.CourseList;
import kr.co.iei.course.model.vo.CourseListItem;
import kr.co.iei.course.model.vo.CourseListResponse;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/courses")
public class CourseController {
	@Autowired
	private CourseService courseService;
	
	//코스 리스트 조회
	@GetMapping
	public ResponseEntity<?> seletCourseList(@ModelAttribute CourseListItem request){
		CourseListResponse response = courseService.selectCourseList(request);
		return ResponseEntity.ok(response);
	}
	
	//코스 관광지 리스트 조회
	@GetMapping(value="/{courseNo}")
	public ResponseEntity<?> selectCourseAttractionList(@PathVariable int courseNo){
		List<CourseAttractionList> list = courseService.selectCourseAttractionList(courseNo);
		return ResponseEntity.ok(list);
	}
	
	//코스 좋아요 삭제
	@DeleteMapping
	public ResponseEntity<?> deleteCourseLike(@ModelAttribute CourseList request){
		int result = courseService.deleteCourseLike(request);
		return ResponseEntity.ok(result);
	}
	
	//코스 좋아요 추가
	@PostMapping
	public ResponseEntity<?> insertCourseLike(@ModelAttribute CourseList request){
		int result = courseService.insertCourseLike(request);
		return ResponseEntity.ok(result);
	}
	
	
	
}
