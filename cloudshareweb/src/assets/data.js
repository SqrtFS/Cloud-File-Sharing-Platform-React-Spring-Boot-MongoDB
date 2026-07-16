import { LayoutDashboard, Upload, Files, CreditCard, Receipt } from "lucide-react";

export const features = [
  {
    iconName: "UploadCloud",
    iconColor: "text-purple-500",
    title: "Fast File Upload",
    description: "Easily add your files using a smooth and user-friendly drag-and-drop system.",
  },
  {
    iconName: "Lock",
    iconColor: "text-green-500",
    title: "Protected Storage",
    description: "All your files are safely encrypted and stored in a reliable cloud system.",
  },
  {
    iconName: "Share",
    iconColor: "text-purple-500",
    title: "Quick Sharing",
    description: "Send files to others using secure and customizable access links.",
  },
  {
    iconName: "Wallet",
    iconColor: "text-orange-500",
    title: "Smart Payments",
    description: "Only pay for the resources you actually use with our flexible credit model.",
  },
  {
    iconName: "Folder",
    iconColor: "text-red-500",
    title: "File Organizer",
    description: "Manage, view, and sort your files from any device anytime.",
  },
  {
    iconName: "History",
    iconColor: "text-indigo-500",
    title: "Activity Logs",
    description: "Monitor your usage and track all transactions in one place.",
  },
];





export const plans = [
  {
    title: "Starter",
    cost: "0",
    info: "Good choice for beginners",
    perks: [
      "Upload up to 5 files",
      "Simple sharing options",
      "Files stored for 1 week",
      "Support via email",
    ],
    buttonText: "Try for Free",
    featured: false,
  },
  {
    title: "Pro",
    cost: "500",
    info: "Best for active users",
    perks: [
      "Up to 500 uploads",
      "Enhanced sharing tools",
      "30 days storage",
      "Faster email support",
      "Usage insights",
    ],
    buttonText: "Upgrade to Pro",
    featured: true,
  },
  {
    title: "Business",
    cost: "2500",
    info: "Designed for teams",
    perks: [
      "5000 uploads included",
      "Collaboration features",
      "No storage limits",
      "24/7 dedicated support",
      "Detailed analytics",
      "Developer API access",
    ],
    buttonText: "Get Business",
    featured: false,
  },
];



export const testimonials = [
  {
    name: "Emily Carter",
    role: "Head of Digital Marketing",
    company: "BrightWave Studio",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "Using CloudShare completely changed the way our team handles creative workflows. Secure sharing and fast access made collaboration much smoother.",
    rating: 5,
  },
  {
    name: "Daniel Lee",
    role: "Independent UI/UX Designer",
    company: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    quote:
      "I often send heavy design files to clients, and CloudShare made the whole process effortless and secure. It’s become part of my daily workflow.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Senior Project Manager",
    company: "NovaTech Solutions",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Before CloudShare, coordinating files across multiple teams was chaotic. Now everything is organized, accessible, and easy to manage.",
    rating: 4,
  },
];


export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Upload",
        icon: Upload,
        path: "/upload",
    },
    {
        id: "03",
        label: "My Files",
        icon: Files,
        path: "/my-files",
    },
    {
        id: "04",
        label: "Subscription",
        icon: CreditCard,
        path: "/subscriptions",
    },
    {
        id: "05",
        label: "Transactions",
        icon: Receipt,
        path: "/transactions",
    },
];