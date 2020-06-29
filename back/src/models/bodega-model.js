const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bodegaSchema = new Schema({
  nombreBodega: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  direccionBodega: {
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
  pais: {
    type: String,
    lowercase: true,
    trim: true,
  },
  departamento: {
    type: String,
    lowercase: true,
    trim: true,
  },
  codigoPostal: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  celular: {
    type: String,
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
  },
  fechaRegistro: {
    type: Date,
    defualt: Date.now(),
  },
  ordenesActuales: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orden",
    },
  ],
  ordenesPasadas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orden",
    },
  ],
});

bodegaSchema.index(
  { direccionBodega: 1, municipio: 1, pais: 1, departamento: 1 },
  { unique: true }
);

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

Bodega.findByLocalizacion = async (body) => {
  let newBodega = null;
  if (body.codigoPostal) {
    let codigoPostal = body.codigoPostal;
    newBodega = await Bodega.findOne({ codigoPostal });
  }
  let query = [
    { municipio: body.municipio },
    { departamento: body.departamento },
    { pais: body.pais },
    { direccion: body.direccion },
  ];
  if (!newBodega) {
    newBodega = await Bodega.findOne({
      $and: query,
    });
  }
  console.log(newBodega);
  return newBodega;
};

module.exports = Bodega;
