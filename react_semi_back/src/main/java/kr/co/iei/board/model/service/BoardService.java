package kr.co.iei.board.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;

	public ListResponse selectBoardList(ListItem request) {
	    // 디버깅용 파라미터 출력
	    System.out.println("status = " + request.getStatus());
	    System.out.println("category = " + request.getCategory());
	    System.out.println("searchType = " + request.getSearchType());
	    System.out.println("searchKeyword = " + request.getSearchKeyword());
	    System.out.println("page = " + request.getPage());
	    System.out.println("size = " + request.getSize());

	    Integer totalCount = boardDao.selectBoardCount(request); // DB에서 전체 글 개수
	    int totalPage = (int) Math.ceil(totalCount / (double) request.getSize()); // 총 페이지 계산
	    List<Board> list = boardDao.selectBoardList(request); // 목록 조회
	    ListResponse response = new ListResponse(list, totalPage); 
	    return response;
	}
}
