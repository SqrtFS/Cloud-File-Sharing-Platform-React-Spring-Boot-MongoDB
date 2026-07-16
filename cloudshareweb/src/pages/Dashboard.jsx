import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { api } from "../util/api";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import RecentFiles from "../components/dashboard/RecentFiles";
import UploadBox from "../components/UploadBox";


const Dashboard = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recentFiles, setRecentFiles] = useState([]);
    const [loadingRecentFiles, setLoadingRecentFiles] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error, info
    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const fetchRecentFiles = async () => {
        setLoadingRecentFiles(true);
        try {
            const token = await getToken();
            const res = await axios.get(api.FETCH_FILES, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sortedFiles = res.data
                .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
                .slice(0, MAX_FILES);
            setRecentFiles(sortedFiles);
        } catch (error) {
            console.error("Error fetching recent files:", error);
        } finally {
            setLoadingRecentFiles(false);
        }
    };

    useEffect(() => {
        fetchRecentFiles();
    }, [getToken]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        if (selectedFiles.length + newFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once `);
            setMessageType("error");
            return;
        }

        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setMessage("");
        setMessageType("");
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessageType("error");
            setMessage("Please select atleast one file to upload.");
            return;
        }
        if (selectedFiles.length > MAX_FILES) {
            setMessageType("error");
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once `);
            return;
        }
        setUploading(true);
        setMessage("Uploading Files ...");
        setMessageType("info");

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        try {
            const token = await getToken();
            const response = await axios.post(api.UPLOAD_FILE, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.remainingCredits !== undefined) {
                setCredits(response.data.remainingCredits);
            }

            setMessageType("success");
            setMessage("Files uploaded successfully.");
            setSelectedFiles([]);

            // Refresh the recent files list after a successful upload
            await fetchRecentFiles();
        } catch (error) {
            console.error("Error uploading files ", error);
            toast.error("Error uploading files. Please try again.");
            setMessageType("error");
            setMessage("Error uploading files. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const isUploadDisabled =
        selectedFiles.length === 0 ||
        selectedFiles.length > MAX_FILES ||
        credits <= 0 ||
        selectedFiles.length > credits;

    const isSelectDisabled = credits <= 0 || selectedFiles.length >= MAX_FILES;

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Drive</h1>
                <p className="text-gray-600 mb-6">Upload, manage, and share your files.</p>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            messageType === "error"
                                ? "bg-red-50 text-red-700"
                                : messageType === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-purple-50 text-purple-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left column */}
                    <div className="w-full md:w-[40%]">
                        <UploadBox
                            files={selectedFiles}
                            onFileChange={handleFileChange}
                            onUpload={handleUpload}
                            uploading={uploading}
                            onRemoveFile={handleRemoveFile}
                            remainingCredits={credits}
                            isSelectDisabled={isSelectDisabled}
                            isUploadDisabled={isUploadDisabled}
                        />
                    </div>

                    {/* Right column */}
                    <div className="w-full md:w-[60%]">
                        {loadingRecentFiles ? (
                            <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center">
                                <Loader2 size={40} className="text-purple-500 animate-spin" />
                                <p className="text-gray-500 mt-4">Loading your files...</p>
                            </div>
                        ) : (
                            <RecentFiles files={recentFiles} />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
export default Dashboard;