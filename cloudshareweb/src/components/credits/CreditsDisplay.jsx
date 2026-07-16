import { CreditCard, Loader2 } from "lucide-react";

const CreditsDisplay = ({ credits, loading }) => {
    return (
        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700">
            <CreditCard size={16}/>
            {loading ? (
                <Loader2 size={14} className="animate-spin text-blue-500" />
            ) : (
                <>
                    <span className="font-medium">{credits}</span>
                    <span className="text-sm">Credits</span>
                </>
            )}
        </div>
    )
}
export default CreditsDisplay;