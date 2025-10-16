import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import Perfil_Deportista from "./perfil_Deportista";
import Entrenador from "./entrenador";
import rel_Deportista_Entrenador from "./rel_Deportista_Entrenador";
import h_Lesiones_Despues from "./h_Lesiones_Despues";
import Equipo from "./equipo";
import Rel_Deportista_Equipo from "./rel_Deportista_Equipo";
import h_Lesiones_Antes from "./h_Lesiones_Antes";
import Asistencia from "./asistencia";
import Token from "./token";

@Table({ tableName: "Deportista", timestamps: true })
export class Deportista extends Model<Deportista> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare ID_Deportista: number;

  @Column({ type: DataType.STRING(15), allowNull: false, unique: true })
  declare no_Documento: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare nombre_Completo: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare fecha_Nacimiento: Date;

  @Column({ type: DataType.ENUM("MASCULINO", "FEMENINO"), allowNull: false })
  declare genero: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare direccion: string;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare telefono: string;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare contrasena: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare eps: string;

  @Column({
    type: DataType.ENUM(
      "CENTRAL",
      "REMATADOR",
      "LIBERO",
      "ARMADOR",
      "ZAGUERO DERECHO",
      "ZAGUERO IZQUIERDO"
    ),
    allowNull: false,
  })
  declare posicion: string;

  @Column({ type: DataType.STRING(3), allowNull: false })
  declare dorsal: string;

  @Column({
    type: DataType.ENUM("B+", "B-", "A+", "A-", "AB+", "AB-", "O+", "O-"),
    allowNull: false,
  })
  declare tipo_De_Sangre: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare alergias: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare nombre_Contacto: string;

  @Column({
    type: DataType.ENUM("PADRE", "MADRE", "HERMANO", "HERMANA", "TUTOR LEGAL"),
    allowNull: false,
  })
  declare parentesco_Contacto: string;

  @Column({ type: DataType.STRING(10), allowNull: true })
  declare resetCode?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare resetCodeExpires?: Date;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare telefono_Contacto: string;

  @HasOne(() => Perfil_Deportista)
  declare perfil_Deportista: Perfil_Deportista[];

  @HasMany(() => h_Lesiones_Despues)
  declare h_lesiones_despues: h_Lesiones_Despues[];

  @HasMany(() => h_Lesiones_Antes)
  declare h_lesiones_antes: h_Lesiones_Antes[];

  @HasMany(() =>Asistencia)
  declare asistencia: Asistencia[];

  @HasMany(() => Token)
  declare token: Token[];

  @BelongsToMany(() => Entrenador, () => rel_Deportista_Entrenador)
  declare entrenador: Entrenador[];

  @BelongsToMany(() => Equipo, () => Rel_Deportista_Equipo)
  declare equipo: Equipo[];
}

export default Deportista;
