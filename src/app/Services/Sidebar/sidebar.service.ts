import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly STORAGE_KEY = 'sidebar_collapsed';
  private isCollapsedSubject: BehaviorSubject<boolean>;

  constructor() {
    // Initial state from localStorage or default to false
    const storedState = localStorage.getItem(this.STORAGE_KEY);
    const initialState = storedState ? JSON.parse(storedState) : false;
    this.isCollapsedSubject = new BehaviorSubject<boolean>(initialState);
  }

  /**
   * Getter for the current collapsed state
   */
  get isCollapsed$(): Observable<boolean> {
    return this.isCollapsedSubject.asObservable();
  }

  /**
   * Get the current value directly
   */
  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  /**
   * Toggle the sidebar state
   */
  toggle(): void {
    const newState = !this.isCollapsedSubject.value;
    this.isCollapsedSubject.next(newState);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
  }

  /**
   * Explicitly set the sidebar state
   */
  setCollapsed(collapsed: boolean): void {
    this.isCollapsedSubject.next(collapsed);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collapsed));
  }
}
