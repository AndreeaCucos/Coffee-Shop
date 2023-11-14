function incarcaPersoane() 
{
    // cere la server cu AJAX pentru fisierul persoane.xml
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        {
            var i;
            var body = document.getElementsByTagName("main")[0];
           
            var xml = this.responseXML;
            var content = xml.getElementsByTagName("cafea");
            var table = document.createElement("table");
            table.setAttribute("id", "coffe-menu");
            var tableBody = document.createElement("tbody");

            var header = document.createElement("thead");
            var elements = ["Nume", "Pret", "Cantitate", "Ingrediente"];
            table.appendChild(header);
            for(let i=0;i<elements.length;i++)
            {
                var th = document.createElement("th");
                th.style.backgroundColor = "black";
                th.style.color = "white";
                th.style.fontStyle = "italic";
                th.style.padding = "20px";
                th.style.alignContent = "center";
                header.appendChild(th).appendChild(document.createTextNode(elements[i]));

            }

            var ingredients = xml.getElementsByTagName("ingrediente");

            for(let i=0;i<content.length;i++)
            {
                var row = document.createElement("tr");
                for(var j=0;j<elements.length;j++)
                {
                    var cell = document.createElement("td");
                    if(j==0)
                    {
                        var cellText = document.createTextNode(content[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue);
                        var img = document.createElement("img");
                        img.style.visibility = "hidden";
                        img.style.width = "100px";
                        img.style.height = "100px";
                        img.style.float = "right";
                        var name = content[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
                        if(name == "Latte")
                        {
                            
                            img.src = "imagini/latte.png";
                            img.setAttribute("id", "latte");
                            img.setAttribute("alt", "latte image");
                            cell.appendChild(img);
                            cell.style.textAlign="left";
                            cell.onmouseover=function(){imageAppear("latte")};
                            cell.onmouseout=function(){imageDisappear("latte")};
                        }
                        else if(name == "Capuccino")
                        {
                            img.src = "imagini/capuccino.png";
                            img.setAttribute("id", "capuccino");
                            img.setAttribute("alt", "capuccino image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("capuccino")};
                            cell.onmouseout=function(){imageDisappear("capuccino")};
                        }
                        else if(name == "Espresso")
                        {
                            img.src = "imagini/espresso.png";
                            img.setAttribute("id", "espresso");
                            img.setAttribute("alt", "espresso image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("espresso")};
                            cell.onmouseout=function(){imageDisappear("espresso")};
                        }
                        else if(name == "Cappucino Vienesse")
                        {
                            img.src = "imagini/vienez.png";
                            img.setAttribute("id", "vienez");
                            img.setAttribute("alt", "vienez image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("vienez")};
                            cell.onmouseout=function(){imageDisappear("vienez")};
                        }
                        else if(name == "Frappe")
                        {
                            img.src = "imagini/frappe.png";
                            img.setAttribute("id", "frappe");
                            img.setAttribute("alt", "frappe image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("frappe")};
                            cell.onmouseout=function(){imageDisappear("frappe")};
                        }
                        else if(name == "Irish Coffe")
                        {
                            img.src = "imagini/irish-coffee.png";
                            img.setAttribute("id", "irish");
                            img.setAttribute("alt", "irish image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("irish")};
                            cell.onmouseout=function(){imageDisappear("irish")};
                        }
                        else if(name == "Flat White")
                        {
                            img.src = "imagini/flatWhite.png";
                            img.setAttribute("id", "flat");
                            img.setAttribute("alt", "flat white image");
                            cell.appendChild(img);
                            cell.onmouseover=function(){imageAppear("flat")};
                            cell.onmouseout=function(){imageDisappear("flat")};
                        }
                        cell.style.fontWeight = "bold";
                        cell.appendChild(cellText);
                    }
                    else if(j==1)
                    {
                        var cellText = document.createTextNode(content[i].getElementsByTagName("pret")[0].childNodes[0].nodeValue);
                        cell.appendChild(cellText);
                    }
                    else if(j==2)
                    {
                        var cellText = document.createTextNode(content[i].getElementsByTagName("cantitate")[0].childNodes[0].nodeValue);
                        cell.appendChild(cellText);
                    }
                    else if(j==3)
                    {
                        var size = ingredients[i].getElementsByTagName("item").length;
                        var ul = document.createElement("ul");
                        ul.style.listStyleImage = "url(imagini/coffee-bullet.png)";
                    
                    
                        for(let k=0;k<size-1;k++)
                        {
                            var li = document.createElement("li");
                            var cellText = document.createTextNode(ingredients[i].getElementsByTagName("item")[k].childNodes[0].nodeValue);
                            li.appendChild(cellText);
                    
                        
                            ul.appendChild(li);
                        }
                        cell.appendChild(ul);
            
                    }
                    cell.style.backgroundColor = "#ffb3b3";
                    cell.style.color = "black";
                    cell.style.textAlign = "center";
                    cell.style.padding = "20px";
                    row.appendChild(cell);
                }
             
                tableBody.appendChild(row);
            }

            table.appendChild(tableBody); 
            body.appendChild(table);
            var par = document.getElementById("try");
            par.remove();
            document.getElementById("coffe-menu").style.marginLeft = "auto";
            document.getElementById("coffe-menu").style.marginRight = "auto";
        }
    };
    xhttp.open("GET", "cafenea.xml", true);
    xhttp.send();   
}

function imageAppear(id)
{
    var img = document.getElementById(id).style.visibility = "visible";
}

function imageDisappear(id)
{
    var img = document.getElementById(id).style.visibility = "hidden";
}