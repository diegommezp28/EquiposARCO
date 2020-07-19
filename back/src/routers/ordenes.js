const express = require("express");
const Orden = require("../models/orden-model");
const Bodega = require("../models/bodega-model");
const Cotizacion = require("../models/cotizacion-model");
const Tarifa = require("../models/tarifa-model");

//const Tercero = require("../models/tercero-model");
const router = express.Router();

/**
 *  Relacion Bodega -> Orden / Cotizacion
 */

/**
 * Crea una orden a partir de una cotizacion y la agrega a una bodega.
 * Copia la infromacion de las tarifas definidas en la cotizacion,y crea nuevas instancias de ellas que las relaciona con la orden.
 * Separa las tarifas nuevas tarifas creada de acuerdo al equipo al que están relacionadas
 * No se espera que en la cotizacion haya mas de una tarifa por equipo pero igual maneja esta situacion
 */
router.post("/bodegas/:idB/cotizaciones/:idC/ordenes", async (req, res) => {
  let orden = null;
  try {
    const bodega = await Bodega.findById(req.params.idB);
    if (!bodega) {
      return res.status(404).send("Ninguna bodega coincidio con ese id");
    }
    const cotizacion = await Cotizacion.findById(req.params.idC).populate(
      "tarifasCotizadas"
    );
    if (!cotizacion) {
      return res.status(404).send("Ninguna cotizacion coincidio con ese id");
    }
    console.log("La bodega y la cotizacion existen");
    orden = new Orden(req.body);
    orden.tarifasDefinitivas = await Tarifa.filtrarPorEquipo(
      cotizacion.tarifasCotizadas
    );
    orden.cotizacion = cotizacion._id;
    await orden.save();
    console.log("orden guardada");
    cotizacion.orden = orden._id;
    await cotizacion.save();
    bodega.ordenesActuales.push(orden._id);
    await bodega.save();
    console.log("Orden aniadida a la bodega con exito");
    const ans = { bodega: bodega, orden: orden };
    res.status(201).send(ans);
  } catch (e) {
    res.status(400).send("No se pudo agregar la bodega al tercero " + e);
    console.error("error", e);
  }
});

/**
 * Crea una orden y la agrega a una bodega
 */
router.post("/bodegas/:idB/ordenes", async (req, res) => {
  let orden = null;
  try {
    orden = new Orden(req.body);
    const bodega = await Bodega.findById(req.params.idB);
    if (!bodega) {
      return res.status(404).send("Ninguna bodega coincidio con ese id");
    }
    console.log("La bodega existe");
    await orden.save();
    console.log("orden guardada");
    bodega.ordenesActuales.push(orden._id);
    await bodega.save();
    console.log("Bodega aniadida al tercero con exito");
    res.status(201).send(bodega);
  } catch (e) {
    res.status(400).send("No se pudo agregar la bodega al tercero ");
  }
});

/**
 * Agrega una orden creada a una bodega
 */
router.patch("/bodegas/:idB/ordenes/:idOr", async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.idOr);
    if (!orden) {
      return res.status(404).send("Ninguna orden coincidio con ese id");
    }
    const bodega = await Bodega.findById(req.params.idB);
    if (!bodega) {
      return res.status(404).send("Ninguna bodega coincidio con ese id");
    }
    console.log("La bodega existe");
    let indice = bodega.ordenesActuales.indexOf(orden._id);
    if (indice !== -1) {
      return res.status(404).send("La orden es una orden actual de la bodega");
    }
    indice = bodega.ordenesPasadas.indexOf(orden._id);
    if (indice !== -1) {
      return res.status(404).send("La orden es una orden pasada de la bodega");
    }
    bodega.ordenesActuales.push(orden._id);
    await bodega.save();
    console.log("Bodega aniadida al tercero con exito");
    res.status(201).send(bodega);
  } catch (e) {
    res.status(400).send("No se pudo agregar la bodega al tercero ");
  }
});

/**
 * Terminar una orden.
 * Pasarla de ordenesActuales a ordenesGuardadas
 */
