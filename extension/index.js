//creates an HTML element given the string to build said element
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

//embeds a youtube video with the specific vId
function embedVideo(vId){
  var wid = window.vList[i].offsetWidth;
  var hei = wid / 16 * 9;
  var video = create("<iframe width=\""+ wid +"\" height=\""+ hei + "\" src=\"https://www.youtube.com/embed/" + vId + "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>");
  var placer = window.vList[i].firstChild;
  window.vList[i].style.cssText = "border: 0px !important";
  window.vList[i].insertBefore(video, placer);
  window.vList[i].removeChild(placer);
}

//Replace Youtube links with embedded video
function embedVideos(){
  window.ob2.disconnect();
  for(i = 0; i < window.vList.length; i++){
  	var vLink = window.vList[i].firstChild.href;
    if(vLink != null){
    	if(vLink.includes("youtube.com/watch?v=")){ //standard youtube link
    		var vPos = vLink.lastIndexOf("youtube.com/watch?v=") + 20;
    		var vId = vLink.slice(vPos);
        embedVideo(vId);
      }
      else if(vLink.includes("youtube.com%2Fwatch%3Fv%3D")){ //messenger redirect
        var vPos = vLink.lastIndexOf("youtube.com%2Fwatch%3Fv%3D") + 26;
    		var vId = vLink.slice(vPos);
        if (vId.indexOf("%26") != -1 && vId.indexOf("%26") < vId.indexOf("&"))
          vId = vId.slice(0, vId.indexOf("%26"));
        else
          vId = vId.slice(0, vId.indexOf("&"));
          embedVideo(vId);
      }
      else if(vLink.includes("youtu.be%2F")){ //linkedshortened messenger redirect
        var vPos = vLink.lastIndexOf("youtu.be%2F") + 11;
        var vId = vLink.slice(vPos);
        if (vId.indexOf("%26") != -1 && vId.indexOf("%26") < vId.indexOf("&"))
          vId = vId.slice(0, vId.indexOf("%26"));
        else
          vId = vId.slice(0, vId.indexOf("&"));
          embedVideo(vId);
      }
      else if(vLink.includes("youtu.be/")){ //linkedshortened messenger redirect
        var vPos = vLink.lastIndexOf("youtu.be/") + 9;
        var vId = vLink.slice(vPos);
          embedVideo(vId);
      }

    }
  }
  if(document.getElementsByClassName("_2k8v")[0] != null){
    window.ob2.observe(document.getElementsByClassName("_2k8v")[0].nextSibling ,{
      childList: true,
      subtree: true});
  }
}

// //turn video embeds on
// function embedOn(){
//   window.embed = setInterval(function(){
//     console.log(window.vList.length, document.getElementsByClassName("_5i_d").length)
//     if(document.getElementsByClassName("_5i_d").length != window.vList.length){
//       console.log("work");
//       embedVideos();
//     }
//   }, 1000);
// }
//
// //turn off video embeds
// function embedOff(){
//   clearInterval(window.embed);
// }

//loads css file
function loadCSS(file) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(file + '.css');
  link.id = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}


//unloads css file
function unloadCSS(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}

//pins all the convo in the list passed (used for beginning of run)
function pinAll(list) {
  var cList = document.getElementsByClassName("_5l-3 _1ht1");
  var i = 0, j = 0;
  for(i = 0; i < list.length; i++){
    for(j = 0; j < cList.length; j++){
      if(list[i] == cList[j].firstChild.firstChild.getAttribute("data-href"))
        pin(cList[j]);
    }
  }
}

//pins the conversation passed in (convo passed is an HTML li element)
function pin(convo) {

    convo.className += " pinned";
    var lights = document.getElementsByClassName("lightswitch")[0];
    if(lights.getAttribute('data-light') == 'on'){
      convo.style.cssText = "background-color: #ddd !important; order: -1 !important;";
    }
    else{
      convo.style.cssText = "background-color: #181818 !important; order: -1 !important;";

    }
    var pinSym = create("<div class = \"pinsym\">📌</div>");
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

//unpins the conversation pased in (HTML li element)
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

//adds the pin button to the menu clicked
function addPin(){
  var menuL = document.getElementsByClassName("_54nf");

  //if menu item exists
  if(menuL.length > 0){
    //find the convo that has the menu open
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

    //add pin if order = 0, add unpin if order = -1
    if (ord == 0)
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh _pintext\">Pin Conversation</span></span></a></li>");
    else
      var fragment = create("<li class=\"_54ni __MenuItem _pinbutton\" role=\"Presentation\"><a class=\"_54nc\" role=\"menuitem\"><span><span class=\"_54nh _pintext\">Unpin Conversation</span></span></a></li>");
    menu.insertBefore(fragment, menu.firstElementChild);
    var pinbutt = document.getElementsByClassName("_pinbutton")[0];

    //setting the pin/unpin button mouseover stylechange
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
    pinbutt.onmouseleave = function() {
      document.getElementsByClassName("_pinbutton")[0].style.cssText = "";
      document.getElementsByClassName("_pintext")[0].style.cssText = "";
    };

    //setting the click action for the pin/unpin button
    if (ord == 0)
      pinbutt.addEventListener("click", function(){pin(convo); convo.getElementsByClassName("_5blh _4-0h")[0].click();});
    else
      pinbutt.addEventListener("click", function(){unpin(convo); convo.getElementsByClassName("_5blh _4-0h")[0].click();});
  }
}

