// Functions for the Artist Travelers Project landing page
const WELCOME = document.getElementById("welcome-div");
const ABOUT = document.getElementById("about-div");
const LOGO = document.getElementById("atp-logo");
const MENU = document.querySelectorAll(".menu-item");
const IMAGE = document.getElementById("image-container");
const CONTENT = document.getElementById("content-container");

function openDiv(div) {
    console.log("openDiv called on", div);
    LOGO.style.display = "none";
    ABOUT.style.display = "none";
    WELCOME.style.display = "none";
    div.style.display = "block";
    swapColors(div);
    changeImage(div);
}

function swapColors(div) {
    if (div == LOGO) {
        for (var i = 0; i < MENU.length; i++) {
            MENU[i].style.color = "white";
            MENU[i].style.fill = "white";
        }
        CONTENT.style.backgroundColor = "rgb(192, 76, 54)";
    } else {
        for (var i = 0; i < MENU.length; i++) {
            MENU[i].style.color = "rgb(192, 76, 54)";
            MENU[i].style.fill = "rgb(192, 76, 54)";
        }
        CONTENT.style.backgroundColor = "rgb(249, 240, 229)";
    }
}

function changeImage(div) {
    if (div == LOGO) {
        IMAGE.style.height = "100%";
        IMAGE.style.flexBasis = "45%";
    } else {
        IMAGE.style.height= "50%";
        IMAGE.style.flexBasis = "40%";
        IMAGE.style.margin = "auto";
    }
}
