import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebarComponents/Sidebar";
import EquipoList from "./components/Equipo/EquipoList/EquipoList";
import TerceroList from "./components/Tercero/TerceroList";
import TerceroDetail from "./components/Tercero/TerceroDetail";
import TerceroCreate from "./components/Tercero/TerceroCreate";
import OrdenList from "./components/Orden/OrdenList/OrdenList";
import Breadcrumb from "./components/Breadcrumb";
import OrdenDetail from "./components/Orden/OrdenDetail";
import ObraDetail from "./components/Orden/ObraDetail";
import CrearOrden from "./components/Factura/CrearOrden/CrearOrden";
import FacturaList from "./components/Factura/FacturaList";
import FacturaDetail from "./components/Factura/FacturaDetail";
import EquipoDetail from "./components/Equipo/EquipoDetail/EquipoDetail";
import EquipoCreate from "./components/Equipo/EquipoCreate/EquipoCreate";
import NotaInventarioCreate from "./components/NotaInventario/NotaInventarioCreate";
import NotaInventarioList from "./components/NotaInventario/NotaInventarioList";
import BodegaCreate from "./components/Bodega/BodegaCreate";
import CotizacionDetail from "./components/Cotizacion/CotizacionDetail";
import RemisionCreate from "./components/Actividades/Remision/RemisionCreate";
import RemisionDetail from "./components/Actividades/Remision/RemisionDetail";
import DevolucionCreate from "./components/Actividades/Devolucion/DevolucionCreate";
import DevolucionDetail from "./components/Actividades/Devolucion/DevolucionDetail";
import ActividadList from "./components/Actividades/Actividad/ActividadList";
import Cotizar from "./components/Factura/Cotizar/Cotizar";
import Prueba from "./components/Prueba";
import GlobalsContext from "./components/GlobalsContext";
import InventarioPorOrden from "./components/Imprimir/InventarioPorOrden/InventarioPorOrden";
import InventarioPorTercero from "./components/Imprimir/InventarioPorTercero/InventarioPorTercero";

// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//Routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  //Globals
  let [globalContext, setGlobalContext] = useState({
    crearOrden: {
      firstStep: "active",
      secondStep: "pending",
      bodega: {},
      cotizacion: {},
    },
  });
  // let GlobalsContext = React.createContext({ globals: globalContext, setter: setGlobalContext });

  useEffect(() => {
    let globals = [];
    async function globalsBack() {
      globals = await (await fetch("/globals/")).json();
    }
    globalsBack();
    for (const global of globals) {
      globalContext[global.nombre] = global.valor;
    }
    setGlobalContext(Object.assign({}, globalContext));
  }, []);

  // useEffect(()=> {
  //   console.log('===============CONTEXTO GLOBAL=====================');
  //   console.log(globalContext);
  //   console.log('====================================');
  // }, [globalContext])

  return (
    <GlobalsContext.Provider
      value={{ globals: globalContext, setter: setGlobalContext }}
    >
      <Router>
        <div id="contenido">
          <Navbar></Navbar>
          <Row id="rowWrapper">
            <Col
              md={3}
              xl={2}
              id="sidebar-column"
              className="d-none d-md-block"
            >
              <Sidebar />
            </Col>
            <Col id="content-column">
              <Row>
                <Breadcrumb />
              </Row>
              <Row>
                <Switch>
                  <Route path="/" exact />
                  <Route
                    path="/inventario/equipos/:idEquipo"
                    component={EquipoDetail}
                  />
                  <Route
                    path="/inventario/crearEquipo"
                    component={EquipoCreate}
                  />
                  <Route path="/inventario/equipos" component={EquipoList} />
                  <Route
                    path="/inventario/listar_notas_de_inventario"
                    component={NotaInventarioList}
                  />
                  <Route
                    path="/inventario/crearNotaInventario"
                    component={NotaInventarioCreate}
                  />
                  <Route
                    path="/terceros/listar_terceros"
                    exact
                    component={TerceroList}
                  />
                  <Route
                    path="/terceros/crear_tercero"
                    exact
                    component={TerceroCreate}
                  />
                  <Route
                    path="/terceros/listar_ordenes"
                    exact
                    component={OrdenList}
                  />
                  <Route
                    path="/terceros/:id/bodegas/create"
                    exact
                    component={BodegaCreate}
                  />
                  <Route path="/terceros/:id" exact component={TerceroDetail} />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr"
                    exact
                    component={OrdenDetail}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/obras/:idObra"
                    exact
                    component={ObraDetail}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr/remisiones/create"
                    exact
                    component={RemisionCreate}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr/remisiones/:idR"
                    exact
                    component={RemisionDetail}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr/devoluciones/create"
                    exact
                    component={DevolucionCreate}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr/devoluciones/:idD"
                    exact
                    component={DevolucionDetail}
                  />
                  <Route
                    path="/terceros/:id/bodegas/:idB/ordenes/:idOr/actividad"
                    exact
                    component={ActividadList}
                  />
                  <Route
                    path="/terceros/:id/cotizaciones/:idC"
                    exact
                    component={CotizacionDetail}
                  />
                  <Route
                    path="/facturacion/crear_orden"
                    component={CrearOrden}
                    exact
                  />
                  <Route path="/facturacion/prueba" exact component={Prueba} />
                  <Route
                    path="/facturacion/cotizar"
                    component={Cotizar}
                    exact
                  />
                  <Route
                    path="/facturacion/listar_facturas"
                    exact
                    component={FacturaList}
                  />
                  <Route
                    path="/facturacion/:idFactura"
                    exact
                    component={FacturaDetail}
                  />
                  <Route
                    path="/imprimir/inventarioPorOrden"
                    exact
                    component={InventarioPorOrden}
                  />
                  <Route
                    path="/imprimir/inventarioPorTercero"
                    exact
                    component={InventarioPorTercero}
                  />
                  <Route path="*"> Pagina no encontrada </Route>
                </Switch>
              </Row>
            </Col>
          </Row>
        </div>
      </Router>
    </GlobalsContext.Provider>
  );
}

export default App;
