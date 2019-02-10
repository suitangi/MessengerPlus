function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function pin() {
  var cList = document.getElementsByClassName("_5l-3 _1ht1");
  var i;
  var convo;
  for (i = 0; i < cList.length; i++) {
      if(cList[i].getElementsByClassName("openToggler selected").length > 0)
      convo = cList[i];
  }
    convo.style.cssText = "background-color: #202020 !important; order: -1 !important;";

}

function unpin() {
  var cList = document.getElementsByClassName("_5l-3 _1ht1");
  var i;
  var convo;
  for (i = 0; i < cList.length; i++) {
      if(cList[i].getElementsByClassName("openToggler selected").length > 0)
      convo = cList[i];
  }
    convo.style.cssText = "";
}

document.getElementsByClassName("_5l-3 _1ht1")[0].parentElement.style.cssText = "display: flex !important; flex-direction: column !important;";


function addPin(){
  var menuL = document.getElementsByClassName("_54nf");

  if(menuL.length > 0){
    var cList = document.getElementsByClassName("_5l-3 _1ht1");
    var i;
    var convo;
    for (i = 0; i < cList.length; i++) {
        if(cList[i].getElementsByClassName("openToggler selected").length > 0)
        convo = cList[i];
    }
    var style = window.getComputedStyle(convo);
    var ord = style.getPropertyValue('order');
    menu = menuL[0];
    if (ord == 0)
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" href=\"javascript:pin();\" role=\"menuitem\"><span><span class=\"_54nh\">Pin Conversation</span></span></a></li>");
    else
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" href=\"javascript:unpin();\" role=\"menuitem\"><span><span class=\"_54nh\">Unpin Conversation</span></span></a></li>");
    menu.insertBefore(fragment, menu.firstElementChild);
    var pinbutt = document.getElementsByClassName("_pinbutton")[0];
    pinbutt.onmouseover  = function() {document.getElementsByClassName("_pinbutton")[0].style.cssText = "background-color: #505050 !important;"};
    pinbutt.onmouseleave  = function() {document.getElementsByClassName("_pinbutton")[0].style.cssText = ""};
  }
}



document.addEventListener("click", function(){
  oncReset();
});

function oncReset(){
    var bList = document.getElementsByClassName("_5blh _4-0h");
    var i  = 0;
    for(i = 0; i < bList.length; i++){
      bList[i].onclick = function() {
              setTimeout(function(){ addPin();}, 20);

      };
    }
}
document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].onscroll = function(){oncReset();};
oncReset();
