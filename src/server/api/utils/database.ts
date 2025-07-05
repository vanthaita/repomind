import { Prisma } from '@prisma/client';

// Database utility functions

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

// Build pagination parameters
export const buildPagination = (params: PaginationParams) => {
  const { page, limit } = params;
  const offset = (page - 1) * limit;
  
  return {
    skip: offset,
    take: limit,
  };
};

// Build sort parameters
export const buildSort = (params: SortParams, defaultSortBy = 'created_at', defaultSortOrder: 'asc' | 'desc' = 'desc') => {
  const { sortBy = defaultSortBy, sortOrder = defaultSortOrder } = params;
  
  return {
    orderBy: { [sortBy]: sortOrder },
  };
};

// Build search filter
export const buildSearchFilter = (search: string, fields: string[]) => {
  if (!search) return {};
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive' as const,
      },
    })),
  };
};

// Build date range filter
export const buildDateRangeFilter = (startDate?: Date, endDate?: Date, field = 'created_at') => {
  const filter: any = {};
  
  if (startDate) {
    filter.gte = startDate;
  }
  
  if (endDate) {
    filter.lte = endDate;
  }
  
  return Object.keys(filter).length > 0 ? { [field]: filter } : {};
};

// Build where clause with common patterns
export const buildWhereClause = (filters: FilterParams, options?: {
  searchFields?: string[];
  dateField?: string;
  excludeDeleted?: boolean;
}) => {
  const where: any = {};
  
  // Add search filter
  if (filters.search && options?.searchFields) {
    Object.assign(where, buildSearchFilter(filters.search, options.searchFields));
  }
  
  // Add date range filter
  if (options?.dateField && (filters.startDate || filters.endDate)) {
    Object.assign(where, buildDateRangeFilter(filters.startDate, filters.endDate, options.dateField));
  }
  
  // Exclude deleted records
  if (options?.excludeDeleted) {
    where.delete = null;
  }
  
  // Add other filters
  Object.keys(filters).forEach(key => {
    if (!['search', 'startDate', 'endDate', 'page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
      if (filters[key] !== undefined && filters[key] !== null) {
        where[key] = filters[key];
      }
    }
  });
  
  return where;
};

// Execute paginated query
export const executePaginatedQuery = async <T>(
  queryFn: (params: { skip: number; take: number; where: any; orderBy: any }) => Promise<T[]>,
  countFn: (params: { where: any }) => Promise<number>,
  params: PaginationParams & SortParams & FilterParams,
  options?: {
    searchFields?: string[];
    dateField?: string;
    excludeDeleted?: boolean;
  }
) => {
  const where = buildWhereClause(params, options);
  const orderBy = buildSort(params);
  const pagination = buildPagination(params);
  
  const [data, total] = await Promise.all([
    queryFn({ ...pagination, where, orderBy }),
    countFn({ where }),
  ]);
  
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      pages: Math.ceil(total / params.limit),
    },
  };
};

// Soft delete helper
export const softDelete = async (
  model: any,
  id: string,
  deleteField = 'delete'
) => {
  return model.update({
    where: { id },
    data: { [deleteField]: new Date() },
  });
};

// Batch operations helper
export const batchOperation = async <T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  batchSize = 100
) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(item => operation(item))
    );
    results.push(...batchResults);
  }
  
  return results;
};

// Transaction helper
export const withTransaction = async <T>(
  prisma: any,
  operation: (tx: any) => Promise<T>
): Promise<T> => {
  return prisma.$transaction(operation);
};

// Retry helper for database operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}; 