import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICuestionario } from './../interfaces/mis-interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { AlertController } from '@ionic/angular';
import { GestionStorageService } from '../servicios/gestion-storage.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  cuestionario: ICuestionario[]=[];

  constructor(private leerFichero: HttpClient, public alertaPregunta: AlertController, private gestionStorage: GestionStorageService) {

    let datosPromesa: Promise<ICuestionario[]> = gestionStorage.getObject("storagePreguntas");

    //Si hay datos de storage los cargamos en el array del cuestionario sino lo pedimos al JSON
    datosPromesa.then( (data) => {
      if(data) {
          console.log(data);
          this.cuestionario.push(...data);
      } else {
        this.getPreguntasFichero();
      }
    });



  
  }

  //Cuando no están guardadas en storage
  getPreguntasFichero() {
    let respuesta: Observable<ICuestionario[]>
    respuesta = this.leerFichero.get<ICuestionario[]>("/assets/datos/datos.json");
    respuesta.subscribe( resp => {
      this.cuestionario.push(... resp);
      console.log(this.cuestionario);
      this.cuestionario.forEach(pregunta => {
        pregunta.errores=0;
       
      });
      this.gestionStorage.setObject("storagePreguntas",this.cuestionario);
    } );
  }

  onClick(item){
    this.presentaPregunta(item);
    console.log(item);
  }
  
  async presentaPregunta(item) {
    let resultado=item.errores;

    const alert = await this.alertaPregunta.create({
      cssClass: 'my-custom-class',
      header: 'Pregunta',
      subHeader: item.pregunta,
      inputs: [
        {
          name: 'respuestaUsuario',
          type: 'text',
          placeholder: 'Atencion a la ortografía'
        },
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: (data) => {
            console.log('Comprobar pregunta: '+ item.pregunta);
            console.log(data.respuestaUsuario);
            resultado=this.comprobarPregunta(data.respuestaUsuario,item.pregunta);
            if(resultado==1){
              item.errores=1;
              const resultado = this.cuestionario.findIndex( pregunta => pregunta.pregunta == item.pregunta );
              console.log(resultado);
              
            }else{
              item.errores-=1;
              const resultado = this.cuestionario.findIndex( pregunta => pregunta.pregunta == item.pregunta );
              console.log(resultado);
            }
            console.log(item.errores);
           //NO hay que guardar siempre this.gestionStorage.setObject("storagePreguntas", this.cuestionario);
          }
        }
      ]
    });

    await alert.present();
  }


  comprobarPregunta(entrada:string, pregunta:string):number {
    let encontrado=-1;
    this.cuestionario.forEach(element => {  
      if(element.pregunta==pregunta){
        if(element.respuesta==entrada){
          encontrado= 1;
        }
      }
    });
    return encontrado; 
  }


  guardarCuestionario(){
    this.gestionStorage.setObject("storagePreguntas", this.cuestionario);
  }

}
