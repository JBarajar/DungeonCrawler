var input = {
		w: false,
		s: false,
		a: false,
		d: false,
    // New key implementations for attacking
    space: false,
    arrowKeyUp: false,
    arrowKeyDown: false,
    arrowKeyLeft: false,
    arrowKeyRight: false
}


var width = 320;
var height = 240;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var Scene;
var startTime = new Date();
var endTime = new Date();
var draw = true;

var tileImage;

var draw = true;


document.addEventListener('keydown',doKeyDown,false);
document.addEventListener('keyup',doKeyRelease,false);



$(function() {

	Scene = new Scene();
	tileImage = document.getElementById("basicTiles");


	Scene.Start();

	requestAnimationFrame(mainLoop);

});





//X & Y coordinates
function Vector2() {
	this.x = 0.0;
	this.y = 0.0;
}

function Transform() {
	this.position = new Vector2();
	this.rotation = new Vector2();
	this.scale = new Vector2();
}


function BoxCollider(width, height, parent) {

	this.offset = new Vector2();
	this.parent = parent;
	this.width = width;
	this.height = height;
    this.isTrigger = false; //if true collider only triggers onCollide() functions. Doesn't return
    this.ignorePlayer = false;

	this.checkCollision = function(scene, position) {
        if(!this.isTrigger) {
    		//Get tile id
    		var tileID;

    		for(var i = 0; i < scene.tileRenderer.map.layers.length; i++) {

    			if(scene.tileRenderer.map.layers[i].properties && scene.tileRenderer.map.layers[i].properties.abovePlayer == true) {
    				continue;
    			}

    			if(scene.tileRenderer.map.layers[i].type == "tilelayer") {
    				tileID = scene.tileRenderer.map.layers[i].data[Math.floor(position.x/16) + scene.tileRenderer.map.width*Math.floor((position.y - 16)/16)] - 1;



    				if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()]) {
    					if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
    						return true;


    					}


    				}

    				tileID = scene.tileRenderer.map.layers[i].data[Math.floor((position.x + this.width)/16) + scene.tileRenderer.map.width*Math.floor((position.y - 16)/16)] - 1;



    				if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()]) {
    					if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
    						return true;


    					}


    				}

    				tileID = scene.tileRenderer.map.layers[i].data[Math.floor((position.x + this.width)/16) + scene.tileRenderer.map.width*Math.floor((position.y + this.height - 16)/16)] - 1;



    				if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()]) {
    					if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
    						return true;


    					}


    				}

    				tileID = scene.tileRenderer.map.layers[i].data[Math.floor(position.x/16) + scene.tileRenderer.map.width*Math.floor((position.y + this.height - 16)/16)] - 1;



    				if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()]) {
    					if(scene.tileRenderer.map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
    						return true;


    					}


    				}



    			}

    		}
		}








		/*

		if(Scene.tiles[Math.floor((position.y)/16)][Math.floor((position.x)/16)]) {
				if(Scene.tiles[Math.floor((position.y)/16)][Math.floor((position.x)/16)] == 2) {
					return true;

				}
		}

		if(Scene.tiles[Math.floor((position.y + this.height)/16)][Math.floor((position.x)/16)]) {
				if(Scene.tiles[Math.floor((position.y + this.height)/16)][Math.floor((position.x)/16)] == 2) {
					return true;

				}
		}

		if(Scene.tiles[Math.floor((position.y)/16)][Math.floor((position.x + this.width)/16)]) {
				if(Scene.tiles[Math.floor((position.y)/16)][Math.floor((position.x + this.width)/16)] == 2) {
					return true;

				}
		}

		if(Scene.tiles[Math.floor((position.y + this.height)/16)][Math.floor((position.x + this.width)/16)]) {
				if(Scene.tiles[Math.floor((position.y + this.height)/16)][Math.floor((position.x + this.width)/16)] == 2) {
					return true;

				}
		}

		*/


		//To-do: check for other box colliders

		for(var i = 0; i < scene.GameObjects.length; i++) {


			//Does the object have a box collider?
			if(scene.GameObjects[i].boxCollider) {

				if(scene.GameObjects[i].boxCollider != this) {
                    if(scene.GameObjects[i].hasOwnProperty("type") && scene.GameObjects[i].type == "Player" && this.ignorePlayer) {

                    }
                    else {
                        if (position.x < scene.GameObjects[i].transform.position.x + scene.GameObjects[i].boxCollider.width &&
                       position.x + this.width > scene.GameObjects[i].transform.position.x &&
                       position.y < scene.GameObjects[i].transform.position.y + scene.GameObjects[i].boxCollider.height &&
                       this.height + position.y > scene.GameObjects[i].transform.position.y) {

                        /*if(scene.GameObjects[i].onCollide) {

                            scene.GameObjects[i].onCollide();

                        }*/

                        if(this.parent.onCollide) {
                            if(this.isTrigger) {
                                this.parent.onCollide(scene, scene.GameObjects[i]);
                            }
                            else {
                            return this.parent.onCollide(scene, scene.GameObjects[i]);}

                        }

                        else return true;

                        }
                    }



				}





			}

		}

		return false;

	}
}


//These objects will be used later on.
function GameObject() {
	this.transform = new Transform();

	this.Start = function(scene) {


	}

	this.Update = function(scene) {



	}

	this.Draw = function(scene) {


	}

}

function Key() {
	this.type = "Key";

}

function Enemy(x, y) {


    this.die = function(scene, imgPosX, imgPosY) {
      this.isDead = true;
      scene.GameObjects.push(new DeadObject(this.transform.position, imgPosX, imgPosY));
    }

    this.refreshPath = function(scene) {
        this.playerPos.x = scene.player.transform.position.x+this.tO;
        this.playerPos.y = scene.player.transform.position.y+this.tO;
        this.path = createPath(this,scene.player,scene);

        if(this.path.length < 2) {
            this.n = 0;
        }
        else {
            this.n = 1;
        }
    }

    this.resetKnockBack = function() {
        this.knockBack = false;
        this.resetingKB = false;
        this.refreshPath(Scene);
    }

	this.Move = function(target,scene) {
		//Store previous values of X and Y (for collisions)
		this.prevX = this.transform.position.x;
		this.prevY = this.transform.position.y;
		if(Math.abs(this.transform.position.x - target.tile.x*16) < 1.0 && Math.abs(this.transform.position.y - target.tile.y*16) < 1.0) {
			this.transform.position.x = target.tile.x*16;
			this.transform.position.y = target.tile.y*16;

			if(Math.floor(this.playerPos.x/16) != Math.floor((scene.player.transform.position.x+this.tO)/16) || Math.floor(this.playerPos.y/16) != Math.floor((scene.player.transform.position.y+this.tO)/16)) {
				this.refreshPath(scene);
			}

			else if(this.n < this.path.length-1) {
				this.n++;
			}

		}
        if(!this.smoothMove) this.transform.position.x = lerp2(this.transform.position.x, target.tile.x*16, this.speed);
    	else {
            if(target.tile.x*16 - this.transform.position.x > 0) this.transform.position.x += this.speed;
            else if(target.tile.x*16 - this.transform.position.x < 0) this.transform.position.x -= this.speed;
        }
		if(this.boxCollider.checkCollision(scene, this.transform.position)) {
			this.transform.position.x = this.prevX;

		}
		if(!this.smoothMove) this.transform.position.y = lerp2(this.transform.position.y, target.tile.y*16, this.speed);
        else {
            if(target.tile.y*16 - this.transform.position.y > 0) this.transform.position.y += this.speed;
            else if(target.tile.y*16 - this.transform.position.y < 0)this.transform.position.y -= this.speed;
        }
		if(this.boxCollider.checkCollision(scene, this.transform.position)) {
			this.transform.position.y = this.prevY;

		}
	}

    this.setFacing = function() {
        if(this.transform.position.y - this.prevY > 0) {
            this.facing = 0;
        }
        else if(this.transform.position.y - this.prevY < 0){
            this.facing = 3;
        }

        if(this.transform.position.x - this.prevX > 0) {
            this.facing = 2;
        }
        else if(this.transform.position.x - this.prevX < 0){
            this.facing = 1;
        }

    }

    this.setIdleFacing = function(scene) {
        if(Math.abs(this.transform.position.y - scene.player.transform.position.y) > Math.abs(this.transform.position.x - scene.player.transform.position.x)) {
            if(this.transform.position.y - scene.player.transform.position.y < 0) {
                this.facing = 0;
            }
            else if(this.transform.position.y - scene.player.transform.position.y > 0){
                this.facing = 3;
            }
        }
        else {
            if(this.transform.position.x - scene.player.transform.position.x < 0) {
                this.facing = 2;
            }
            else if(this.transform.position.x - scene.player.transform.position.x > 0){
                this.facing = 1;
            }
        }



    }

    this.getHit = function(collider) {
            if(!this.knockBack) {

                this.kbPos.x = this.transform.position.x - ((collider.transform.position.x - this.transform.position.x) * 2);
                this.kbPos.y = this.transform.position.y - ((collider.transform.position.y - this.transform.position.y) * 2);
                this.knockBack = true;
                this.health -= collider.damage;
              }
    }

    this.onCollide = function(scene, collider) {

    }



	this.Start = function(scene) {


	}

	this.Update = function(scene) {


    }

	this.Draw = function(scene) {


	}


}

