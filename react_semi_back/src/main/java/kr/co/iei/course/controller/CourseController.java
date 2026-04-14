package kr.co.iei.course.controller;

import java.util.List;
import java.util.Map;

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

import kr.co.iei.course.model.service.CourseService;
import kr.co.iei.course.model.vo.AttractionList;
import kr.co.iei.course.model.vo.AttractionSearchItem;
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
	
	//코스 생성 관광지 리스트
	@GetMapping(value="/attraction")
	public ResponseEntity<?> selectAttractionList(@ModelAttribute AttractionSearchItem item){
		List<AttractionList> list = courseService.selectAttractionList(item);
		return ResponseEntity.ok(list);
	}
	
	//회원 이름 조회
	@GetMapping(value="/member/{memberId}")
	public ResponseEntity<?> selectMemberName(@PathVariable String memberId){
		String memberName = courseService.selectMemberName(memberId);
		return ResponseEntity.ok(memberName);
	}
	
	//코스 생성
	@PostMapping(value="/insert")
	public ResponseEntity<?> insertCourse(@RequestBody Map<String, Object> request){
		int result = courseService.insertCourse(request);
		return ResponseEntity.ok(result);
	}
	
	//코스 제목 조회
	@GetMapping(value="/courseTitle/{courseNo}")
	public ResponseEntity<?> selectCourseTitle(@PathVariable int courseNo){
		String courseTitle = courseService.selectCourseTitle(courseNo);
		return ResponseEntity.ok(courseTitle);
	}
	
	//코스 삭제
	@DeleteMapping(value="/{courseNo}")
	public ResponseEntity<?> deleteCourse(@PathVariable int courseNo){
		int result = courseService.deleteCourse(courseNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/addr")
	public ResponseEntity<?> selectAttractionAddr(){
		List<String> list = courseService.selectAttractionAddr();
		return ResponseEntity.ok(list);
	}
	
	//업데이트할 코스 정보 조회
	@GetMapping(value="/update/{courseNo}")
	public ResponseEntity<?> selectCourse(@PathVariable int courseNo){
		CourseList course = courseService.selectCourse(courseNo);
		return ResponseEntity.ok(course);
	}
	
	//업데이트할 코스 관광지 리스트 조회
	@GetMapping(value="/update/attraction/{courseNo}")
	public ResponseEntity<?> selectUpdateCourseAttractionList(@PathVariable int courseNo){
		List<AttractionList> list = courseService.selectUpdateCourseAttractionList(courseNo);
		return ResponseEntity.ok(list);
	}
	
	//코스 업데이트
	@PostMapping(value="/update")
	public ResponseEntity<?> updateCourse(@RequestBody Map<String, Object> request){
		int result = courseService.updateCourse(request);
		return ResponseEntity.ok(result);
	}
	
	//코스 좋아요 조회
	@GetMapping(value="/courseView")
	public ResponseEntity<?> selectCourseLike(@ModelAttribute CourseList request){
		int result = courseService.selectCourseLike(request);
		return ResponseEntity.ok(result);
	}
	
}






