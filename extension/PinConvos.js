function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function loadCSS(file) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(file + '.css');
  link.id = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function unloadCSS(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}


function pinAll(list) {
  var cList = document.getElementsByClassName("_5l-3 _1ht1");
  var i = 0, j = 0;
  for(i = 0; i < list.length; i++){
    for(j = 0; j < cList.length; j++){
      if(list[i] == cList[j].firstChild.firstChild.getAttribute("data-href"))
        pin(cList[j]);
    }
    // for(var k = 0; k < 10; k++){
    //   document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].scrollTo(0,document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].scrollHeight);}
    //
    //   cList = document.getElementsByClassName("_5l-3 _1ht1");
    //
    // i --;
    // console.log(i, j);
  }
}

function pin(convo) {
    var lights = document.getElementsByClassName("lightswitch")[0];
    if(lights.getAttribute('data-light') == 'on'){
      convo.style.cssText = "background-color: #ddd !important; order: -1 !important;";
      var pinSym = create("<div class = \"pinsym\" style=\"position: absolute; top:27px;right: 30px; font-size: 20px; opacity: 0.2; filter:saturate(0); filter:brightness(0)\">📌</div>");
    }
    else{
      convo.style.cssText = "background-color: #181818 !important; order: -1 !important;";
      var pinSym = create("<div class = \"pinsym\" style=\"position: absolute; top:27px;right: 30px; font-size: 20px; opacity: 0.2; filter:saturate(0); filter:brightness(40)\">📌</div>");
    }

    var convoEle = convo.getElementsByClassName("_1qt3 _5l-3")[0];
    convoEle.insertBefore(pinSym, convoEle.lastChild.nextSibling);
    chrome.storage.sync.get({pinlist: ''}, function(data) {
      var pinnedList = data.pinlist.split(" ");
      if(!pinnedList.includes(convo.firstChild.firstChild.getAttribute("data-href")))
        pinnedList.push(convo.firstChild.firstChild.getAttribute("data-href"));
      chrome.storage.sync.set({pinlist: pinnedList.join(' ')}, function() {
      });
    })
}

function unpin(convo) {
    convo.style.cssText = "";
    while(convo.getElementsByClassName("pinsym").length > 0){
      convo.getElementsByClassName("pinsym")[0].remove();}
    chrome.storage.sync.get({pinlist: ''}, function(data) {
      var pinnedList = data.pinlist.split(" ");
      for(var i = 0; i < pinnedList.length; i++){
       if (pinnedList[i] == convo.firstChild.firstChild.getAttribute("data-href")) {
         pinnedList.splice(i, 1);
       }
      }
      chrome.storage.sync.set({pinlist: pinnedList.join(' ')}, function() {
      });
    })
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
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh _pintext\">Pin Conversation</span></span></a></li>");
    else
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh _pintext\">Unpin Conversation</span></span></a></li>");
    menu.insertBefore(fragment, menu.firstElementChild);
    var pinbutt = document.getElementsByClassName("_pinbutton")[0];
    pinbutt.onmouseover  = function() {
      var lights = document.getElementsByClassName("lightswitch")[0];
      if(lights.getAttribute('data-light') == 'on'){
        document.getElementsByClassName("_pinbutton")[0].style.cssText = "background-color: #0084ff !important;";
        document.getElementsByClassName("_pintext")[0].style.cssText = "color: #fff !important;";
      }
      else{
        document.getElementsByClassName("_pinbutton")[0].style.cssText = "background-color: #505050 !important; color: #fff !important;";
      }
    };
    pinbutt.onmouseleave  = function() {
      document.getElementsByClassName("_pinbutton")[0].style.cssText =   "";
      document.getElementsByClassName("_pintext")[0].style.cssText = "";
    };
    if (ord == 0)
      pinbutt.addEventListener("click", function(){pin(convo); convo.getElementsByClassName("_5blh _4-0h")[0].click();});
    else
      pinbutt.addEventListener("click", function(){unpin(convo); convo.getElementsByClassName("_5blh _4-0h")[0].click();});
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
    loadCSS("Default");
    if(document.getElementsByClassName("_5l-3 _1ht1").length > 0){


      var lightswitch = create("<div class = \"lightswitch\" title = \"Light and Dark mode switch\" style=\"font-size: 18px; position: absolute; top: 12px; left: 40px; filter: hue-rotate(180deg); cursor:pointer;\">  💡</div>");
      var title = document.getElementsByClassName("_1tqi")[0]
      title.parentElement.insertBefore(lightswitch, title);
      var lights = document.getElementsByClassName("lightswitch")[0];

      var att = document.createAttribute("data-light");
      att.value = "";
      lights.setAttributeNode(att);

      chrome.storage.sync.get({light_switch: 'on'}, function(data) {
        lights.setAttribute('data-light', data.light_switch);
        // console.log(data.light_switch);
        if(data.light_switch == 'off')
          loadCSS("DarkSkin");
      });
      lights.addEventListener("click", function(){
        if(lights.getAttribute('data-light') == 'on'){
          loadCSS("DarkSkin");
          lights.setAttribute('data-light', 'off');
          chrome.storage.sync.set({light_switch: 'off'}, function() {});

          var cList = document.getElementsByClassName("_5l-3 _1ht1");
          for (var i = 0; i < cList.length; i++) {
            var style = window.getComputedStyle(cList[i]);
            if(style.getPropertyValue('order') == -1)
              cList[i].style.cssText = "background-color: #181818 !important; order: -1 !important;";
          }
          var pList = document.getElementsByClassName("pinsym")
          for (var i = 0; i < pList.length; i++)
            pList[i].style.cssText = "position: absolute; top:27px;right: 30px; font-size: 20px; opacity: 0.2; filter:saturate(0); filter:brightness(40)";

        }
        else{
          unloadCSS("DarkSkin");
          lights.setAttribute('data-light', 'on');
          chrome.storage.sync.set({light_switch: 'on'}, function() {});

          var cList = document.getElementsByClassName("_5l-3 _1ht1");
          for (var i = 0; i < cList.length; i++) {
            var style = window.getComputedStyle(cList[i]);
            if(style.getPropertyValue('order') == -1)
              cList[i].style.cssText = "background-color: #ddd !important; order: -1 !important;";
          }
          var pList = document.getElementsByClassName("pinsym")
          for (var i = 0; i < pList.length; i++)
            pList[i].style.cssText = "position: absolute; top:27px;right: 30px; font-size: 20px; opacity: 0.2; filter:saturate(0); filter:brightness(0)";
        }
      });

      oncReset();
      console.log("Loaded");
      chrome.storage.sync.get({pinlist: ''}, function(data) {
        var pinnedList = data.pinlist.trim().split(" ");
        console.log(pinnedList);
        pinAll(pinnedList);
      });

      document.getElementsByClassName("_5l-3 _1ht1")[0].parentElement.style.cssText = "display: flex !important; flex-direction: column !important;";
      document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].onscroll = function(){oncReset();};


      clearInterval(start);
    }
}, 1000);
