let countdownOn = false; //para comprobar si ya se inició countdown

let contadorVentanas = 0; //para llevar la cuenta de las ventanas abiertas
let contadorVentanasCreadas = 0; //para llevar la cuenta de las ventanas que han sido creadas
let contadorVentanasIdentificador = 0; //sirve para nombrar las ventanas creadas con window.open

let firstWindowWasClicked = false;
let secondWindowWasClicked = false;
let firstWindowReference;
let secondWindowReference;

let flag = false;

let countdownInterval;
let openWindowInterval; 
let checkCountIsZeroInterval;
let checkWindowValuesInterval;

const animals = [
    {
        name: 'seal',
        img: 'imgs/seal.jpg'
    },
    {
        name: 'turtle',
        img: 'imgs/turtle.jpeg'
    },
    {
        name: 'dolphin',
        img: 'imgs/dolphin.jpg'
    },
    {
        name: 'crab',
        img: 'imgs/crab.jpg'
    }
]

showLastGameResults();

//muestra countdown de 30 segundos
document.getElementById('button').addEventListener('click', () => {
    document.getElementById('numOfWindows').innerHTML = "";
    document.getElementById('message').innerHTML = "";

    let segundos = 30;
    contadorVentanas = 0; //reinicio por si el das a START despues de haber jugado 1 partida
    contadorVentanasCreadas = 0;

    if(!countdownOn) {
        countdownOn = true;
        
        countdownInterval = setInterval(() => {
            if(segundos == -1) {
                countdownOn = false;
                document.getElementById('message').classList.remove('text-success'); //elimino si tenia clase aplicada anteriormente
                document.getElementById('message').classList.add('text-danger'); //añado la clase de bootstrap xra darle color rojo al mensaje
                document.getElementById('message').innerHTML = '¡Perdiste! Vuélvelo a intentar.';
                localStorage.setItem('numVentanas', `Número de ventanas creadas en la última partida: ${contadorVentanasCreadas}`);
                localStorage.setItem('lastGameResult', 'Perdiste la última partida');
                clearInterval(checkCountIsZeroInterval);
                clearInterval(openWindowInterval);
                clearInterval(checkWindowValuesInterval);
                clearInterval(countdownInterval);
            } else if(segundos == 0) {
                document.getElementById('countdown').innerHTML = `00:0${segundos}`;
                segundos -= 1;
            } else {
                document.getElementById('countdown').innerHTML = `00:${segundos}`;
                segundos -= 1;
            }
        }, 1000);
    }
    
    //los primeros tres segundos se abre ventana centrada
    setTimeout(() => {
        openCenteredWindow(400, 200);

        checkCountIsZeroInterval = setInterval(() => {
            if(contadorVentanas === 0) {
                clearInterval(countdownInterval);
                document.getElementById('message').classList.remove('text-danger'); //elimino si tenia clase aplicada anteriormente
                document.getElementById('message').classList.add('text-success'); //añado la clase de bootstrap xra darle color verde al mensaje
                document.getElementById('message').innerHTML = '¡Enhorabuena! Has ganado.';
                countdownOn = false;
                localStorage.setItem('numVentanas', `Número de ventanas creadas en la última partida: ${contadorVentanasCreadas}`);
                localStorage.setItem('lastGameResult', 'Ganaste la última partida');
                clearInterval(checkCountIsZeroInterval);
                clearInterval(openWindowInterval);
                clearInterval(checkWindowValuesInterval);
            }
        }, 500);
    }, 3000);

    //después, cada 3 segundos abre una nueva en un sitio aleatorio
    openWindowInterval = setInterval(() => {
        openRandomWindow(400, 200);
    }, 3000);

    //cada medio segundo comprueba si los dos valores a los que se ha hecho click son ==
    checkWindowValuesInterval = setInterval(() => {
        checkFirstSecondValues();
    }, 500);

    showLastGameResults();
});



function openCenteredWindow(width, height) { //window.screenY -> posicion de la ventana en relacion con la pantalla (si es 0 la ventana ocupa toda la pantalla?)
    const top = window.screenY + (window.outerHeight/2) - (height/2); //window.outerHeight -> altura total de la ventana
    const left = window.screenX + (window.outerWidth/2) - (width/2);
    contadorVentanas++;
    contadorVentanasIdentificador++;
    contadorVentanasCreadas++;

    const ventanaHija = window.open("VentanaHijaEx2.html", `Ventana ${contadorVentanasIdentificador}`, `width=${width}, height=${height}, top=${top}, left=${left}`);
    
    ventanaHija.document.body.style.backgroundImage = 'url("imgs/turtle.jpeg")';
    ventanaHija.document.body.style.backgroundSize = "cover";
    ventanaHija.document.body.style.backgroundPosition = "center";

    document.getElementById('contador').innerHTML = `Ventanas abiertas: ${contadorVentanas}`;
    document.getElementById('numOfWindows').innerHTML = `Ventanas creadas hasta el momento: ${contadorVentanasCreadas}`;
}



