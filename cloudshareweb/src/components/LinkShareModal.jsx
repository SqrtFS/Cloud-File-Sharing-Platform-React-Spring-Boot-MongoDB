
import { useState } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import Modal from "./Modal"; 

const LinkShareModal = ({ isOpen, onClose, link }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Error copying link: ", error.message);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Share File"
            size="sm"
        >
            <div className="flex flex-col gap-4">
                <p className="text-gray-600 text-sm">
                    Anyone with this link can view the file.
                </p>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <LinkIcon size={16} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        readOnly
                        value={link}
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
                        onFocus={(e) => e.target.select()}
                    />
                </div>

                <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-colors ${
                        copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {copied ? (
                        <>
                            <Check size={16} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy Link
                        </>
                    )}
                </button>
            </div>
        </Modal>
    );
};

export default LinkShareModal;