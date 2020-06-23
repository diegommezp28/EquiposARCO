const mongoose = require("mongoose");
require("../db/mongoose");

//const validator = require("validator");

const tiposEquipo = [
  "maquinaria liviana",
  "maquinaria pesada",
  "motriz",
  "escaleras industriales",
  "andamio tubular",
  "andamio colgante",
  "andamio multidireccional",
  "andamio universal",
  "andamio carga",
  "andamio colgante",
  "fomaleteria tradicional",
  "formaleta",
  "fomaleteria industrial",
];

/*
 * Definición del modelo con sus propiedades
 */
const Equipo = mongoose.model("Equipo", {
  nombreEquipo: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  tipoEquipo: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    validate(value) {
      isValid = (value) => tiposEquipo.includes(value);
      if (!isValid) {
        throw new Error("Tipo de equipo invalido");
      }
    },
  },
  //   nombreFamilia: {
  //     type: String,
  //     trim: true,
  //     required: true,
  //     lowercase: true,
  //   },
  //   nombreGrupo: {
  //     type: String,
  //     trim: true,
  //     required: true,
  //     lowercase: true,
  //   },
  //   nombreFamilia: {
  //     type: String,
  //     trim: true,
  //     required: true,
  //     lowercase: true,
  //   },
  cantidadInventario: {
    type: Number,
    required: false,
    default: 1,
  },
  fechaAdquision: {
    type: Date,
    required: true,
  },
});

// const equipoPrueba = new Equipo({
//   nombreEquipo: "Mezcladora (Ele)",
//   tipoEquipo: "maquinaria liviana",
//   fechaAdquision: Date.now(),
// });

// equipoPrueba
//   .save()
//   .then((result) => {
//     console.log("llega");
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log("llega");
//     console.log(error);
//   });

module.exports = Equipo;
