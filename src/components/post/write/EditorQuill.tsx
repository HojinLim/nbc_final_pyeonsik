import React from 'react';
import { useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { ImageResize } from 'quill-image-resize-module-ts';
import 'react-quill/dist/quill.snow.css';
import 'src/components/post/write/StyledEditorQuill.css';
import { CommonBodyProps } from 'src/types/types';
import styled from 'styled-components';

import { toast } from 'react-toastify';
import { LIMIT_3MB } from 'src/utility/guide';

Quill.register('modules/ImageResize', ImageResize);

const EditorQuill = ({ body, setBody }: CommonBodyProps) => {
  const QuillRef = useRef<ReactQuill>();

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files![0];
      console.log(file.size);
      if (file !== null && file.size > 0.1 * 1024 * 1024) {
        toast(LIMIT_3MB);
        return;
      }

      let quill = QuillRef.current?.getEditor();
      const range = QuillRef.current?.getEditor().getSelection()?.index;

      if (range !== null && range !== undefined) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise(() => {
          reader.onload = () => {
            quill?.setSelection(range, 1);
            quill?.insertEmbed(range, 'image', reader.result);
          };
          return;
        });
      }
    });
  };

  const modules = useMemo(
    () => ({
      ImageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      },
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ font: [] }],
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          // ['blockquote', 'code-block'],

          // [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],

          // [{ script: 'sub' }, { script: 'super' }],
          // [{ indent: '-1' }, { indent: '+1' }],
          // [{ direction: 'rtl' }],

          ['image', 'video', 'clean']
        ],
        handlers: {
          image: imageHandler
          // handlers object will be merged with default handlers object
          // link: function (body) {
          //   if (body) {
          //     var href = prompt('Enter the URL');
          //     this.quill.format('link', href);
          //   } else {
          //     this.quill.format('link', false);
          //   }
          // }
        }
      }
    }),
    []
  );

  return (
    <Container>
      <ReactQuill
        ref={(element) => {
          if (element !== null) {
            QuillRef.current = element;
          }
        }}
        modules={modules}
        value={body}
        onChange={setBody}
        theme="snow"
        placeholder="그르르…갉 편의점 의자에서 나누는 대화처럼 재밌는 이야기를 공유해 주세요."
      />
    </Container>
  );
};

export default EditorQuill;

const Container = styled.div``;
