import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  title: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>, @Inject(MAT_DIALOG_DATA) data: {"title": string, "message": string}) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onClickOK() {
    this.dialogRef.close();
  }

}
