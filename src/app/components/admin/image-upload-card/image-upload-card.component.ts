import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppConstants } from '../../../config/app-constants.config';

@Component({
  selector: 'app-image-upload-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './image-upload-card.component.html'
})
export class ImageUploadCardComponent {
  @Input() uploading: boolean = false;
  @Output() upload = new EventEmitter<{file: File, dates: {start_date: string, end_date: string}}>();

  AppConstants = AppConstants;
  
  newImageDates = {
    start_date: '',
    end_date: ''
  };

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.upload.emit({
        file,
        dates: this.newImageDates
      });
      // Reset input manually if needed, or parent will handle reload
      event.target.value = '';
    }
  }
}
