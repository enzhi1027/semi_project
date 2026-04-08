package kr.co.iei.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.ListItem;
import kr.co.iei.board.model.vo.ListResponse;
import kr.co.iei.member.model.vo.LoginMember;
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
	    Integer totalCount = boardDao.selectBoardCount(request);
	    int totalPage = (int) Math.ceil(totalCount / (double) request.getSize()); 
	    List<Board> list = boardDao.selectBoardList(request); 
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
	
	// 게시글 상세 조회
    public Board selectOneBoard(Integer boardNo) {
        return boardDao.selectOneBoard(boardNo);
    }

    //게시글 삭제
    @Transactional
    public int deleteBoard(Integer boardNo) {
        int result = boardDao.deleteBoard(boardNo);
        return result;
    }
	
  //좋아요 정보 조회: 게시글의 전체 좋아요 수, 현재 로그인한 사용자의 좋아요 여부 같이 반환
  	public Map<String, Object> selectLikeInfo(Integer boardNo, String token) {
  		//전체 좋아요 수 조회
  		int likeCount = boardDao.selectLikeCount(boardNo);
  		Map<String, Object> likeInfo = new HashMap<String, Object>();
  		likeInfo.put("likeCount", likeCount);
  		if(token != null) {
  			LoginMember loginMember = jwtUtils.checkToken(token);		
  			String memberId = loginMember.getMemberId();
  			Map<String, Object> params = new HashMap<String, Object>();
  			params.put("boardNo", boardNo);
  			params.put("memberId", memberId);
  			int isLike = boardDao.selectIsLike(params);
  			likeInfo.put("isLike", isLike);
  		}else {
  			likeInfo.put("isLike", 0); 
  		}
  		return likeInfo;
  	}
  	
  	//좋아요 추가
  	@Transactional
  	public int insertLike(Integer boardNo, String token) {
  		LoginMember login = jwtUtils.checkToken(token);
  		Map<String, Object> map = new HashMap<String,Object>();
  		map.put("boardNo", boardNo);
  		map.put("memberId", login.getMemberId());
  		int result = boardDao.insertLike(map);
  		return result;
  	}

  	//좋아요 취소
  	@Transactional
  	public int deleteLike(Integer boardNo, String token) {
  		LoginMember login = jwtUtils.checkToken(token);
  		Map<String, Object> map = new HashMap<String,Object>();
  		map.put("boardNo", boardNo);
  		map.put("memberId", login.getMemberId());
  		int result = boardDao.deleteLike(map);
  		return result;
  	}
  	
  //댓글 등록
  	@Transactional
  	public BoardComment insertBoardComment(BoardComment boardComment) {
  		int boardCommentNo = boardDao.selectNewBoardCommentNo();
  		boardComment.setBoardCommentNo(boardCommentNo);
  		int result = boardDao.insertBoardComment(boardComment);
  		BoardComment newComment = boardDao.selectOneBoardComment(boardCommentNo);
  		return newComment;
  	}
  	//댓글 조회
  	public List<BoardComment> selectBoardCommentList(Integer boardNo) {
  		List<BoardComment> commentList = boardDao.selectBoardCommentList(boardNo);
  		return commentList;
  	}
  	//댓글 수정
  	@Transactional
  	public int updateBoardComment(BoardComment comment) {
  		int result = boardDao.updateBoardComment(comment);
  		return result;
  	}
  	//댓글 삭제
  	@Transactional
  	public int deleteBoardComment(Integer boardCommentNo) {
  		int result = boardDao.deleteBoardComment(boardCommentNo);
  		return result;
  	}
  	
  	/*
  	//사용자 관련 기능(마이페이지용): 내가 좋아요 한 글 보기
  	public ListResponse selectLikeBoardList(String memberId, ListItem request) {
		int totalCount = boardDao.selectLikeBoardCount(memberId);
		int totalPage = (int)(Math.ceil(totalCount/(double)request.getSize()));
		//좋아요 표시한 게시글 번호를 조회
		request.setMemberId(memberId);
		List<Board> items = boardDao.selectBoardLikeList2(request);
		ListResponse response = new ListResponse(items,totalPage);
		return response;
	}
  	
  	//관리자 관련 기능 (관리자 페이지용): 관리자용 전체 게시글 조회
	public ListResponse selectAdminBoardList(ListItem request) {
		Integer totalCount = boardDao.selectAdminTotalCount(request);
		Integer totalPage = (int)(Math.ceil(totalCount/(double)request.getSize()));
		List<Board> items = boardDao.selectAdminBaordList(request);
		ListResponse response = new ListResponse(items, totalPage);
		return response;
	}
	
	//게시글 상태 변경
	@Transactional
	public int changBoardStatus(Board board) {
		int result = boardDao.changeBoardStatus(board);
		return result;
	}
    */
    
}
