export interface Ilogger {
  info: (...message: any[]) => void;
  error: (...message: any[]) => void;
}
