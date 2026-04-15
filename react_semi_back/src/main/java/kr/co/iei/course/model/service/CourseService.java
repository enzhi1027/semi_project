package kr.co.iei.course.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.iei.course.model.dao.CourseDao;
import kr.co.iei.course.model.vo.AttractionList;
import kr.co.iei.course.model.vo.AttractionSearchItem;
import kr.co.iei.course.model.vo.CourseAttractionList;
import kr.co.iei.course.model.vo.CourseList;
import kr.co.iei.course.model.vo.CourseListItem;
import kr.co.iei.course.model.vo.CourseListResponse;

@Service
public class CourseService {
	@Autowired
	private CourseDao courseDao;

	//코스 리스트 조회
	public CourseListResponse selectCourseList(CourseListItem request) {
		List<CourseList> list = courseDao.selectCourseList(request);
		int totalCount = courseDao.selectTotalCount();
		int totalPage = (int)Math.ceil(totalCount/(double)request.getSize());
		CourseListResponse response = new CourseListResponse(list, totalPage);
		return response;
	}
	
	//코스 관광지 리스트 조회
	public List<CourseAttractionList> selectCourseAttractionList(int courseNo) {
		List<CourseAttractionList> list = courseDao.selectCourseAttractionList(courseNo);
		return list;
	}
	
	//코스 좋아요 삭제
	@Transactional
	public int deleteCourseLike(CourseList request) {
		int result = courseDao.deleteCourseLike(request);
		return result;
	}

	//코스 좋아요 추가
	@Transactional
	public int insertCourseLike(CourseList request) {
		int result = courseDao.insertCourseLike(request);
		return result;
	}
	
	//관광지 리스트 조회
	public List<AttractionList> selectAttractionList(AttractionSearchItem item) {
		List<AttractionList> list = courseDao.selectAttractionList(item);
		return list;
	}

	//유저이름 조회
	public String selectMemberName(String memberId) {
		String memberName = courseDao.selectMemberName(memberId);
		return memberName;
	}

	//관광지 코스 추가
	@Transactional
	public int insertCourse(Map<String, Object> request) {
		ObjectMapper mapper = new ObjectMapper();
		CourseList courseInfo = mapper.convertValue(
				request.get("courseInfo"),
				new TypeReference<CourseList>() {
				}); 
		List<AttractionList> attractionList = mapper.convertValue(
				request.get("attractionList"),
				new TypeReference<List<AttractionList>>() {
				}); 
	    int courseNo = courseDao.insertCourseNo();
	    courseInfo.setCourseNo(courseNo);
	    int resultCourse = courseDao.insertCourse(courseInfo);
	    int result = 0;
	    if(resultCourse == 1) {
	    	for(AttractionList attraction : attractionList) {
	    		attraction.setCourseNo(courseNo);
	    		result += courseDao.insertCourseAttraction(attraction); 
	    	}
	    	if(result == attractionList.size()) {
	    		return courseNo;
	    	}
	    }
		return 0;
	}

	//코스 제목 조회
	public String selectCourseTitle(int courseNo) {
		String courseTitle = courseDao.selectCourseTitle(courseNo);
		return courseTitle;
	}

	//코스 삭제
	@Transactional
	public int deleteCourse(int courseNo) {
		int result = courseDao.deleteCourse(courseNo);
		return result;
	}

	public List<String> selectAttractionAddr() {
		List<String> list = courseDao.selectAttractionAddr();
		return list;
	}

	//코스 조회
	public CourseList selectCourse(int courseNo) {
		CourseList course = courseDao.selectCourse(courseNo);
		return course;
	}

	//코스 관광지 조회
	public List<AttractionList> selectUpdateCourseAttractionList(int courseNo) {
		List<AttractionList> list = courseDao.selectUpdateCourseAttractionList(courseNo);
		return list;
	}

	//코스 업데이트
	@Transactional
	public int updateCourse(Map<String, Object> request1) {
		ObjectMapper mapper = new ObjectMapper();
		CourseList courseInfo = mapper.convertValue(
				request1.get("courseInfo"),
				new TypeReference<CourseList>() {
				}); 
		List<AttractionList> attractionList = mapper.convertValue(
				request1.get("attractionList"),
				new TypeReference<List<AttractionList>>() {
				});
		int courseNo = courseInfo.getCourseNo();
		List<CourseList> courseLikeList = courseDao.selectCourseLikeList(courseNo);
		int likeResult = 0;
		int result = courseDao.deleteCourse(courseInfo.getCourseNo());
		if(result > 0) {
			result = 0;
			int resultCourse = courseDao.insertCourse(courseInfo);
			if(resultCourse == 1) {
				if(courseLikeList.size() != 0) {
					for(CourseList request : courseLikeList) {
						likeResult += courseDao.insertCourseLike(request);
					}
				}
				if(courseLikeList.size() != likeResult) {
					return 0;
				}
				for(AttractionList attraction : attractionList) {
					attraction.setCourseNo(courseNo);
					result += courseDao.insertCourseAttraction(attraction); 
				}
				if(result == attractionList.size()) {
					return 1;
				}
			}
		}
		
		return 0;
	}

	public int selectCourseLike(CourseList request) {
		int result = courseDao.selectCourseLike(request);
		return result;
	}

	//좋아요 표시한 코스 목록 조회
	public CourseListResponse selectLikeCourseList(CourseListItem request) {
		List<CourseList> list = courseDao.selectLikeCourseList(request);
		int likeCourseCount = courseDao.selectLikeCourseCount(request);
		int totalPage = (int)Math.ceil(likeCourseCount/(double)request.getSize());
		CourseListResponse response = new CourseListResponse(list, totalPage);
		return response;
	}

	

}









