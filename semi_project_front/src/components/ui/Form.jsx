//입력창(input)과 글쓰기창(TextArea)을 재사용하기 위해 만든 컴포넌트
import styles from './Form.module.css';

const Input = (props) => {
  return <input className={styles.input} {...props}></input>;
};

const TextArea = (props) => {
  return <textarea className={styles.textarea} {...props}></textarea>;
};

export { Input, TextArea };
