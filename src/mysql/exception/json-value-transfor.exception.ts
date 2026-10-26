/**
 * JSON值转换异常
 */
export class JsonValueTransformException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
