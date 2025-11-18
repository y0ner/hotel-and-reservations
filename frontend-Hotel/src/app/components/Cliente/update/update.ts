import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ClienteService } from '../../../services/Client.service';
import { ClientResponseI } from '../../../models/Client';

@Component({
  selector: 'app-cliente-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule, CardModule, RouterModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  entityId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      document: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nationality: ['', [Validators.required]],
      status: ['ACTIVE', []],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entityId = parseInt(id, 10);
      this.loadData();
    } else {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID de cliente no proporcionado' });
    }
  }

  loadData(): void {
    this.loading = true;
    this.clienteService.getById(this.entityId).subscribe({
      next: (data: ClientResponseI) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos del cliente' });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      let formData = this.form.value;

      this.clienteService.update(this.entityId, formData).subscribe({
        next: (response: ClientResponseI) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente' });
          setTimeout(() => this.router.navigate(['/Cliente']), 1000);
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Error al actualizar el cliente' });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/Cliente']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) return 'El campo es requerido.';
      if (field.errors['email']) return 'El formato del email no es válido.';
    }
    return '';
  }
}