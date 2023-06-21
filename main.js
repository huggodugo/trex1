//variáveis globais
var trex
var trex_img, trex_die
var chao
var chao_img
var edges
var nuvem_img
var cacto_img1,cacto_img2,cacto_img3,cacto_img4,cacto_img5,cacto_img6;
var pulo
var grupoNuvem, grupoCacto
var pontos = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOver_img, restart, restart_img;
var morte

//carregar os arquivos
function preload(){
   trex_img = loadAnimation("assets/trex1.png","assets/trex3.png","assets/trex4.png");
   chao_img = loadImage("assets/ground2.png");
   nuvem_img = loadImage("assets/cloud.png");
   cacto_img1 = loadImage("assets/obstacle1.png");
   cacto_img2 = loadImage("assets/obstacle2.png");
   cacto_img3 = loadImage("assets/obstacle3.png");
   cacto_img4 = loadImage("assets/obstacle4.png");
   cacto_img5 = loadImage("assets/obstacle5.png");
   cacto_img6 = loadImage("assets/obstacle6.png");
   pulo = loadSound("assets/jump.mp3");
   trex_die = loadAnimation("assets/trex_collided.png");
   gameOver_img = loadImage("assets/gameOver.png");
   restart_img = loadImage("assets/restart.png");
   morte = loadSound("assets/die.mp3");
   check = loadSound("assets/checkpoint.mp3")
}

//criando sprites e suas propriedades
function setup(){
    createCanvas(windowWidth,windowHeight)
    chao = createSprite(width/2,height-20,width,40);
    chao.addImage(chao_img)
   
    trex = createSprite(50,height-30,20,40);
    trex.addAnimation("correndo",trex_img);
    trex.addAnimation("die",trex_die);
    trex.scale = 0.5;

    //trex.debug = true;
    //trex.setCollider("rectangle",0,0,200,200)
    console.log(trex)

    edges = createEdgeSprites();
    grupoNuvem = new Group();
    grupoCacto = new Group();

    gameOver = createSprite(width/2,height/2);
    gameOver.addImage(gameOver_img);
    gameOver.scale = 0.7;
   
    restart = createSprite(width/2,height/2 + 30);
    restart.addImage(restart_img);
    restart.scale = 0.4;
    
}

function draw(){
    background(255);
    

    if(gameState === PLAY){
         chao.velocityX = -6 

        if(pontos > 0  && pontos % 100 === 0){
            if(!check.isPlaying()){
                check.play()
            }
        }


        gameOver.visible = false;
        restart.visible = false;

        pontos += Math.round(getFrameRate()/60);
        gerarNuvens();
        gerarCactos();

        //pulo
        if(touches.length > 0 || keyDown("space") && trex.y > height - 30 ){
            trex.velocityY = -10; 
            touches = []
            if(!pulo.isPlaying()){
                pulo.play();
            }   
        }
        

        if(trex.isTouching(grupoCacto)){
            gameState = END
          //  if(!morte.isPlaying()){
                morte.play()
           // }
        }
    }else if(gameState === END){
        chao.velocityX = 0;
        grupoCacto.setVelocityXEach(0);
        grupoNuvem.setVelocityXEach(0);

        grupoCacto.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);
        
        trex.changeAnimation("die");
        gameOver.visible = true;
        restart.visible = true;

        if(mousePressedOver(restart)){
            reset();
        }

    }

   //gravidade
        trex.velocityY += 0.5;

   //
   trex.collide(edges)

   //fundo infinito
   if(chao.x < 800){
    chao.x = chao.width/2 
   }

    drawSprites();

   

   //text("texto", x , y)
   text(mouseX +"," + mouseY, mouseX, mouseY);

   
   textFont("arial black");
   textSize(15);
   text("SCORE: " + pontos,width-200,height-170);


}//fim do draw

function gerarNuvens(){
            //módulo
    if(frameCount % 120 === 0 ){
        var y = Math.round(random(height-180,height-100)) ;
        var nuvem = createSprite(width,y);
        nuvem.addImage(nuvem_img);
        nuvem.velocityX = -2;
        nuvem.scale = random(0.3,1.4);

        nuvem.depth = trex.depth;
        trex.depth +=1

        // largura do canvas divido pela velocidade
        nuvem.lifetime = width/nuvem.velocityX;

        grupoNuvem.add(nuvem);

        console.log(y)
    }
}

function gerarCactos(){
    if(frameCount % 100 === 0){
       var cacto = createSprite(width,height-40);
        cacto.addImage(cacto_img1);
        cacto.scale = 0.7;
        cacto.velocityX = -6;
        cacto.debug = true
        var num = Math.round(random(1,6));
        switch(num){
            case 1:
                cacto.addImage(cacto_img1);
            break
            case 2:
                cacto.addImage(cacto_img2);
            break
            case 3:
                cacto.addImage(cacto_img3);
            break
            case 4:
                cacto.addImage(cacto_img4);
            break
            case 5:
                cacto.addImage(cacto_img5);
            break
            case 6:
                cacto.addImage(cacto_img6);
                //cacto.scale = 0.3;
            break
            default: break
        }

        cacto.setCollider("rectangle",0,0, cacto.width,cacto.height)
        cacto.depth = trex.depth;
        trex.depth +=1

         // largura do canvas divido pela velocidade
         cacto.lifetime = width/cacto.velocityX;
         
         grupoCacto.add(cacto);
    }  
}


function reset(){
    gameState = PLAY;
    grupoCacto.destroyEach();
    grupoNuvem.destroyEach();
    trex.changeAnimation("correndo");
    pontos = 0;
}