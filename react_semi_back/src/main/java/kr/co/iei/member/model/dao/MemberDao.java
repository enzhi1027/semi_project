package kr.co.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.member.model.vo.MemberListItem;
import kr.co.iei.touritem.model.vo.TourItem;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);

	int insertMember(Member member);

	int updateMemberThumb(Member m);

	int updateMember(Member member);

	int deleteMember(String memberId);

	int updateMemberPw(Member m);

	Member selectOneMemberEmail(String memberEmail);

	Member selectOneMemberPhone(String memberPhone);

	Integer selectMemberTotalCount(MemberListItem request);

	List<Member> selectMemberList(MemberListItem request);

	int changeMemberGrade(Member member);

	Member selectMemberIdSearch(Member m);

	String searchId(Member m);

	Member selectMemberPwSearch(Member m);

	//int deleteThumbnail(String memberId);





	
}
