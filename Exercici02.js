let countdownOn = false; //para comprobar si ya se inició countdown
let contadorVentanas = 0;
let firstWindowWasClicked = false;
let secondWindowWasClicked = false;
let firstWindowReference;
let secondWindowReference;
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



//muestra countdown de 30 segundos
document.getElementById('button').addEventListener('click', () => {
    let intervalID;
    let segundos = 30;
    
    if(!countdownOn) {
        countdownOn = true;
        
        intervalID = setInterval(() => {
            if(segundos == -1) {
                countdownOn = false;
                clearInterval(intervalID);
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
    }, 3000);

    //después, cada 3 segundos abre una nueva en un sitio aleatorio
    setInterval(() => {
        openRandomWindow(400, 200);
    }, 3000);

    //cada milisegundo compruebe si los dos valores a los que se ha hecho click son ==
    setInterval(() => {
        checkFirstSecondValues();
    }, 50);
});



function openCenteredWindow(width, height) { //window.screenY -> posicion de la ventana en relacion con la pantalla (si es 0 la ventana ocupa toda la pantalla?)
    const top = window.screenY + (window.outerHeight/2) - (height/2); //window.outerHeight -> altura total de la ventana
    const left = window.screenX + (window.outerWidth/2) - (width/2);
    contadorVentanas++;

    const ventanaHija = window.open("", `Ventana ${contadorVentanas}`, `width=${width}, height=${height}, top=${top}, left=${left}`);
    
    ventanaHija.document.body.style.backgroundImage = 'url("imgs/turtle.jpeg")';
    ventanaHija.document.body.style.backgroundSize = "cover";
    ventanaHija.document.body.style.backgroundPosition = "center";

    document.getElementById('contador').innerHTML = `Ventanas abiertas: ${contadorVentanas}`;
}



function openRandomWindow(width, height) {
    const top = Math.floor(Math.random() * window.innerHeight);
    const left = Math.floor(Math.random() * window.innerWidth);
    contadorVentanas++;

    const ventanaHija= window.open("VentanaHijaEx2.html", `Ventana ${contadorVentanas}`, `width=${width}, height=${height}, top=${top}, left=${left}`);

    document.getElementById('contador').innerHTML = `Ventanas abiertas: ${contadorVentanas}`;
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
    console.log(`Referencia ventana hija: ${windowReference}`);
}


function checkFirstSecondValues() {
    const value1 = document.getElementById('valueWindow1').textContent;
    const value2 = document.getElementById('valueWindow2').textContent;

    if(value1 === value2) {
        if(firstWindowReference !== secondWindowReference) {
            firstWindowReference.close();
            secondWindowReference.close();
            console.log("Se han cerrado las 2 ventanas");
        } else { //si es la misma ventana clicada 2 veces se cambia el animal de fondo
            const randomAnimal = createRandomAnimal();
            firstWindowReference.changeBackground(randomAnimal);

            //crea ventana aleatoria
            console.log("SON LA MISMA VENTANAAAA");
        }
    } else {

    }

}