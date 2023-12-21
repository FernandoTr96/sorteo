// Especifica el rango de números (modifica según tus necesidades)
let rangoInicial = 1;
let rangoFinal = 150;
let localStorageKey = "SorteoNumeros";
// Lleva un registro de los números utilizados
let numerosUtilizados = obtenerInformacionLocal() ?? [];
// elementos html
let ganadorAudio = new Audio('./assets/ganador.mp3');
let buscandoGanadorAudio = new Audio('./assets/generating.mp3');
let numeroElement = document.getElementById("numero");
let generarNumeroButton = document.getElementById("botonGenerar");
let atrasButton = document.getElementById("botonAtras");
let botonReinicio = document.getElementById("botonReinicio");

// al cargar la pagina
document.addEventListener('DOMContentLoaded', ()=>{
    actualizarRegistroVisual();
});

function buscarGanador(){
    let contador = rangoInicial;
    let intervalo;
    buscandoGanadorAudio.play();
    intervalo = setInterval(()=>{
        contador++;
        numeroElement.textContent = contador;
        if(contador === rangoFinal){
            clearInterval(intervalo);
            buscandoGanadorAudio.remove();
            generarNumero();
        }
    })
}

function generarNumero() {

    // Verificar si se han agotado todos los números posibles
    if (numerosUtilizados.length === rangoFinal - rangoInicial + 1) {
        alert("¡Se han agotado todos los números posibles!");
        return;
    }

    // Generar número aleatorio no utilizado
    var numeroAleatorio;
    do {
        numeroAleatorio = Math.floor(Math.random() * (rangoFinal - rangoInicial + 1)) + rangoInicial;
    } while (numerosUtilizados.includes(numeroAleatorio));

    // Agregar el número utilizado al registro
    numerosUtilizados.push(numeroAleatorio);
    almacenarLocalmente();

    // Mostrar el número generado con animación
    numeroElement.style.transform = "scale(1.5)";
    numeroElement.textContent = numeroAleatorio;

    setTimeout(function () {
        numeroElement.style.transform = "scale(1)";
    }, 400);

    // Actualizar el registro visual
    actualizarRegistroVisual();
    // Audio ganador
    ganadorAudio.play();
    // Lanzar conffeti
    confetti({spread: 200});
}

function revertirGanador(){
    let confirmacion = window.confirm("¿ REVERTIR GANADOR ?\n SI REVIERTES TENDRAS LA OPORTUNIDAD DE ESCOGER OTRO GANADOR, INCLUYENDO A LA PERSONA QUE GANO EN ESTE TURNO.");
    if(confirmacion){
        numerosUtilizados.pop();
        almacenarLocalmente();
        actualizarRegistroVisual();
        numeroElement.textContent = "?";
    }
}

function actualizarRegistroVisual() {
    var registroElement = document.getElementById("registro");

    // Limpiar el contenido actual del registro
    registroElement.innerHTML = "";

    // Rellenar el registro con números utilizados
    for (var i = rangoInicial; i <= rangoFinal; i++) {
        var numeroElement = document.createElement("div");
        numeroElement.classList.add("participante");
        numeroElement.textContent = i;

        // Marcar visualmente los números utilizados
        if (numerosUtilizados.includes(i)) {
            numeroElement.classList.add("participante-ganador");
        }

        // Agregar el número al registro
        registroElement.appendChild(numeroElement);
    }
}

function almacenarLocalmente(){
    localStorage.setItem(localStorageKey, JSON.stringify(numerosUtilizados));
}

function obtenerInformacionLocal(){
    return JSON.parse(localStorage.getItem(localStorageKey));
}

function reiniciarSorteo(){
    let confirmacion = window.confirm("¿ ESTAS SEGURO DE REINICIAR EL SORTEO ?\n SI REINICIAS SE PERDERAN LOS NUMEROS SELECCIONADOS ANTERIORMENTE Y TENDRAS QUE INICIAR DE NUEVO.")
    if(confirmacion){
        numerosUtilizados = [];
        numeroElement.textContent = "?";
        localStorage.removeItem(localStorageKey);
        actualizarRegistroVisual();
    }
}
