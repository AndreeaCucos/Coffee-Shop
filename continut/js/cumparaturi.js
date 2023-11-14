var myWorker;

function Produs(id, nume, cantitate)
{
    this.id = id;
    this.nume = nume;
    this.cantitate = cantitate;
}

Produs.prototype.toJson = function(){
    return JSON.stringify({id: this.id, nume: this.nume, cantitate: this.cantitate});
};

Produs.fromJson = function(json)
{
    var data = JSON.parse(json);
    return new Produs(data.id, data.nume, data.cantitate);
}

class Method
{
    constructor()
    {
        if(this.constructor == Method)
        {
            throw new Error("Object of abstract class");
        }
    }

    putData(produs)
    {
        throw new Error("Object of abstract class");
    }

    getData()
    {
        throw new Error("Object of abstract class");
    }
}

class WebApi extends Method
{
    putData(produs)
    {
        var serialize = produs.toJson();
        window.localStorage.setItem(id.toString(), serialize);
    }

    getData(id)
    {
        return Produs.fromJson(window.localStorage.getItem(id.toString()));
    }
}

class IndexedDB extends Method
{
    constructor()
    {
        super();
        this.db = null;
    }

    putData(produs)
    {
        let openRequest = window.indexedDB.open('lista', 2);
      
        openRequest.onsuccess = (e) => {
            this.db = openRequest.result;
            if(this.db)
            {
                let transaction = this.db.transaction('lista', 'readwrite');
                let lista = transaction.objectStore('lista');
                console.log(transaction);
                console.log(lista);
                const data= {id: produs.id, nume: produs.nume, cantitate: produs.cantitate};
                let request = lista.add(data);
                request.onsuccess = function(){console.log(request.result)};
                request.onerror = function(error){console.log(error.data)};
            }
        };

       openRequest.onupgradeneeded = (e) => {
           this.db = e.target.result;
           if(!this.db.objectStoreNames.contains('lista'))
           {
               this.db.createObjectStore('lista', {keyPath: 'id'});
           }
           return this.db;
       };    
    }

    getData(id)
    {
        if(this.db)
        {
            let request = this.db.transaction(['lista']).objectStore('lista').get(id);
            request.onerror = e => console.log(request.result);
            request.onsuccess = e => 
            {
                var table = document.getElementById("lista");

                var prod = JSON.stringify(request.result);
                var res = JSON.parse(prod);

                var row = table.insertRow(id);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                cell1.innerHTML = res.id + ".";
                cell2.innerHTML = res.nume;
                cell3.innerHTML = res.cantitate;
            }
        }
    }

    clearData()
    {
        console.log(this.db);
        let openRequest = window.indexedDB.open('lista', 2);
            openRequest.onsuccess = (e) => {
                this.db = openRequest.result;
                console.log("here");
                let request = this.db.transaction('lista', 'readwrite').objectStore('lista').clear();
                request.onsuccess = ()=> {
                    console.log(`Object Store lista emptied`);
                }

                request.onerror = (err)=> {
                    console.error(`Error to empty Object Store: lista`)
                }
            };

    }
       
    
}



var id = 0;

let print = (receiver, sender, data) => console.log(receiver + ": Am primit de la " + sender + ": " + data);
var db;
function addToCart()
{   
    var choice = document.getElementById("choose").value;
    var obj;
    if(choice == "webAPI")
    {
        obj = new WebApi();
    }
    else
    {
        obj = new IndexedDB();
    }

    if(window.Worker)
    {
        var table = document.getElementById("lista");
        myWorker = new Worker("js/worker.js");
        myWorker.postMessage("Butonul Adaugă a fost apăsat");
        id = id + 1;
        let myPromise = new Promise(function(resolve, reject)
        {
            try
            {
                var nume = document.getElementById("name");
                var cant = document.getElementById("cant");
                var produs = new Produs(id, nume.value, cant.value);
                obj.putData(produs);
                resolve();
            }catch(e)
            {
                reject(e);
            }
        });

        myPromise.then(
            function(){console.log("Produsul a fost adăugat cu succes!");},
            function(error){console.log(error);}
        );
        
        myWorker.onmessage = function(e)
        {
            print("Programul principal", "worker",  e.data);
            console.log("Printing on screen");
            
            if(obj instanceof IndexedDB)
            {   
                obj.getData(id);
            }
            else if(obj instanceof WebApi)
            {
                var prod = obj.getData(id);
                var row = table.insertRow(id);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                cell1.innerHTML = prod.id + ".";
                cell2.innerHTML = prod.nume;
                cell3.innerHTML = prod.cantitate;
            }
            
        }
    }
}

function sterge()
{
    var obj = new IndexedDB();
    if(document.getElementById("deleteTable").checked != false)
    {
            console.log("clear");
            obj.clearData();
    }
    id = 0;
}
