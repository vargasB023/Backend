import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import Sesion from './sesion';
import rel_Ejercicio_Sesion from './rel_Ejercicio_Sesion';

@Table({ tableName: 'Ejercicio', timestamps: true,})
 
export class Ejercicio extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Ejercicio: number;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare nombre_Ejer: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare descripcion: string;

  @Column({ 
    type: DataType.ENUM('TECNICO', 'TACTICO', 'FISICO','CALENTAMIENTO','RECUPERACION'),  allowNull: false })
  declare tipo_Ejer: string;

  @BelongsToMany(()=> Sesion, ()=> rel_Ejercicio_Sesion)
    declare sesion: Sesion[];
}

export default Ejercicio;