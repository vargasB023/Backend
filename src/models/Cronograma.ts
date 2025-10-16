import {Table,Column,Model,DataType,ForeignKey, BelongsTo, HasMany,} from "sequelize-typescript";
import Entrenador from "./entrenador";
import Equipo from "./equipo";
import Asistencia from "./asistencia";

@Table({ tableName: "Cronograma", timestamps: true })
class Cronograma extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Cronograma: number;

  @Column(DataType.STRING(150))
  declare nombre_Evento: string;

  @Column(DataType.DATEONLY)
  declare fecha: string;

  @Column(DataType.TIME)
  declare hora: string;

  @Column(DataType.ENUM("ENTRENAMIENTO", "PARTIDO"))
  declare tipo_Evento: string;

  @Column(DataType.STRING(150))
  declare lugar: string;

  @Column(DataType.STRING(200))
  declare descripcion: string;

  @ForeignKey(() => Entrenador)
  @Column({ allowNull: false })
  declare ID_Entrenador: number;

  @ForeignKey(() => Equipo)
  @Column({ allowNull: false })
  declare ID_Equipo: number;

  @BelongsTo(() => Entrenador, { as: "entrenador" })
  declare entrenador: Entrenador;

  @BelongsTo(() => Equipo, { as: "equipo" })
  declare equipo: Equipo;

  @HasMany(() => Asistencia, { as: "asistencias" })
  declare asistencias: Asistencia[];
  
}

export default Cronograma;
