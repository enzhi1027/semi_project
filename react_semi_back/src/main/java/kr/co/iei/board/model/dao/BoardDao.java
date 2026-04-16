package kr.co.iei.board.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.MyCommentList;
import kr.co.iei.board.model.vo.MyCommentResponse;


@Mapper
public interface BoardDao {

	Integer selectBoardCount(ListItem request);

	List<Board> selectBoardList(ListItem request);

	int getNewBoardNo();

	int inserBoard(Board board);

	Board selectOneBoard(Integer boardNo);

	int deleteBoard(Integer boardNo);

	int selectLikeCount(Integer boardNo);

	int selectIsLike(Map<String, Object> params);

	int insertLike(Map<String, Object> map);

	int deleteLike(Map<String, Object> map);

	int insertBoardComment(BoardComment boardComment);

	List<BoardComment> selectBoardCommentList(Integer boardNo);

	int selectNewBoardCommentNo();

	BoardComment selectOneBoardComment(int boardCommentNo);

	int updateBoardComment(BoardComment comment);

	int deleteBoardComment(int boardCommentNo);

	int updateBoard(Board board);
	
	int changeBoardStatus(Board board);

	int changeCommentStatus(BoardComment comment);

	String selectBoardContent(Integer boardNo);

	Integer selectLikeBoardCount(ListItem request);

	List<Board> selectLikeBoardList(ListItem request);

	Integer selectMyBoardCount(ListItem request);

	List<Board> selectMyBoardList(ListItem request);

	Integer selectMyCommentCount(ListItem request);

	List<MyCommentList> selectMyCommentList(ListItem request);



}
