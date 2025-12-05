import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ProductReviewCreate, ProductReviewUpdate, ProductReview } from '../../../core/models/product.models';
import { ProductService } from '../../../core/services/product-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss'],
  standalone: false
})
export class ProductReviewComponent {
  
  @Input() productId!: number;
  @Input() reviews: ProductReview[] = [];
  @Output() refreshReviews = new EventEmitter<void>();
  
  private authService = inject(AuthService);
  currentUserId: string | null = null;

  // Form state
  reviewTitle = '';
  reviewDescription = '';
  reviewRating = 5;

  // Edit Mode
  isEditing = false;
  editReviewId: number | null = null;

  constructor(private productService: ProductService,
              private snack: MatSnackBar) {
    this.currentUserId = this.authService.currentUser()?.id || null;
  }

  isCurrentUsersReview(reviewUserId: string | null): boolean {
    return this.currentUserId === reviewUserId;
  }

  /* -----------------------------------------------
   * CREATE REVIEW
   * ------------------------------------------------*/
  submitReview(): void {
    const review: ProductReviewCreate = {
      productId: this.productId,
      rating: this.reviewRating,
      title: this.reviewTitle,
      description: this.reviewDescription
    };
    console.log(review);
      
    this.productService.createReview(review).subscribe({
      next: () => {
        this.snack.open('Review added successfully', 'Close', { duration: 1500 });
        this.clearForm();
        this.refreshReviews.emit();
      },
      error: () => this.snack.open('Failed to submit review', 'Close')
    });
  }

  /* -----------------------------------------------
   * START EDITING
   * ------------------------------------------------*/
  startEdit(review: ProductReview): void {
    console.log(review);
    
    this.isEditing = true;
    this.editReviewId = review.id;
    this.reviewRating = review.rating;
    this.reviewTitle = review.title;
    this.reviewDescription = review.description;
  }

  /* -----------------------------------------------
   * UPDATE REVIEW
   * ------------------------------------------------*/
  updateReview(): void {
    if (!this.editReviewId) return;

    const update: ProductReviewUpdate = {
      productId: this.productId,
      id: this.editReviewId,
      rating: this.reviewRating,
      title: this.reviewTitle,
      description: this.reviewDescription
    };
    console.log(update);
    this.productService.updateReview(update).subscribe({
      next: () => {
        this.snack.open('Review updated', 'Close', { duration: 4000 });
        this.cancelEdit();
        this.refreshReviews.emit();
      },
      error: () => this.snack.open('Failed to update review', 'Close', { duration: 4000 })
    });
  }

  /* -----------------------------------------------
   * DELETE REVIEW
   * ------------------------------------------------*/
  deleteReview(id: number): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.productService.deleteReview(id).subscribe({
      next: () => {
        this.snack.open('Review deleted', 'Close', { duration: 4000 });
        this.refreshReviews.emit();
      },
      error: () => this.snack.open('Failed to delete review', 'Close', { duration: 4000 })
    });
  }

  /* -----------------------------------------------
   * HELPERS
   * ------------------------------------------------*/
  cancelEdit(): void {
    this.isEditing = false;
    this.editReviewId = null;
    this.clearForm();
  }

  clearForm(): void {
    this.reviewRating = 5;
    this.reviewTitle = '';
    this.reviewDescription = '';
  }
}