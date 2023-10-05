let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
})

function iniciarApp() {
    mostrarSeccion(); //Show and hide the sections
    tabs(); //Change the section when the tabs are clicked 
    botonesPaginador(); //Add or removes the buttons of the next and previous page
    paginaSiguiente();
    paginaAnterior();
    consultarApi();// Check the api in the php backend
    idCliente(); //Add the client ID to the API
    nombreCliente(); //Add the name of the client to the "cita" object
    seleccionarFecha() // add the date of the reservation(cita) in the object
    seleccionarHora(); // add the hour of the reservation in the object
    mostrarResumen(); // Show the reservation resume 
}

function mostrarSeccion() {
    // Hide the section with the class 'mostrar'
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    //Select the section with the step
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //remove the class 'actual' to the previous tab
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // highlight the current tab
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            e.preventDefault();
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();

            if (paso === 3) {
                mostrarResumen();
            }
        })
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;

        paso--;

        botonesPaginador()
    })
}


function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;

        paso++;

        botonesPaginador()
    })


}

async function consultarApi() {
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio, tipo } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const tipoServicio = document.createElement('H1');
        tipoServicio.classList.add('tipo-servicio');
        tipoServicio.textContent = tipo;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        const tipoDiv = document.createElement('DIV');
        tipoDiv.classList.add('tipo');
        tipoDiv.dataset.tipoServicio = tipo;
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);
        tipoDiv.appendChild(tipoServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}


function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;
    //check the element that we are clicking
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);


    //Check if a service has been added or removed 

    if (servicios.some(agregado => agregado.id === id)) {
        //remove from the list
        cita.servicios = servicios.filter(agregado => agregado.id !== id)
        divServicio.classList.remove("seleccionado")

    } else {
        // add to the list
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add("seleccionado")


    }


}
function idCliente() {
    cita.id = document.querySelector('#id').value;

}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', function (e) {
        const horaCita = e.target.value;
        const [hora, minutos] = horaCita.split(":").map(Number);


        if ((hora < 9 || hora === 9 && minutos < 30) || (hora > 19 || hora === 19 && minutos > 30) || minutos < 0 || minutos >= 60) {
            e.target.value = '';
            mostrarAlerta('Hora no válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}



function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Domingo Cerrado', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    //Prevent to spam alerts
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    //Scripting to create the alert message
    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        //remove alert
        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen')

    //clean the content every time the screen appears
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    // Format the resume div
    const { nombre, fecha, hora, servicios } = cita;


    //heading for services in resume page
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    //iterating over each service
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV')
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio)
        contenedorServicio.appendChild(precioServicio)

        resumen.appendChild(contenedorServicio);
    })


    //date in spanish format
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

    //heading for services in resume page
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;
    //button to create a reservation

    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(fechaCita);

    resumen.appendChild(botonReservar);


}

async function reservarCita() {

    const { nombre, fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map(servicio => servicio.id)

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    console.log([...datos]);

    try {
        //API Request
        const url = '/api/citas'

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        })
        const resultado = await respuesta.json();

        console.log(resultado.resultado);

        if (resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita creada',
                text: 'Tu cita fue creada correctamente',
                button: 'Ok'
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            })
        }


    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }


}