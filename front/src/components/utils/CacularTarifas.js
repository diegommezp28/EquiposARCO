const Holidays = require('date-holidays');
const hd = new Holidays('CO')

const categorias = ["unidad", "metro", "metro2", "metro3", "venta"];

const tiempo = ["hora", "dia cal", "dia habil", "semana", "mes", "anio"];

const holidays = hd.getHolidays(new Date().getFullYear()); //Arreglo con fecha y descripción de los festivos de Colombia en el año actual

const conversion = {
    hora: 1000 * 3600,
    "dia cal": 1000 * 3600 * 24,
    semana: 1000 * 3600 * 24 * 7,
    mes: 1000 * 3600 * 24 * 30,
    anio: 1000 * 3600 * 24 * 365
} //Tasa de conversión de milisengundos a cada unidad de medida




/**
 * Función que calcula el total a cobrar por las tarifas asociadas a una cotizacion. 
 * Devuelve un objeto con el valor total por cada tarifa de cada equipo y el valor total de toda la cotización. Cada ID de cada tarifa
 * es un campo en la respuesta, donde los valores de ese campo son el total a cobrar por esa tarifa, el tiempo total y los festivos encontrados
 * en caso de que la tarifa sea por día hábil.
 * Este último es la suma de los primeros.
 * @param {[]} tarifas . Es un arreglo con tarifas asociadas a Cotizaciones. Es decir, TODAS deben tener fecha final y precio referencia
 * Además el campo de precio de Referencia TIENE que estar populado, ya que este se usa para ver el tiempo mínimo y la unidad de medida
 */
export default function calcularTarifaCotizacion(tarifas) {
    let respuesta = {};
    let cobroCompleto = 0;
    if (!tarifas) {
        console.log("dates");
        console.log(hd.getHolidays('2020'));
        const hd1 = holidays[0];
        console.log(hd1.date);
        console.log(new Date("2020-07-04T05:00:00.000+00:00").getDay());
        console.log(0 % 6);




    }
    else {
        tarifas.map((tarifa) => {
            let informaciónCobroTarifa = {}
            if (!tarifa.precioReferencia || !tarifa.precioReferencia.tiempo) {
                return null;
            }
            else {
                const tiempoMinimo = tarifa.precioReferencia.tiempoMinimo;
                const medidaTiempo = tarifa.precioReferencia.tiempo;
                if (medidaTiempo != "dia habil") {
                    const calculo = calcularTarifa(tarifa, medidaTiempo, tiempoMinimo);
                    informaciónCobroTarifa.cobroTotal = calculo.precioTotal;
                    informaciónCobroTarifa.tiempoTotal = calculo.tiempoTotal;
                    cobroCompleto += calculo.precioTotal;

                }
                else {
                    const calculo = calcularTarifaDiaHabil(tarifa, tiempoMinimo);
                    informaciónCobroTarifa.cobroTotal = calculo.precioTotal;
                    informaciónCobroTarifa.tiempoTotal = calculo.diasTotales;
                    informaciónCobroTarifa.festivos = calculo.festivosEnMedio;
                    cobroCompleto += calculo.precioTotal;
                }
            }
            respuesta[tarifa._id] = informaciónCobroTarifa;
        })
        respuesta.cobroCompleto = cobroCompleto;
        return respuesta;
    }


}


/**
 * @param {Object} tarifa. Único campo requerido, si los otros faltan, los campos de tarifa serán los usados por defecto
 * @param {Number} tiempoMinimo. Tiempo mínimo para calcular el valor da cobrar, por defecto es 0.
 * @param {Date} fechaInicio. Fecha de inicio del periodo de tiempo a calcular, si no se le pasa se usa la de tarifa.
 * @param {Date} fechaFin. Fecha fin del periodo de tiempo a calcular, si no se le pasa se usa la de tarifa.
 * @param {Number}} cantidad. Cantidad de equipos para los cuales sacar el cobro total, si no se pasa se usa la de tarifa.
 */
