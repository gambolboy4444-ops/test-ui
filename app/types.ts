export interface LogEntry {
  id: string;
  type: 'INBOUND' | 'OUTBOUND' | 'SYSTEM' | 'ERROR';
  name: string;
  timestamp: number;
}
