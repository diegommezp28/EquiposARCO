import React from "react";
import withFormHandling from "../withFormHandling";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import EscogerEquipos from "./EscogerEquipos";
import EquipoDetail from "./EquipoDetail";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";

function RemisionForm(props) {
  const [remision, setRemision] = useState(undefined);
  const [asumidoTercero, setAsumidoTercero] = useState(true);
  const [equiposSels, setEquiposSels] = useState([]);
  const [equipos, setEquipos] = props.equipos;
  const [selectedDate, handleDateChange] = useState(new Date());

  const { fields, handleChange, handleSubmitPOST, idT, idB, idOr } = props;
  //console.log("equipos", equipos);

  const history = useHistory();

  useEffect(() => {
    mostrarOrden();
  }, [remision]);

  useEffect(() => {
    handleChangeEquipos();
  }, [equiposSels]);

  const mostrarOrden = () => {
    //console.log("bodega", bodega);
    if (remision) {
      history.replace(`/terceros/${idT}/bodegas/${idB}/ordenes/${idOr}`);
    }
  };

  const jsonConsola = (e) => {
    e.preventDefault();
    console.log(fields);
  };

  const handleRadio = (event) => {
    const asumidoTerceroP = event.currentTarget.value === "true" ? true : false;
    //console.log("handle", asumidoTerceroP);
    setAsumidoTercero(asumidoTerceroP);
    fields.asumidoTercero = asumidoTerceroP;
  };

  const handleChangeEquipos = () => {
    fields.equiposEnRemision = equiposSels;
  };

  const eliminarEquipoSelect = (equipo) => {
    console.log("equiposSels", equiposSels);
    console.log("indice", equiposSels.indexOf(equipo));
    setEquiposSels(equiposSels.splice(equiposSels.indexOf(equipo), 1));
    console.log(equiposSels);
  };

  return (
    <div className="remision-registrar-card">
      <form
        onSubmit={jsonConsola}
        // onSubmit={(e) =>
        //   handleSubmitPOST(e).then((value) => setRemision(value))
        // }
      >
        <h4 className="titulo">Registrar una remisión</h4>
        <label>Fecha y hora de salida : </label>{" "}
        <MuiPickersUtilsProvider locale="es" utils={MomentUtils}>
          <DateTimePicker
            value={selectedDate}
            disablePast
            onChange={handleDateChange}
            showTodayButton
            cancelLabel="Cancelar"
            todayLabel="Hoy"
          ></DateTimePicker>
        </MuiPickersUtilsProvider>
        <div className="form-group">
          <Row>
            <Col>
              <label>Equipos a trasportar : </label>
            </Col>
            <Col>
              <EscogerEquipos
                equipos={[equipos, setEquipos]}
                equiposSels={[equiposSels, setEquiposSels]}
              ></EscogerEquipos>
            </Col>
          </Row>
          <Row>
            <table className="table-width">
              <thead class="thead-light">
                <tr>
                  <th>Equipo</th>
                  <th>Cantidad</th>
                  <th className="w50"></th>
                </tr>
              </thead>
              <tbody>
                {equiposSels &&
                  equiposSels.map((equipoRender, index) => (
                    <EquipoDetail
                      key={index}
                      equipoRender={equipoRender}
                      equiposSels={[equiposSels, setEquiposSels]}
                      eliminarEquipoSelect={eliminarEquipoSelect}
                    ></EquipoDetail>
                  ))}
              </tbody>
            </table>
          </Row>
        </div>
        <div className="form-group">
          <label htmlFor="direccionBodega">
            ¿Quién se encarga del transporte?
          </label>
          <label htmlFor="asumidoTercero">
            <input
              type="radio"
              id="tercero"
              name="asumidoTercero"
              onChange={handleRadio}
              checked={asumidoTercero === true}
              value="true"
            />{" "}
            El Tercero
          </label>
          <label htmlFor="asumidoTercero">
            <input
              type="radio"
              id="equiposARCO"
              name="asumidoTercero"
              onChange={handleRadio}
              checked={asumidoTercero === false}
              value="false"
            />{" "}
            Equipos ARCO
          </label>
        </div>
        {!asumidoTercero && [
          <div key="1" className="form-group">
            <label htmlFor="vehiculoTransportador"> Vehiculo : </label>
            <input
              name="vehiculoTransportador"
              type="text"
              value={fields.vehiculoTransportador}
              onChange={handleChange}
            />
          </div>,
          <div key="2" className="form-group">
            <label htmlFor="conductor"> Conductor : </label>
            <input
              name="conductor"
              type="text"
              value={fields.conductor}
              onChange={handleChange}
            />
          </div>,
        ]}
        <div id="button-wrapper">
          <button type="submit" className="buttonTercero">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}

export default withFormHandling(RemisionForm);
