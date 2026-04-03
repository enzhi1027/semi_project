import styles from './BoardFrm.module.css';
import TextEditor from '../ui/TextEditor';
import { Input } from '../ui/Form';

const BoardFrm = ({
  board, //게시글 데이터(제목, 내용..)
  inputBoard, //제목 수정
  inputBoardContent, //내용 수정
}) => {
  return (
    <div className={styles.board_frm_wrap}>
      <div className={styles.input_wrap}>
        <Input
          type="text"
          name="boardTitle"
          id="boardTitle"
          value={board.boardTitle}
          onChange={inputBoard}
          placeholder="제목을 입력하세요."
        />
      </div>

      <div className={styles.input_wrap}>
        <TextEditor data={board.boardContent} setData={inputBoardContent} />
      </div>
    </div>
  );
};

export default BoardFrm;
