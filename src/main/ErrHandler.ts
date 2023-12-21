import * as fs from 'fs';
import * as path from 'path';

export type LoggableErrorDescriptor = {
  logPath: string;
  originalErr: string;
  isLoggableErrorDescriptor: true;
};

export class LoggableError extends Error {
  private _logPath: string;
  private _originErr: Error;
  public isLoggableErr = true;
  constructor(e: Error | string) {
    super(typeof e === 'string' ? e : e.message);

    const filePath = path.resolve(__dirname, `err-${Date.now()}`);
    fs.writeFileSync(filePath, JSON.stringify(e));

    this._logPath = filePath;
    this._originErr = typeof e === 'string' ? new Error(e) : e;
  }

  getLogPath() {
    return this._logPath;
  }

  getOriginErr() {
    return this._originErr;
  }

  toDescriptor(): LoggableErrorDescriptor {
    return {
      originalErr: JSON.stringify(this._originErr),
      logPath: this._logPath,
      isLoggableErrorDescriptor: true
    };
  }
}

function errHandler(e: any): LoggableErrorDescriptor {
  if (e.isLoggableErr) {
    return e.toDescriptor();
  } else {
    return new LoggableError(e).toDescriptor();
  }
}

export function handleErr<Args extends any[], Return extends Promise<any> | any>(
  fn: (...args: Args) => Return
): (...args: Args) => Return | LoggableErrorDescriptor {
  // TODO: Solve typing
  //@ts-ignore
  return (...args: Args) => {
    if (fn[Symbol.toStringTag] === 'AsyncFunction') {
      return (fn(...args) as Promise<any>).catch(errHandler);
    } else {
      try {
        return fn(...args);
      } catch (e: any) {
        return errHandler(e);
      }
    }
  };
}
