import { Table, Column, Model, DataType, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import  Perfil_Entrenador  from './perfil_Entrenador';
import Equipo from './equipo';
import Sesion from './sesion';
import Evaluacion_Deportiva from './evaluacion_Deportiva';
import Deportista from './deportista';
import rel_Deportista_Entrenador from './rel_Deportista_Entrenador';
import Cronograma from './Cronograma';
import Token from './token';

@Table({ tableName: 'Entrenador', timestamps: true})

export class Entrenador extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Entrenador: number;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare nombre_Completo: string;

  @Column({ type: DataType.STRING(15), allowNull: false, unique: true })
  declare no_Documento: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha_Nacimiento: Date;

  @Column({ type: DataType.ENUM('MASCULINO', 'FEMENINO'), allowNull: false })
  declare genero: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare direccion: string;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare telefono: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare especialidad?: string;

  @Column({ type: DataType.STRING(250), allowNull: true })
  declare certificacion?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare experiencia?: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare contrasena: string;

  @Column({ type: DataType.STRING(10), allowNull: true })
  declare resetCode?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare resetCodeExpires?: Date;

  @HasOne(() => Perfil_Entrenador)
  declare perfil_Entrenador: Perfil_Entrenador[];

  @HasMany(() =>Equipo)
  declare equipo: Equipo[];
  
  @HasMany(() =>Sesion)
  declare sesion:Sesion[];

  @HasMany(() =>Cronograma)
  declare cronograma :Cronograma[];

  @HasMany(() => Token)
  declare token: Token[];

  @HasMany(() =>Evaluacion_Deportiva)
  declare evaluacion_deportiva :Evaluacion_Deportiva[];
  
  @BelongsToMany (()=> Deportista, ()=>rel_Deportista_Entrenador)
  declare deportista : Deportista[];

}

export default Entrenador;
