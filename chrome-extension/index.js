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
function embedVideo(i, source, vId){
  var wid = window.vList[i].offsetWidth;
  var hei = wid / 16 * 9;
  var video = create("<div class=\"video-container\"><iframe width=\""+ wid +"\" height=\""+ hei + "\" src=\"" + source + vId + "\" frameborder=\"0\" allow=\"accelerometer; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></div>");
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
        embedVideo(i, "https://www.youtube.com/embed/", vId);
      }
      else if(vLink.includes("youtube.com%2Fwatch%3Fv%3D")){ //messenger yt redirect
        var vPos = vLink.lastIndexOf("youtube.com%2Fwatch%3Fv%3D") + 26;
    		var vId = vLink.slice(vPos);
        if (vId.indexOf("%26") != -1 && vId.indexOf("%26") < vId.indexOf("&"))
          vId = vId.slice(0, vId.indexOf("%26"));
        else
          vId = vId.slice(0, vId.indexOf("&"));
          embedVideo(i, "https://www.youtube.com/embed/", vId);
      }
      else if(vLink.includes("youtu.be%2F")){ //linkedshortened yt messenger redirect
        var vPos = vLink.lastIndexOf("youtu.be%2F") + 11;
        var vId = vLink.slice(vPos);
        if (vId.indexOf("%26") != -1 && vId.indexOf("%26") < vId.indexOf("&"))
          vId = vId.slice(0, vId.indexOf("%26"));
        else
          vId = vId.slice(0, vId.indexOf("&"));
          embedVideo(i, "https://www.youtube.com/embed/", vId);
      }
      else if(vLink.includes("youtu.be/")){ //linkedshortened yt link
        var vPos = vLink.lastIndexOf("youtu.be/") + 9;
        var vId = vLink.slice(vPos);
          embedVideo(i, "https://www.youtube.com/embed/", vId);
      }
      else if(vLink.includes("clips.twitch.tv/")){//standard twitch clip
        var vPos = vLink.lastIndexOf("clips.twitch.tv/") + 16;
        var vId = vLink.slice(vPos);
        vId += "&autoplay=false";
          embedVideo(i, "https://clips.twitch.tv/embed?clip=", vId);
      }
      else if(vLink.includes("clips.twitch.tv%2F")){//messenger redirect twitch clip
        var vPos = vLink.lastIndexOf("clips.twitch.tv%2F") + 18;
        var vId = vLink.slice(vPos, vLink.indexOf("&"));
        vId += "&autoplay=false";
          embedVideo(i, "https://clips.twitch.tv/embed?clip=", vId);
      }
      else if(vLink.includes("twitch.tv%2Ftwitch%2Fclip%2F")){//messenger redirect twitch clip
        var vPos = vLink.lastIndexOf("twitch.tv%2Ftwitch%2Fclip%2F") + 28;
        var vId = vLink.slice(vPos, vLink.indexOf("&"));
        vId += "&autoplay=false";
          embedVideo(i, "https://clips.twitch.tv/embed?clip=", vId);
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

//get the file's text
function getHtml(file){
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(file);
  link.id = file;
  link.type = "text/html";
  console.log(link);
}

//pins all the convo in the list passed (used for beginning of run)
function pinAll(list) {
  var cList = document.getElementsByClassName("_5l-3 _1ht1");
  var objDiv = document.getElementsByClassName("uiScrollableAreaWrap")[0];

  var tries = 0;
  var pinny = setInterval(function(){
    tries += 1;
    console.log("Searching for pinned conversations. Iteration: " + tries);
    var i = 0, j = 0;
    for(i = 0; i < list.length; i++){
      for(j = 0; j < cList.length; j++){
        if(list[i] == cList[j].firstChild.firstChild.getAttribute("data-href")){
          pin(cList[j]);
          list.splice(i, 1);
          i--;
          break;
        }
      }
    }
    // console.log(list); //debug
    objDiv.scrollTop = objDiv.scrollHeight;
    if(list.length == 0 || (list.length == 1 && list[0] == "")){
      clearInterval(pinny);
      objDiv.scrollTop = 0;
      var load = document.getElementById("loader");
      document.getElementById("loadtext").innerHTML = "All Done!";
      load.removeChild(document.getElementsByClassName("lds-ring")[0]);
      setTimeout(function(){
        load.style.opacity = 0;
      },500);
      setTimeout(function(){
        load.parentElement.removeChild(load);
        unloadCSS("css/Loading");
      },1500);

    }
    if(tries > 29){ //timeout
      clearInterval(pinny);
      var load = document.getElementById("loader");
      load.parentElement.removeChild(load);
      unloadCSS("css/Loading");
      objDiv.scrollTop = 0;
      window.removeList = [];
      for(j = 0; j < list.length; j++){
        window.removeList.push(list[j]);
      }
      chrome.storage.sync.get({pinlist: ''}, function(data) {
        var pinnedList = data.pinlist.split(" ");
        for(j = 0; j < window.removeList.length; j++){
            for(var i = 0; i < pinnedList.length; i++){
             if (pinnedList[i] == window.removeList[j]) {
               pinnedList.splice(i, 1);
              console.log(i)
             }
          }
        }
        chrome.storage.sync.set({pinlist: pinnedList.join(' ')}, function() {
        });
      })
      window.alert("Unable to locate and pin conversations at: " + list.join(", ") + " . Conversations unpinned.\nPlease check your internet connection and Facebook Messenger's Status.");
      list = [];
    }
  }, 500);
}


//pins the conversation passed in (convo passed is an HTML li element)
function pin(convo) {

    convo.className += " pinned";
    var pMButt = document.getElementById("pMenuButton");
    if(pMButt.getAttribute('data-light') == 'on'){
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
      var pMButt = document.getElementById("pMenuButton");
      if(pMButt.getAttribute('data-light') == 'on'){
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

//toggles themes between dark and light
function changeTheme(){
  var lights = document.getElementById("LightB");
  var pMButt = document.getElementById("pMenuButton");
  if(pMButt.getAttribute('data-light') == 'on'){ //in light mode, go to the dark side
    loadCSS('css/DarkSkin');
    unloadCSS('css/Default');
    chrome.storage.sync.set({light_switch: 'off'}, function() {});
    var pMButt = document.getElementById("pMenuButton");
    pMButt.setAttribute('data-light', 'off');
    var cList = document.getElementsByClassName("_5l-3 _1ht1");
    for (var i = 0; i < cList.length; i++) {
      var style = window.getComputedStyle(cList[i]);
      if(style.getPropertyValue('order') == -1)
        cList[i].style.cssText = "background-color: #181818 !important; order: -1 !important;";
    }
    lights.innerHTML = "Light Mode";
    if(pMButt.getAttribute('data-border') == 'on')//load the dark border css
      loadCSS("css/DarkBorders");
  }
  else{//already in dark mode, go back to light mode
    loadCSS('css/Default');
    unloadCSS('css/DarkSkin');
    pMButt.setAttribute('data-light', 'off');
    chrome.storage.sync.set({light_switch: 'on'}, function() {});
    var pMButt = document.getElementById("pMenuButton");
    pMButt.setAttribute('data-light', 'on');
    var cList = document.getElementsByClassName("_5l-3 _1ht1");
    for (var i = 0; i < cList.length; i++) {
      var style = window.getComputedStyle(cList[i]);
      if(style.getPropertyValue('order') == -1)
        cList[i].style.cssText = "background-color: #ddd !important; order: -1 !important;";
    }
    lights.innerHTML = "Dark Mode";
    if(pMButt.getAttribute('data-border') == 'on')//unload the border css
      unloadCSS("css/DarkBorders");
  }
}

//toggles the border modes
function changeBorder(){
  var borders = document.getElementById("BorderB");
  var pMButt = document.getElementById("pMenuButton");
  if(pMButt.getAttribute('data-border') == 'on'){ //borders on, turn it off
    loadCSS("css/NoBorders");
    chrome.storage.sync.set({border_switch: 'off'}, function() {});
    if(pMButt.getAttribute('data-light') == 'off')
      unloadCSS("css/DarkBorders");
    pMButt.setAttribute('data-border', 'off');
    borders.innerHTML = "Enable Borders";
  }
  else {//borders off, turn it on (why tho)
    unloadCSS("css/NoBorders");
    chrome.storage.sync.set({border_switch: 'on'}, function() {});
    if(pMButt.getAttribute('data-light') == 'off')
      loadCSS("css/DarkBorders");
    pMButt.setAttribute('data-border', 'on');
    borders.innerHTML = "Disable Borders";
  }
}

//toggles the private modes
function changePrivate(){
  var privates = document.getElementById("PrivateB");
  var pMButt = document.getElementById("pMenuButton");
  if(pMButt.getAttribute('data-private') == 'on'){ //private mode  on, turn it off
    unloadCSS("css/Private");
    chrome.storage.sync.set({private_switch: 'off'}, function() {});
    pMButt.setAttribute('data-private', 'off');
    privates.innerHTML = "Enable Private Mode";
  }
  else { //private mode off, turn it on
    loadCSS("css/Private");
    chrome.storage.sync.set({private_switch: 'on'}, function() {});
    pMButt.setAttribute('data-private', 'on');
    privates.innerHTML = "Disable Private Mode";
  }
}

//toggles the compact modes
function changeCompact(){
  var compacts = document.getElementById("CompactB");
  var pMButt = document.getElementById("pMenuButton");
  if(pMButt.getAttribute('data-compact') == 'on'){ //private mode  on, turn it off
    unloadCSS("css/Compact");
    chrome.storage.sync.set({compact_switch: 'off'}, function() {});
    pMButt.setAttribute('data-compact', 'off');
    compacts.innerHTML = "Enable Compact Mode";
  }
  else { //compact mode off, turn it on
    loadCSS("css/Compact");
    chrome.storage.sync.set({compact_switch: 'on'}, function() {});
    pMButt.setAttribute('data-compact', 'on');
    compacts.innerHTML = "Disable Compact Mode";
  }
}

//initialization code~
if (window.location.href.includes("messenger.com/videocall/")) {//load this for call pages
  //get the dark/light theme saved from chrome data
  chrome.storage.sync.get({light_switch: 'on'}, function(data) {
    if(data.light_switch == 'off')
      loadCSS("css/DarkCall");
  });
}
else{ //load this for other pages

  //dislplay the loading screen
  loadCSS("css/Loading");
  var frag = create("<div ID = \"loader\" style = \"background:#101010;\"><div ID=\"loadtext\">Messenger+ is customizing your messenger, please wait...</div><div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div></div>");
  var body = document.getElementsByTagName("body")[0];
  body.insertBefore(frag, body.firstElementChild);


  //to load at the start of the DOM after it has been dynamically built
  var start = setInterval(function(){
      console.log("Loading...");
      loadCSS('css/Default');
      if(document.getElementsByClassName("_1tqi").length > 0){

        //create the light switch and its variable-holder attribute
        var pMenuButton = create("<div><div class=\"pMenuButton\" id=\"pMenuButton\" title = \"MessengerPlus Options\"></div></div>");
        var title = document.getElementsByClassName("_1tqi")[0]
        title.parentElement.insertBefore(pMenuButton, title);
        var pMButt = document.getElementById("pMenuButton");
        var att_light = document.createAttribute("data-light");
        att_light.value = "";
        var att_click = document.createAttribute("data-clicked");
        att_click.value = ""
        var att_border = document.createAttribute("data-border");
        att_border.value = ""
        var att_private = document.createAttribute("data-private");
        att_private.value = ""
        var att_compact = document.createAttribute("data-compact");
        att_compact.value = ""
        pMButt.setAttributeNode(att_light);
        pMButt.setAttributeNode(att_click);
        pMButt.setAttributeNode(att_border);
        pMButt.setAttributeNode(att_private);
        pMButt.setAttributeNode(att_compact);
        pMButt.setAttribute('data-clicked', 'off');

        // get the dark/light theme saved from chrome data
        chrome.storage.sync.get({light_switch: 'on'}, function(data) {
          pMButt.setAttribute('data-light', data.light_switch);
          if(data.light_switch == 'off'){
            loadCSS("css/DarkSkin");
            unloadCSS("css/Default");
          }
        });

        //borders are default off because I like it that way
        loadCSS("css/NoBorders");

        // get the border on/off saved from chrome data
        chrome.storage.sync.get({border_switch: 'off'}, function(data) {
          var pMButt = document.getElementById("pMenuButton");
          pMButt.setAttribute('data-border', data.border_switch);
          if(data.border_switch == 'on'){
            unloadCSS("css/NoBorders");
            if(pMButt.getAttribute('data-light') == 'off')
              loadCSS("css/DarkBorders");
          }
        });

        //get the private mode on/off saved from chrome data
        chrome.storage.sync.get({private_switch: 'off'}, function(data) {
          pMButt.setAttribute('data-private', data.private_switch);
          if(data.private_switch == 'on'){
            loadCSS("css/Private");
          }
        });

        //get the compact mode on/off saved from chrome data
        chrome.storage.sync.get({compact_switch: 'off'}, function(data) {
          pMButt.setAttribute('data-compact', data.compact_switch);
          if(data.compact_switch == 'on'){
            loadCSS("css/Compact");
          }
        });

        //adds click listeners for the plus menu button
        pMButt.addEventListener("click", function(){
          if(pMButt.getAttribute('data-clicked') == 'off'){
            pMButt.setAttribute('data-clicked', 'on');

            if(document.getElementById("pMenu") == null){
              var url = chrome.extension.getURL("PlusMenu.html");
              fetch(url)
                .then(function(response) {
                  return response.text();
                }).then(function(myText) {
                  var pMenu = create(myText);
                  var pMButt = document.getElementById("pMenuButton");
                  pMButt.parentElement.insertBefore(pMenu, pMButt);

                  //Set the lights button clickListener
                  var lights = document.getElementById("LightB");
                  lights.addEventListener("click", function(){
                    changeTheme();
                  });
                  if(pMButt.getAttribute('data-light') == 'off')
                    lights.innerHTML = "Light Mode";

                  //Set the borders button clickListener
                  var borders = document.getElementById("BorderB");
                  borders.addEventListener("click", function(){
                    changeBorder();
                  });
                  if(pMButt.getAttribute('data-border') == 'on')
                    borders.innerHTML = "Disable Borders";

                  //Set the private button clickListener
                  var privates = document.getElementById("PrivateB");
                  privates.addEventListener("click", function(){
                    changePrivate();
                  });
                  if(pMButt.getAttribute('data-private') == 'on')
                    privates.innerHTML = "Disable Private Mode";

                  //Set the compact button clickListener
                  var compacts = document.getElementById("CompactB");
                  compacts.addEventListener("click", function(){
                    changeCompact();
                  });
                  if(pMButt.getAttribute('data-compact') == 'on')
                    compacts.innerHTML = "Disable Compact Mode";

                });
              }
              else {
                document.getElementById("pMenu").style.visibility = "visible";
              }

          }
        });

        //other clicks closes the menu
        document.addEventListener("click", function(){
          if(pMButt.getAttribute('data-clicked') == 'on'){
            pMButt.setAttribute('data-clicked', 'off');
            if(document.getElementById("pMenu") != null)
              document.getElementById("pMenu").style.visibility = "hidden";
          }
        }, true);

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

        //implementing the observe for ob2
        var videm = setInterval(function(){
            if(document.getElementsByClassName("_2k8v")[0] != null){
              window.ob2.observe(document.getElementsByClassName("_2k8v")[0].nextSibling ,{
                childList: true,
                subtree: true
              });
              clearInterval(videm);
            }
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
}