Slime.prototype = new Enemy();
Slime.prototype.constructor = Slime;
function Slime(x,y) {

    this.type = "Enemy";
    this.transform = new Transform();
    this.layer = 1;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.active = false;
    this.activationRange = 7*16;

    this.isDead = false;
    this.health = 100;

    this.drawHealth = true;

    this.smoothMove = true;
    //DONT SET SPEED HIGHER THAN 1.0
    if(this.smoothMove) this.speed = 0.8;
    else this.speed = 0.1; //getRandomArbitrary(0.07, 0.1);

    this.damage = 10;
    //this.img = document.getElementById("chest");
    this.path;
    this.n = 0;
    this.playerPos = new Vector2();
    this.playerPos.x;
    this.playerPos.y;
    this.prevX = this.transform.position.x;
    this.prevY = this.transform.position.y;
    this.tO = 8;

    this.knockBack = false;
    this.resetingKB = false;
    this.kbPos = new Vector2();

    this.img = document.getElementById("characters");
    this.imgRed = document.getElementById("charactersRed");
    this.facing = 0; //0 - down; 1 - left; 2 - right; 3 - up
    this.frame = 0;

    this.drawPath = false;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.boxCollider = new BoxCollider(15, 15, this);

    this.Start = function(scene) {
        this.playerPos.x = scene.player.transform.position.x+this.tO;
        this.playerPos.y = scene.player.transform.position.y+this.tO;
        this.path = createPath(this,scene.player,scene);
    }

    this.onCollide = function(scene, collider) {
        if(collider.type == "StaticProp") {
            collider.onCollide(scene, this);
            return true;
        }
        if(collider.type == "Enemy") {
            //return true;

        }
        if(collider.type == "Attack") {
            this.getHit(collider);
        }
    }

    this.Update = function(scene) {
        if(!this.active && Math.abs(this.transform.position.x - scene.player.transform.position.x) < this.activationRange && Math.abs(this.transform.position.y - scene.player.transform.position.y) < this.activationRange && rayCast(scene,this,scene.player)) {
            this.refreshPath(scene);
            this.active = true;
        }

        if(this.transform.position.y < scene.player.transform.position.y) this.layer = 2;
        else this.layer = 0;

        // Checks if enemy is dead
        if (this.health <= 0) {
          this.die(scene,1*16,2*16);
        }

        if(!this.knockBack) {
            if(this.active) {
                this.frame += scene.deltaTime*0.01;
                this.frame = this.frame % 3;
                this.Move(this.path[this.n],scene);
                this.setFacing();
            }
        }
        else {

            this.prevX = this.transform.position.x;
            this.prevY = this.transform.position.y;

            this.transform.position.y = lerp2(this.transform.position.y, this.kbPos.y, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.y = this.prevY;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 300);
                }
            }
            this.transform.position.x = lerp2(this.transform.position.x, this.kbPos.x, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.x = this.prevX;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 300);
                }
            }

            if(Math.abs(this.transform.position.x - this.kbPos.x) < 1 && Math.abs(this.transform.position.y - this.kbPos.y) < 1) {
                this.knockBack = false;
                this.refreshPath(scene);
            }
        }
    }
    this.Draw = function(scene) {
        if(this.drawPath) {
            ctx.fillStyle = "white";
            for(var i = 0; i < this.path.length; i++) {
                ctx.globalAlpha = 0.2;
                ctx.fillRect(Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16 - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
                ctx.globalAlpha = 1.0;
                ctx.fillText(i, Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16+8 - scene.Camera.transform.position.y + scene.Camera.offset.y));
            }
            ctx.globalAlpha = 1.0;
        }


        ctx.fillStyle = "green";
        if(this.knockBack) ctx.drawImage(this.imgRed,  (Math.floor(this.frame)*16),4*16 + this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        else ctx.drawImage(this.img,  (Math.floor(this.frame)*16),4*16 + this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        if(this.drawHealth && this.health < 100) {
          ctx.fillStyle = "#000";
          ctx.fillRect(Math.floor((this.transform.position.x - 1) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+15) - scene.Camera.transform.position.y + scene.Camera.offset.y),(112)/6,5);
          ctx.fillStyle = "red";
          ctx.fillRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),this.health/6,2.5);
        }
    }
}

Skeleton.prototype = new Enemy();
Skeleton.prototype.constructor = Skeleton;
function Skeleton(x,y) {

    this.type = "Enemy";
    this.transform = new Transform();
    this.layer = 1;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.active = false;
    this.activationRange = 7*16;

    this.isDead = false;
    this.health = 100;

    this.drawHealth = true;

    this.smoothMove = true;
    //DONT SET SPEED HIGHER THAN 1.0
    if(this.smoothMove) this.speed = 0.8;
    else this.speed = 0.1; //getRandomArbitrary(0.07, 0.1);

    this.damage = 10;
    //this.img = document.getElementById("chest");
    this.path;
    this.n = 0;
    this.playerPos = new Vector2();
    this.playerPos.x;
    this.playerPos.y;
    this.prevX = this.transform.position.x;
    this.prevY = this.transform.position.y;
    this.tO = 8;

    this.knockBack = false;
    this.resetingKB = false;
    this.kbPos = new Vector2();

    this.img = document.getElementById("characters");
    this.imgRed = document.getElementById("charactersRed");
    this.facing = 0; //0 - down; 1 - left; 2 - right; 3 - up
    this.frame = 0;

    this.drawPath = false;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.boxCollider = new BoxCollider(15, 15, this);
    this.atkRange = 12*16;
    this.canAttack = true;
    this.moving = true;

    this.Start = function(scene) {
        this.playerPos.x = scene.player.transform.position.x+this.tO;
        this.playerPos.y = scene.player.transform.position.y+this.tO;
        this.path = createPath(this,scene.player,scene);
    }

    this.onCollide = function(scene, collider) {
        if(collider.type == "StaticProp") {
            collider.onCollide(scene, this);
            return true;
        }
        if(collider.type == "Enemy") {
            //return true;

        }
        if(collider.type == "Attack") {
            if(collider.parent != this) this.getHit(collider);
        }
    }

    this.resetAtk = function() {
        this.canAttack = true;
        this.refreshPath(Scene);
    }

    this.Update = function(scene) {
        if(!this.active && Math.abs(this.transform.position.x - scene.player.transform.position.x) < this.activationRange && Math.abs(this.transform.position.y - scene.player.transform.position.y) < this.activationRange && rayCast(scene,this,scene.player)) {
            this.active = true;

        }

        if(this.transform.position.y < scene.player.transform.position.y) this.layer = 2;
        else this.layer = 0;

        // Checks if enemy is dead
        if (this.health <= 0) {
          this.die(scene, 0, 2*16);
        }

        if(!this.knockBack) {
            if(this.active) {
                if(this.moving) {
                    this.frame += scene.deltaTime*0.01;
                    this.frame = this.frame % 3;
                }
                else this.frame = 1;

                if(Math.abs(this.transform.position.x - scene.player.transform.position.x) > this.atkRange || Math.abs(this.transform.position.y - scene.player.transform.position.y) > this.atkRange || !rayCast(scene,this,scene.player)) {
                    this.Move(this.path[this.n],scene);
                    this.setFacing();
                    if(!this.moving) this.moving = true;
                }
                else{
                    this.moving = false;
                    this.setIdleFacing(scene);
                }


                if(Math.abs(this.transform.position.x - scene.player.transform.position.x) < this.atkRange && Math.abs(this.transform.position.y - scene.player.transform.position.y) < this.atkRange && rayCast(scene,this,scene.player) && this.canAttack) {
                    this.setIdleFacing(scene);
                    scene.GameObjects.push(new Arrow(this, this.facing, this.transform.position,10, scene.player));
                    this.canAttack = false;
                    setTimeout(this.resetAtk.bind(this), 2000);
                }
            }
        }
        else {

            this.prevX = this.transform.position.x;
            this.prevY = this.transform.position.y;

            this.transform.position.y = lerp2(this.transform.position.y, this.kbPos.y, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.y = this.prevY;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 300);
                }
            }
            this.transform.position.x = lerp2(this.transform.position.x, this.kbPos.x, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.x = this.prevX;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 300);
                }
            }

            if(Math.abs(this.transform.position.x - this.kbPos.x) < 1 && Math.abs(this.transform.position.y - this.kbPos.y) < 1) {
                this.knockBack = false;
                this.refreshPath(scene);
            }
        }
    }
    this.Draw = function(scene) {
        if(this.drawPath) {
            ctx.fillStyle = "white";
            for(var i = 0; i < this.path.length; i++) {
                ctx.globalAlpha = 0.2;
                ctx.fillRect(Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16 - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
                ctx.globalAlpha = 1.0;
                ctx.fillText(i, Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16+8 - scene.Camera.transform.position.y + scene.Camera.offset.y));
            }
            ctx.globalAlpha = 1.0;
        }


        ctx.fillStyle = "green";
        if(this.knockBack) ctx.drawImage(this.imgRed,  (Math.floor(this.frame)*16) + 9*16, this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        else ctx.drawImage(this.img,  (Math.floor(this.frame)*16) + 9*16, this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        if(this.drawHealth && this.health < 100) {
          ctx.fillStyle = "#000";
          ctx.fillRect(Math.floor((this.transform.position.x - 1) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+15) - scene.Camera.transform.position.y + scene.Camera.offset.y),(112)/6,5);
          ctx.fillStyle = "red";
          ctx.fillRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),this.health/6,2.5);
        }
    }
}

