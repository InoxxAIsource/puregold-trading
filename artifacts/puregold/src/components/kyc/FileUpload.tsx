import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  icon?: string;
  hint?: string;
  onChange: (file: File | null, preview: string | null) => void;
}

export function FileUpload({ label, icon = "📄", hint = "JPG, PNG, PDF — Max 10MB", onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handle = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(f, result);
    };
    reader.readAsDataURL(f);
    setFile(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handle(f);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handle(f);
  };

  const remove = () => {
    setFile(null);
    setPreview(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        {icon} {label}
      </label>
      {file ? (
        <div className="border border-green-500/40 bg-green-500/5 rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          {preview && preview.startsWith("data:image") && (
            <img src={preview} alt="preview" className="h-12 w-12 object-cover rounded border border-border" />
          )}
          <button onClick={remove} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }`}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-foreground font-medium">Drag & drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          <button
            type="button"
            className="mt-3 px-4 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary/50 transition-colors text-foreground"
          >
            Choose File
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={onInput}
      />
    </div>
  );
}
