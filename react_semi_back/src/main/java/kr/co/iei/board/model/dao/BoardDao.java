package kr.co.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.ListItem;


@Mapper
public interface BoardDao {

	Integer selectBoardCount(ListItem request);

	List<Board> selectBoardList(ListItem request);

	int getNewBoardNo();

	int inserBoard(Board board);



}
