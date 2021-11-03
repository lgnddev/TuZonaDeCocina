import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class BDService {

  public database: SQLiteObject;

  CTipoUsuario: string = "CREATE TABLE IF NOT EXISTS TipoUsuario(id_tipo_usu INTEGER PRIMARY KEY autoincrement, nom_tipo_usu Varchar(20) NOT NULL);"; 
  CTipoReceta: string = "CREATE TABLE IF NOT EXISTS TipoReceta(id_tipo INTEGER PRIMARY KEY autoincrement, tipo Varchar(20) NOT NULL);";
  CDificultad: string = "CREATE TABLE IF NOT EXISTS Dificultad(id_difi INTEGER PRIMARY KEY autoincrement, dificultad Varchar(20) NOT NULL);";
  CUsuario: string = "CREATE TABLE IF NOT EXISTS Usuario(id_usu INTEGER PRIMARY KEY autoincrement, nombre VARCHAR(30) NOT NULL, apellidos VARCHAR(30) NOT NULL, f_nacimiento DATE NOT NULL"+
                    ", email VARCHAR(30) NOT NULL, contrasena VARCHAR(12) NOT NULL, id_tipo_usu INTEGER NOT NULL, FOREIGN KEY(id_tipo_usu) references TipoUsuario(id_tipo_usu));";
  CReceta: string = "CREATE TABLE IF NOT EXISTS Receta(id_receta INTEGER PRIMARY KEY autoincrement, nom_receta VARCHAR(30) NOT NULL, tiempo INTEGER NOT NULL, ingredientes TEXT NOT NULL" +
                   ", preparacion TEXT NOT NULL, valor_final INTEGER NOT NULL, descripcion TEXT NOT NULL, id_difi INTEGER NOT NULL, id_tipo INTEGER NOT NULL, id_usu INTEGER NOT NULL" +
                   ", FOREIGN KEY(id_difi) references Dificultad(id_difi), FOREIGN KEY(id_tipo) references TipoReceta(id_tipo), FOREIGN KEY(id_usu) references Usuario(id_usu));";
  CValoracion: string = "CREATE TABLE IF NOT EXISTS Valoracion(id_valor INTEGER PRIMARY KEY autoincrement, comentario VARCHAR(200) NOT NULL, fecha_valor DATE NOT NULL" +
                  ", id_usu INTEGER NOT NULL, id_receta INTEGER NOT NULL, FOREIGN KEY(id_usu) references Usuario(id_usu),FOREIGN KEY(id_receta) references Receta(id_receta));";
  CFavorito: string = "CREATE TABLE IF NOT EXISTS Favorito(id_favo INTEGER PRIMARY KEY autoincrement, id_usu INTEGER NOT NULL, id_receta INTEGER NOT NULL" +
                  ", FOREIGN KEY(id_usu) references Usuario(id_usu),FOREIGN KEY(id_receta) references Receta(id_receta));";

  rTipoUsuario1: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (1, 'Administrador');";
  rTipoUsuario2: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (2, 'Cliente');";

  rTipoReceta1: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (1, 'Desayuno');";
  rTipoReceta2: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (2, 'Ensalada');";
  rTipoReceta3: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (3, 'Almorzar');";
  rTipoReceta4: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (4, 'Postre');";

  rDificultad1: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (1, 'Facil');";
  rDificultad2: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (2, 'Medio');";
  rDificultad3: string = "INSERT or IGNORE INTO (id_tipo_usu, nom_tipo_usu, ) VALUES (3, 'Dificil');";

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
        this.presentAlert("BD Creada");
        //llamamos a la creación de tablas
        this.crearTablas();
      }).catch(e => this.presentAlert(e));
    })

  }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: mensaje,
      buttons: ['Cancel']
    });

    await alert.present();
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
      //datos respectivos del tipo de receta, tipo de usuario y dificultad de la receta
      await this.database.executeSql(this.rTipoUsuario1, []);
      await this.database.executeSql(this.rTipoUsuario2, []);
      await this.database.executeSql(this.rTipoReceta1, []);
      await this.database.executeSql(this.rTipoReceta2, []);
      await this.database.executeSql(this.rTipoReceta3, []);
      await this.database.executeSql(this.rTipoReceta4, []);
      await this.database.executeSql(this.rDificultad1, []);
      await this.database.executeSql(this.rDificultad2, []);
      await this.database.executeSql(this.rDificultad3, []);
      //this.presentAlert("Creo la Tabla");
      //this.buscarUsuario();
      this.isDbReady.next(true);
    } catch (e) {
      this.presentAlert("error creartabla " + e);
    }
  }

  /*buscarUsuario() {
    //this.presentAlert("a");
    return this.database.executeSql('SELECT * FROM Usuario', []).then(res => {
      let items: Usuario[] = [];
      //this.presentAlert("b");
      if (res.rows.length > 0) {
        //this.presentAlert("c");
        for (var i = 0; i < res.rows.length; i++) { 
          //this.presentAlert("d");
          items.push({ 
            id: res.rows.item(i).id,
            titulo: res.rows.item(i).titulo,  
            texto: res.rows.item(i).texto
           });
        }
      }
      //this.presentAlert("d");
      this.listaNoticias.next(items);
    });
  }

  fetchNoticias(): Observable<Usuario[]> {
    return this.listaNoticias.asObservable();
  }*/

  addUsuario(nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) {
    let data = [nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu];
    return this.database.executeSql('INSERT INTO Usuario (nombre, apellidos, f_nacimiento, email, contrasena, id_tipo_usu) VALUES (?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        //this.buscarNoticias();
      });	
  }

  /*updateUsuario(id_usu, usuario : Usuario) {
    let data = [usuario.titulo, noticia.texto];
    return this.database.executeSql('UPDATE noticia SET titulo = ?, texto = ? WHERE id = ${id}', data)
      .then(data => {
        //this.buscarNoticias();
      })
  }*/

  deleteUsuario(id_usu) {
    return this.database.executeSql('DELETE FROM Usuario WHERE id_usu = ?', [id_usu])
      .then(_ => {
        //this.buscarNoticias();
      });
  }

}
