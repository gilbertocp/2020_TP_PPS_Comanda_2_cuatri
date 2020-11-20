import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Empleado } from '../../models/empleado';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEmpleado } from 'src/app/models/tipo-empleado.enum';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
})
export class EmpleadoPage implements OnInit, OnDestroy {

  empleado: Empleado;
  private subscription: Subscription;

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.EMPLEADO)
    .subscribe(empleado => {
      if(empleado) {
        this.empleado = empleado[0];
        console.log(this.empleado);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  irALaEncuesta(empleado: Empleado): void {
    this.router.navigate(['encuesta-empleado'], {
      state: {empleado},
      relativeTo: this.route
    });
  }

  esBartenderOCocinero(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.BARTENDER || empleado.tipo == TipoEmpleado.COCINERO;
  }

  IrAgregarProducto(empleado: Empleado): void {
    this.router.navigate(['alta-producto'], {
      state: {empleado},
      relativeTo: this.route
    });
  }

  presentActionSheet(): void {
    this.actionSheetCtlr.create({
      buttons: [{
        text: 'Cerrar sesión',
        icon: 'log-out',
        handler: () => {
          this.authService.logout();
        }
      }]
    })
    .then(a => a.present());
  }
}
