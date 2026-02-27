import {
  LayoutDashboard,
  LogOut,
  Newspaper,
  BookOpen,
  MessageSquareQuote,
  Users,
  Settings,
  Mail, 
} from "lucide-react";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/home",
  },
  {
    id: "02",
    label: "Programs",
    icon: BookOpen,
    path: "/programs",
  },
  {
    id: "03",
    label: "Testimonials",
    icon: MessageSquareQuote,
    path: "/testimonials",
  },
  {
    id: "04",
    label: "Blogs",
    icon: Newspaper,
    path: "/blogs",
  },
  {
    id: "05",
    label: "Inquiries", 
    icon: Mail,
    path: "/contacts",
  },
  {
    id: "06",
    label: "Students",
    icon: Users,      
    path: "/studentRegistration",
  },
  {
    id: "07",
    label: "Account Settings",
    icon: Settings,      
    path: "/account-settings",
  },
  {
    id: "08",
    label: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];