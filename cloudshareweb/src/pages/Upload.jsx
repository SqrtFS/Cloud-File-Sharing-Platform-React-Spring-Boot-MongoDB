import DashboardLayout from "../layout/DashboardLayout";
import { useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import { AlertCircleIcon } from "lucide-react";
import UploadBox from "../components/UploadBox.jsx";
import axios from "axios";
import { api } from "../util/api.jsx";
import toast from "react-hot-toast";

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); //success or error
    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if(files.length + selectedFiles.length > MAX_FILES){
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once `);
            setMessageType("error");
            return;
        }


        //add the new files into the existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i ) => i!== index));
        setMessage("");
        setMessageType("");
    }

    const handleUpload = async () => {
        if(files.length === 0 ){
            setMessageType("error");
            setMessage("Please  select atleast one file to upload.");
            return;
        }
        if(files.length > MAX_FILES){
            setMessageType("error");
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once `);
            return;
        }
        setUploading(true);
        setMessage("Uploading Files ...");
        setMessageType("info");

        const formData = new FormData();
        files.forEach((file) => formData.append("files" , file));
        
        try {
            const token = await getToken();
            const response = await axios.post(api.UPLOAD_FILE , formData , {headers: {Authorization: `Bearer ${token}` , "Content-Type": "multipart/form-data"}});
            if(response.data && response.data.remainingCredits !== undefined){
                setCredits(response.data.remainingCredits);
            }
            setMessageType("success");
            setMessage("Files uploaded successfully.");
            setFiles([]);
        } catch (error) {
            console.error("Error uploading files ", error);
            toast.error("Error uploading files. Please try again.");
            setMessageType("error");
            setMessage("Error uploading files. Please try again.");
        } finally {
            setUploading(false);
        }

    }

    const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;

    const isSelectDisabled = credits <= 0 || files.length >= MAX_FILES;

    return (
        <DashboardLayout activeMenu="Upload">
            <div className="p-6">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === "error" ? "bg-red-50 text-red-700" : messageType === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                        {messageType === "error" && <AlertCircleIcon size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isSelectDisabled={isSelectDisabled}
                    isUploadDisabled={isUploadDisabled} />
            </div>
        </DashboardLayout>
    )
}
export default Upload;