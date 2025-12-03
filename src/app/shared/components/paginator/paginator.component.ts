import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() pageNum = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  // Predefined page size options
  pageSizeOptions = [3, 4, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 1;
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.pageChange.emit(newPage);
  }

  onPageSizeChange(newSize: number) {
    this.pageSizeChanged.emit(newSize);
    this.changePage(1); // reset to first page when page size changes
  }
}

