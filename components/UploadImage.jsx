import { useState } from 'react';

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      } else {
        reject(new Error('Unable to read file'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file, bucket = 'media') {
  const base64 = await fileToBase64(file);
  const response = await fetch('/api/admin/uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bucket,
      name: file.name,
      contentType: file.type,
      base64,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Upload failed');
  }

  const { url } = await response.json();
  if (!url) {
    throw new Error('Upload failed');
  }

  return url;
}

export default function UploadImage({ onUploaded, bucket = 'media' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const url = await uploadImageFile(file, bucket);
      onUploaded?.(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
      {busy && <p className="text-sm text-gray-500 mt-1">Uploading…</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