function calcularTarifaDiaHabil(tarifa, tiempoMinimo = 0, fechaInicio, fechaFin, cantidad) {
    const fechaInicial = fechaInicio || new Date(tarifa.fechaInicio);
    const fechaFinal = fechaFin || new Date(tarifa.fechaFin);
    const cantidadUsada = cantidad || tarifa.cantidad;
    if (!fechaFinal || !fechaInicial || (cantidadUsada!==0 && !cantidadUsada)) {
        return null;
    }

    else {
        const timeDifference = fechaFinal.getTime() - fechaInicial.getTime();
        let dias = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const semanas = Math.floor(dias / 7);
        //Quita dos días por cada semana (Sábado y Domingo)
        dias -= semanas * 2;

        //Manejo de casos especiales
        const diaInicial = fechaInicial.getDay();
        const diaFinal = fechaFinal.getDay();

        //Quita días que faltaron
        if (diaInicial - diaFinal > 1) {
            dias -= 2;
        }
        //Remueve día inicial si los días empezaron en Domingo pero terminaron antes de Sábado
        if (diaInicial == 0 && diaFinal != 6) {
            dias--;
        }
        //Remueve día final si los días terminan un Sábado pero empiezan después del Domingo
        if (diaFinal == 6 && diaInicial != 0) {
            dias--;
        }

        let festivosEnMedio = []
        holidays.forEach(dia => {
            const festivo = new Date(dia.date);
            if (festivo >= diaInicial && festivo <= diaFinal) {
                //Si el festivo no es ni Sábado (6) ni Domingo (0)
                if ((festivo.getDay() % 6) != 0) {
                    dias--;
                    festivosEnMedio.push(dia);
                }
            }
        })
        const diasTotales = Math.max(dias, tiempoMinimo);
        const precioTotal = diasTotales * tarifa.valorTarifa * cantidadUsada;
        return { precioTotal: precioTotal, diasTotales: diasTotales, festivosEnMedio: festivosEnMedio };
    }


}

/**
 * 
 * @param {Object} tarifa. Campo requerido, a excepción de medidaTiempo, si los otros faltan, los campos de tarifa serán los usados por defecto.
 * @param {String} medidaTiempo. Campo requerido, Un string entre: "hora", "dia cal", "dia habil", "semana", "mes", "anio.
 * @param {Number} tiempoMinimo. Tiempo mínimo para calcular el valor da cobrar, por defecto es 0.
 * @param {Date} fechaInicio. Fecha de inicio del periodo de tiempo a calcular, si no se le pasa se usa la de tarifa.
 * @param {Date} fechaFin. Fecha fin del periodo de tiempo a calcular, si no se le pasa se usa la de tarifa.
 * @param {Number}} cantidad. Cantidad de equipos para los cuales sacar el cobro total, si no se pasa se usa la de tarifa.
 */
function calcularTarifa(tarifa, medidaTiempo, tiempoMinimo = 0, fechaInicio, fechaFin, cantidad) {
    const fechaInicial = fechaInicio || new Date(tarifa.fechaInicio);
    const fechaFinal = fechaFin || new Date(tarifa.fechaFin);
    const cantidadUsada = cantidad || tarifa.cantidad;
    if (!fechaFinal || !fechaInicial || !conversion[medidaTiempo] || (cantidadUsada!==0 && !cantidadUsada)) {
        return [null, -1];
    }
    else {
        const timeDifference = fechaFinal.getTime() - fechaInicial.getTime();
        const tiempoConvertido = Math.ceil(timeDifference / conversion[medidaTiempo]);
        const tiempoTotal = Math.max(tiempoConvertido, tiempoMinimo);
        const precioTotal = tiempoTotal * tarifa.valorTarifa * cantidadUsada;
        return { precioTotal: precioTotal, tiempoTotal: tiempoTotal };
    }
}
