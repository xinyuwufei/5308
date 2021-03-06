//------------------------- Set Agents-------------------------
function Agent(p, Id, d)
{
    this.x          = p.x;
    this.y          = p.y;
    this.id         = Id;
    this.radius     = n ? nodes[0].radius - 3 : 0;
    this.next       = 0;
    this.goal       = 0;
    this.stage      = 1;
    this.direction  = d;
    this.fillStyle  = "#0044ff";
    this.terminate  = false;
    this.vanish     = false;
    this.chasing    = -1;
    this.joinme     = false;
    this.imageX=0,  // 图像定位坐标
        this.imageY= 0;
        this.width= 50;  // 图像显示区域大小
        this.height= 60;

    /*  1.Devide:    state: 0 : init, 1 : explore, 2 : return ,3 : go to v
        4.Pairing:   state: 0 : init, 1 : explore, 2 : return ,3 : chase, 5 : become paired-left or alone
        6.Gathering: state: 0 : init, 1 : explore, 2 : return ,3 : chase, 4 : stay and check

    */
    this.state      = 0;
    this.report     = false;


   this.draw = function ()
    {
        if(algorithm==3 && this.id<=2){
            playerImage = new Image();
            playerImage.src='redshell_r.png';
            // context.fillStyle = this.fillStyle;
            // context.beginPath();
            // context.arc(this.x, this.y, this.radius,  0, 2 * Math.PI, true);
            // context.closePath();
            // context.fill();
            context.drawImage(playerImage,0, 0, this.width, this.height, this.x-25, this.y-25,this.height, this.width, this.height);
        }
        else{
            playerImage = new Image();
            playerImage.src = 'Mario.png';
            context.drawImage(playerImage, this.imageX, this.imageY, this.width, this.height, this.x-25, this.y-25,this.height, this.width, this.height);
        }
    }

    this.doAlgorithm = function ()
    {
        var a = agents[this.id - 1];
        if (this.vanish)
        {
            return;
        }else if (this.report && !this.next)
        {
            checkLastLink(a);
            this.terminate = true;
            console(this.id, 2);
            done++;
            return;
        }
        switch (algorithm)
        {
        //  algorithm Devide
        case "1":
                Divide(a);
                break;

        //  algorithm OptTime
        case "2":
                OptTime(a);
                break;
        case "3":
                TradeOff(a);
                break;

        case "4":
                Pairing1(a);
                break;

        case "5":
                Elimination(a);
                break;

        case "6":
                Gathering(a);
                break;

        case "7":
                Bod(a);
        }


    }

    this.move = function ()
    {
        this.doAlgorithm();//change goal state direction
        // it stays
        if (this.state > 3)
        {
            positionChange[this.id - 1] = [0, 0];
            return;
        }
        if(!this.terminate){
        var current = this.next;
        var next    = current + this.direction;//update next position of id

        if (next < 0)
        {
            this.next = n - 1;
        }else if (next > n - 1)
        {
            this.next = 0;
        }else{
            this.next = next;
        }
        var p = moveAB(nodes[current], nodes[this.next]);
        positionChange[this.id - 1] = p;
    }
    }

    // return 0 - n-1 if it meets a node, otherwise it returns -1
    this.collision = function()
    {
        var p = nodes[this.next];
        if (Math.abs(p.x - this.x) < 0.1  &&  Math.abs(p.y - this.y)< 0.1)
        {
            if (this.next === blackHole)
            {
                this.radius = 0;
                this.vanish = true;
                if (algorithm != '3')
                {
                    done++;//1. terminates| ate by blackhole
                }
            }
            this.x = p.x;
            this.y = p.y;
            return 1;
        }
        return 0;
    }

}


//  update the position of every agent
//  update the position of every agent
function moveAgents()

{

    if (!agents.length)
    {
        return;
    }

    // draw agents with text
    // context.font = nodes[0].radius + "px Arial";

    // for (var i = 0; i < agents.length; i++)
    // {
    //     var ai = agents[i];
    //     if (ai.vanish)
    //     {
    //         continue;
    //     }
    //     if (!ai.terminate)
    //     {
    //         var p  = positionChange[i];
    //         agents[i].x += p[0];
    //         agents[i].y += p[1];
    //         if(getDirection(ai.next)){
    //             ai.imageY = 0;
    //             if(ai.direction==-1) ai.imageY = 60;
    //         }
    //         else {
    //             ai.imageY = 60;
    //             if(ai.direction==1) ai.imageY = 0;
    //         }

    //         if (ai.imageX >= 150) ai.imageX = 0;
    //         else ai.imageX += 50;



    //     }
    //     //  draw agents
    //     agents[i].draw(context);
    //     // set the text at the center of the nodes
    //     var x = ai.x - (ai.id > 9 ? ai.radius / 1.8 : ai.radius / 3.6)+35;
    //     var y = ai.y + ai.radius / 3;
    //     // set black hole node text with different color
    //     context.fillStyle = "#ff0000";
    //     context.fillText(i + 1, x, y);
    // }
    var temp=[];
    for(var i=0;i<k;i++){
        temp.push(agents[i].next);
    }
    var unique=[];
    unique= temp.filter( onlyUnique );
    for (var i=0;i<unique.length;i++) {
        var results= [];
        for (var j=0;j<k;j++){
            if(temp[j]==-1)continue;
            if(unique[i]==temp[j]){
                results.push(j);
                temp[j]=-1;
            }
        }

        moveAgents1(results);

    }

}


