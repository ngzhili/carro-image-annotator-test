/*
   jPolygon - a ligthweigth javascript library to draw polygons over HTML5 canvas images.
   Project URL: http://www.matteomattei.com/projects/jpolygon
   Author: Matteo Mattei <matteo.mattei@gmail.com>
   Version: 1.0
   License: MIT License
*/

var polygons = new Array();
var perimeter = new Array();
var colour;
var input_name = false;
var saved_name;


var complete = false;
var canvas = document.getElementById("jPolygon");
var ctx;

function line_intersects(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['x'] - p0['x'];
    s1_y = p1['y'] - p0['y'];
    s2_x = p3['x'] - p2['x'];
    s2_y = p3['y'] - p2['y'];

    var s, t;
    s = (-s1_y * (p0['x'] - p2['x']) + s1_x * (p0['y'] - p2['y'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['y'] - p2['y']) - s2_y * (p0['x'] - p2['x'])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
    return false; // No collision
}




function point(x, y){
    var select = document.getElementById("cat");
    var result = select.options[select.selectedIndex].text;
    result_global = result
    /*alert(result);*/
    if (result == "car_license_plate"){
        colour = 'rgba(0, 255, 0, 0.5)'
    };
    if (result == "front_bonnet"){
        colour = 'rgba(255, 0, 0, 0.5)'
    };
    if (result == "front_bumper"){
        colour = 'rgba(0, 0, 255, 0.5)'
    };
    if (result == "front_left_headlight"){
        colour = 'rgba(0, 0, 0, 0.5)'
    };
    if (result == "front_left_side_mirror"){
        colour = 'rgba(255, 225, 0, 0.5)'
    };
    if (result == "front_right_headlight"){
        colour = 'rgba(255, 0, 255, 0.5)'
    };
    if (result == "front_right_side_mirror"){
        colour = 'rgba(150, 0, 255, 0.5)'
    };
    ctx.fillStyle=colour;
    ctx.strokeStyle = colour;
    ctx.fillRect(x-2,y-2,3,3);
    ctx.moveTo(x,y);
}

function undo(){
    ctx = undefined;
    perimeter.pop();
    complete = false;
    start(true);
}

function clear_canvas(){
    ctx = undefined;
    perimeter = new Array();
    complete = false;
    document.getElementById('coordinates').value = '';
    start();
    
    document.getElementById("front bumper").innerHTML = "front_bumper";
    document.getElementById("front bonnet").innerHTML = " front_bonnet";
    document.getElementById("front right headlight").innerHTML = "front_right_headlight";
    document.getElementById("front right side mirror").innerHTML = "front_right_side_mirror";
    document.getElementById("front left headlight").innerHTML = "front_left_headlight";
    document.getElementById("front left side mirror").innerHTML = "front_left_side_mirror";
    document.getElementById("car license plate").innerHTML = "car_license_plate";
    
}



/* to draw the last polygon line to close the polygon*/
function draw(end){
    
    var select = document.getElementById("cat");
    var result = select.options[select.selectedIndex].text;
    result_global = result

    /*alert(result);*/
    if (result == "car_license_plate"){
        colour = 'rgba(0, 255, 0, 0.5)'
    };
    if (result == "front_bonnet"){
        colour = 'rgba(255, 0, 0, 0.5)'
    };
    if (result == "front_bumper"){
        colour = 'rgba(0, 0, 255, 0.5)'
    };
    if (result == "front_left_headlight"){
        colour = 'rgba(0, 0, 0, 0.5)'
    };
    if (result == "front_left_side_mirror"){
        colour = 'rgba(255, 225, 0, 0.5)'
    };
    if (result == "front_right_headlight"){
        colour = 'rgba(255, 0, 255, 0.5)'
    };
    if (result == "front_right_side_mirror"){
        colour = 'rgba(150, 0, 255, 0.5)'
    };
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.lineCap = "square";
    ctx.beginPath();

    for(var i=0; i<perimeter.length; i++){
        if(i==0){
            ctx.moveTo(perimeter[i]['x'],perimeter[i]['y']);
            end || point(perimeter[i]['x'],perimeter[i]['y']);
        } else {
            ctx.lineTo(perimeter[i]['x'],perimeter[i]['y']);
            end || point(perimeter[i]['x'],perimeter[i]['y']);
        }
    }


    /* if draw(true) then draw the polygon*/
    if(end){
        

        ctx.lineTo(perimeter[0]['x'],perimeter[0]['y']);
        ctx.closePath();
        /*ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';*/
        
        /*ctx.fillStyle ='rgba(255, 0, 0, 0.5)';*/
        ctx.fillStyle =colour;
        ctx.fill();
        ctx.strokeStyle = colour;
        complete = false;

    }
    ctx.stroke();

    // print coordinates
    if(perimeter.length == 0){
        document.getElementById('coordinates').value = '';

        
    } else {   
        document.getElementById('coordinates').value = JSON.stringify(perimeter);

    }
}

function check_intersect(x,y){
    if(perimeter.length < 4){
        return false;
    }
    var p0 = new Array();
    var p1 = new Array();
    var p2 = new Array();
    var p3 = new Array();

    p2['x'] = perimeter[perimeter.length-1]['x'];
    p2['y'] = perimeter[perimeter.length-1]['y'];
    p3['x'] = x;
    p3['y'] = y;

    for(var i=0; i<perimeter.length-1; i++){
        p0['x'] = perimeter[i]['x'];
        p0['y'] = perimeter[i]['y'];
        p1['x'] = perimeter[i+1]['x'];
        p1['y'] = perimeter[i+1]['y'];
        if(p1['x'] == p2['x'] && p1['y'] == p2['y']){ continue; }
        if(p0['x'] == p3['x'] && p0['y'] == p3['y']){ continue; }
        if(line_intersects(p0,p1,p2,p3)==true){
            return true;
        }
    }
    return false;
}



/* event by mouse left and right click*/
function point_it(event) {
    if(complete){
        alert('Polygon already created');
        return false;
    }
    var rect, x, y;
    

    /*press left click to close polygon*/
    if(event.ctrlKey || event.which === 3 || event.button === 2){
        if(perimeter.length==2){
            alert('You need at least three points for a polygon');
            return false;
        }
        /* x and y coordinates are the first coordinate now*/
        x = perimeter[0]['x'];
        y = perimeter[0]['y'];

        if(check_intersect(x,y)){
            alert('The line you are drawing intersect another line');
            return false;
        }
        draw(true);
        /*alert('Polygon closed');*/
        perimeter = [];

        var select = document.getElementById("cat");
        var result = select.options[select.selectedIndex].text;


        if (result == "front_bumper"){
            document.getElementById("front bumper").textContent = "front_bumper (Complete)";
            
        }    
        if (result == "front_bonnet"){
            document.getElementById("front bonnet").innerHTML = "front_bonnet (Complete)";
        } 
        if (result == "front_right_headlight"){
            document.getElementById("front right headlight").innerHTML = "front_right_headlight (Complete)";
        } 
        if (result == "front_right_side_mirror"){
            document.getElementById("front right side mirror").innerHTML = "front_right_side_mirror (Complete)";
        } 
        if (result == "front_left_headlight"){
            document.getElementById("front left headlight").innerHTML = "front_left_headlight (Complete)";
        } 
        if (result == "front_left_side_mirror"){
            document.getElementById("front left side mirror").innerHTML = "front_left_side_mirror (Complete)";
        }   
        if (result == "car_license_plate"){
            document.getElementById("car license plate").innerHTML = "car_license_plate (Complete)";
        }     

	event.preventDefault();
        return false;
    } else {
        rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if (perimeter.length>0 && x == perimeter[perimeter.length-1]['x'] && y == perimeter[perimeter.length-1]['y']){
            // same point - double click
            return false;
        }
        if(check_intersect(x,y)){
            alert('The line you are drawing intersect another line');
            return false;
        }
        perimeter.push({'x':x,'y':y});
        draw(false);

                    

        return false;
    }
}

function start(with_draw) {
    var img = new Image();
    img.src = canvas.getAttribute('data-imgsrc');

    img.onload = function(){
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if(with_draw == true){
            draw(false);
        }
    }
}

/*
var c=document.getElementById("jPolygon");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(100,75,50,0,2*Math.PI);
ctx.stroke();
*/
function download_image(){
  if (input_name){
    var canvas = document.getElementById("jPolygon");
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download =  String(saved_name)+"_submission.png";
    link.href = image;
    link.click();}
  else{
    alert("Cannot download image as you have not submitted your name!");
}

}


function othername() {
    var input = document.getElementById("userInput").value;
    if (input.length == 0){
        alert(input+" is an invalid input! Please reenter your name!");
    }
    else{
        alert("Welcome "+input+"! You have submitted your name!");
        input_name = true;
        saved_name = input;
        

    }
}

