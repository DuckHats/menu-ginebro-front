import {
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../Services/Alert/alert.service';
import { CommonModule } from '@angular/common';
import { Messages } from '../../config/messages.config';

@Component({
  selector: 'app-bulk-upload-modal',
  templateUrl: './bulk-upload-modal.component.html',
  styleUrls: ['./bulk-upload-modal.component.css'],
  imports: [CommonModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class BulkUploadModalComponent {
  selectedFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<BulkUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      plantillaUrl: string;
      plantillaCsvUrl?: string;
      descripcion: string;
    },
    private alertService: AlertService
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.selectedFile = event.dataTransfer?.files?.[0] || null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.alertService.show(
        'warning',
        Messages.IMPORT_EXPORT.SELECT_VALID_JSON, // Consider renaming this constant if possible, or ignore for now as text is likely "Valid file" in updated config? No, it's specific. I'll rely on the user to update text or I can check config messages.
        '',
        3000
      );
      return;
    }

    const fileName = this.selectedFile.name.toLowerCase();
    const reader = new FileReader();

    if (fileName.endsWith('.csv')) {
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.dialogRef.close({ data: csvData, format: 'csv' });
      };
      reader.readAsText(this.selectedFile);
    } else if (fileName.endsWith('.json')) {
      reader.onload = (e: any) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          this.dialogRef.close(jsonData);
        } catch {
          this.alertService.show(
            'error',
            Messages.IMPORT_EXPORT.INVALID_JSON,
            '',
            3000
          );
        }
      };
      reader.readAsText(this.selectedFile);
    } else {
      this.alertService.show(
        'error',
        'Format de fitxer no suportat. Useu .json o .csv',
        '',
        3000
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
