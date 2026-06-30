"use client";

import { useRef, useState } from "react";

type ImportUploaderProps = {
  selectedFileName: string;
  selectedFileType: string;
  onSelectFile: (file: File) => void;
};

export function ImportUploader({ selectedFileName, selectedFileType, onSelectFile }: ImportUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragActive(false);
    const [file] = Array.from(event.dataTransfer.files);
    if (file) {
      onSelectFile(file);
    }
  };

  return (
    <section className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Upload file</h2>
      <p className="mt-2 text-sm text-slate-600">Drop a CSV or JSON file, or use the file picker.</p>

      <div
        onDrop={onDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        className={`mt-4 rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragActive ? "border-[#1f3b2f] bg-[#f4f8f5]" : "border-[#d7cbb3] bg-[#fcfaf6]"
        }`}
      >
        <p className="text-sm text-slate-700">Drag and drop file here</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-[#f8f2e4]"
        >
          Choose file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          className="hidden"
          onChange={(event) => {
            const [file] = Array.from(event.target.files ?? []);
            if (file) {
              onSelectFile(file);
            }
          }}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Filename</p>
          <p className="mt-1 text-sm text-slate-800">{selectedFileName || "No file selected"}</p>
        </div>
        <div className="rounded-2xl border border-[#e7dcc3] bg-[#fcfaf6] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">File type</p>
          <p className="mt-1 text-sm text-slate-800">{selectedFileType || "Unknown"}</p>
        </div>
      </div>
    </section>
  );
}
