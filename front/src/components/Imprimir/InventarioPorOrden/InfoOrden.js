import React from "react";
import TarifaRow from "./TarifaRow";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function InfoOrden(props) {
  const orden = props.orden;
  const tarifas = orden && orden.tarifasDefinitivas;

  const input = document.getElementById("to-print-2");

  const createPdf = () => {
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`inventario_orden_${orden.codigo}.pdf`);
    });
  };

  return (
    <div className="orden-wrapper-inventario">
      <div id="to-print-2">
        <h4 className="page-title-orden">Inventario Orden {orden.codigo}</h4>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Cantidad</th>
                <th>Valor</th>
                <th>Tipo de Cobro</th>
                <th>Periodo Cobro</th>
              </tr>
            </thead>
            <tbody>
              {tarifas &&
                tarifas.map((tarifaAgrupada, index) => (
                  <TarifaRow
                    key={index}
                    tarifasPorEquipo={tarifaAgrupada.tarifasPorEquipo}
                    index={index}
                    opcion={1}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={createPdf} className="button-print">
        Save as PDF
      </button>
    </div>
  );
}

export default InfoOrden;
