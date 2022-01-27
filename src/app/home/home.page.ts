import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICuestionario } from './../interfaces/mis-interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  cuestionario: ICuestionario[]=[];

  constructor(private leerFichero: HttpClient, public alertaPregunta: AlertController) {
    this.getPreguntasFichero();
  }

  getPreguntasFichero() {
    // Declaramos el Observable. Requerirá importar la clase
    let respuesta: Observable<ICuestionario[]>
    

    respuesta = this.leerFichero.get<ICuestionario[]>("/assets/datos/datos.json");
    
    respuesta.subscribe( resp => {
      this.cuestionario.push(... resp);
      console.log(this.cuestionario);
      this.cuestionario.forEach(pregunta => {
        pregunta.errores=0;
      });
      //console.log("Noticias", resp);
    } );
  }

  onClick(item){
    this.presentaPregunta(item);
    console.log(item);
  }
  
  async presentaPregunta(item) {
    let resultado=0; //de momento. luego al storage

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
            }else{
              item.errores-=1;
            }
            console.log(item.errores);
            //Comprobar pregunta
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

// // imports de HttpClientModule en app.module.ts
// import {HttpClientModule} from '@angular/common/http'
// // Leer datos
// let respuesta: Observable<TipoDato>
// respuesta = this.leerFichero.get<TipoDato>("/assets/datos/nombre.json");
// respuesta.subscribe( datos => {
// …
// } );
// // Conversión JSON objetos
// let copiaDatos: TipoDatos = JSON.parse(stringDatos);
// const stringDatos2: string = JSON.stringify(copiaDatos);


}
