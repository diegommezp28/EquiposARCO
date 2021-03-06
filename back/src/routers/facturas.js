var express = require("express");
const Factura = require("../models/factura-model");
var router = express.Router();

/**
 *  Factura
 */

/**
 * Cantidad de documentos que hay en factura
 */
router.get("/facturas/cantidad", async (req, res) => {
  try {
    const count = await Factura.estimatedDocumentCount();
    console.log("count", count);
    res.send(count + "");
  } catch (e) {
    res
      .status(500)
      .send(["No se puede contar los facturas, hubo un error en el sistema"]);
  }
});

/**
 *  Get de facturas paginacion
 */
router.get("/facturas/:page/:elementsPerPage", async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const elementsPerPage = parseInt(req.params.elementsPerPage);
    let facturas = null;
    if (elementsPerPage === -1) {
      facturas = await Factura.find({});
    } else {
      facturas = await Factura.find({})
        .limit(elementsPerPage)
        .skip((page - 1) * elementsPerPage);
    }
    res.send(facturas);
  } catch (e) {
    res
      .status(500)
      .send(["No se puede listar los facturas, hubo un error en el sistema"]);
  }
});

/**
 * Facturas de una obra
 */
router.get("/obras/:idObra/facturas", async (req, res) => {
  const idObra = req.params.idObra;
  try {
    const fact = await Factura.find({ codigoObra: idObra }).sort({
      fechaCorte: -1,
    });
    res.send(fact);
  } catch (e) {
    res.status(404).send([`No se puede dar las facturas de la obra ${idObra}`]);
  }
});

/**
 *  Post de factura
 */
router.post("/facturas", async (req, res) => {
  try {
    const factura = new Factura(req.body);
    await factura.save();
    res.status(201).send(factura);
  } catch (e) {
    console.log(e);
    res.status(400).send(["No se pudo crear la factura"]);
  }
});

/**
 *  Get de facturas
 */
router.get("/facturas", async (req, res) => {
  let facturas = null;
  try {
    facturas = await Factura.find({});
    res.send(facturas);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 *  Get de factura por su id.
 */
router.get("/facturas/:id", async (req, res) => {
  try {
    const factura = await Factura.findOne({ codigo: req.params.id })
      .populate("ordenes")
      .populate({
        path: "ordenes",
        populate: {
          path: "remisiones",
          populate: {
            path: "equiposEnRemision",
            populate: { path: "equipoID", populate: { path: "precios" } },
          },
        },
      })
      .populate({
        path: "ordenes",
        populate: {
          path: "devoluciones",
          populate: {
            path: "equiposEnDevolucion",
            populate: {
              path: "equipoID",
              populate: {
                path: "precios",
              },
            },
          },
        },
      })
      .populate({
        path: "ordenes",
        populate: {
          path: "tarifasDefinitivas",
          populate: {
            path: "tarifasPorEquipo",
            populate: {
              path: "equipo precioReferencia",
            },
          },
        },
      })
      .populate({
        path: "bodega",
        populate: {
          path: "duenio ordenes",
        },
      });
    if (!factura) {
      return res.status(404).send("No hubo coincidencia");
    }
    console.log(factura);
    res.send(factura);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 *  Modifica un factura
 */
router.patch("/facturas/:id", async (req, res) => {
  // Se pueden pasar por parametro los campos no modificables
  try {
    if (!Factura.fieldsNotAllowedUpdates(req.body)) {
      return res.status(400).send("Modificaciones invalidas");
    }
    const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!factura) {
      return res.status(404).send();
    }
    res.send(factura);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Elimina un factura
 */
router.delete("/facturas/:id", async (req, res) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) {
      return res.status(404).send();
    }
    res.send(factura);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
