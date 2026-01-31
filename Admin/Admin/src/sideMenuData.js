import {
  LayoutDashboard,
  LogOut,
  Newspaper,
  BookOpen,
  MessageSquareQuote,
  Users,
  Settings,
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
    label: "Students",
    icon: Users,      
    path: "/studentRegistration",
  },
{
    id: "06",
    label: "Account Settings", // Added the new menu item
    icon: Settings,      
    path: "/account-settings",
  },


  {
    id: "07",
    label: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];