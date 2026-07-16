import { X } from "lucide-react";

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmText,
    cancelText,
    onConfirm,
    confirmationButtonClass = "bg-blue-600 hover:bg-blue-700",
    size = "md",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose} 
        >
            <div
                className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4`}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4">
                    {children}
                </div>

                {(confirmText || cancelText) && (
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                        {cancelText && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        {confirmText && (
                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 rounded-md text-white transition-colors ${confirmationButtonClass}`}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;