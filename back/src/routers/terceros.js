const express = require("express");
const Tercero = require("../models/tercero-model");
const router = new express.Router();

/**
 *  Post de tercero
 */
router.post("", async (req, res) => {
  const tercero = new Tercero(req.body);
  try {
    await tercero.save();
    res.status(201).send(tercero);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 *  Get de terceros
 */
router.get("", async (req, res) => {
  try {
    const terceros = await Tercero.find({});
    res.send(terceros);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 *  Get de tercero por su id
 */
router.get("/:id", async (req, res) => {
  try {
    const tercero = await Tercero.findById(req.params.id);
    if (!tercero) {
      res.status(404).send("No hubo coincidencia");
    }
    res.send(tercero);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 *  Modifica un tercero
 */
router.patch("/:id", async (req, res) => {
  // Se pueden pasar por parametro los campos no modificables
  try {
    if (!Tercero.fieldsNotAllowedUpdates(req.body)) {
      return res.status(400).send({ error: "Invalid updates" });
    }

    const tercero = await Tercero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tercero) {
      return res.status(404).send();
    }
    res.send(tercero);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

/**
 * Elimina un tercero
 */
router.delete("/:id", async (req, res) => {
  try {
    const tercero = await Tercero.findByIdAndDelete(req.params.id);
    if (!tercero) {
      return res.status(404).send();
    }
    res.send(tercero);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * Agrega una bodega nueva a un tercero
 */
router.post("/:id/bodegas", async (req, res) => {
  const newBodega = new Bodega(req.body);
  try {
    const tercero = await Tercero.findById(req.params.id);
    if (!tercero) {
      res.status(404).send("Ninguna tercero coincidio con ese id");
    }
    await newBodega.save();
    tercero.bodegas.push(newBodega._id);
    await tercero.save();
    res.status(201).send(tercero);
  } catch (e) {
    res.status(400).send("No se pudo la bodega al tercero " + e);
  }
});

/**
 * Agrega una bodega creada a un tercero
 */
router.post("/:id/bodegas/:idB", async (req, res) => {
  try {
    const bodega = await Bodega.findById(req.params.idB);
    if (!bodega) {
      res.status(404).send("Ninguna bodega coincidio con ese id");
    }
    const tercero = await Tercero.findById(req.params.id);
    if (!tercero) {
      res.status(404).send("Ningun tercero coincidio con ese id");
    }
    tercero.bodegas.push(bodega._id);
    await tercero.save();
    res.status(201).send(equipoN);
  } catch (e) {
    res.status(400).send("No se pudo agregar la bodega al tercero " + e);
  }
});

/**
 * Obtiene las bodegas de un tercero
 * Envia el tercero completo con sus bodegas.
 */
router.get("/:id/bodegas", async (req, res) => {
  try {
    const tercero = await Tercero.findById(req.params.id).populate("bodegas");
    res.send(tercero);
  } catch (e) {
    res.status(400).send("El tercero con sus bodegas" + e);
  }
});

module.exports = router;
