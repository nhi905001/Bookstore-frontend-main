import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['link', 'blockquote', 'code-block'],
  ['clean'],
];

const RichTextEditor = ({ label, value = '', onChange, placeholder = '' }) => {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: { toolbar: toolbarOptions },
    placeholder,
  });

  // update parent on change
  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      const html = quill.root.innerHTML;
      onChange?.(html === '<p><br></p>' ? '' : html);
    };

    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [quill, onChange]);

  // sync value coming from outside
  useEffect(() => {
    if (!quill) return;
    const current = quill.root.innerHTML;
    const incoming = value || '';
    if (incoming !== current) {
      quill.root.innerHTML = incoming;
    }
  }, [value, quill]);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="bg-white rounded-md border border-gray-300">
        <div ref={quillRef} className="min-h-[200px]" />
      </div>
      <p className="text-xs text-gray-500">
        Bạn có thể định dạng văn bản tương tự như trong Word (in đậm, gạch đầu dòng, chèn liên kết, ...).
      </p>
    </div>
  );
};

export default RichTextEditor;

