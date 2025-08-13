// Export all types from recipe module
export * from './recipe';

// Common UI types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  current?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

// Search and filter types
export interface SearchState {
  query: string;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

// Theme and UI state types
export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}
