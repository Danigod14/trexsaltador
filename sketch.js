var PLAY = 1;
var END = 0;
var gameState =PLAY;
var trex ,trex_running,trex_collided;
var ground,groundImg,invisibleGround;
var cloud,cloudImg;
var obstacleGroup, obstacle1, obstacle2,obstacle3,obstacle4,obstacle5,obstacle6
var score;
var gameoverImg,restartImg;
var jumpSound, checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg =loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkpoint.mp3"),
  diedSound = loadSound("die.mp3");
}

function setup(){
  createCanvas(600,200);
  
  //crear sprite de Trex
  trex = createSprite(50,150,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trex_collided);
  //tamaño de trex
  trex.scale = 0.5;
  trex.x = 50;

  //crear  el suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImg);
  ground.x =ground.width/2;
 // ground.velocityX= -4;
 //suelo invisible
 invisibleGround = createSprite(200,190,400,20);
  invisibleGround.visible = false;

   //crear letrero de game over 
   gameOver = createSprite(300,100);
   gameOver.addImage(gameOverImg);
   gameOver.scale = 0.5;
   //crear boton de reinicio
   restart = createSprite(300,140);
   restart.addImage(restartImg);
   restart.scale = 0.5;

  //crear grupos de nubes y obstaculos
  obstacleGroup = new Group();  
  cloudsGroup = new Group();

  //crear sensor de colision
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
   
  var rand = Math.floor(random(1,50));
  //console.log("Hola"+" mundo");
  score = 0;
}

function draw(){
  background("#000000");
  //mostrar puntuacion         
   text("puntuacion: "+ score ,500,50);
  
  //console.log(trex.y); 
  
if(gameState == PLAY ){
  //ocultar renicio y gameOver
  gameOver.visible = false;
  restart.visible = false;
  //aumentar la puntuacion
  score = score + Math.round(getFrameRate()/60);

  //desplazamiento del suelo
  ground.velocityX = -(4 + 2* score/100)
  //ocultar renicio y >gameOver
  gameOver.visible = false;
  restart.visible = false;
   //hacer que el trex salte
   if(keyDown("space") && trex.y >= 150){
    jumpSound.play();
    trex.velocityY = -10;
  }


  //gravedad
  trex.velocityY = trex.velocityY + 0.8;
  
 //reproducirsonido de checkpoint cada 100 puntos
 if(score > 0 &&  score %130 == 0){
  checkPointSound.play();
}

 //restablecer posicion del suelo
  trex.collide(invisibleGround);
 if(ground.x < 0){
   ground.x =ground.width/2;
 }
  //hacer que aparezcan las nubes
 spawnclouds();
  //hacer que aparezcan los osbtaculos
  spawnObstacles();
  
  if(obstacleGroup.isTouching(trex)){
    diedSound.play();
    gameState = END;
  }

} else if (gameState == END){
 //cambiar animacion del trex
 trex.changeAnimation("collided",trex_collided);

 //mostrar reinicio y gameOver
  gameOver.visible = true;
  restart.visible = true ;

  //trex.velocityY = 0;
  trex.velocityY = trex.velocityY + 0.8;
  ground.velocityX = 0;

  //establecer nuevo lifetime de los objetos
  obstacleGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);

  //detener nubes y osbtaculos
  obstacleGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0); 
}
//hacer que el trex camine en el suelo invisble
trex.collide(invisibleGround);

  //reinicio del juego
  if(mousePressedOver(restart)){
    reset();
 }

  
 drawSprites();
}

 function spawnclouds(){
   if(frameCount % 60 == 0 ){
   cloud =createSprite(600,100,40,10);
    cloud.addImage(cloudImg)
    cloud.scale =0.6;
    cloud.Y= Math.floor(random(10,80));
   cloud.velocityX=-4;
    // asignar la variable de liftime
   cloud.lifetime = 200;

   cloud.depth = trex.depth;
   trex.depth = trex.depth + 2;

   //agregar cada nube al grupo 
   cloudsGroup.add(cloud);


  } 
 }
 
 function spawnObstacles(){
  if(frameCount % 60 == 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 +score/100);

    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;      
      case 3: obstacle.addImage(obstacle3);
              break;   
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;  
      case 6: obstacle.addImage(obstacle6);
              break;  
        default: break;            
    }

     obstacle.scale = 0.5;
     obstacle.lifetime = 200;

   //agragar cada osbtaculo al grupo 
   obstacleGroup.add(obstacle);
  }
} 

function  reset(){
  gameState = PLAY ;

  //ocultar reinicio y game over
  gameOver.visible = false;
  restart.visible = false;

  //cambiar animacion del trex
  trex.changeAnimation("runnig",trex_collided);

 //reiniciar puntutaje
  score = 0;   

  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
}  