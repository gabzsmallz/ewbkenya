import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import { uploadImageFile } from './UploadImage';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <textarea className="w-full border rounded p-2" rows={6} />,
});

import 'react-quill/dist/quill.snow.css';

export default function WysiwygEditor({ value, onChange, bucket = 'media', ...props }) {
  const quillRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'clean'],
        ],
        handlers: {
          image: () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              try {
                setUploading(true);
                const url = await uploadImageFile(file, bucket);
                const editor = quillRef.current?.getEditor?.();
                if (!editor) return;
                const range = editor.getSelection(true);
                const position = range ? range.index : editor.getLength();
                editor.insertEmbed(position, 'image', url, 'user');
                editor.setSelection(position + 1);
              } catch (err) {
                console.error(err);
                alert(err.message || 'Image upload failed');
              } finally {
                setUploading(false);
              }
            };
          },
        },
      },
    }),
    [bucket]
  );

  return (
    <div className="space-y-2">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        {...props}
      />
      {uploading && <p className="text-sm text-gray-500">Uploading image…</p>}
    </div>
  );
}
