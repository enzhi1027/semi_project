package kr.co.iei.member.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);

	int insertMember(Member member);

	int updateMemberThumb(Member m);

	int updateMember(Member member);
	
}
