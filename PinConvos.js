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
    var pinSym = create("<div class = \"pinsym\" style=\"position: absolute; top:27px;right: 10px; font-size: 20px; opacity: 0.5; filter:saturate(0); filter:brightness(0)\">📌</div>");
    var convoEle = convo.getElementsByClassName("_1qt3 _5l-3")[0];
    convoEle.insertBefore(pinSym, convoEle.lastChild.nextSibling);
    convo.getElementsByClassName("_5blh _4-0h")[0].click();
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
    convo.getElementsByClassName("pinsym")[0].remove();
    convo.getElementsByClassName("_5blh _4-0h")[0].click();
}


function addPin(){
  var menuL = document.getElementsByClassName("_54nf");
//  var buttL = document.getElementsByClassName("_pinbutton");  && buttL.length < 1
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
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh\">Pin Conversation</span></span></a></li>");
    else
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh\">Unpin Conversation</span></span></a></li>");
    menu.insertBefore(fragment, menu.firstElementChild);
    var pinbutt = document.getElementsByClassName("_pinbutton")[0];
    pinbutt.onmouseover  = function() {document.getElementsByClassName("_pinbutton")[0].style.cssText = "background-color: #505050 !important;"};
    pinbutt.onmouseleave  = function() {document.getElementsByClassName("_pinbutton")[0].style.cssText = ""};
    if (ord == 0)
      pinbutt.addEventListener("click", function(){pin()});
    else
      pinbutt.addEventListener("click", function(){unpin()});
  }
}

function oncReset(){
    var bList = document.getElementsByClassName("_5blh _4-0h");
    var i  = 0;
    for(i = 0; i < bList.length; i++){
      if(!bList[i].hasAttribute("data-pin")){
        var attr = document.createAttribute("data-pin");
        attr.value = "true";
        bList[i].setAttributeNode(attr);
        bList[i].addEventListener("click", function(){
          setTimeout(function(){ addPin();}, 20);
        });
      }
    }
}
document.addEventListener("click", function(){
    oncReset();
});


var start = setInterval(function(){
    console.log("Loading...");
    if(document.getElementsByClassName("_5l-3 _1ht1").length > 0){
      oncReset();
      console.log("Loaded");
      document.getElementsByClassName("_5l-3 _1ht1")[0].parentElement.style.cssText = "display: flex !important; flex-direction: column !important;";
      document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].onscroll = function(){oncReset();};
      clearInterval(start);
    }
}, 1000);
