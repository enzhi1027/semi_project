package kr.co.iei.course.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
		int totalCount = list.size();
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

	public List<AttractionList> selectAttractionList(AttractionSearchItem item) {
		List<AttractionList> list = courseDao.selectAttractionList(item);
		return list;
	}

	public String selectMemberName(String memberId) {
		String memberName = courseDao.selectMemberName(memberId);
		return memberName;
	}
}









