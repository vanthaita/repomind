import { DATE_FORMATS } from '@/constants/time';


export function formatDate(date: Date | string, format: keyof typeof DATE_FORMATS = 'SHORT'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'LONG' ? 'long' : 'short',
    day: 'numeric',
  };

  if (format === 'TIME') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  } else if (format === 'DATETIME') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', options);
}


export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}


export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  
  if (!match) return null;
  
  return {
    owner: match[1] as string,
    repo: match[2]?.replace(/\.git$/, '') as string,
  };
} 