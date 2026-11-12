/**
 * 媒体异常
 */
export class MediaException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
