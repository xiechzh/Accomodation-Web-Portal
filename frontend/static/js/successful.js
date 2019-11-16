$(document).ready(function(){
    var div_height = window.screen.height;
    div_height = div_height-100;
    div_height = div_height+'px';
    console.log(div_height);
    document.getElementById("container").style.height = div_height;
});