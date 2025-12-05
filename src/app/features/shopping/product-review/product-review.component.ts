
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product-review',
//   templateUrl: './product-review.component.html',  // Fixed file extension
//   styleUrls: ['./product-review.component.scss'] ,
//     standalone: false  // Fixed property name
// })
// export class ProductReviewComponent {  // Fixed class name
//   // Add your review logic here
// }

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductReviewCreate, ProductReviewUpdate, ProductReview } from '../../../core/models/product.models';
import { ProductService } from '../../../core/services/product-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
  ,  standalone: false
})
export class ProductReviewComponent {
  
  @Input() productId!: number;
  @Input() reviews: ProductReview[] = [];
  @Output() refreshReviews = new EventEmitter<void>();

  // Form state
  reviewTitle = '';
  reviewDescription = '';
  reviewRating = 5;

  // Edit Mode
  isEditing = false;
  editReviewId: number | null = null;

  constructor(private productService: ProductService,
              private snack: MatSnackBar) {}

  /* -----------------------------------------------
   * CREATE REVIEW
   ------------------------------------------------*/
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
   ------------------------------------------------*/
  startEdit(review: ProductReview): void {
   console.log(review);
  
    this.editReviewId = review.id;
    this.reviewRating = review.rating;
    this.reviewTitle = review.title;
    this.reviewDescription = review.description;
  }

  /* -----------------------------------------------
   * UPDATE REVIEW
   ------------------------------------------------*/
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
        this.snack.open('Review updated', 'Close', { duration: 1500 });
        this.cancelEdit();
        this.refreshReviews.emit();
       
        
      },
      error: () => this.snack.open('Failed to update review', 'Close')
    });
  }

  /* -----------------------------------------------
   * DELETE REVIEW
   ------------------------------------------------*/
  deleteReview(id: number): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.productService.deleteReview(id).subscribe({
      next: () => {
        this.snack.open('Review deleted', 'Close', { duration: 1500 });
        this.refreshReviews.emit();
      },
      error: () => this.snack.open('Failed to delete review', 'Close')
    });
  }

  /* -----------------------------------------------
   * HELPERS
   ------------------------------------------------*/
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

  userAlreadyReviewed(): boolean {
    // This should later be replaced with LoggedInUserId comparison
    return false;
  }
}