function openRandomWindow(width, height) {
    const top = Math.floor(Math.random() * window.innerHeight);
    const left = Math.floor(Math.random() * window.innerWidth);
    contadorVentanas++;
    contadorVentanasIdentificador++;
    contadorVentanasCreadas++;

    const ventanaHija= window.open("VentanaHijaEx2.html", `Ventana ${contadorVentanasIdentificador}`, `width=${width}, height=${height}, top=${top}, left=${left}`);

    document.getElementById('contador').innerHTML = `Ventanas abiertas: ${contadorVentanas}`;
    document.getElementById('numOfWindows').innerHTML = `Ventanas creadas hasta el momento: ${contadorVentanasCreadas}`;
}



function createRandomAnimal() { //se le llama desde la ventana hija
    const randomNumber = Math.floor(Math.random() * 4);
    
    let animal;

    switch(randomNumber) {
        case 0:
            animal = animals[0];
            break;
        case 1:
            animal = animals[1];
            break;
        case 2:
            animal = animals[2];
            break;
        case 3:
            animal = animals[3];
            break;
    }

    return animal;
}



function receiveItemClicked(animal, windowReference) {
    if(!firstWindowWasClicked && !secondWindowWasClicked) { //cuando se inicia el juego
        //se guarda el valor de la primera ventana a la que se ha hecho click
        firstWindowWasClicked = true;
        firstWindowReference = windowReference;
        document.getElementById('valueWindow1').textContent = "" + animal.name;
    } else if(firstWindowWasClicked && !secondWindowWasClicked) {
        firstWindowWasClicked = false;
        secondWindowWasClicked = true;
        secondWindowReference = windowReference;
        document.getElementById('valueWindow2').innerHTML = "" + animal.name;
    } else if(!firstWindowWasClicked && secondWindowWasClicked) {
        firstWindowWasClicked = true;
        secondWindowWasClicked = false;
        firstWindowReference = windowReference;
        document.getElementById('valueWindow1').innerHTML = "" + animal.name;
    } else {
        document.getElementById('error').innerHTML = 'Hubo un error al recibir el valor de la ventana hija';
    }

    flag = true;
}



function checkFirstSecondValues() {
    let value1 = document.getElementById('valueWindow1').textContent;
    let value2 = document.getElementById('valueWindow2').textContent;

    if(value1 === value2 && flag) {
        if(firstWindowReference && secondWindowReference) { //si no son null
            if(firstWindowReference !== secondWindowReference) {
                firstWindowReference.close();
                secondWindowReference.close();
                firstWindowReference = null;
                secondWindowReference = null;
                document.getElementById('valueWindow1').textContent = 'sin valor1';
                document.getElementById('valueWindow2').textContent = 'sin valor2'; //para que no entre en el else inferior y se cambie otra vez el fondo
                contadorVentanas -= 2;
                document.getElementById('contador').innerHTML = `Ventanas abiertas: ${contadorVentanas}`;

            } else { //si es la misma ventana clicada 2 veces se cambia el animal de fondo
                const randomAnimal = createRandomAnimal();
                firstWindowReference.changeBackground(randomAnimal);
                //firstWindowReference = null;
                secondWindowReference = null; //para que no haga changeBackground en bucle hasta que le des clic a otra carta
                document.getElementById('valueWindow1').textContent = "LE HAS DADO DOBLE CLICK";
                document.getElementById('valueWindow2').textContent= "A LA MISMA VENTANA"; //para que no las cierre en el próximo interval por tener el mismo valor y != referencia

                //crea nueva ventana aleatoria
                openRandomWindow(400, 200);
            }

            flag = false;
        }
    }
}



function endGame() {
    console.log("ENDING GAME");
    clearInterval(checkCountIsZeroInterval);
    clearInterval(openWindowInterval);
    clearInterval(checkWindowValuesInterval);
    clearInterval(countdownInterval);

    document.getElementById('message').classList.remove('text-success'); //elimino si tenia clase aplicada anteriormente
    document.getElementById('message').classList.add('text-danger'); //añado la clase de bootstrap xra darle color rojo al mensaje
    document.getElementById('message').innerHTML = '¡Perdiste! Vuélvelo a intentar.';
    localStorage.setItem('numVentanas', `Número de ventanas creadas en la última partida: ${contadorVentanasCreadas}`);
    localStorage.setItem('lastGameResult', 'Perdiste la última partida');

    //reiniciar variables
    countdownOn = false; //para comprobar si ya se inició countdown
    firstWindowWasClicked = false;
    secondWindowWasClicked = false;
    firstWindowReference = null;
    secondWindowReference = null;
    flag = false;
}



function showLastGameResults() {
    document.getElementById('lastGameNumOfWindows').innerHTML = localStorage.getItem('numVentanas');
    document.getElementById('lastGameResult').innerHTML = localStorage.getItem('lastGameResult');
}