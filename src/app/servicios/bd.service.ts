import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { TipoUsuario } from './tipo-usuario';
import { idUsuario, Usuario } from './usuario';
import { Receta } from './receta'

@Injectable({
  providedIn: 'root'
})
export class BDService {

  public database: SQLiteObject;

  usuario = new BehaviorSubject([]);
  
  recetasUsu = new BehaviorSubject([]);

  CTipoUsuario: string = "CREATE TABLE IF NOT EXISTS TipoUsuario(id_tipo_usu INTEGER PRIMARY KEY, nom_tipo_usu Varchar(20) NOT NULL);";
  CTipoReceta: string = "CREATE TABLE IF NOT EXISTS TipoReceta(id_tipo INTEGER PRIMARY KEY, tipo Varchar(20) NOT NULL);";
  CDificultad: string = "CREATE TABLE IF NOT EXISTS Dificultad(id_difi INTEGER PRIMARY KEY, dificultad Varchar(20) NOT NULL);";
  CUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario(id_usu INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(30) NOT NULL, apellidos VARCHAR(30) NOT NULL, f_nacimiento DATE NOT NULL" +
    ", email VARCHAR(30) NOT NULL, contrasena VARCHAR(12) NOT NULL, id_tipo_usu INTEGER NOT NULL, FOREIGN KEY(id_tipo_usu) references TipoUsuario(id_tipo_usu));";
  CReceta: string = "CREATE TABLE IF NOT EXISTS Receta(id_receta INTEGER PRIMARY KEY autoincrement, nom_receta VARCHAR(30) NOT NULL, tiempo INTEGER NOT NULL, ingredientes TEXT NOT NULL" +
    ", preparacion TEXT NOT NULL, descripcion TEXT NOT NULL, id_difi INTEGER NOT NULL, id_tipo INTEGER NOT NULL, id_usu INTEGER NOT NULL" +
    ", FOREIGN KEY(id_difi) references Dificultad(id_difi), FOREIGN KEY(id_tipo) references TipoReceta(id_tipo), FOREIGN KEY(id_usu) references Usuario(id_usu));";
  CValoracion: string = "CREATE TABLE IF NOT EXISTS Valoracion(id_valor INTEGER PRIMARY KEY autoincrement, comentario VARCHAR(200) NOT NULL, fecha_valor DATE NOT NULL" +
    ", id_usu INTEGER NOT NULL, id_receta INTEGER NOT NULL, FOREIGN KEY(id_usu) references Usuario(id_usu),FOREIGN KEY(id_receta) references Receta(id_receta));";
  CFavorito: string = "CREATE TABLE IF NOT EXISTS Favorito(id_favo INTEGER PRIMARY KEY autoincrement, id_usu INTEGER NOT NULL, id_receta INTEGER NOT NULL" +
    ", FOREIGN KEY(id_usu) references Usuario(id_usu),FOREIGN KEY(id_receta) references Receta(id_receta));";

  rTipoUsuario1: string = "INSERT or IGNORE INTO TipoUsuario(id_tipo_usu, nom_tipo_usu) VALUES (1, 'Administrador');";
  rTipoUsuario2: string = "INSERT or IGNORE INTO TipoUsuario(id_tipo_usu, nom_tipo_usu) VALUES (2, 'Cliente');";

  rTipoReceta1: string = "INSERT or IGNORE INTO TipoReceta(id_tipo, tipo) VALUES (1, 'Desayuno');";
  rTipoReceta2: string = "INSERT or IGNORE INTO TipoReceta(id_tipo, tipo) VALUES (2, 'Ensalada');";
  rTipoReceta3: string = "INSERT or IGNORE INTO TipoReceta(id_tipo, tipo) VALUES (3, 'Almorzar');";
  rTipoReceta4: string = "INSERT or IGNORE INTO TipoReceta(id_tipo, tipo) VALUES (4, 'Postre');";

  rDificultad1: string = "INSERT or IGNORE INTO Dificultad(id_difi, dificultad) VALUES (1, 'Facil');";
  rDificultad2: string = "INSERT or IGNORE INTO Dificultad(id_difi, dificultad) VALUES (2, 'Medio');";
  rDificultad3: string = "INSERT or IGNORE INTO Dificultad(id_difi, dificultad) VALUES (3, 'Dificil');";

  insertUsuario: string = "INSERT or IGNORE INTO Usuario (nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) VALUES ('Cliente', 'X', '25/10/2000', 'cl', '1234', '2')"
  insertPrueba: string = "INSERT or IGNORE INTO Receta(id_receta, nom_receta, tiempo, ingredientes, preparacion, descripcion, id_difi, id_tipo, id_usu) VALUES (1, 'POTATOES', 25, 'LISTAINGREDIENTES', 'HAGALOUSTEDMISMO' , 'SI', 1, 1, 4);";

  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private router: Router, private sqlite: SQLite, private platform: Platform, public alertController: AlertController) {
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
      //creacion de tablas
      await this.database.executeSql(this.CTipoUsuario, []);
      await this.database.executeSql(this.CTipoReceta, []);
      await this.database.executeSql(this.CDificultad, []);
      await this.database.executeSql(this.CUsuario, []);
      await this.database.executeSql(this.CReceta, []);
      await this.database.executeSql(this.CValoracion, []);
      await this.database.executeSql(this.CFavorito, []);
      //datos respectivos al tipo de receta, tipo de usuario y dificultad de la receta
      await this.database.executeSql(this.rTipoUsuario1, []);
      await this.database.executeSql(this.rTipoUsuario2, []);
      await this.database.executeSql(this.rTipoReceta1, []);
      await this.database.executeSql(this.rTipoReceta2, []);
      await this.database.executeSql(this.rTipoReceta3, []);
      await this.database.executeSql(this.rTipoReceta4, []);
      await this.database.executeSql(this.rDificultad1, []);
      await this.database.executeSql(this.rDificultad2, []);
      await this.database.executeSql(this.rDificultad3, []);
      await this.database.executeSql(this.insertUsuario, []);
      await this.database.executeSql(this.insertPrueba, []);
      //this.presentAlert("Creo la Tabla");
      this.buscarUsu();
      this.isDbReady.next(true);
      this.login("", "");
      this.recetasUsuario("");
    } catch (e) {
      this.presentAlert("error creartabla " + e);
    }
  }

  addUsuario(nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) {
    let data = [nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu];
    return this.database.executeSql('INSERT INTO Usuario (nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) VALUES (?, ?, ?, ?, ?, ?)', data)
  }

  /*validarUsu(email, contrasena) {
    return this.database.executeSql('SELECT email, contrasena FROM Usuario;', []).then(res => {

      if (res.rows.length > 0) {
        // this.presentAlert("c");
        for (var i = 0; i < res.rows.length; i++) {
          if (email == res.rows.item(i).email && contrasena == res.rows.item(i).contrasena) {
            this.router.navigate(['/folder/Inbox']);
            break;
          }
          else {
            this.presentAlert('El correo (y/o) la contraseña es incorrecta')
          }
        }
      }

    });
  }*/

  login(email, contrasena) {
    let data = [email, contrasena]
    return this.database.executeSql('SELECT * FROM Usuario WHERE email = ? AND contrasena = ? ;', [data[0], data[1]]).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id_usu: res.rows.item(i).id_usu,
            nombre: res.rows.item(i).nombre,
            apellidos: res.rows.item(i).apellidos,
            f_nacimiento: res.rows.item(i).f_nacimiento,
            email: res.rows.item(i).email,
            contrasena: res.rows.item(i).contrasena,
            id_tipo_usu: res.rows.item(i).id_tipo_usu,
          });
        }
      }
      this.usuario.next(items);
    });
  }

  recetasUsuario(id) {
    return this.database.executeSql('SELECT * FROM Receta WHERE id_usu = ? ;', [id]).then(res => {
      let items: Receta[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id_receta: res.rows.item(i).id_receta,
            nom_receta: res.rows.item(i).nom_receta,
            tiempo: res.rows.item(i).tiempo,
            ingredientes: res.rows.item(i).ingredientes,
            preparacion: res.rows.item(i).preparacion,
            descripcion: res.rows.item(i).descripcion,
            id_difi: res.rows.item(i).id_difi,
            id_tipo: res.rows.item(i).id_tipo,
            id_usu: res.rows.item(i).id_usu,
          });
        }
      }
      this.recetasUsu.next(items);
    });
  }

  fetchRecUsua(): Observable<Receta[]> {
    return this.recetasUsu.asObservable();
  }

  fetchUsuario(): Observable<Usuario[]> {
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

  buscarUsu() {
    return this.database.executeSql('SELECT * FROM Usuario;', []).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {

          items.push({
            id_usu: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            apellidos: res.rows.item(i).apell,
            f_nacimiento: res.rows.item(i).fnaci,
            email: res.rows.item(i).email,
            contrasena: res.rows.item(i).pass,
            id_tipo_usu: res.rows.item(i).tipo,
          });
        }
      }
      this.usuario.next(items);

    });
  }

  addReceta(nom_receta, tiempo, ingredientes, preparacion, descripcion, id_difi, id_tipo, id_usu) {
    let data = [nom_receta, tiempo, ingredientes, preparacion, descripcion, id_difi, id_tipo, id_usu];
    return this.database.executeSql('INSERT INTO Receta (nom_receta, tiempo, ingredientes, preparacion, descripcion, id_difi, id_tipo, id_usu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data).then(data2 => {
      this.recetasUsuario(id_usu);
    })
  }

  updateUsuario(nombre, apellidos, f_nacimiento, email, contrasena, id_usu) {
    let data = [nombre, apellidos, f_nacimiento, email, contrasena, id_usu];
    return this.database.executeSql('UPDATE usuario SET nombre = ?, apellidos = ?, f_nacimiento = ?, email = ?, contrasena = ? WHERE id_usu = ?', data).then(data2 => {
      this.login(email, contrasena);
    })
  }

}

