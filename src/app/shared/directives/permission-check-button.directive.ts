import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

@Directive({
  selector: '[appPermissionCheckButton]',
  standalone: true,
  hostDirectives: [MatTooltip],
})
export class PermissionCheckButtonDirective implements OnInit {
  @Input() isViewerDisabled: boolean = false;  // Управление активностью кнопки
  @Input() viewerTooltip: string = 'У вас нет прав для выполнения этого действия';         // Текст тултипа

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isViewerDisabled) {
      if (this.matTooltip) {
        this.matTooltip.show();   // Показываем тултип при наведении
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.isViewerDisabled) {
      if (this.matTooltip) {
        this.matTooltip.hide();   // Скрываем тултип, если курсор уходит с кнопки
      }
    }
  }

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private matButton: MatButton,
    private matTooltip: MatTooltip
  ) {
  }

  ngOnInit() {
    this.updateButtonState();  // Обновляем состояние кнопки при инициализации
  }

  private updateButtonState() {
    if (this.isViewerDisabled) {
      if (this.matButton) {
        this.matButton.disabled = true;
        this.matButton.disabledInteractive = true;
      }
      if (this.matTooltip) {
        this.matTooltip.message = this.viewerTooltip;
      }
      this.renderer.setStyle(this.elRef.nativeElement, 'cursor', 'not-allowed');
    } else {
      if (this.matButton) {
        this.matButton.disabled = false;
      }
      this.renderer.setStyle(this.elRef.nativeElement, 'cursor', 'pointer');
    }
  }
}
