import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { TipoUsuario } from './tipo-usuario';
import { idUsuario, Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class BDService {

  public database: SQLiteObject;

  createTipoUsuario: string = "CREATE TABLE IF NOT EXISTS TipoUsuario(id_tipo_usu INTEGER PRIMARY KEY autoincrement, nom_tipo_usu VARCHAR(20) NOT NULL);";
  createUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario(id_usu INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(30) NOT NULL, apellidos VARCHAR(30) NOT NULL, f_nacimiento DATE NOT NULL, email VARCHAR(30) NOT NULL, contrasena VARCHAR(12) NOT NULL, id_tipo_usu INTEGER NOT NULL, FOREIGN KEY(id_tipo_usu) references TipoUsuario(id_tipo_usu));"
  insertAdmin: string = "INSERT or IGNORE INTO TipoUsuario(id_tipo_usu, nom_tipo_usu) VALUES (1, 'Administrador');"
  insertCliente: string = "INSERT or IGNORE INTO TipoUsuario(id_tipo_usu, nom_tipo_usu) VALUES (2, 'Cliente');"
  usuario = new BehaviorSubject([]);

  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, public alertController: AlertController) {
    this.crearBD();
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'ZonaCocina.db',
        location: 'default'

      }).then((db: SQLiteObject) => {
        this.database = db;
        //this.presentAlert("BD Creada");
        this.crearTablas();
      }).catch(e => this.presentAlert(e));
    })

  }

  async crearTablas() {
    try {
      await this.database.executeSql(this.createTipoUsuario, []);
      await this.database.executeSql(this.createUsuario, []);
      await this.database.executeSql(this.insertAdmin, []);
      await this.database.executeSql(this.insertCliente, []);
      this.isDbReady.next(true);
      this.login("", "");
    } catch (e) {
      this.presentAlert("error creartabla " + e);
    }
  }

  addUsuario(nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) {
    let data = [nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu];
    return this.database.executeSql('INSERT INTO Usuario (nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) VALUES (?, ?, ?, ?, ?, ?)', data)
  }

  login(email, contrasena){
    let data = [email, contrasena]
    return this.database.executeSql('SELECT id_usu FROM Usuario WHERE email = ? AND contrasena = ? ;', [data[0],data[1]]).then(res => {
      let items: idUsuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            id_usu: res.rows.item(i).id_usu
           });
        }
      }
      this.usuario.next(items);
    });
  }

  fetchUsuario(): Observable<idUsuario[]> {
    return this.usuario.asObservable();
  }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: mensaje,
      buttons: ['Cancel']
    });

    await alert.present();
  }

}