function Arrow(parent,dir,pos,damage,target) {
    this.transform = new Transform();
    this.parent = parent;
    this.tPos = new Vector2();
    this.tPos.x = target.transform.position.x;
    this.tPos.y = target.transform.position.y;
    this.isDead = false;
    this.type = "Attack";
    this.img = document.getElementById("arrow");
    this.boxCollider = new BoxCollider(15,15,this);
    this.boxPos = new Vector2();
    this.damage = damage;
    //this.arrowOffset = 32;
    var tileSize = 16;

    this.onCollide = function(scene, collider) {
        if(collider.type == "Enemy" && collider != parent) {
            collider.getHit(this);

        }
        this.isDead = true;

    }

    if (dir == 3) {
        this.transform.position.x = pos.x;
        this.transform.position.y = pos.y - tileSize;
        //this.tPos.y -= 32;
    }

    if (dir == 0) {
        this.transform.position.x = pos.x;
        this.transform.position.y = pos.y + tileSize;
        //this.tPos.y += 32;
    }

    if (dir == 1) {
        this.transform.position.x = pos.x - tileSize;
        this.transform.position.y = pos.y;
        //this.tPos.x -= 32;
    }

    if (dir == 2) {
        this.transform.position.x = pos.x + tileSize;
        this.transform.position.y = pos.y;
        //this.tPos.y += 32;
    }

    this.Start = function(scene) {

    }
    this.Update = function(scene) {
        this.transform.position = lerp(this.transform.position, this.tPos, 0.05);
        if(this.boxCollider.checkCollision(Scene, this.transform.position)) {
            this.isDead = true;
        }
        if(Math.abs(this.transform.position.x - this.tPos.x) < 1 && Math.abs(this.transform.position.y - this.tPos.y) < 1) {
            this.isDead = true;
        }
    }
    this.Draw = function(scene) {
        ctx.drawImage(this.img, dir*16, 0, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
    }
}

function Slash(parent,dir,pos,damage,target) {
    this.transform = new Transform();
    this.parent = parent;
    this.tPos = new Vector2();
    this.noTarget = true;
    if(typeof target != 'undefined') {
        this.tPos.x = target.transform.position.x;
        this.tPos.y = target.transform.position.y;
        this.noTarget = false;
    }
    this.isDead = false;
    this.type = "Attack";
    this.img = document.getElementById("slash");
    this.boxCollider = new BoxCollider(15,15,this);
    this.boxPos = new Vector2();
    this.damage = damage;
    //this.arrowOffset = 32;
    var tileSize = 16;

    this.onCollide = function(scene, collider) {
        if(collider instanceof Boss) {
            return false;
        }
        else if(collider.type == "Enemy") {
            collider.getHit(this);

        }
        this.isDead = true;

    }

    if (dir == 3) {
        this.transform.position.x = pos.x;
        this.transform.position.y = pos.y - tileSize;
        if(this.noTarget) {
            this.tPos.x = pos.x;
            this.tPos.y = pos.y - 8*16;
            //this.tPos.y -= 32;
        }

    }

    if (dir == 0) {
        this.transform.position.x = pos.x;
        this.transform.position.y = pos.y + tileSize;
        if(this.noTarget) {
            this.tPos.x = pos.x;
            this.tPos.y = pos.y + 8*16;
            //this.tPos.y += 32;
        }
    }

    if (dir == 1) {
        this.transform.position.x = pos.x - tileSize;
        this.transform.position.y = pos.y;
        if(this.noTarget) {
            this.tPos.x = pos.x - 8*16;
            this.tPos.y = pos.y;
            //this.tPos.x -= 32;
        }
    }

    if (dir == 2) {
        this.transform.position.x = pos.x + tileSize;
        this.transform.position.y = pos.y;
        if(this.noTarget) {
            this.tPos.x = pos.x + 8*16;
            this.tPos.y = pos.y;
            //this.tPos.y += 32;
        }
    }

    this.Start = function(scene) {

    }
    this.Update = function(scene) {
        this.transform.position = lerp(this.transform.position, this.tPos, 0.07);
        if(this.boxCollider.checkCollision(scene, this.transform.position)) {
            this.isDead = true;
        }
        if(Math.abs(this.transform.position.x - this.tPos.x) < 1 && Math.abs(this.transform.position.y - this.tPos.y) < 1) {
            this.isDead = true;
        }
    }
    this.Draw = function(scene) {
        ctx.drawImage(this.img, dir*16, 0, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
    }
}

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;
function Boss(x,y) {

    this.type = "Enemy";
    this.transform = new Transform();
    this.layer = 1;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.active = false;
    this.activationRange = 7*16;

    this.isDead = false;
    this.health = 300;

    this.drawHealth = true;

    this.smoothMove = true;
    //DONT SET SPEED HIGHER THAN 1.0
    if(this.smoothMove) this.speed = 1.0;
    else this.speed = 0.1; //getRandomArbitrary(0.07, 0.1);

    this.damage = 10;
    //this.img = document.getElementById("chest");
    this.path;
    this.n = 0;
    this.playerPos = new Vector2();
    this.playerPos.x;
    this.playerPos.y;
    this.prevX = this.transform.position.x;
    this.prevY = this.transform.position.y;
    this.tO = 8;

    this.knockBack = false;
    this.resetingKB = false;
    this.kbPos = new Vector2();

    this.img = document.getElementById("characters");
    this.imgRed = document.getElementById("charactersRed");
    this.imgWep = document.getElementById("weaponboss");
    this.facing = 0; //0 - down; 1 - left; 2 - right; 3 - up
    this.frame = 0;

    this.drawPath = false;

    this.transform.position.x = x;
    this.transform.position.y = y;
    this.boxCollider = new BoxCollider(15, 15, this);

    this.atkRange = 12*16;
    this.atkSpeed = 2000; //milliseconds
    this.canAttack = true;
    this.moving = true;

    this.slash = false;
    this.atkframe = 0;

    this.phasestart = 100;
    this.phase2 = false;
    this.hcheck1 = false;
    this.hcheck2 = false;

    this.teleporting = false;
    //Boss teleporting points
    this.point1 = new Vector2();
    this.point1.x = 13*16;
    this.point1.y = 7*16;
    this.point2 = new Vector2();
    this.point2.x = 14*16;
    this.point2.y = 18*16;
    this.reverse = false;

    this.Start = function(scene) {
        this.playerPos.x = scene.player.transform.position.x+this.tO;
        this.playerPos.y = scene.player.transform.position.y+this.tO;
        this.path = createPath(this,scene.player,scene);
    }

    this.onCollide = function(scene, collider) {
        if(collider.type == "StaticProp") {
            collider.onCollide(scene, this);
            return true;
        }
        if(collider.type == "Enemy") {
            //return true;

        }
        if(collider.type == "Attack" && !(collider instanceof Slash) && !this.teleporting) {
            this.getHit(collider);
        }
    }

    this.resetAtk = function() {
        this.canAttack = true;
        this.refreshPath(Scene);
    }

    this.teleport = function() {

        if(this.teleporting == false) {
            this.teleporting = true;
            this.frame = 0;
        }

        if(!this.reverse) {
            this.frame += 0.2;
        }
        else this.frame -= 0.2;

        if(this.frame  > 3) {
            this.frame = 3;
            this.jump();
            this.refreshPath(Scene);
            this.reverse = true;
        }
        if(this.frame < 0 && this.reverse) {
            this.frame = 0;
            this.reverse = false;
            this.teleporting = false;
        }

    }

    this.jump = function() {
        var x1 = Math.abs(this.transform.position.x - this.point1.x);
        var x2 = Math.abs(this.transform.position.x - this.point2.x);
        var y1 = Math.abs(this.transform.position.y - this.point1.y);
        var y2 = Math.abs(this.transform.position.y - this.point2.y);
        if((x1 + y1) > (x2 + y2)) {
            this.transform.position.x = this.point1.x;
            this.transform.position.y = this.point1.y;
        }

        else {
            this.transform.position.x = this.point2.x;
            this.transform.position.y = this.point2.y;
        }

    }

    this.Update = function(scene) {
        if(!this.active && Math.abs(this.transform.position.x - scene.player.transform.position.x) < this.activationRange && Math.abs(this.transform.position.y - scene.player.transform.position.y) < this.activationRange && rayCast(scene,this,scene.player)) {
            this.active = true;
            scene.drawBossHealth = true;
            scene.SpawnBarriers();
            scene.playMusic("music-boss");
        }

        if(this.transform.position.y < scene.player.transform.position.y) this.layer = 2;
        else this.layer = 0;

        if(this.health < 200) {
            if(!this.hcheck1) {
                this.hcheck1 = true;
                if(!this.teleporting) {
                   this.resetKnockBack();
                   this.teleport();
                }
                this.atkSpeed = 800;
            }

        }
        if(this.health < 150) {
            if(!this.hcheck2) {
                this.hcheck2 = true;
                if(!this.teleporting) {
                    this.resetKnockBack();
                    this.teleport();
                }
                this.atkSpeed = 600;
            }

        }

        if(this.health < this.phasestart) {
                        this.phase2 = true;
                        this.phasestart = 1000;

                    }

        // Checks if enemy is dead
        if (this.health <= 0) {
          this.die(scene,2*16,3*16);
          scene.win = true;
          setTimeout(scene.resetWin.bind(this), 5000);
          setTimeout(this.resetKnockBack.bind(this), 200);
          scene.DeleteBarriers();
          scene.playMusic("music-savepoint");
        }

        if(!this.knockBack && !this.teleporting) {
            if(this.active) {
                if(this.phase2) {
                    if(this.atkframe == 0) scene.playSound("swingSound");
                    this.atkframe += 0.3;
                    this.facing++;
                    if(this.facing > 3) this.facing = 0;
                    if(this.atkframe > 3) {
                        this.atkframe = 0;
                        this.canAttack = true;
                        //this.slash = false;
                        //scene.GameObjects.push(new Slash(this, this.facing, this.transform.position,10, scene.player));
                        //this.canAttack = false;
                        //if(this.health < 400) this.atkSpeed = 1000;
                        //setTimeout(this.resetAtk.bind(this), this.atkSpeed);
                    }
                    this.Move(this.path[this.n],scene);
                    if(this.canAttack) {
                        scene.GameObjects.push(new Slash(this,this.facing,this.transform.position,10));
                        this.canAttack = false;
                    }
                }
                if(!this.phase2){
                    if(this.moving) {
                        this.frame += scene.deltaTime*0.01;
                        this.frame = this.frame % 3;
                    }
                    else this.frame = 1;

                    if(Math.abs(this.transform.position.x - scene.player.transform.position.x) > this.atkRange || Math.abs(this.transform.position.y - scene.player.transform.position.y) > this.atkRange || !rayCast(scene,this,scene.player)) {
                        this.Move(this.path[this.n],scene);
                        this.setFacing();
                        if(!this.moving) this.moving = true;
                    }
                    else{
                        this.moving = false;
                        this.setIdleFacing(scene);
                    }


                    if(Math.abs(this.transform.position.x - scene.player.transform.position.x) < this.atkRange && Math.abs(this.transform.position.y - scene.player.transform.position.y) < this.atkRange && rayCast(scene,this,scene.player) && this.canAttack) {
                        this.setIdleFacing(scene);
                        this.slash = true;



                    }

                    if(this.slash) {
                        if(this.atkframe == 0) scene.playSound("swingSound");
                        this.atkframe += 0.3;
                        // Damage is now 20
                        if(this.atkframe > 3) {
                            this.slash = false;
                            scene.GameObjects.push(new Slash(this, this.facing, this.transform.position,10, scene.player));
                            this.canAttack = false;
                            setTimeout(this.resetAtk.bind(this), this.atkSpeed);
                        }

                    }
                    else this.atkframe = 0.0;



                }

            }
        }

        else if(this.teleporting) {
            this.teleport();
        }

        else if(this.knockBack) {

            this.prevX = this.transform.position.x;
            this.prevY = this.transform.position.y;

            this.transform.position.y = lerp2(this.transform.position.y, this.kbPos.y, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.y = this.prevY;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 200);
                    if(!this.phase2) setTimeout(this.teleport.bind(this), 200);

                }
            }
            this.transform.position.x = lerp2(this.transform.position.x, this.kbPos.x, 0.1);
            if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                this.transform.position.x = this.prevX;
                if(!this.resetingKB) {
                    this.resetingKB = true;
                    setTimeout(this.resetKnockBack.bind(this), 200);
                    if(!this.phase2) setTimeout(this.teleport.bind(this), 200);
                }
            }

            if(Math.abs(this.transform.position.x - this.kbPos.x) < 1 && Math.abs(this.transform.position.y - this.kbPos.y) < 1) {
                this.knockBack = false;
                this.refreshPath(scene);
            }
        }
    }

    this.Draw = function(scene) {
        if(this.drawPath) {
            ctx.fillStyle = "white";
            for(var i = 0; i < this.path.length; i++) {
                ctx.globalAlpha = 0.2;
                ctx.fillRect(Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16 - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
                ctx.globalAlpha = 1.0;
                ctx.fillText(i, Math.floor(this.path[i].tile.x*16 - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.path[i].tile.y*16+8 - scene.Camera.transform.position.y + scene.Camera.offset.y));
            }
            ctx.globalAlpha = 1.0;
        }


        ctx.fillStyle = "green";
        if(this.teleporting) {
            ctx.drawImage(this.imgWep, (Math.floor(this.frame)*16),4*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        }
        else if(this.knockBack) ctx.drawImage(this.imgRed, 9*16 + (Math.floor(this.frame)*16),4*16 + this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
        else if(this.phase2) {
            if (this.facing == 3) {
                ctx.drawImage(this.imgWep, (Math.floor(2)*16), this.facing*16-16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 0) {
                ctx.drawImage(this.imgWep, (Math.floor(2)*16), this.facing*16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 1) {
                ctx.drawImage(this.imgWep, 3*16 + (Math.floor(2)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 2) {
                 ctx.drawImage(this.imgWep, 3*16 + (Math.floor(2)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x+16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }
        }
        else if(this.slash) {
            if (this.facing == 3) {
                ctx.drawImage(this.imgWep, (Math.floor(this.atkframe)*16), this.facing*16-16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 0) {
                ctx.drawImage(this.imgWep, (Math.floor(this.atkframe)*16), this.facing*16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 1) {
                ctx.drawImage(this.imgWep, 3*16 + (Math.floor(this.atkframe)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 2) {
                 ctx.drawImage(this.imgWep, 3*16 + (Math.floor(this.atkframe)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x+16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }
        }
        else ctx.drawImage(this.img, 9*16 + (Math.floor(this.frame)*16),4*16 + this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
    }

}

function DeadObject(pos,imgPosX,imgPosY) {
    this.transform = new Transform();
    this.transform.position.x = pos.x;
    this.transform.position.y = pos.y;
    this.img = document.getElementById("dead");
    this.Start = function(scene) {

    }
    this.Update = function(scene) {

    }
    this.Draw = function(scene) {
        ctx.drawImage(this.img, imgPosX, imgPosY, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
    }
}

function StaticProp(buffer, x, y) {
	this.transform = new Transform();
	this.type = "StaticProp";
	this.boxCollider = new BoxCollider(16, 16, this);
	this.transform.position.x = x;
	this.transform.position.y = y;

	this.offset = new Vector2();
	this.offset.x = 0;
	this.offset.y = -16;
	this.img = buffer;

	this.onCollide = function(scene, collider) {

		return true;
	}

	this.Start = function(scene) {


	}

	this.Update = function(scene) {


	}

	this.Draw = function(scene) {
		ctx.drawImage(this.img, 0, 0, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);


	}


}

function Chest(x, y) {
	this.type = "Chest";
	this.transform = new Transform();
	this.boxCollider = new BoxCollider(16, 16, this);
	this.transform.position.x = x;
	this.transform.position.y = y;
	this.img = document.getElementById("chest");

	this.Inventory = [];

	this.isOpen = 0;

	this.onCollide = function(scene, collider) {
		//this.isOpen = 1;

	}

	this.Start = function(scene) {


	}

	this.Update = function(scene) {


	}

	this.Draw = function(scene) {


		/*
		ctx.fillRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x - (16/2)),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y - (16/2)),16,16);
		*/


		ctx.drawImage(this.img, this.isOpen * 16, 0, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);


	}


}

function Door(x, y) {
	this.type = "Door";

}

function Swing(parent, dir,pos,damage, tSize, ignorePlayer) {
  this.type = "Attack";
  var tileSize = tSize;
  this.parent = parent;
  this.boxCollider = new BoxCollider(16,16,this);
  this.boxCollider.isTrigger = true;
  this.boxCollider.ignorePlayer = ignorePlayer;
  this.transform = new Transform();
  this.damage = damage;

  this.onCollide = function(scene, collider) {
    if(this.parent instanceof Player) {
        if(collider.type == "Enemy") {
            collider.onCollide(scene, this);
        }
    }
    else if(collider.type == "Player") {
            collider.onCollide(scene, this);
        }

    /*if(collider.type == "Attack") {
        collider.onCollide(scene, this);
    }*/
  }

  if (dir == 3) {
    this.transform.position.x = pos.x;
    this.transform.position.y = pos.y - tileSize;
  }

  if (dir == 0) {
    this.transform.position.x = pos.x;
    this.transform.position.y = pos.y + tileSize;
  }

  if (dir == 1) {
    this.transform.position.x = pos.x - tileSize;
    this.transform.position.y = pos.y;
  }

  if (dir == 2) {
    this.transform.position.x = pos.x + tileSize;
    this.transform.position.y = pos.y;
  }

  /*if (dir == "up left") {
    this.boxPos.x = pos.x - tileSize;
    this.boxPos.y = pos.y - tileSize;
  }

  if (dir == "up right") {
    this.boxPos.x = pos.x + tileSize;
    this.boxPos.y = pos.y - tileSize;
  }

  if (dir == "down left") {
    this.boxPos.x = pos.x - tileSize;
    this.boxPos.y = pos.y + tileSize;
  }

  if (dir == "down right") {
    this.boxPos.x = pos.x + tileSize;
    this.boxPos.y = pos.y + tileSize;
  }*/

  this.boxCollider.checkCollision(Scene, this.transform.position);



}

function Player() {
	this.transform = new Transform();
	this.type = "Player";
    this.layer = 1;
	this.boxCollider = new BoxCollider(14, 14, this);
	this.transform.position.x = 7*16;
	this.transform.position.y = 13*16;

	this.speed = .1;

	this.health = 100;
	this.img = document.getElementById("characters");
	this.imgRed = document.getElementById("charactersRed");
	this.imgWhite = document.getElementById("charactersWhite");
    this.imgWep = document.getElementById("weapon");
    this.imgDead = document.getElementById("dead");
	this.facing = 0; //0 - down; 1 - left; 2 - right; 3 - up
	this.frame = 0;

	this.prevX = 0;
	this.prevY = 0;

	this.knockBack = false;
	this.kbPos = new Vector2();

	this.invuln = false;
	this.flash = false;
	this.flashing = false;
	this.flashSpeed = 150; //milliseconds

    this.atkframe = 0;
    this.canAttack = true;
    this.attacking = false;

    this.alive = true;
    this.checkSpace = true;

	this.setPos = function(x, y) {

    	this.transform.position.x = x;
    	this.transform.position.y = y;

    }

	this.getHit = function(collider) {
		if(!this.invuln) {
			if(!this.knockBack) {
				this.knockBack = true;
				this.health = this.health - collider.damage;
				this.kbPos.x = this.transform.position.x - ((collider.transform.position.x - this.transform.position.x) * 2);
	            this.kbPos.y = this.transform.position.y - ((collider.transform.position.y - this.transform.position.y) * 2);
			}
		}
	}

    this.die = function() {
        this.knockBack = false;
        this.invuln = false;
        this.attacking = false;
        this.alive = false;
    }

    this.resetKnockBack = function() {
        this.knockBack = false;
        this.resetingKB = false;
        this.invuln = true;
        setTimeout(this.resetInvuln.bind(this), 1000);
    }

	this.resetInvuln = function() {
		this.invuln = false;
	}

    this.resetAtk = function() {
        this.checkSpace = true;
    }

	this.setFlash = function() {
		if(this.flash) {
            this.flash = false;
        }
        else {this.flash = true;}
        if(this.invuln) setTimeout(this.setFlash.bind(this), this.flashSpeed);
        else this.flashing = false;
	}


	this.setPosition = function(x, y) {
	    //console.log("here!");
		this.transform.position.x = x;
		this.transform.position.y = y;
		this.prevX = x;
		this.prevY = y;

		Scene.Camera.transform.position.x = x;
		Scene.Camera.transform.position.y = y;
	}


	this.onCollide = function(scene, collider) {
		if(collider.type) {
			if(collider.type == "StaticProp") {
				collider.onCollide(scene, this);
                return true;
			}
			if(collider.type == "Chest") {
				collider.isOpen = 1;
				return true;
			}
			if(collider.type == "Enemy") {
				this.getHit(collider);
			}
            if(collider.type == "Attack") {
                this.getHit(collider);
            }
		}
	}

	this.Start = function(scene) {


	}

	this.Update = function(scene) {
        //console.log("Player position: (" + this.transform.position.x + ", " + this.transform.position.y + ")");
        //console.log("Player tile: (" + Math.floor(this.transform.position.x/16) + ", " + Math.floor(this.transform.position.y/16) + ")");

        scene.Camera.transform.position = lerp(scene.Camera.transform.position, this.transform.position, scene.deltaTime*0.004);

        //Store previous values of X and Y (for collisions)
        this.prevX = this.transform.position.x;
        this.prevY = this.transform.position.y;

        if(this.health <= 0) {
            this.die();
        }

        if(this.alive) {

            //KnockBack
            if(this.knockBack) {
                this.transform.position.y = lerp2(this.transform.position.y, this.kbPos.y, this.speed);
                if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                    this.transform.position.y = this.prevY;
                    if(!this.resetingKB) {
                        this.resetingKB = true;
                        setTimeout(this.resetKnockBack.bind(this), 300);
                    }
                }
                this.transform.position.x = lerp2(this.transform.position.x, this.kbPos.x, this.speed);
                if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                    this.transform.position.x = this.prevX;
                    if(!this.resetingKB) {
                        this.resetingKB = true;
                        setTimeout(this.resetKnockBack.bind(this), 300);
                    }

                }

                if(Math.abs(this.transform.position.x - this.kbPos.x) < 1 && Math.abs(this.transform.position.y - this.kbPos.y) < 1) {
                    this.knockBack = false;
                    this.invuln = true;
                    setTimeout(this.resetInvuln.bind(this), 1000);
                }
            }

            //Move Normaally
            else if(!this.attacking) {

                if(input.w || input.s || input.a || input.d) {

                    this.frame += scene.deltaTime*0.01;
                    this.frame = this.frame % 3;

                }
                //Return to standing position if idle
                else {
                    this.frame = 1;
                }


                if(input.w || input.s) {
                    if(input.w) {
                        this.transform.position.y -= (scene.deltaTime * this.speed);
                        this.facing = 3; //Up



                    }


                    if(input.s) {
                        this.transform.position.y += (scene.deltaTime * this.speed);
                        this.facing = 0; //Down

                    }


    				if(this.boxCollider.checkCollision(scene, this.transform.position)) {
    					this.transform.position.y = this.prevY;
                    }

                    /*

                    // Check collisions based on current tile (Scene.tiles[y][x])
                    if(Scene.tiles[Math.floor(this.transform.position.y/16)][Math.floor(this.transform.position.x/16)]) {
                        if(Scene.tiles[Math.floor(this.transform.position.y/16)][Math.floor(this.transform.position.x/16)] == 2) {
                        this.transform.position.y = prevY;

                        }
                    }
                    */



                }




                if(input.a || input.d) {
                    if(input.a) {
                        this.transform.position.x -= (scene.deltaTime * this.speed);
                        this.facing = 1; //Left

                    }

                    if(input.d) {
                        this.transform.position.x += (scene.deltaTime * this.speed);
                        this.facing = 2; //Right

                    }

                    if(this.boxCollider.checkCollision(scene, this.transform.position)) {
                        this.transform.position.x = this.prevX;
                    }

                    /*

                    // Check collisions based on current tile (Scene.tiles[y][x])
                    if(Scene.tiles[Math.floor(this.transform.position.y/16)][Math.floor(this.transform.position.x/16)]) {
                        if(Scene.tiles[Math.floor(this.transform.position.y/16)][Math.floor(this.transform.position.x/16)] == 2) {
                        this.transform.position.x = prevX;

                        }

                    }

                    */


                }

                //idle collision check
                if(!input.w && !input.s && !input.a && !input.d) {
                    this.boxCollider.checkCollision(scene, this.transform.position)
                }

                if(!this.attacking && !this.canAttack && !input.space) {
                    this.canAttack = true;
                }
                else if(input.space && this.canAttack && this.checkSpace) {
                    this.canAttack = false;
                    this.checkSpace = false;
                    this.atkframe = 0;
                    this.attacking = true;
                    scene.playSound("swingSound");
                }


            }
            else {
                if(this.attacking) {
                    this.atkframe += 0.3;
                    // Damage is now 20
                    if(this.atkframe > 1) {swing = new Swing(this,this.facing, this.transform.position, 20, 11,true);}
                    if(this.atkframe > 3) {
                        this.attacking = false;
                        setTimeout(this.resetAtk.bind(this), 200)
                    }
                }
            }
        }


    }

	this.Draw = function(scene) {
         ctx.fillStyle = "#000000";
         //ctx.fillRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);

         if(!this.alive) {
            ctx.drawImage(this.imgDead, 0, 0, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
         }

         //Draw KnockBack Sprite
         else if(this.knockBack) {
            ctx.drawImage(this.imgRed, (Math.floor(this.frame)*16), this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
         }

         //Draw invulnverable sprite
         else if(this.invuln) {
            if(!this.flashing) {
                this.flashing = true;
                this.flash = true;
                setTimeout(this.setFlash.bind(this), this.flashSpeed);
             }

             if(this.flash) {
                ctx.drawImage(this.imgWhite,  (Math.floor(this.frame)*16), this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
             }
             else ctx.drawImage(this.img,  (Math.floor(this.frame)*16), this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
         }

         //Draw Normally
         else {
            ctx.drawImage(this.img, (Math.floor(this.frame)*16), this.facing*16, 16, 16, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 16);
         }

        if(this.attacking) {
            ctx.strokeStyle = "red"

            if (this.facing == 3) {
                ctx.drawImage(this.imgWep, (Math.floor(this.atkframe)*16), this.facing*16-16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 0) {
                ctx.drawImage(this.imgWep, (Math.floor(this.atkframe)*16), this.facing*16, 16, 32, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 16, 32);
                //ctx.strokeRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 1) {
                ctx.drawImage(this.imgWep, 3*16 + (Math.floor(this.atkframe)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.facing == 2) {
                 ctx.drawImage(this.imgWep, 3*16 + (Math.floor(this.atkframe)*32), this.facing*16, 32, 16, Math.floor((this.transform.position.x) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y) - scene.Camera.transform.position.y + scene.Camera.offset.y), 32, 16);
                //ctx.strokeRect(Math.floor((this.transform.position.x+16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }


              /*// 4 corner directional cases
              if (this.dir == "up left") {
                ctx.strokeRect(Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.dir == "up right") {
                ctx.strokeRect(Math.floor((this.transform.position.x+16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y-16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.dir == "down left") {
                ctx.strokeRect(Math.floor((this.transform.position.x-16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }

              if (this.dir == "down right") {
                ctx.strokeRect(Math.floor((this.transform.position.x+16) - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor((this.transform.position.y+16) - scene.Camera.transform.position.y + scene.Camera.offset.y),16,16);
              }*/
        }


	}

}


function TileRenderer() {
	this.transform = new Transform();

    this.map = {};
    this.img = document.getElementById("basicTiles");

    this.tileBuffer = document.createElement('canvas');
    this.floatBuffer = document.createElement('canvas');

    this.tileContext = this.tileBuffer.getContext('2d');
    this.floatContext = this.floatBuffer.getContext('2d');

	this.loadMap = function(filename, scene) {

		scene.GameObjects = []; //Clear array
        scene.drawBossHealth = false;
		scene.GameObjects.push(this); //Push this tile renderer back into the list
		scene.GameObjects.push(scene.player); //Push player back into the list
        scene.win = false;



        this.tileBuffer = document.createElement('canvas');
        this.floatBuffer = document.createElement('canvas');
        this.tileContext = this.tileBuffer.getContext('2d');
        this.floatContext = this.floatBuffer.getContext('2d');

        $.ajaxSetup({async: false});

        console.log("before map load");
        var mapData = {};

		$.get('maps/' + filename + '.json', function(data) {
			mapData = data;
			console.log("during map load");


        });

        console.log("after map load");

		this.map = mapData;

        //For Joey
        if(typeof this.map.layers == 'undefined') {
            console.log("parsing JSON");
            this.map = JSON.parse(mapData);
        }

        this.img = document.getElementById("basicTiles");


        this.tileBuffer.width = this.map.width * 16;
        this.tileBuffer.height = this.map.height * 16;

        this.floatBuffer.width = this.map.width * 16;
        this.floatBuffer.height = this.map.height * 16;
        scene.player.resetKnockBack();
        for(var i = 0; i < this.map.layers.length; i++) {

                if(this.map.layers[i].type == "tilelayer") {

                    for(var y = 0; y < this.map.height; y++) {

                        for(var x = 0; x < this.map.width; x++) {

                            var tileID = this.map.layers[i].data[x + this.map.width*y] - 1;

                            var tX = tileID % 8;
                            var tY = Math.floor(tileID / 8);


                            if(this.map.layers[i].properties && this.map.layers[i].properties.abovePlayer == true) {

                            	this.floatContext.drawImage(this.img, tX * 16, tY * 16, this.map.tilewidth, this.map.tileheight, x*16, y*16, this.map.tilewidth, this.map.tileheight);

                            } else {

                            	this.tileContext.drawImage(this.img, tX * 16, tY * 16, this.map.tilewidth, this.map.tileheight, x*16, y*16, this.map.tilewidth, this.map.tileheight);

                            }



                        }

                    }


                } else if(this.map.layers[i].type == "objectgroup") {

                    for(var o = 0; o < this.map.layers[i].objects.length; o++) {

                        var gID = this.map.layers[i].objects[o].gid - 1;

                        var tX = gID % 8;
                        var tY = Math.floor(gID / 8);

                        var imgBuffer = document.createElement('canvas');
                        var imgCtx = imgBuffer.getContext('2d');

                        imgCtx.drawImage(this.img, tX * 16, tY * 16, 16, 16, 0, 0, 16, 16);

                        if(this.map.layers[i].objects[o].type == "Slime") {
                        	scene.GameObjects.push(new Slime(this.map.layers[i].objects[o].x,this.map.layers[i].objects[o].y));
                            scene.GameObjects[Scene.GameObjects.length-1].Start(scene);


                        }
                        else if(this.map.layers[i].objects[o].type == "Skeleton") {
                            scene.GameObjects.push(new Skeleton(this.map.layers[i].objects[o].x,this.map.layers[i].objects[o].y));
                            scene.GameObjects[Scene.GameObjects.length-1].Start(scene);
                        }
                        else if(this.map.layers[i].objects[o].type == "Boss") {
                            scene.boss = new Boss(this.map.layers[i].objects[o].x,this.map.layers[i].objects[o].y);
                            scene.GameObjects.push(scene.boss);
                            scene.GameObjects[Scene.GameObjects.length-1].Start(scene);
                            scene.barPos = scene.boss.health;
                        } else {
                        	var prop = new StaticProp(imgBuffer, this.map.layers[i].objects[o].x, this.map.layers[i].objects[o].y);

						prop.onCollide = new Function("scene", "return true;");


						if(this.map.layers[i].objects[o].properties) {
							if(this.map.layers[i].objects[o].properties.onCollide) {
								prop.onCollide = new Function("scene", this.map.layers[i].objects[o].properties.onCollide + "return true;");


                            }



                        }

                        scene.GameObjects.push(prop);

                        }





                    }


                }


            }

            if(this.map.properties) {

            	if(this.map.properties.backgroundMusic) {
            		Scene.playMusic(this.map.properties.backgroundMusic);

            	}
            }



        /*

            $.get('/maps/testMap.json', function(data) {
                this.tileBuffer = document.createElement('canvas');
                this.tileContext = this.tileBuffer.getContext('2d');
                this.img = document.getElementById("basicTiles");

                this.map = data;


                this.tileBuffer.width = this.map.width * this.map.tilewidth;
            this.tileBuffer.height = this.map.height * this.map.tileheight;

            for(var i = 0; i < this.map.layers.length; i++) {

                if(this.map.layers[i].type == "tilelayer") {

                    for(var y = 0; y < this.map.height; y++) {

                        for(var x = 0; x < this.map.width; x++) {

                            var tileID = this.map.layers[i].data[x + this.map.width*y] - 1;

                            var tX = tileID % 8;
                            var tY = tileID / 8;

                            this.tileContext.drawImage(this.img, tX * 16, tY * 16, this.map.tilewidth, this.map.tileheight, this.map.tilewidth, this.map.tileheight, this.map.tilewidth, this.map.tileheight);


                        }

                    }


                }


            }

            });
            */


	}


	this.Start = function(scene) {

		this.loadMap("testMap", scene);


    }

    this.Update = function(scene) {



    }

    this.Draw = function(scene) {


        ctx.drawImage(this.tileBuffer, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y + 16), this.map.width*this.map.tilewidth, this.map.height*this.map.tileheight);
    }

    this.DrawTopLayer = function(scene) {

    	ctx.drawImage(this.floatBuffer, Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y + 16), this.map.width*this.map.tilewidth, this.map.height*this.map.tileheight);


    }



}



function Camera() {
	this.transform = new Transform();

	this.offset = new Vector2();

	this.offset.x = 320/2;
	this.offset.y = 240/2;

	this.Start = function(scene) {


	}


	this.Update = function(scene) {


	}

	this.Draw = function(scene) {



	}



}




function Scene() {
    this.GameObjects = [];
    this.deltaTime = 0.0;
    this.Camera = new Camera();

    this.tileBuffer = document.createElement('canvas');
    this.tileBuffer.width = 1024;
    this.tileBuffer.height = 1024;
    this.tileContext = this.tileBuffer.getContext('2d');

    this.tileRenderer = new TileRenderer();
    this.player = new Player();
    this.pBarPos = this.player.health;
    this.layers = 2; //includes 0

    this.drawBossHealth = false;
    this.barlength = 0;
    this.barPos;
    this.win = false;

    this.barriers = [];

    this.cheat = false;

    //Barriers for boss room
    this.SpawnBarriers = function() {
        var imgBuffer = document.getElementById("barrier");
        this.barriers.push(new StaticProp(imgBuffer, 7*16, 13*16));
        this.barriers.push(new StaticProp(imgBuffer, 7*16, 14*16));
        this.barriers.push(new StaticProp(imgBuffer, 7*16, 15*16));
        this.barriers.push(new StaticProp(imgBuffer, 7*16, 16*16));
        this.barriers.push(new StaticProp(imgBuffer, 13*16, 29*16));
        this.barriers.push(new StaticProp(imgBuffer, 14*16, 29*16));
        this.barriers.push(new StaticProp(imgBuffer, 15*16, 29*16));
        this.barriers.push(new StaticProp(imgBuffer, 16*16, 29*16));
        this.barriers.push(new StaticProp(imgBuffer, 22*16, 13*16));
        this.barriers.push(new StaticProp(imgBuffer, 22*16, 14*16));
        this.barriers.push(new StaticProp(imgBuffer, 22*16, 15*16));
        this.barriers.push(new StaticProp(imgBuffer, 22*16, 16*16));

        for(var i = 0; i < this.barriers.length; i++) {
            this.GameObjects.push(this.barriers[i]);
        }
    }

    this.DeleteBarriers = function() {
        for(var i = 0; i < this.barriers.length; i++) {
            this.barriers[i].isDead = true;
        }
    }

    this.resetWin = function() {
        this.win = false;
    }

	this.loadMap = function(fileName) {

		this.tileRenderer.loadMap(fileName, this);
	}

    this.drawUI = function() {


        if(this.win) {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "white";
            ctx.font = "30px Pixel";
            ctx.fillText("You Win!", width/5,height/2);
        }
        else if(this.player.health > 0) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#999999";
            ctx.fillRect(9,9,102,10);
            if(this.player.health > 75) ctx.fillStyle = "green";
            else if(this.player.health > 50) ctx.fillStyle = "#bcf442";
            else if(this.player.health > 25) ctx.fillStyle = "#f4f442";
            else ctx.fillStyle = "#f44242";
            ctx.globalAlpha = 1.0;
            if(this.pBarPos == this.player.health) {
                ctx.fillRect(10,10,this.player.health,8);
            }
            else if(this.pBarPos > this.player.health) {
                ctx.fillRect(10,10,this.pBarPos,8);
                this.pBarPos -= 2;
            }
            else {
                ctx.fillRect(10,10,this.pBarPos,8);
                this.pBarPos += 2;
            }

        }
        else {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "white";
            ctx.font = "30px Pixel";
            ctx.fillText("Game Over", width/9,height/2);
            ctx.font = "12px Pixel";
            ctx.fillText("Hit Space to restart", width/5,height/1.5);
        }

        if(this.drawBossHealth) {
            if(this.boss.health > 0) {
                ctx.fillStyle = "red";
                ctx.font = "5px Pixel";
                ctx.fillText("Boss", 35, 215);
                if(this.barlength < 100) {
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = "#999999";
                    ctx.fillRect(34,219,this.barlength*2.5+2,11);
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = "red";
                    ctx.fillRect(35,220,this.barlength*2.5,9);
                    this.barlength++;
                }
                else {
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = "#999999";
                    ctx.fillRect(34,219,100*2.5+2,11);
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = "red";
                    if(this.barPos == this.boss.health) {
                        ctx.fillRect(35,220,this.boss.health/3*2.5,9);
                    }
                    else {
                        ctx.fillRect(35,220,this.barPos/3*2.5,9);
                        this.barPos -= 2;
                    }

                }
            }

        }
    }

    this.playSound = function(soundName) {

    	var element = document.getElementById(soundName);

    	element.currentTime = 0;
    	element.play();
    }

    this.playMusic = function(soundName) {

    	var element = document.getElementById("music");

    	if($("#music").attr("title") != soundName || element.currentTime == 0) {
    		$("#music").attr("title", soundName);
    		element.pause();
			element.currentTime = 0;
    		element.src = "sounds/" + soundName + ".mp3";
    		element.play();
    	}

    }

	this.Start = function() {
        this.GameObjects.push(this.tileRenderer);
        this.player = new Player();
        this.GameObjects.push(this.player);
        //run TileRenderer's Start() before pushing in other objects to prevent them from being wiped from inital loadMap call
        this.tileRenderer.Start(this);

        //-----Add other GameObjects Here-----
        //this.boss = new Boss(9*16,5*16);
        //this.GameObjects.push(this.boss);
        //this.GameObjects.push(new Boss(9*16,5*16));

        //Skips TileRenderer at index 0 since already done above
		for(var i = 1; i < this.GameObjects.length; i++) {
			this.GameObjects[i].Start(this);

		}
	}

	this.Update = function() {
		this.Camera.Update(this);

        for(var i = 0; i < this.GameObjects.length; i++) {
          // Deletes game objcects
          if(this.GameObjects[i].isDead) this.GameObjects.splice(i,1);
           else this.GameObjects[i].Update(this);

        }

        if(!this.player.alive && input.space) {
            location.reload(false);
        }


        this.deltaTime = new Date() - startTime;
        startTime = new Date();

        if(input.arrowKeyLeft && input.arrowKeyRight) {
            if(!this.cheat) {
                this.cheat = true;
                this.loadMap("davies-1");
                this.player.transform.position.x = 14*16;
                this.player.transform.position.y = 27*16;
            }
        }

        if(!input.arrowKeyLeft && !input.arrowKeyRight && this.cheat) {
            this.cheat = false;
        }
    }

    this.Draw = function() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        //Draws objects by layer. Higher layers are farther in the back and lower layers in the front. If no layer specified, draws in highest layer.
        for(var j = this.layers; j >= 0; j--) {
            for(var i = 0; i < this.GameObjects.length; i++) {
                if(this.GameObjects[i].hasOwnProperty("layer")) {
                    if(this.GameObjects[i].layer == j) {
                        this.GameObjects[i].Draw(this);
                    }
                }
                else if(j == this.layers) {this.GameObjects[i].Draw(this);}
            }
        }

        this.tileRenderer.DrawTopLayer(this);

        //Draws UI above everything else
        this.drawUI();

    }

}


function mainLoop() {

	Scene.Update();
    if(draw) Scene.Draw();

	requestAnimationFrame(mainLoop);

}

function Tile(x, y, cost) {
	this.getTile = function(n) {
		return Math.floor(n/16);
	}
	this.getCost = function(s, end, mcost) {
		this.g = this.parent.g + mcost;
		this.h = Math.abs(end.tile.x - this.tile.x) + Math.abs(end.tile.y - this.tile.y)
		return this.g + this.h;
	}

	this.tile = new Vector2();
	this.tile.x = this.getTile(x);
	this.tile.y = this.getTile(y);
	this.parent;
	this.g = 0;
	this.h = 0;
	this.cost = cost;
}

function inList(t, cl) {
    for(var i = 0; i < cl.length; i++) {
        if(t.tile.x == cl[i].tile.x && t.tile.y == cl[i].tile.y) return true;
    }
    return false;
}

function findObjects(scene, type) {
    var objList = [];

    for (var i = 0; i < scene.GameObjects.length; i++) {
        if(Array.isArray(type)) {
            for(var j = 0; j < type.length; j++) {
                if(scene.GameObjects[i].type == type[j]) {
                    objList.push(new Tile(scene.GameObjects[i].transform.position.x, scene.GameObjects[i].transform.position.y, 0));
                }
            }
        }
        else {
            if(scene.GameObjects[i].type == type) {
            objList.push(new Tile(scene.GameObjects[i].transform.position.x, scene.GameObjects[i].transform.position.y, 0));
        }
        }

    }

    return objList;
}

function createPath(a , b, scene) {
    var tO = 8;
    var map = new Array();
    map = scene.tileRenderer.map;
    var openList = new Array();
    var closedList = new Array();
    var start = new Tile(a.transform.position.x,a.transform.position.y, 0);
    var curr = start;
    var target = new Tile(b.transform.position.x+tO, b.transform.position.y+tO);
    var tempTile = new Tile(0,0,0);
    var objList = findObjects(scene, ["Chest", "Enemy"]);

    this.checkTile = function(x,y) {
        var tileID = map.layers[0].data[x + map.width*(y-1)]-1;
        if(!map.tilesets[0].tileproperties[tileID.toString()] || !map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
            if(map.layers[1].data[x + map.width*(y-1)]-1) tileID = map.layers[1].data[x + map.width*(y-1)]-1;
            if (!map.tilesets[0].tileproperties[tileID.toString()] || !map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
                return false;
            }

        }
        return true;
    }


    this.addAdjTile = function(x,y,mcost) {
        var tileID = map.layers[0].data[x + map.width*(y-1)]-1;
        if(!map.tilesets[0].tileproperties[tileID.toString()] || !map.tilesets[0].tileproperties[tileID.toString()].isSolid) {
            tempTile = new Tile(0,0,0);
            tempTile.tile.x = x;
            tempTile.tile.y = y;
            tempTile.parent = curr;
            tempTile.cost = tempTile.getCost(start,target,mcost);
            if(map.layers[1].data[x + map.width*(y-1)]-1) tileID = map.layers[1].data[x + map.width*(y-1)]-1;
            if(!inList(tempTile, closedList) && (!map.tilesets[0].tileproperties[tileID.toString()] || !map.tilesets[0].tileproperties[tileID.toString()].isSolid)) {
                if(inList(tempTile, openList)) {
                    /*var i = 0;
                    for(i = 0; i < openList.length-1;i++) {
                        if(tempTile.tile.x == openList[i].tile.x && tempTile.tile.y == openList[i].tile.y) {

                        }
                    }*/
                }
                else {
                    openList.push(tempTile);
                }

            }
        }
    }

    do {
    //for(var ind = 0; ind < 7; ind++) {
        closedList.push(curr);
        //left tile
        this.addAdjTile(curr.tile.x-1,curr.tile.y,10);
        //right tile
        this.addAdjTile(curr.tile.x+1,curr.tile.y,10);
        //top tile
        this.addAdjTile(curr.tile.x,curr.tile.y-1,10);
        //bottom tile
        this.addAdjTile(curr.tile.x,curr.tile.y+1,10);
        //Top left
        if(!this.checkTile(curr.tile.x-1,curr.tile.y) && !this.checkTile(curr.tile.x,curr.tile.y-1))
            this.addAdjTile(curr.tile.x-1,curr.tile.y-1,14);
        //Top right
        if(!this.checkTile(curr.tile.x+1,curr.tile.y) && !this.checkTile(curr.tile.x,curr.tile.y-1))
            this.addAdjTile(curr.tile.x+1,curr.tile.y-1,14);
        //Bot left
        if(!this.checkTile(curr.tile.x-1,curr.tile.y) && !this.checkTile(curr.tile.x,curr.tile.y+1))
            this.addAdjTile(curr.tile.x-1,curr.tile.y+1,14);
        //Bot right
        if(!this.checkTile(curr.tile.x+1,curr.tile.y) && !this.checkTile(curr.tile.x,curr.tile.y+1))
            this.addAdjTile(curr.tile.x+1,curr.tile.y+1,14);
        tempTile = new Tile(0,0,0);
        var index = openList.length-1;
        tempTile = openList[index];
        for(var i = openList.length-1; i >= 0; i--) {
            if(openList[i].tile.x == target.tile.x && openList[i].tile.y == target.tile.y) {
                tempTile = openList[i];
                index = i;
                break;
            }
            else if(tempTile.cost > openList[i].cost) {
                tempTile = openList[i];
                index = i;
            }
        }
        openList.splice(index,1);
        curr = new Tile(0,0,0);
        curr = tempTile;
    } while((closedList[closedList.length-1].tile.x != target.tile.x || closedList[closedList.length-1].tile.y != target.tile.y) && curr != null);

    var list = new Array();
    var c = new Tile();
    var c = closedList[closedList.length-1];
    while (c != null) {
        list.push(c);
        c = new Tile();
        c = list[list.length-1].parent;
    }
    //list.reverse();
    var path = new Array();
    for(var i = list.length-1; i >= 0; i--) {
        path.push(list[i]);
        if(i > 0 && list[i].tile.x != list[i-1].tile.x && list[i].tile.y != list[i-1].tile.y) {
            //right side
            if(list[i-1].tile.x - list[i].tile.x > 0) {
                //right down
                if(list[i-1].tile.y - list[i].tile.y >= 0) {
                    if(this.checkTile(list[i].tile.x+1,list[i].tile.y)) {
                        path.push(new Tile((list[i].tile.x)*16, (list[i].tile.y+1)*16, 0));
                    }
                    else if(this.checkTile(list[i].tile.x,list[i].tile.y+1)) {
                        path.push(new Tile((list[i].tile.x+1)*16, (list[i].tile.y)*16, 0));
                    }
                }
                //right up
                else {
                    if(this.checkTile(list[i].tile.x+1,list[i].tile.y)) {
                        path.push(new Tile((list[i].tile.x)*16, (list[i].tile.y-1)*16, 0));
                    }
                    else if(this.checkTile(list[i].tile.x,list[i].tile.y-1)) {
                        path.push(new Tile((list[i].tile.x+1)*16, (list[i].tile.y)*16, 0));
                    }
                }
            }
            //left side
            else {
                //left down
                if(list[i-1].tile.y - list[i].tile.y > 0) {
                    if(this.checkTile(list[i].tile.x-1,list[i].tile.y)) {
                        path.push(new Tile((list[i].tile.x)*16, (list[i].tile.y+1)*16, 0));
                    }
                    else if(this.checkTile(list[i].tile.x,list[i].tile.y+1)) {
                        path.push(new Tile((list[i].tile.x-1)*16, (list[i].tile.y)*16, 0));
                    }
                }
                //left up
                else {
                    if(this.checkTile(list[i].tile.x-1,list[i].tile.y)) {
                        path.push(new Tile((list[i].tile.x)*16, (list[i].tile.y-1)*16, 0));
                    }
                    else if(this.checkTile(list[i].tile.x,list[i].tile.y-1)) {
                        path.push(new Tile((list[i].tile.x-1)*16, (list[i].tile.y)*16, 0));
                    }
                }
            }
        }
    }

    return path;
}

function rayCast(scene, a, b) {
    this.transform = new Transform();
    this.transform.position.x = a.transform.position.x;
    this.transform.position.y = a.transform.position.y;
    this.target = new Transform();
    this.target.position.x = b.transform.position.x;
    this.target.position.y = b.transform.position.y;
    this.boxCollider = new BoxCollider(16,16,this);
    this.hit = false;
    this.clear = false;

    this.onCollide = function(scene, collider) {
        if(collider == b) {
            this.clear = true;
        }
        if(collider.type == "Enemy" || collider.type == "Attack") return false;
        else if(collider != a) {
            return true;
        }


    }
    while(Math.abs(this.transform.position.x - (this.target.position.x)) >= 1 || Math.abs(this.transform.position.y - (this.target.position.y)) >= 1) {
        ctx.fillRect(Math.floor(this.transform.position.x - scene.Camera.transform.position.x + scene.Camera.offset.x - (1/2)),Math.floor(this.transform.position.y - scene.Camera.transform.position.y + scene.Camera.offset.y - (1/2)),1,1);
        this.transform.position = lerp(this.transform.position, this.target.position,0.1);
        if(this.boxCollider.checkCollision(scene, this.transform.position)) {
            if(this.clear) return true;
            break;
        }


    }
    return false;

}

function doKeyDown(e) {

			var code = e.keyCode;

			if (code == 87) { // w
				input.w = true;
			} else if(code == 83) { // s
				input.s = true;
			} else if(code == 65) { // a
				input.a = true;
			} else if(code == 68) { // d
				input.d = true;
			}
      else if(code == 32) { // spacebar
          input.space = true;
      }
      else if(code == 37) { // arrowKeyLeft
          input.arrowKeyLeft = true;
      }
      else if(code == 38) { // arrowKeyUp
          input.arrowKeyUp = true;
      }
      else if(code == 39) { // arrowKeyRight
          input.arrowKeyRight = true;
      }
      else if(code == 40) { // arrowKeyDown
          input.arrowKeyDown = true;
      }
	}

	function doKeyRelease(e) {

		var code = e.keyCode;

			if (code == 87) { // w
				input.w = false;
			} else if(code == 83) { // s
				input.s = false;
			} else if(code == 65) { // a
				input.a = false;
			} else if(code == 68) { // d
				input.d = false;
			} else if(code == 32) { // spacebar
                input.space = false;
      }
      else if(code == 37) { // arrowKeyLeft
          input.arrowKeyLeft = false;
      }
      else if(code == 38) { // arrowKeyUp
          input.arrowKeyUp = false;
      }
      else if(code == 39) { // arrowKeyRight
          input.arrowKeyRight = false;
      }
      else if(code == 40) { // arrowKeyDown
          input.arrowKeyDown = false;
      }




	}


	function lerp2(a,b,t) {

		//x axis
		var x = a + t * (b - a);

		return x;
	}

	//a and b are Vector2 objects
	function lerp(a,b,t) {

		//x axis
		var x = a.x + t * (b.x - a.x);

		//y axis
		var y = a.y + t * (b.y - a.y);

		var ret = new Vector2();
		ret.x = x;
		ret.y = y;

		return ret;

	}


	function getRandomArbitrary(min, max) {
  		return Math.random() * (max - min) + min;
	}