function drawAgents()
{
    // draw agents with text
    context.font = nodes[0].radius + "px Arial";
    for (var i = 0; i < agents.length; i++)
    {
        var ai = agents[i];
        //  draw agents
        agents[i].draw(context);
        // set the text at the center of the nodes
        var x = ai.x - (ai.id > 9 ? ai.radius / 1.8 : ai.radius / 3.6)+35;
        var y = ai.y + ai.radius / 3;
        // set black hole node text with different color
        context.fillStyle = "#ff0000";
        context.fillText(i + 1, x, y);//content,x axis,y axis
    }
}

function moveAgents1(a){
    //if(a.length==0)return;
    context.font = nodes[0].radius + "px Arial";
    var offset=35;

    for (var i = 0; i < a.length; i++)
    {
        var ai = agents[a[i]];
        if (ai.vanish)
        {
            continue;
        }
        if (!ai.terminate)
        {
            var p  = positionChange[a[i]];
            ai.x += p[0];
            ai.y += p[1];
            if(getDirection(ai.next)){
                ai.imageY = 0;
                if(ai.direction==-1) ai.imageY = 60;
            }
            else {
                ai.imageY = 0;
                if(ai.direction==1) ai.imageY = 60;
            }

            if (ai.imageX >= 100) ai.imageX = 0;
            else {
                if(timer%15==0)ai.imageX += 50;
            }



        }
        //  draw agents
        agents[a[i]].draw(context);
        // set the text at the center of the nodes
        if(ai.id > 9)offset+=10;
        var x = ai.x - (ai.id > 9 ? ai.radius / 1.8 : ai.radius / 3.6)+offset;
        var y = ai.y + ai.radius / 3;
        // set black hole node text with different color
        context.fillStyle = "#ff0000";
        context.fillText(a[i] + 1, x, y);
        offset+=15;
    }

}


function checkCollision()
{
    var temp=false;
    var currentMoves=moves;
    var add = false;
    for (var i = 0; i < agents.length; i++)
    {
        // If the agent vanishes or terminates.do not check
        if (agents[i].vanish || agents[i].terminate)
        {
            continue;
        }
        // if there is a collision

        if (agents[i].collision())
        {
            temp=true;

            agents[i].move();
            if (algorithm == '3' || algorithm == '6'){
              if (agents[i].state != 4 && (agents[i].next != lastVisit)){
                  lastVisit = agents[i].next;
                  add = true;
              }
            }
        }
        
    }
    if (currentMoves < moves){
        $('#moves').val(currentMoves );
    }
    if(temp){
        if (algorithm != '3' && algorithm != '6'){
          idealtime++;
        }else if ((algorithm == '3' || algorithm == '6') && currentMoves < moves){
          if (add){
            idealtime++;
          }
        //  alert(idealtime);
        }
        $('#idealtime').val(idealtime);
    }
}

function baseAgents()
{
    bases = [];
    for (var i = 0;i < k; i++ )
    {
        bases.push(0);
    }
}

function randomAgents()
{
    bases = [];
    var a, b, i = 0, c = n;
    var r = [];
    while(i < c)
    {
        r[i] = i;
        i++;
    }
    // generate a ramdom array
    while (c)
    {
        a = c-1;
        b = Math.floor(Math.random() * c);
        c--;
        if (a == b)
        {
            continue;
        }
        r[a] ^= r[b];
        r[b] ^= r[a];
        r[a] ^= r[b];
    }

    for (i = 0, c = -1; i < k; )
    {
        c++;
        if(r[c] === blackHole)
        {
            continue;
        }
        bases.push(r[c]);
        i++;
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getDirection(id){
    var half=Math.floor(n/2);
    var quarter=Math.floor(half/2);
    //if(id==0)return false;
    if(id<quarter||id>half+quarter){
        return true;
    }
    else{
        return false;
    }

}