router.patch("/bodegas/:idB/ordenes/:idOr/terminar", async (req, res) => {
  try {
    const bodega = await Bodega.findById(req.params.idB);
    if (!bodega) {
      return res.status(404).send("Ninguna bodega coincidio con ese id");
    }
    console.log("La bodega existe");
    const orden = await Orden.findById(req.params.idOr);
    if (!orden) {
      return res.status(404).send("Ninguna orden coincidio con ese id");
    }
    console.log("La orden existe");
    const indice = bodega.ordenesActuales.indexOf(orden._id);
    if (indice === -1) {
      return res.status(404).send("La orden no pertenece a la bodega");
    }
    bodega.ordenesActuales.splice(indice, 1);
    bodega.ordenesPasadas.push(orden._id);
    await bodega.save();
    console.log("Bodega aniadida al tercero con exito");
    res.status(201).send(bodega);
  } catch (e) {
    res.status(400).send("No se pudo agregar la bodega al tercero ");
  }
});

/**
 * Obtener las ordenes actuales de una bodega
 * Return: las ordenes actuales
 */
router.get("/bodegas/:idB/ordenesActuales", async (req, res, next) => {
  try {
    const bodega = await Bodega.findById(req.params.idB).populate(
      "ordenesActuales"
    );
    if (!bodega) {
      return res.send("La bodega no existe");
    }
    res.send(bodega.ordenesActuales);
    console.log("La bodega existe");
  } catch (e) {
    res.status(404).send("No se pudo hacer la solicitud ");
  }
});

/**
 * Obtener las ordenes pasadas de una bodega
 * Return: las ordenes pasadas
 */
router.get("/bodegas/:idB/ordenesPasadas", async (req, res, next) => {
  try {
    const bodega = await Bodega.findById(req.params.idB).populate(
      "ordenesPasadas"
    );
    if (!bodega) {
      return res.send("La bodega no existe");
    }
    res.send(bodega.ordenesPasadas);
    console.log("La bodega existe");
  } catch (e) {
    res.status(404).send("No se pudo hacer la solicitud ");
  }
});

/**
 *  Orden
 */

/**
 * Cantidad de documentos que hay en Orden
 */
router.get("/ordenes/cantidad", async (req, res) => {
  try {
    const count = await Orden.estimatedDocumentCount();
    console.log("count", count);
    res.send(count + "");
  } catch (e) {
    res.status(500).send("Error del sistema");
  }
});

/**
 *  Post de Orden
 */
router.post("/ordenes", async (req, res) => {
  const orden = new Orden(req.body);
  try {
    await orden.save();
    res.status(201).send(orden);
  } catch (e) {
    res.status(400).send("Error del sistema");
  }
});

/**
 *  Get de ordenes
 */
router.get("/ordenes", async (req, res) => {
  let ordenes = null;
  try {
    ordenes = await Orden.find({});
    res.send(ordenes);
  } catch (e) {
    res.status(500).send("Error del sistema");
  }
});

/**
 *  Get de orden por su id. Puebla las tarifas, las remisiones y las devoluciones
 */
router.get("/ordenes/:id", async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate({
        path: "tarifasDefinitivas",
        populate: {
          path: "tarifasPorEquipo",
          populate: {
            path: "equipo precioReferencia",
          },
        },
      })
      .populate("remisiones")
      .populate("devoluciones");
    if (!orden) {
      return res.send("La orden no existe");
    }
    res.send(orden);
    console.log("La orden existe");
  } catch (e) {
    res.status(404).send("No se pudo hacer la solicitud " + e);
  }
});

/**
 *  Modifica un orden
 */
router.patch("/ordenes/:id", async (req, res) => {
  // Se pueden pasar por parametro los campos no modificables
  try {
    if (!Orden.fieldsNotAllowedUpdates(req.body)) {
      return res.status(400).send("Modificaciones invalidas");
    }
    const orden = await Orden.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!orden) {
      return res.status(404).send();
    }
    res.send(orden);
  } catch (e) {
    res.status(400).send("Error del sistema");
  }
});

/**
 * Elimina un Orden
 */
router.delete("/ordenes/:id", async (req, res) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id);
    if (!orden) {
      return res.status(404).send();
    }
    res.send(orden);
  } catch (error) {
    res.status(500).send("Error del sistema");
  }
});

module.exports = router;
