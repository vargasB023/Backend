import {Table,Column,Model,DataType,ForeignKey, BelongsTo,} from "sequelize-typescript";
import Entrenador from "./entrenador";
import Equipo from "./equipo";

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

  @BelongsTo(() => Entrenador)
  declare entrenador: Entrenador;

  @BelongsTo(() => Equipo)
  declare equipo: Equipo;
  
}

export default Cronograma;
