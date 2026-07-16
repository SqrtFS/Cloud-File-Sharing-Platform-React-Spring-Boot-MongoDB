import { Link } from "react-router-dom";
import { FileText, Inbox } from "lucide-react";

const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    return `${(bytes / 1024).toFixed(2)} KB`;
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const RecentFiles = ({ files }) => {
    if (!files || files.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
                <Inbox size={40} className="text-gray-300 mb-3" />
                <h3 className="text-gray-700 font-medium">No files yet</h3>
                <p className="text-sm text-gray-400 mt-1">
                    Files you upload will show up here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h2>
            <ul className="divide-y divide-gray-100">
                {files.map((file) => (
                    <li key={file.id || file.fileId} className="py-3">
                    
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <FileText size={18} className="text-purple-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatSize(file.size)} &bull; {formatDate(file.uploadedAt)}
                                    </p>
                                </div>
                            </div>
                    
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentFiles;