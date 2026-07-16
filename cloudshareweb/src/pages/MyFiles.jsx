import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Copy, Download, Eye, File, Globe, Grid, List, Lock, Trash2, Image, Video, Music, FileText, FileIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/MyFiles/FileCard";
import { api } from "../util/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LinkShareModal from "../components/LinkShareModal";


const MyFiles = () => {
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [deleteConfirmation , setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null
    });

    const [shareModel , setShareModel] = useState({
        isOpen: false,
        fileId: null,
        link: ""
    });

    //fetching the files for a logged in user
    const fetchFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(api.FETCH_FILES, { headers: { Authorization: `Bearer ${token}` } })
            if (response.status === 200) {
                setFiles(response.data);
            }

        } catch (error) {
            console.log('Error fetching the files from server: ', error);
            toast.error('Error fetching the files from server: ', error.message)
        }
    }

    //Toggles the public/private status of a file
    const togglePublic = async (fileToUpdate) =>{
        try {
            const token = await getToken();
            const id = fileToUpdate.id;
            const response = await axios.patch(api.TOGGLE_FILE(id) , {} , { headers: { Authorization: `Bearer ${token}` } })
           if (response.status === 200) {
                setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic} : file));
            }
        } catch (error) {
            console.error('Error toggling the file status: ', error.message);
            toast.error(`Error toggling the file status`);
        }
    }

    //Handle file download
    const downloadFile = async (fileToDownload) => {
        try {
            const token = await getToken();
            const id = fileToDownload.id;
            const response = await axios.get(api.DOWNLOAD_FILE(id) , {headers: {Authorization: `Bearer ${token}`}, responseType: 'blob'});
            
            // create a blob url and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download",fileToDownload.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); //clean up the object url
        } catch (error) {
            console.error('Error downloading the file : ', error.message);
            toast.error(`Error downloading the file`);
        }
    }



    //Closes the delete confirmation modal
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null
        });
    }

    //Opens the delete confirmation modal
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId: fileId
        });
    }

     //Opens the share link modal
     const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModel({
            isOpen: true,
            fileId: fileId,
            link: link
        });
     }

    //Close the share link modal
    const closeShareModal = () => {
        setShareModel({
            isOpen: false,
            fileId: null,
            link: ""
        });
    }

    //handle delete after confirmation modal
    const deleteFile = async () => {
        const fileId = deleteConfirmation.fileId;
        if(!fileId) return;
        try {
            const token = await getToken();
            const response = await axios.delete(api.DELETE_FILE(fileId) , {headers: {Authorization: `Bearer ${token}`}})
            if(response.status === 204){
                setFiles(files.filter((file) => file.id !== fileId ));
                closeDeleteConfirmation();
            }else{
                 toast.error(`Error deleting the file`);
            }
        } catch (error) {
            console.error('Error deleting the file : ', error.message);
            toast.error(`Error deleting the file`);
        }
    }
    

    useEffect(() => {
        fetchFiles();
    }, [getToken])

    const getFileIcon = (file) => {
        const extension = file.name.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
            return <Image size={24} className="text-purple-500" />;
        }

        if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
            return <Video size={24} className="text-blue-500" />;
        }

        if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
            return <Music size={24} className="text-green-500" />;
        }

        if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
            return <FileText size={24} className="text-amber-500" />;
        }

        return <FileIcon size={24} className="text-purple-500" />;
    }

    return (
        <DashboardLayout activeMenu="My Files">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">My Files {files.length}</h2>
                    <div className="flex items-center gap-3">
                        <List onClick={() => setViewMode("list")} size={24} className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} />
                        <Grid onClick={() => setViewMode("grid")} size={24} className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} />
                    </div>
                </div>
                {files.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                        <File size={60} className="text-purple-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No files uploaded yet</h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">Start uploading files to see them listed here. You can upload documents, images, and other files to share and manage them securely</p>
                        <button onClick={() => navigate("/upload")} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">Go to Upload</button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file)=>(
                            <FileCard file={file} key={file.id} onDelete={openDeleteConfirmation} onTogglePublic={togglePublic} onDownload={downloadFile} onShareLink={openShareModal} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {files.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(file)}
                                                {file.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {(file.fileSize / 1024).toFixed(1)} KB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-4">
                                                <button onClick={()=>togglePublic(file)} className="flex items-center gap-2 cursor-pointer group">
                                                    {file.isPublic ? (
                                                        <>
                                                            <Globe size={16} className="text-green-500" />
                                                            <span className="group-hover:underline">Public</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock size={16} className="text-gray-500" />
                                                            <span className="group-hover:underline">Private</span>
                                                        </>
                                                    )}
                                                </button>
                                                {file.isPublic && (
                                                    <button onClick={()=>openShareModal(file.id)} className="flex items-center gap-2 cursor-pointer group text-blue-600">
                                                        <Copy size={16}/>
                                                        <span className="group hover:underline">
                                                            Share Link
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex justify-center">
                                                    <button onClick={() => downloadFile(file)} title="Download" className="cursor-pointer text-gray-500 hover:text-blue-600">
                                                        <Download size={18}/>
                                                    </button>
                                                </div>
                                                <div onClick={() => openDeleteConfirmation(file.id)} className="flex justify-center">
                                                    <button title="Delete" className="cursor-pointer text-gray-500 hover:text-red-600">
                                                        <Trash2 size={16}/>
                                                    </button> 
                                                </div>
                                                <div className="flex justify-center">{file.isPublic ? (
                                                    <a href={`/file/${file.id}`} title="ViewFile" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600">
                                                        <Eye size={16}/>
                                                    </a>
                                                ):(
                                                    <span className="w-4.5"></span>
                                                )}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Delete confirmation diaolog */}
                <ConfirmationDialog
                    isOpen={deleteConfirmation.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Are you sure want to delete this file ? This action can not be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={deleteFile}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />

                 {/* Share link modal */}
                 <LinkShareModal
                    isOpen={shareModel.isOpen}
                    onClose={closeShareModal}
                    link={shareModel.link}
                 />
            </div>
        </DashboardLayout>
    )
}
export default MyFiles;