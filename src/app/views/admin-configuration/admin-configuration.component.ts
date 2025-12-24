import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../Services/Admin/configuration/configuration.service';
import { ImageService } from '../../Services/Admin/image/image.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIconModule } from '@angular/material/icon';
import { ImageManagementCardComponent } from '../../components/admin/image-management-card/image-management-card.component';
import { ImageUploadCardComponent } from '../../components/admin/image-upload-card/image-upload-card.component';

@Component({
  selector: 'app-admin-configuration',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule,
    ImageManagementCardComponent,
    ImageUploadCardComponent
  ],
  templateUrl: './admin-configuration.component.html',
  styleUrls: ['./admin-configuration.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AdminConfigurationComponent implements OnInit {
  AppConstants = AppConstants;
  activeTab: string = AppConstants.CONFIGURATION.TABS.IMAGES;
  settings: any = {
    order_deadline_time: '',
    order_deadline_days_ahead: '',
    menu_price: '',
    app_active: '1',
    redsys_url: '',
    redsys_merchant_code: '',
    redsys_terminal: '',
    redsys_key: ''
  };
  loading = false;
  saving = false;
  uploading = false;
  newImageDates = {
    start_date: '',
    end_date: ''
  };

  images: any[] = [];

  constructor(
    private configService: ConfigurationService,
    private imageService: ImageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadImages();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadSettings(): void {
    this.loading = true;
    this.configService.getConfigurations().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.settings = { ...this.settings, ...res.data };
        }
        this.loading = false;
      },
      error: (err) => {
        this.alertService.show('error', Messages.CONFIGURATION.LOAD_ERROR, '');
        this.loading = false;
      }
    });
  }

  loadImages(): void {
    this.imageService.getImages().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.images = res.data;
        }
      },
      error: (err) => {
        this.alertService.show('error', Messages.CONFIGURATION.IMAGES_LOAD_ERROR, '');
      }
    });
  }

  saveSettings(): void {
    this.saving = true;
    this.configService.updateConfigurations(this.settings).subscribe({
      next: (res) => {
        this.alertService.show('success', Messages.CONFIGURATION.SAVE_SUCCESS, '');
        this.saving = false;
      },
      error: (err) => {
        this.alertService.show('error', Messages.CONFIGURATION.SAVE_ERROR, '');
        this.saving = false;
      }
    });
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.imageService.uploadImage(file, this.newImageDates.start_date, this.newImageDates.end_date).subscribe({
        next: (res) => {
          this.alertService.show('success', Messages.CONFIGURATION.IMAGE_UPLOAD_SUCCESS, '');
          this.loadImages();
          this.uploading = false;
          this.newImageDates = { start_date: '', end_date: '' };
        },
        error: (err) => {
          this.alertService.show('error', Messages.CONFIGURATION.IMAGE_UPLOAD_ERROR, '');
          this.uploading = false;
        }
      });
    }
  }

  deleteImage(id: number): void {
    if (confirm(Messages.CONFIGURATION.IMAGE_DELETE_CONFIRM)) {
      this.imageService.deleteImage(id).subscribe({
        next: (res) => {
          this.alertService.show('success', Messages.CONFIGURATION.IMAGE_DELETE_SUCCESS, '');
          this.loadImages();
        },
        error: (err) => {
          this.alertService.show('error', Messages.CONFIGURATION.IMAGE_DELETE_ERROR, '');
        }
      });
    }
  }

  updateImageDates(img: any): void {
    if (!img.start_date || !img.end_date) {
      this.alertService.show('error', 'Les dates són obligatòries', '');
      return;
    }

    this.imageService.updateImageDates(img.id, img.start_date, img.end_date).subscribe({
      next: (res) => {
        this.alertService.show('success', 'Dates actualitzades correctament', '');
        this.loadImages();
      },
      error: (err) => {
        this.alertService.show('error', 'Error en actualitzar les dates', '');
      }
    });
  }
}
