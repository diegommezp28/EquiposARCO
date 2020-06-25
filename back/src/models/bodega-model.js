const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bodegaSchema = new Schema({
  tipoDocumento: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  nombreBodega: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  direccion: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  municipio: {
    type: String,
    lowercase: true,
    trim: true,
  },
  ciudad: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  pais: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
  },
  celular: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
  },
  regimenSimplificado: {
    type: Boolean,
    default: false,
  },
});
const Bodega = mongoose.model("Bodega", bodegaSchema);

const noUpdatable = ["__v"];

/**
 * @param body: Corresponde a los campos que se van a actualizar
 * @returns retorna true si todos los campos que se actualizan se pueden,
 *  retorna false en caso contrario.
 */
Bodega.fieldsNotAllowedUpdates = (body) => {
  const updates = Object.keys(body);

  // Sirve para obtener los campos del modelo
  let allowedUpdates = Object.keys(Bodega.schema.paths);

  // Deja los campos que no queremos moficiar
  allowedUpdates = allowedUpdates.filter(
    (update) => !noUpdatable.includes(update)
  );
  const isValidOp = updates.every((update) => allowedUpdates.includes(update));
  console.log(updates);
  return isValidOp;
};

module.exports = Bodega;
