onmessage = function(e)
{
    console.log("Am primit de la programul principal mesajul: " + e.data);
    postMessage("Am terminat acțiunea mea.");
}