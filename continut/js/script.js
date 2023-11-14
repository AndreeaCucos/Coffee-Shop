var versiune;
var c;
var ctx;
function g() {
    let e = document.getElementById("dataMea");
    e.innerHTML = new Date();
}

function f() {
    setInterval(g, 1000);
    versiune = document.getElementById("versiune");
    versiune.innerHTML = navigator.userAgent;
}


var x = null;
var y = null;
var x2 = null;
var y2 = null;
var points = [];
function draw(event, canvas, ctx)
{
  const canvasRX = event.offsetX * canvas.width / canvas.clientWidth;
  const canvasRY = event.offsetY * canvas.height / canvas.clientHeight;
 
  points.push(canvasRX);
  points.push(canvasRY);

  if (points.length == 4)
  {
    ctx.beginPath();
    x = points[0];
    y = points[1];
    x2 = points[2];
    y2 = points[3];
    ctx.fillStyle = document.getElementById('paint').value;
    ctx.strokeStyle = document.getElementById('paintStroke').value;
    ctx.fillRect(x, y, Math.abs(x - x2), Math.abs(y - y2));
    ctx.strokeRect(x, y, Math.abs(x - x2), Math.abs(y - y2));
    points = [];
  }
  else
  {
      console.log("Not enough points");
  }
}

function start()
{
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  var base_image = new Image();
  base_image.src="/imagini/sign.jpg";
  base_image.width = "5px";
  base_image.height = "5px";
  base_image.onload = function(){
      context.drawImage(base_image, 50, 20, 100, 60);
  }
  
  canvas.addEventListener("click", event => {
    draw(event, canvas, context);
  });
}

function deleteThis()
{
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
}

function rowInsertion() {
    var line = document.getElementById('line').value;
    var table = document.getElementById('myTable').insertRow(line);
    var size = document.getElementById('myTable').rows[0].cells.length;
    for (var i = 0; i < size; i++) {
        var y = table.insertCell(i);
        y.innerHTML = "";
    }

}

function columnInsertion() {
    var row = document.getElementById("myTable");
    var column = document.getElementById("column").value;
    for (var i = 0; i < row.rows.length; i++) {
        row.rows[i].insertCell(column);
    }

    /*var row = document.getElementById("myTable").tHead;
    var name = document.getElementById("newColumn");
    for(var i=0;i<row.rows.length;i++)
    {
        var newR = document.createElement('th');
        row.rows[i].appendChild(newR);
        newR.innerHTML = name.value;
    }

    var body = document.getElementById("myTable").tBodies[0];
    for(var i=0;i<body.rows.length;i++)
    {
        var newC = document.createElement('td');
        body.rows[i].appendChild(newC);
        newC.innerHTML = ''
    }*/

}

function preciseInsertion() {
    var line = document.getElementById("ln");
    var color = document.getElementById('cellColor').value;
    var column = document.getElementById("cl");
    // var text = document.getElementById("txt");
    var x = document.getElementById("myTable").rows[line.value].cells;
    //x[column.value].innerHTML = text.value;
    x[column.value].style.backgroundColor = color;
}


function schimbaContinut(resursa, jsFisier, jsFunctie) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        document.getElementById("continut").innerHTML = this.responseText;
        if (jsFisier) {
            var elementScript = document.createElement('script');
            elementScript.onload = function () {
                console.log("hello");
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            };
            elementScript.src = jsFisier;
            document.head.appendChild(elementScript);
        } else {
            if (jsFunctie) {
                window[jsFunctie]();
            }
        }
    }
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}

function enableDisableButton()
{
    var numeUtil = document.getElementById("uname");
    var pass = document.getElementById("pass");
    var email = document.getElementById("email");

    if(numeUtil.value != "" && pass.value != "" && email.value != "")
    {
        document.getElementById('btn').removeAttribute('disabled');
    }
   
}

function sendData()
{
    var xml = new XMLHttpRequest();
    var name = document.getElementById("uname");
    var pass = document.getElementById("pass");
    
    let data = "";
    data += "name=" + name.value + "&password=" + pass.value;
    xml.open('POST', '/api/utilizatori', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.send(data);
}


function check()
{
    fetch("./utilizatori.json")
    .then(res => res.json())
    .then(data => {
        var c = true;
        for( el of data)
        {
            if(document.getElementById("utilizator").value != undefined && document.getElementById("parola").value != undefined)
            { 
                
                if(el.utilizator == document.getElementById("utilizator").value && el.parola == document.getElementById("parola").value)
                {
                    
                    c = true;
                    break;
                }
                else
                {
                    c = false;
                }
            }
            
        }
        if(c == true)
        {
            document.getElementById("raspuns").innerHTML = "Logare cu succes!";
        }
        else{
            document.getElementById("raspuns").innerHTML = "Utilizator sau parolă greșite!";
        }
    }
    );
   
}