//sets/resets the onclick actions for the settings button
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


//Classchanged function for the MutationObserver for active conversation
function classChanged() {
	if(link != window.location.href){
		window.link = window.location.href;
		pos = window.link.lastIndexOf("/");
		// console.log(window.link.slice(pos + 1)); //debug purposes
	}
	var act = document.getElementsByClassName("_1ht2")[0];
    window.ob.observe(act, {
      attributes: true,
      attributeFilter: ["class"]
    });
}

//Set the chat color to the color passed into the parameter
function changeChatColor(col){
  document.documentElement.style.setProperty("--chat-color", col);
}



//to load at the start of the DOM after it has been dynamically built
var start = setInterval(function(){
    console.log("Loading...");
    loadCSS('Default');
    if(document.getElementsByClassName("_5l-3 _1ht1").length > 0){

      //create the light switch and its variable-holder attribute
      var lightswitch = create("<div class = \"lightswitch\" title = \"Light and Dark mode switch\">  💡</div>");
      var title = document.getElementsByClassName("_1tqi")[0]
      title.parentElement.insertBefore(lightswitch, title);
      var lights = document.getElementsByClassName("lightswitch")[0];
      var att = document.createAttribute("data-light");
      att.value = "";
      lights.setAttributeNode(att);

      //get the dark/light theme saved from chrome data
      chrome.storage.sync.get({light_switch: 'on'}, function(data) {
        lights.setAttribute('data-light', data.light_switch);
        // console.log(data.light_switch);
        if(data.light_switch == 'off')
          loadCSS("DarkSkin");
      });

      //adds click listeners for the light switch
      lights.addEventListener("click", function(){
        if(lights.getAttribute('data-light') == 'on'){
          loadCSS('DarkSkin');
          unloadCSS('Default');
          lights.setAttribute('data-light', 'off');
          chrome.storage.sync.set({light_switch: 'off'}, function() {});

          var cList = document.getElementsByClassName("_5l-3 _1ht1");
          for (var i = 0; i < cList.length; i++) {
            var style = window.getComputedStyle(cList[i]);
            if(style.getPropertyValue('order') == -1)
              cList[i].style.cssText = "background-color: #181818 !important; order: -1 !important;";
          }
        }
        else{
          loadCSS('Default');
          unloadCSS('DarkSkin');
          lights.setAttribute('data-light', 'on');
          chrome.storage.sync.set({light_switch: 'on'}, function() {});

          var cList = document.getElementsByClassName("_5l-3 _1ht1");
          for (var i = 0; i < cList.length; i++) {
            var style = window.getComputedStyle(cList[i]);
            if(style.getPropertyValue('order') == -1)
              cList[i].style.cssText = "background-color: #ddd !important; order: -1 !important;";
          }
        }
      });


      oncReset();
      console.log("Loaded");

      //chatcolortest
      // loadCSS("ChatColor");
      // changeChatColor("#384712");

      //the mutation observer for changing active convos
      window.link = window.location.href;
      window.ob = new MutationObserver(function() {
        setTimeout(function(){embedVideos();}, 500);
        classChanged();
      });
      var act = document.getElementsByClassName("_1ht2")[0];
      window.ob.observe(act, {
        attributes: true,
        attributeFilter: ["class"]
      });

      //getting the list of pinned convos from chrome storage
      chrome.storage.sync.get({pinlist: ''}, function(data) {
        var pinnedList = data.pinlist.trim().split(" ");
        // console.log(pinnedList); //Debug Purposes
        pinAll(pinnedList);
      });

      //the mutation observer for new messages
      window.ob2 = new MutationObserver(function() {
        setTimeout(function(){embedVideos();}, 1000);
      });

      var videm = setInterval(function(){
          if(document.getElementsByClassName("_2k8v")[0] != null){
            window.ob2.observe(document.getElementsByClassName("_2k8v")[0].nextSibling ,{
              childList: true,
              subtree: true});
          }
          clearInterval(videm);
      }, 100);

      // start the youtube replacements
      window.vList = document.getElementsByClassName("_5i_d");
      setTimeout(function(){embedVideos();}, 500);

      //setting some CSS and reset functions
      document.getElementsByClassName("_5l-3 _1ht1")[0].parentElement.style.cssText = "display: flex !important; flex-direction: column !important;";
      document.getElementsByClassName("uiScrollableAreaWrap scrollable")[0].onscroll = function(){oncReset();};

      clearInterval(start);
    }
}, 1000); //before DOM is dynamically loaded, check every second
