// packages/rx-store/src/history.ts
import { BehaviorSubject } from 'rxjs';
import type { State } from './types';

export interface HistoryEntry {
  state: State;
  timestamp: number;
  groupId?: string;
  meta?: any;
}

export class HistoryManager {
  private history: HistoryEntry[] = [];
  private cursor = -1;
  private maxSize = 500;

  canUndo$ = new BehaviorSubject(false);
  canRedo$ = new BehaviorSubject(false);

  push(entry: HistoryEntry) {
    if (this.cursor < this.history.length - 1) {
      this.history = this.history.slice(0, this.cursor + 1);
    }

    if (entry.groupId) {
      const last = this.history[this.history.length - 1];
      if (last?.groupId === entry.groupId) {
        this.history[this.history.length - 1] = entry;
        this.update();
        return;
      }
    }

    this.history.push(entry);
    this.cursor = this.history.length - 1;
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.cursor--;
    }
    this.update();
  }

  undo(): State | null {
    if (this.cursor <= 0) return null;
    this.cursor--;
    this.update();
    return this.history[this.cursor].state;
  }

  redo(): State | null {
    if (this.cursor >= this.history.length - 1) return null;
    this.cursor++;
    this.update();
    return this.history[this.cursor].state;
  }

  jumpTo(index: number): State | null {
    if (index < 0 || index >= this.history.length) return null;
    this.cursor = index;
    this.update();
    return this.history[index].state;
  }

  clear() {
    this.history = [];
    this.cursor = -1;
    this.update();
  }

  private update() {
    this.canUndo$.next(this.cursor > 0);
    this.canRedo$.next(this.cursor < this.history.length - 1);
  }

  get entries() { return this.history; }
  get cursorIndex() { return this.cursor; }
}