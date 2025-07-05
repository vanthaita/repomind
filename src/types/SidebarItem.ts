import { NavItem } from './NavItem';

export interface SidebarItem extends NavItem {
  items?: NavItem[];
} 