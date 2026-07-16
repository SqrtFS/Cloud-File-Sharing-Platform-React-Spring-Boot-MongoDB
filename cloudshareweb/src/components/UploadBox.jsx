import { useState } from "react";
import { UploadCloud, X, File as FileIcon } from "lucide-react";

const UploadBox = ({
    files,
    onFileChange,
    onUpload,
    uploading,
    onRemoveFile,
    remainingCredits,
    isUploadDisabled,
    isSelectDisabled,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        onFileChange({ target: { files: e.dataTransfer.files } });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                } ${isUploadDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <UploadCloud size={40} className="text-gray-400 mb-2" />
                <span className="text-gray-600 text-sm">
                    Click to select files or drag and drop
                </span>
                <span className="text-gray-400 text-xs mt-1">
                    Remaining credits: {remainingCredits}
                </span>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onFileChange}
                    disabled={isSelectDisabled}
                />
            </label>

            {files?.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <FileIcon size={16} className="text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            </div>
                            <button
                                onClick={() => onRemoveFile(index)}
                                className="text-gray-400 hover:text-red-500 shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onUpload}
                disabled={uploading || isUploadDisabled || !files || files.length === 0}
                className="mt-6 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
};

export default UploadBox;