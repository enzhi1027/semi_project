import { EditorContent, useEditor } from '@tiptap/react';
import styles from './TextEditor.module.css';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ResizeImage from 'tiptap-extension-resize-image';
import axios from 'axios';

const TextEditor = ({ data, setData }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, ResizeImage],
    content: data || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });

  return (
    <div className={styles.editor_wrap}>
      <MenuBar editor={editor} />
      <div style={{ position: 'relative' }}>
        {!data && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 20,
              color: 'gray',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            내용을 입력하세요.
          </div>
        )}
        <EditorContent editor={editor} className={styles.editor_content} />
      </div>
    </div>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      //선택한 이미지를 백엔드서버에 업로드하고, 파일이름을 받아옴
      const form = new FormData();
      form.append('image', file);
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/boards/image-upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res);
          const imageUrl = `${import.meta.env.VITE_BACKSERVER}/editor/${res.data}`;
          editor.chain().focus().setImage({ src: imageUrl }).run();
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };
  return (
    <div className={styles.menu_bar}>
      <button
        type="button"
        className={editor.isActive('bold') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </button>
      <button
        type="button"
        className={editor.isActive('italic') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
      </button>
      <button
        type="button"
        className={
          editor.isActive('heading', { level: 2 }) ? styles.active : ''
        }
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </button>
      <button
        type="button"
        className={editor.isActive('bulletList') ? styles.active : ''}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        List
      </button>
      <button type="button" onClick={addImage}>
        Image
      </button>
    </div>
  );
};
export default TextEditor;
