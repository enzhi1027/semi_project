import { Input } from '../ui/Form';
import styles from './BoardFrm.module.css';
import TextEditor from '../ui/TextEditor';

const BoardFrm = ({ board, inputBoard, inputBoardContent }) => {
  return (
    <div className={styles.board_frm_wrap}>
      <div className={styles.input_wrap}>
        <label htmlFor="boardTitle">제목</label>
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
        <label htmlFor="boardContent">내용</label>
        <TextEditor data={board.boardContent} setData={inputBoardContent} />
      </div>
    </div>
  );
};

export default BoardFrm;
