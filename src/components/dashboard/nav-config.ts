import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Receipt,
  FileText,
  LineChart,
  BarChart3,
  Bot,
  Building2,
  User,
  Bell,
  Users,
  ScrollText,
  CreditCard,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/security";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
      { href: "/assistant", label: "AI Assistant", icon: Bot, permission: "use:ai" },
    ],
  },
  {
    title: "Finances",
    items: [
      { href: "/transactions", label: "Transactions", icon: ArrowLeftRight, permission: "manage:transactions" },
      { href: "/revenue", label: "Revenue", icon: TrendingUp, permission: "manage:transactions" },
      { href: "/expenses", label: "Expenses", icon: Receipt, permission: "manage:transactions" },
      { href: "/invoices", label: "Invoices", icon: FileText, permission: "manage:invoices" },
      { href: "/cash-flow", label: "Cash Flow", icon: LineChart, permission: "view:dashboard" },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/forecasts", label: "Forecasts", icon: TrendingUp, permission: "view:reports" },
      { href: "/reports", label: "Reports", icon: BarChart3, permission: "view:reports" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { href: "/team", label: "Team Members", icon: Users, permission: "manage:team" },
      { href: "/audit-logs", label: "Audit Logs", icon: ScrollText, permission: "view:audit" },
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/company", label: "Company Settings", icon: Building2, permission: "manage:company" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/help", label: "Help Center", icon: LifeBuoy },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
