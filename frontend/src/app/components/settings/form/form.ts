// src/app/components/settings/form/form.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SettingsService } from '../../../services/settings.service';
import { MessageService } from 'primeng/api';
import { SettingsI } from '../../../models/settings'; 

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './form.html',
})
export class FormComponent implements OnInit {
  form;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private messageService: MessageService // Inyecta el servicio de mensajes
  ) {
    this.form = this.fb.group({
      hotelName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      taxId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const currentSettings = this.settingsService.getSettings();
    this.form.patchValue(currentSettings);
  }

submit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // --- CORRECCIÓN AQUÍ: Construimos el objeto explícitamente ---
      const newSettings: SettingsI = {
        hotelName: formValue.hotelName ?? '',
        address: formValue.address ?? '',
        phone: formValue.phone ?? '',
        taxId: formValue.taxId ?? '',
      };

      this.settingsService.updateSettings(newSettings);
      
      this.messageService.add({ 
        severity: 'success', 
        summary: '¡Éxito!', 
        detail: 'La configuración ha sido guardada correctamente.' 
      });
    }
  }
}