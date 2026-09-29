export interface IJsonResponse<T> {
  requestId: string;
  status: 'success' | 'error';
  code: number;
  timestamp: number;
  data: T;
  error?: string;
  request?: unknown;
}
