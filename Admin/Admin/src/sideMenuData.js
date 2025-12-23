import {
  LayoutDashboard,
  Wallet,
  HandCoins,
  LogOut,
  BookOpen, // Icon for Courses
  MessageSquareQuote, // Icon for Testimonials
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
    label: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];
