package kr.co.iei.course.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.course.model.vo.AttractionList;
import kr.co.iei.course.model.vo.AttractionSearchItem;
import kr.co.iei.course.model.vo.CourseAttractionList;
import kr.co.iei.course.model.vo.CourseList;
import kr.co.iei.course.model.vo.CourseListItem;

@Mapper
public interface CourseDao {

	List<CourseList> selectCourseList(CourseListItem request);

	List<CourseAttractionList> selectCourseAttractionList(int courseNo);

	int deleteCourseLike(CourseList request);

	int insertCourseLike(CourseList request);

	List<AttractionList> selectAttractionList(AttractionSearchItem item);

	String selectMemberName(String memberId);

}
