import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import Deportista from './deportista';
import Entrenador from './entrenador';


@Table({ tableName: 'H_Lesiones_Despues', timestamps: true })
class h_Lesiones_Despues extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Lesiones_Despues: number;

  @Column(DataType.DATE)
  declare fecha_lesion: string;

  @Column(DataType.STRING(200))
  declare tipo_de_lesion_producida: string;

  @Column(DataType.STRING(200))
  declare detalles_lesion: string;

  @Column(DataType.ENUM('PARTIDO', 'ENTRENAMIENTO'))
  declare tipo_evento_producido: string;

  @Column(DataType.ENUM('LEVE', 'GRAVE', 'MODERADO'))
  declare gravedad: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare dolor_molestia: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare primeros_auxilios: string;

  @Column(DataType.ENUM('SI', 'NO'))
  declare traslado_centro_medico: string;

  @Column(DataType.STRING(255))
  declare tratamiento_registro_medico: string;

  @Column(DataType.STRING(30))
  declare tiempo_fuera: string;

  @ForeignKey(() => Deportista)
  @Column({allowNull : false})
  declare ID_Deportista: number;

  @ForeignKey(() => Entrenador)
  @Column({allowNull : false})
  declare ID_Entrenador: number;

  @BelongsTo(() => Deportista)
  declare deportista: Deportista;

  @BelongsTo(() => Entrenador)
  declare entrenador: Entrenador;
}

export default h_Lesiones_Despues;
