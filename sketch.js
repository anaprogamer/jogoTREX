//definicao de variaveis
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var nuvem, nuvemimg;
var obstaculo,obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5, obstaculo6;
var pontuacao = 0;
var grupodeobs, gruponuvem;
var JOGAR = 1;
var ENCERRAR = 0;
var estadodojogo = JOGAR;
var gameover, restart, imgover, imgrestart;
var saltosom, checksom, finadosom;

// funcao para carregamento de imagem e animacoes
function preload(){
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  nuvemimg = loadImage("cloud.png");
  
  obstaculo1 = loadImage ("obstacle1.png");
  obstaculo2 = loadImage ("obstacle2.png");
  obstaculo3 = loadImage ("obstacle3.png");
  obstaculo4 = loadImage ("obstacle4.png");
  obstaculo5 = loadImage ("obstacle5.png");     
  obstaculo6 = loadImage ("obstacle6.png");
  
  imgover = loadImage ("GAME.jpg");
  imgrestart = loadImage ("restart.png");
 
  saltosom = loadSound("jump.mp3");
  finadosom = loadSound("die.mp3");
  checksom = loadSound("checkPoint.mp3");
 
}

function setup() {

  createCanvas(600,200)
  
  //criar um sprite do trex, imagem e reduzindo o tamanho da imagen
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.scale = 0.5;  
  //correção de bug do raio de colisão.
   //trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  //criar um sprite do solo, imagem, posicao do solo na horizontal, e velocidade do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  
  //criando solo invisível
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //gerar números aleatórios
  // var rand =  Math.round(random(1,100));
  // console.log(rand);
  
  grupodeobs = createGroup();
  gruponuvem = createGroup();
  
 trex.addAnimation("collided", trex_colidiu);
  
  gameover = createSprite (300,100);
  gameover.addImage ("gameover", imgover);
  gameover.scale = 0.2;
  restart = createSprite (300,140);
  restart.addImage ("restart", imgrestart);
  restart.scale = 0.5;
  
  

}

function draw() {
  //definir cor de fundo
  background("green");
  text("Pontuacao: "+ pontuacao, 30,70);
  
   if (estadodojogo === JOGAR){
     
     gameover.visible = false;
     restart.visible = false;
       pontuacao = pontuacao + Math.round(frameRate()/60);
     //som da pontuação alcancada.
     if(pontuacao>0 && pontuacao%100 === 0){       
       checksom.play();
     }
     
     solo.velocityX = -(4 + 3* pontuacao/100);
     
      // pular quando a tecla espaço é acionada
  if(keyDown("space") && trex.y >= 160) {
    trex.velocityY = -13;
    saltosom.play();
  }
  // adicionanado gravidade ao trex para retornar ao solo
  trex.velocityY = trex.velocityY + 0.8
       // condicao para solo infinito
  if (solo.x < 0){
     solo.x = solo.width/2;
  }
     
  if (grupodeobs.isTouching(trex)){
    estadodojogo = ENCERRAR;
    finadosom.play();  
  }
 }   

   else if (estadodojogo === ENCERRAR){
     gameover.visible = true;
     restart.visible = true;
     solo.velocityX = 0;
     //altera a animação do Trex 
     trex.changeAnimation("collided", trex_colidiu);
 
     grupodeobs.setLifetimeEach(-1);
     gruponuvem.setLifetimeEach(-1);
     
     grupodeobs.setVelocityXEach(0);     
     gruponuvem.setVelocityXEach(0); 
     
     trex.velocityY = 0;
  
     if(mousePressedOver(restart)) { 
     
      reset();
     }
   
   } 
  
  // verificacao da variacao da posicao vertical para o salto do trex
  //console.log(trex.y)
  
  
  //manter trex correndo acima do solo
  trex.collide(soloinvisivel);
  
  if (grupodeobs.isTouching(trex)){
    trex.velocityX = 0;
    
  }
  
  //geraracão nuvens
  gerarNuvens();
  //console.log(frameCount);
  
  gerarobst();
  
  drawSprites();
  

}

  //função para gerar as nuvens
function gerarNuvens() {
 // escreva o seu código aqui
  if (frameCount % 60 === 0){
    nuvem = createSprite(600, 100, 40, 10);
    nuvem.velocityX = -3;
    nuvem.addImage("cloud", nuvemimg);
    nuvem.y = Math.round(random(10, 70));
    
    //ajustando a profundidade 
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;  

    //atribuição do tempo de vida da variavel
    nuvem.lifetime = 200;
    
    gruponuvem.add(nuvem);
  }
    
}
function gerarobst() {
  if (frameCount % 60 === 0){
    obstaculo = createSprite(600, 165, 10, 40);
    obstaculo.velocityX = -(6 + pontuacao/100);
    
    var rand = Math.round(random(1,6));
    //console.log(rand); 
    
    switch(rand) {
    case 1: obstaculo.addImage(obstaculo1);
            break;
    case 2: obstaculo.addImage(obstaculo2);
            break;
    case 3: obstaculo.addImage(obstaculo3);
            break;
    case 4: obstaculo.addImage(obstaculo4);
            break;
    case 5: obstaculo.addImage(obstaculo5);
            break;
    case 6: obstaculo.addImage(obstaculo6);
            break; 
    default: break;
    }
    obstaculo.scale = 0.5;
    
    obstaculo.lifetime = 300;
    
    grupodeobs.add(obstaculo);
}
  
}

  function reset(){
    
    estadodojogo =JOGAR;
    
    grupodeobs.destroyEach();   
    gruponuvem.destroyEach();
    
    gameover.visible = false;
    restart.visible = false;
    
    pontuacao = 0;
    
    trex.changeAnimation("running", trex_correndo);
 
    
     }

  