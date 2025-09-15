// src/app/app.ts

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Aside } from './components/layout/aside/aside';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Footer } from './components/layout/footer/footer'; // <-- 1. AÑADE ESTA LÍNEA

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. AÑADE 'Footer' AQUÍ
  imports: [CommonModule, RouterOutlet, Header, Aside, ConfirmDialogModule, ToastModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  showAside = signal(true);

  toggleAside() {
    this.showAside.update(v => !v);
  }
}