import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { AuthProvider } from '../../providers/auth/auth';

interface listaInterface {
  Nombre: string,
  Cantidad: number,
  id?: string
}

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
 
  listaColeccion: AngularFirestoreCollection<listaInterface>;
  // lista: Observable<listaInterface[]>;
  lista: listaInterface[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private asf: AngularFirestore, public auth : AuthProvider, public alertCtrl: AlertController) {
  }


  ionViewDidEnter() {
    this.listaColeccion = this.asf.collection(this.auth.getUser());
    this.listaColeccion.snapshotChanges().subscribe(listaItems => {
      this.lista = listaItems.map(item => {
        return {
          Nombre: item.payload.doc.data().Nombre,
          Cantidad: item.payload.doc.data().Cantidad,
          id: item.payload.doc.id
        }
      })
    })
  }

  // Añadir item
  add_item() {
    this.alertCtrl.create({
      title: 'Añada articulo y cantidad',
      inputs: [{
        name: 'Nombre',
        placeholder: 'Articulo'
      }, 
      { name: 'Cantidad',
        placeholder: 'Cantidad'}],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Añadir',
        handler: data => {
          this.add_articulo(data.Nombre, data.Cantidad);
        }
      }]
    }).present();
  }

  add_articulo(Nombre: string, Cantidad: number){
    this.listaColeccion.add({Nombre, Cantidad}).then(newItem => {

    }).catch(err => {
      console.error(err);
    });
  }

  edit_articulo(id:string, Nombre: string, Cantidad: number){
    this.listaColeccion.doc(id).update({Nombre, Cantidad}).then(newItem => {

    }).catch(err => {
      console.error(err);
    });
  }

  edit_item(id:string, Nombre: string, Cantidad: string){
    this.alertCtrl.create({
      title: 'Modifique los valores',
      inputs: [{
        name: 'Nombre',
        placeholder: 'Articulo',
        value: Nombre,
      }, 
      { name: 'Cantidad',
        placeholder: 'Cantidad',
        value: Cantidad}],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Editar',
        handler: data => {
          this.edit_articulo(id, data.Nombre, data.Cantidad);
        }
      }]
    }).present();
  }

  delete_item(id:string){
    this.listaColeccion.doc(id).delete().then(() => {

    }).catch(err => {
      console.error(err);
    });
  }

}
