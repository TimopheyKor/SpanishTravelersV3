// Functions for the Artist Travelers Project landing page
var welcome = document.getElementById("welcome-div");
var about = document.getElementById("about-div");
var logo = document.getElementById("atp-logo");
var menu = document.querySelectorAll(".menu-item");
var image = document.getElementById("image-container");
var content = document.getElementById("content-container");

function openDiv(div) {
    console.log("openDiv called on", div);
    logo.style.display = "none";
    about.style.display = "none";
    welcome.style.display = "none";
    div.style.display = "block";
    swapColors(div);
    changeImage(div);
}

function swapColors(div) {
    if (div == logo) {
        for (var i = 0; i < menu.length; i++) {
            menu[i].style.color = "white";
            menu[i].style.fill = "white";
        }
        content.style.backgroundColor = "rgb(192, 76, 54)";
    } else {
        for (var i = 0; i < menu.length; i++) {
            menu[i].style.color = "rgb(192, 76, 54)";
            menu[i].style.fill = "rgb(192, 76, 54)";
        }
        content.style.backgroundColor = "rgb(249, 240, 229)";
    }
}

function changeImage(div) {
    if (div == logo) {
        image.style.height = "100%";
        image.style.flexBasis = "45%";
    } else {
        image.style.height= "50%";
        image.style.flexBasis = "40%";
        image.style.margin = "auto";
    }
}
