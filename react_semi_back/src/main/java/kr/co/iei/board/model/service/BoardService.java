package kr.co.iei.board.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.utils.FileUtils;
import kr.co.iei.utils.JwtUtils;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private JwtUtils jwtUtils;

	//게시글 목록 조회
	public ListResponse selectBoardList(ListItem request) {
	    Integer totalCount = boardDao.selectBoardCount(request); // DB에서 전체 글 개수
	    int totalPage = (int) Math.ceil(totalCount / (double) request.getSize()); // 총 페이지 계산
	    List<Board> list = boardDao.selectBoardList(request); // 목록 조회
	    ListResponse response = new ListResponse(list, totalPage); 
	    return response;
	}

	//게시글 등록
	@Transactional
	public int insertBoard(Board board) {
		int boardNo = boardDao.getNewBoardNo();
		board.setBoardNo(boardNo);
		int result = boardDao.inserBoard(board); 
		return result;
}
}
