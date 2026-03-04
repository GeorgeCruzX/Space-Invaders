const nave = document.getElementById("nave");
const gameArea = document.getElementById("gameArea");
const tempoSpan = document.getElementById("tempo");
const vidasSpan = document.getElementById("vidas");
const aliensSpan = document.getElementById("aliensMortos");

let posX = window.innerWidth / 2 - 40;
let vidas = 3;
let aliensMortos = 0;
let pausado = false;
let segundos = 0;
let fase = 1;
let velocidadeAlien = 2;
let aliensNaFase = 0;

const backgrounds = [
"background1.jpg",
"background2.jpg",
"background3.jpg",
"background4.jpg"
];

// ===== RELÓGIO =====
const tempoInterval = setInterval(()=>{
if(!pausado){
segundos++;
let h = String(Math.floor(segundos/3600)).padStart(2,'0');
let m = String(Math.floor((segundos%3600)/60)).padStart(2,'0');
let s = String(segundos%60).padStart(2,'0');
tempoSpan.innerText = `${h}:${m}:${s}`;
}
},1000);

// ===== MOVIMENTO =====
document.addEventListener("keydown",(e)=>{

if(pausado) return;

if(e.key==="ArrowLeft") posX-=30;
if(e.key==="ArrowRight") posX+=30;
if(e.key===" ") disparar();

if(posX<0) posX=0;
if(posX>window.innerWidth-80) posX=window.innerWidth-80;

nave.style.left = posX+"px";

});

// ===== DISPARO =====
function disparar(){

if(pausado) return;

const missil = document.createElement("img");
missil.src="missil.png";
missil.className="missil";

let y = window.innerHeight - 120;

missil.style.left = (posX+30)+"px";
missil.style.top = y+"px";

gameArea.appendChild(missil);

const tiro = setInterval(()=>{

if(pausado) return;

y-=10;
missil.style.top = y+"px";

document.querySelectorAll(".alien").forEach(alien=>{

if(colidiu(missil,alien)){
alien.remove();
missil.remove();
clearInterval(tiro);

aliensMortos++;
aliensNaFase++;
aliensSpan.innerText = aliensMortos;

if(aliensNaFase === 3){
passarFase();
}
}
});

if(y<0){
missil.remove();
clearInterval(tiro);
}

},20);
}

// ===== CRIAR ALIENS =====
const alienInterval = setInterval(()=>{

if(pausado) return;
if(aliensNaFase >= 3) return;

const alien=document.createElement("img");
alien.src="alien.png";
alien.className="alien";

let x=Math.random()*(window.innerWidth-60);
let y=0;

alien.style.left=x+"px";
alien.style.top=y+"px";

gameArea.appendChild(alien);

const descida=setInterval(()=>{

if(pausado) return;

y+=velocidadeAlien;
alien.style.top=y+"px";

if(colidiu(alien,nave)){
vidas--;
vidasSpan.innerText=vidas;

alien.remove();
clearInterval(descida);

if(vidas<=0){
gameOver();
}
}

if(y>window.innerHeight){
alien.remove();
clearInterval(descida);
}

},30);

},1500);

// ===== PASSAR FASE =====
function passarFase(){

fase++;
aliensNaFase = 0;

if(fase > 4){
vitoria();
return;
}

velocidadeAlien += 1;

// mudar cenário
gameArea.style.backgroundImage = `url(${backgrounds[fase-1]})`;

alert("FASE " + fase);
}

// ===== GAME OVER =====
function gameOver(){
pausado = true;
clearInterval(tempoInterval);
clearInterval(alienInterval);

mostrarMensagem("GAME OVER");
}

// ===== VITÓRIA =====
function vitoria(){
pausado = true;
clearInterval(tempoInterval);
clearInterval(alienInterval);

mostrarMensagem("YOU WIN");
}

// ===== MOSTRAR MENSAGEM FINAL =====
function mostrarMensagem(texto){

const msg = document.createElement("div");
msg.innerText = texto;
msg.style.position = "absolute";
msg.style.top = "40%";
msg.style.left = "50%";
msg.style.transform = "translate(-50%, -50%)";
msg.style.fontSize = "60px";
msg.style.color = "white";
msg.style.fontWeight = "bold";
msg.style.background = "rgba(0,0,0,0.7)";
msg.style.padding = "20px";

gameArea.appendChild(msg);
}

// ===== COLISÃO =====
function colidiu(a,b){
return a.getBoundingClientRect().left < b.getBoundingClientRect().right &&
a.getBoundingClientRect().right > b.getBoundingClientRect().left &&
a.getBoundingClientRect().top < b.getBoundingClientRect().bottom &&
a.getBoundingClientRect().bottom > b.getBoundingClientRect().top;
}