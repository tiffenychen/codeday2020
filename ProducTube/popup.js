/*Productube Chrome Extension - Popup JavaScript */

// VARIABLES AND CONSTANTS _____________________________________________________________________________________________

var keyStoreVals = ['keywords', 'session_keywords' , 'max_wordID', 'session_block' ]
const FREQ_COUNT_CAP =1000000


var lastDeletedKeywordObj = {"lastKey":null, "lastKeyInfo":null , "lastKeyStorageType":null}


deletedKeywords= {   
    "MUSICAL":[{
                "total_freq": 10000000,
                "session_freq": 0,
                "first_occur": Date.now(),
                "latest_occur": null,
                "wordID":0
                }, "NoNoWord"]
}


// MAIN RENDERING FUNCTION _____________________________________________________________________________________________
document.addEventListener('DOMContentLoaded', function(){
    
    //flip the check box depending on the current mode // default initialization should be leisure
    chrome.storage.local.get( ['mode'], function(val) {
        var currMode = val.mode
        var dad = document.getElementById("focusSwitch").parentElement
        
        console.log("WHAT IS THE CURRENT STATE? ", currMode )
        if (currMode == "PRODUCTIVITY"){
            // setTimeout(function() { document.getElementById("focusSwitch").checked = true; }, 0)
            document.getElementById("focusSwitch").checked = true
            // $("#focusSwitch").prop( "checked", true );
            // var dad = $("#focusSwitch").parent()
            // dad.classList.remove('switch3-checked')
            // dad.offsetHeight
            dad.classList.add('switch3-checked')
            // dad.addClass('switch3-checked');
        }
        else{
            // $("#focusSwitch").prop( "checked", false);
            document.getElementById("focusSwitch").checked = false
            // var dad = document.getElementById("focusSwitch").parentElement
            dad.classList.remove('switch3-checked')
            // var dad = $("#focusSwitch").parent()
            // dad.removeClass('switch3-checked');
        }
    });
    
    show_list()
            // show_list(function(){
            //     //hide the blocks right after we intially render them to determine if a value can be scrolled (may need to be a callback, but I'll write this sequentially for now)
            //     var blocks = document.querySelectorAll(".middleBlock")
            //     console.log(blocks)
            //     blocks.forEach(function(block){
            //         if (block.id != "introBlock"){
            //             block.style.display = "none"
            //             block.style.visibility = "visible"
            //         }  
            //     })
            // })
   



    //put a listener on every button on the popup
    articles = document.getElementsByTagName('button');
    for (var i = 0; i < articles.length; i++) {
        articles[i].addEventListener('click',onclick,false);
    }

    function onclick(event){

        console.log("clickety click click")
        chrome.tabs.query({currentWindow: true, active:true },
        function( tabs ){

            chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": event.target.id}  ) //sends info to content.js and prints whatever 'this' is
            chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": "[" +event.target.id+"] || [start_timer]:" }  )
            // chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": "[" +event.target.id+"] || [start_timer]:"+event.target.id=="start_timer" }  )
            chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": event.target.id=="start_timer" }  )

            switch (event.target.id){
                case "add_new_keyword":

                    var string = document.getElementById("text1").value;//"HELLO HAPPY DAY"; //STRING FROM INPUT FIELD
                    var strArr =  string.toUpperCase().split(" ").filter(Boolean);
                    var list = document.getElementById("keys-list");
                    addKeywords(strArr, list)
                    document.getElementById("text1").value = '';                               
                    break;
                case "delete_keyword": //changed to not need to be based off one button (obviously) do it's found in a function below
                    // chrome.runtime.sendMessage({"message": "DELETE_KEYWORD", "keyword": "cats" } , tester2 ) //sends keyword to background.js to delete from the keyword list
                    break;
                case "start_timer": //timer UI is not implmented at the moment 
                    // chrome.runtime.sendMessage({"message": "START_TIMER", "duration": 1, "alarm_name": "PRODUCTIVE_MODE" } , tester2 ) 
                    chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": "set the alarm1"}  )
                    chrome.alarms.create( "PRODUCTIVITY_MODE", { delayInMinutes: 0.25 //, periodInMinutes: 0.1 
                    });
                    window.close();
                    chrome.tabs.sendMessage(tabs[0].id, {"message": "print_test", "printMsg": "set the alarm2"}  )
                    chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'PRODUCTIVITY', "session_keywords": {}, "session_block": {} }} , function(){
                        console.log("PRODUCTIVE TIME NEW SESSION")
                        // alert("success")
                    } )
                    // chrome.storage.local.set({'mode':'PRODUCTIVITY'}, function() {
                    //     // console.log('Value is set to ' + value);
                    // });
                    //this 1) sets the alarm and 2) changes the storage value for whether we're in productivity mode or not to true (value used for reference if we will pause video )
                    break;
                case "stop_timer": //timer UI is not implmented at the moment 
                    // chrome.runtime.sendMessage({"message": "STOP_TIMER" } , tester2 ) 
                    chrome.alarms.clear("PRODUCTIVITY_MODE");
                    window.close();
                    chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'LEISURE'}} , function(){
                        console.log("LEISURE TIME")
                        // alert("success")
                    } )
                    // chrome.storage.local.set({'mode':'LEISURE'}, function() {
                    //     // console.log('Value is set to ' + value);
                    // });
                    //this 1) clears ALL alarms (not refined further rn) and 2) changes the storage value for whether we're in productivity mode or not to false (value used for reference if we will pause video )
                    break;
            }
        })
    }
    //functions only left as a reference to structure and for learning
    function setCount (res) {
        const div = document.createElement('div')
        div.textContent = `${res.count} instances:: ${res.divContent}`
        document.body.appendChild(div)
    }
    function tester (res) { //this function allows us to append to the page
        console.log("clicking")
        const div = document.createElement('div')
        div.textContent = ` hidiho ${res.testVal} |||  ${res.divContent}`
        document.body.appendChild(div)
    }
    function tester2 (res) {
        console.log("adding new keyword.......")
    }
}, false)

// OTHER LISTENERS _____________________________________________________________________________________________________
document.getElementById("closingButton").addEventListener('click',function(){
    console.log("CLICKIE")
    var footerMenu = document.getElementById("keywordSummaryWrapper")
    // var footerMenuInfo = document.getElementById("keywordSummary")
    var footerMenuSpacer = document.getElementById("blankFooterSpace")

        var footerMenuSpacer = document.getElementById("blankFooterSpace")

        //CONVERT TO JAVASCRIPT LATER:

        // if ($("#keywordSummaryWrapper").hasClass('animateOut')){
        if (footerMenu.classList.contains('animateOut')){
            // styleOverflowScrollable(footerMenuInfo, "keywordSummary-s")
            footerMenu.classList.remove('animateOut')
            footerMenu.classList.add('animateIn')

            // $("#keywordSummaryWrapper").removeClass('animateOut');
            // $("#keywordSummaryWrapper").addClass('animateIn');
            console.log("ANIMATE IN")
            if ( footerMenuSpacer!= null && footerMenuSpacer.classList.contains("blankFooterSpaceCollapse")){
            // if (footerMenuSpacer!= null && (footerMenuSpacer.style.display == "" || footerMenuSpacer.style.display == "none")){
                console.log("IT'S NONE!!!")
                // footerMenuSpacer.style.display = "block"  
                footerMenuSpacer.classList.remove("blankFooterSpaceCollapse") 
                footerMenuSpacer.classList.add("blankFooterSpaceExpand") 
                
            }
            if (document.getElementById("cheveron").classList.contains("cheveronFlip")){
                document.getElementById("cheveron").classList.remove("cheveronFlip")
                console.log("REMOVING CHEVERON")
            }
            else{
                document.getElementById("cheveron").classList.add("cheveronFlip")
                console.log("ADDING CHEVERON")
            }
        }
        // else if ($("#keywordSummaryWrapper").hasClass('animateIn')){
        //     $("#keywordSummaryWrapper").removeClass('animateIn');
        //     $("#keywordSummaryWrapper").addClass('animateOut');
        //     console.log("ANIMATE OUT")
        else if (footerMenu.classList.contains('animateIn')){
            // styleOverflowScrollable(footerMenuInfo, "keywordSummary-s")
            footerMenu.classList.remove('animateIn')
            footerMenu.classList.add('animateOut')
            if ( footerMenuSpacer!= null && footerMenuSpacer.classList.contains("blankFooterSpaceExpand")){
            // if (footerMenuSpacer!= null && ( footerMenuSpacer.style.display == "block")){
                console.log("IT'S NONE!!!")
                // footerMenuSpacer.style.display = "none"   
                footerMenuSpacer.classList.remove("blankFooterSpaceExpand")
                footerMenuSpacer.classList.add("blankFooterSpaceCollapse")
            }
            if (document.getElementById("cheveron").classList.contains("cheveronFlip")){
                document.getElementById("cheveron").classList.remove("cheveronFlip")
                console.log("REMOVING CHEVERON")
            }
            else{
                document.getElementById("cheveron").classList.add("cheveronFlip")
                console.log("ADDING CHEVERON")
            }
        }
},false);


//SWITCH TO MANUALLY TURN PRODUCTIVITY MODE ON AND OFF
// found on a Codepen by Joel César (sweet switch!)
document.querySelector('.switch3 input').addEventListener('change', function(){
    var dad = this.parentElement;
    if(this.checked == true){
        dad.classList.add('switch3-checked')
        chrome.storage.local.get( ['last_video'], function(val) {
            console.log(val.last_video.url, val.last_video)
            chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'PRODUCTIVITY', "session_keywords": {}, "session_block": {} , 'last_video': { 'url': val.last_video.url  , 'toggle-cleared': true}}} , function(){
                console.log("PRODUCTIVE TIME NEW SESSION")
                //if necessary we can reload the page but it seems like a systme that's working fine shouldn't have this issue
                //location.reload()
            } )
        })
    }
    else{
        dad.classList.remove('switch3-checked')
        chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'LEISURE'}} , function(){
            console.log("LEISURE TIME")
        } )
    }
  });
// $('.switch3 input').on('change', function(){
//     var dad = $(this).parent();
//     if($(this).is(':checked')){
//         dad.classList.add('switch3-checked')
//         chrome.storage.local.get( ['last_video'], function(val) {
//             console.log(val.last_video.url, val.last_video)
//             chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'PRODUCTIVITY', "session_keywords": {}, "session_block": {} , 'last_video': { 'url': val.last_video.url  , 'toggle-cleared': true}}} , function(){
//                 console.log("PRODUCTIVE TIME NEW SESSION")
//             } )
//         })
//     }
//     else{
//         dad.classList.remove('switch3-checked')
//         chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'LEISURE'}} , function(){
//             console.log("LEISURE TIME")
//         } )
//     }
//   });

//   $('.switch3 input').on('change', function(){
//     var dad = $(this).parent();
//     if($(this).is(':checked')){
//         dad.addClass('switch3-checked');
//         chrome.storage.local.get( ['last_video'], function(val) {
//             console.log(val.last_video.url, val.last_video)
//             chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'PRODUCTIVITY', "session_keywords": {}, "session_block": {} , 'last_video': { 'url': val.last_video.url  , 'toggle-cleared': true}}} , function(){
//                 console.log("PRODUCTIVE TIME NEW SESSION")
//             } )
//         })
//     }
//     else{
//         dad.removeClass('switch3-checked');
//         chrome.runtime.sendMessage({"message": "save_keys", "user_changes": {'mode':'LEISURE'}} , function(){
//             console.log("LEISURE TIME")
//         } )
//     }
//   });

// SUBMIT INPUT FOR KEYWORD IF ENTER IS PRESSED IN INPUT FIELD
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.id == 'text1' ) {
        document.getElementById("add_new_keyword").click();
      }
})


    // document.getElementById("restoreLastDeletedButton").addEventListener('click',function(){
    //     restoreKeyword( addUI )
        // var restoredUISpec = restoreKeyword()
        // console.log(restoredUISpec)
        // if (restoredUISpec != []){
        //     addUI(restoredUISpec[0], restoredUISpec[1], restoredUISpec[2],restoredUISpec[3])
        // }
        
    // })

// HELPER FUNCTIONS ____________________________________________________________________________________________________

/*Toggle Content and Navbar Color Changing Code*/
//THIS SHOULD BE CONVERTED TO PURE JAVASCRIPT LATER
var display = function(block_name, title) {
    // Toogle Middle Block Content 
    var blocks = document.querySelectorAll(".middleBlock")
    console.log(blocks)
    blocks.forEach(function(block){
        block.style.display = "none"
        block.style.visibility = "visible"
    })
    // document.getElementById(block_name).style.display="block"
    document.getElementById(block_name).style.display="flex"
    // $('.middleBlock').css('display', 'none');
    // $('.middleBlock').css('visibility', 'visible');
    
    // $('#' + block_name + '').css('display', 'block');
  
  }
  
  document.getElementById('timer').addEventListener('click', function() {
    display('timeBlock', this);
    hideObj("added_warning")
  });

  document.getElementById('list').addEventListener('click', function() {
    display('listBlock', this);
    hideObj("added_warning")
  });

  document.getElementById('freq').addEventListener('click', function() {
    display('freqBlock', this);
    hideObj("added_warning")
  });

//   $('#timer').on('click', function() {
//     display('timeBlock', $(this));
//   });
  
//   $('#list').on('click', function() {
//     display('listBlock', $(this));
//   });
  
//   $('#freq').on('click', function() {
//     display('freqBlock', $(this));
//   });

var navButtons = document.querySelectorAll(".navButtons")
console.log("navbuttons:" ,navButtons)
navButtons.forEach(function(nb){
    nb.addEventListener('click', function(e) {
        var navButtonsReset = document.querySelectorAll(".navButtons")
        navButtonsReset.forEach(function(nbr){
            nbr.classList.remove("color_change")
        })
        this.classList.add("color_change")
    })
   
})
//     $('.navButtons').click(function(e){
//         console.log("clicking navs")
//     $('.navButtons').removeClass("color_change")
//     $(this).addClass("color_change")
// });

//RENDER BOTH THE NONO LIST AND MOST FREQUENT LIST
function show_list(/*callback = null , */ oneList = null ){
    var list = document.getElementById("keys-list");
    var freq_list = document.getElementById("freq-list");
    chrome.storage.local.get( keyStoreVals, function(val) {
        var storageKeys = val.keywords; 
        var sessionStorageKeys = val.session_keywords;
        var x = val.keywords.length; 
        var new_max_wordID = val.max_wordID
        var block_sites = val.session_block

        var sortedStorageKeysArr = sortByNonDecreasingFreq(storageKeys, "TOTAL")
        var sortedSessionStorageKeysArr = sortByNonDecreasingFreq(sessionStorageKeys, "SESSION")

        var finishedCounter = 0

        if (oneList == null || oneList == "NoNoWord" ){
            // list.innerHTML = ""
            removeAllChildNodes(list)
            for (index = 0; index < sortedStorageKeysArr.length; index++) { 
                // for(let term in storageKeys){
                    term = sortedStorageKeysArr[index][0]
                    console.log("Keyword: " + term)
                    addUI(list, term, storageKeys[term], "NoNoWord" )
                    if (index+1 == sortedStorageKeysArr.length){
                        finishedCounter++
                    }
                }
        }
        if (oneList == null || oneList == "FrequentWord" ){
            console.log("freq_list refresh!")
            // freq_list.innerHTML = ""
            removeAllChildNodes(freq_list)
            for (index = 0; index < sortedSessionStorageKeysArr.length; index++) { 
                term = sortedSessionStorageKeysArr[index][0]
                console.log("Keyword: " + term)
                addUI(freq_list, term, sessionStorageKeys[term], "FrequentWord")
                if (index+1 == sortedStorageKeysArr.length){
                    finishedCounter++
                }
            } 
        }

        // if (callback && finishedCounter == 2){
            // return callback()
        // }
    });
  
}


// FUNCTION TO REMOVE ALL NODES FROM A DOM OBJECT WITHOUT USING innerHTML and getting a memory leak from not clearing the event handlers on the children
// e.g. each keyword has click events whose reference will be orphaned if we use innerHTMl = "" on the list
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


//DECIDE ON THE TYPE AND ASPECTS OF A KEYWORD TO RENDER
function addUI(ul, value, keywordInfo, keywordType ) {

    //might be a smart idea to make this quicker by changing the divs when you click the button instead of load the whole thing in on condition
    if (keywordInfo!= undefined){
        chrome.storage.local.get( keyStoreVals, function(val) {
            var storageKeys = val.keywords
        var freqType = null;
        var closeClassType = null;
        if ( keywordType=="NoNoWord" ){
            freqType="total_freq"
            closeClassType = "close"
        }
        else if ( keywordType=="FrequentWord" ){
            freqType="session_freq"
            if (value in storageKeys){
                // closeClassType = "close"
                closeClassType = "close-added" //we're not adding any buttons if it's been added before
            }
            else{
                closeClassType = "close-freq"
            }
            console.log("-------RENDERED")
        }
        addUIRender( ul, value, keywordInfo, keywordType, freqType, closeClassType)
        //HIDDEN ORIGINAL CODE:
                                // var li = document.createElement("li");
                                // li.classList.add("list-group-item")

                                // var infoDiv = document.createElement("div");
                                // infoDiv.classList.add("info-container")
                                // li.appendChild(infoDiv);
                                // // $("li").addClass("list-group-item");

                                // // li.appendChild(document.createTextNode(value));

                                // if (freqType in keywordInfo){
                                //     infoDiv.innerHTML =     "<div class='list-item-name' >"+
                                //                                 value+
                                //                             "</div>"+
                                //                             "<div class='list-item-freq' >"+
                                //                                 "("+keywordInfo[freqType]+")"
                                //                             "</div>"
                                //     }

                                // if (value != '') {
                                //     ul.appendChild(li);
                                // }
                                // var closeButton = document.createElement("SPAN");
                                // // closeButton.style.fontSize = "0.75rem";
                                // var x_txt = document.createTextNode("\u00D7");
                                // var plus_txt = document.createTextNode("+");
                                
                                // closeButton.classList.add(closeClassType);
                                // closeButton.appendChild(x_txt);
                                // li.appendChild(closeButton);
                                // if ( closeClassType == "close-freq" ){
                                //     var addButton = document.createElement("SPAN");
                                //     addButton.classList.add("add-freq");
                                //     addButton.appendChild(plus_txt);
                                //     li.appendChild(addButton);
                                //     addButton.addEventListener('click', function(event){
                                //         // var index = $(this).index(".close");
                                //         // console.log(index);
                                //         var div = this.parentElement;
                                //         console.log("PARENT DIV: ", div , "CHILD:" ,this)
                                //         //alternatively we can get rid of this removal and just apply a disable on the add button
                                //         var prevKey = this.previousSibling
                                //         if(prevKey  && prevKey.classList.contains("close-freq") ){
                                //             prevKey.classList.remove("close-freq")
                                //             prevKey.classList.add("close")
                                //         }
                                //         this.remove()
                                //         if (div){
                                //             var keyword = div.firstChild.firstChild.innerHTML
                                //             console.log( "PARENT VAL", div.firstChild.firstChild.innerHTML )
                                //             var list = document.getElementById("keys-list");
                                //             addKeywords([keyword], list)
                                //         }

                                //         // var div = this.parentElement
                                //         // chrome.storage.local.get( keyStoreVals, function(val) {
                                //         //     var storageKeys = val.keywords
                                //         //     var sessionStorageKeys = val.session_keywords
                                //         //     var keyword = div.firstChild.firstChild.innerHTML
                                //         //     storageKeys[keyword] = sessionStorageKeys[keyword]
                                //         //     var list = document.getElementById("keys-list");
                                //         //     chrome.storage.local.set({'keywords': storageKeys, 'session_keywords': sessionStorageKeys }, function() {
                                //         //     });
                                //         //     addUI(list, keyword, storageKeys[keyword], "NoNoWord")
                                //         // })



                                //         // var div = this.parentElement;
                                //         // console.log("PARENT DIV: ", div , "CHILD:" ,this)
                                //         // this.remove()
                                //         // if (div){
                                //         //     console.log( "PARENT VAL", div.firstChild.firstChild.innerHTML )
                                //         //     removeKeyword(div.firstChild.firstChild.innerHTML, keywordType)
                                //         //     div.remove()
                                //         // }
                                //     },false);
            })
        
        }
}

//RENDER A DOM OBJECT FOR THE KEYWORD
function addUIRender(ul, value, keywordInfo, keywordType, freqType, closeClassType ) {
    console.log("-------RENDERED",ul, value, keywordInfo, keywordType, freqType, closeClassType )
    var li = document.createElement("li");
    li.classList.add("list-group-item")

    // document.getElementById("myDIV").childElementCount

    var infoDiv = document.createElement("div");
    infoDiv.classList.add("info-container")

    li.appendChild(infoDiv);
    console.log("-------RENDERED2", keywordInfo[freqType])

    var listNumDiv = document.createElement("div");
    listNumDiv.classList.add("list-item-number")
    listNumDiv.textContent =  "("+(ul.childElementCount+1)+")"

    var nameDiv = document.createElement("div");
    nameDiv.textContent = value
    nameDiv.classList.add("list-item-name")

    if (value != '') {
        ul.appendChild(li);
    }
    var freqDiv = document.createElement("div");
    
    //if we hit a cap, to not burst from the allocated space, just print a static number with a plus sign after it
    console.log("freq num:", keywordInfo[freqType], parseInt(keywordInfo[freqType])<FREQ_COUNT_CAP)
    if (parseInt(keywordInfo[freqType])<FREQ_COUNT_CAP){
        freqDiv.textContent =  "("+keywordInfo[freqType]+")"
    }
    else{
        freqDiv.textContent =  "("+(FREQ_COUNT_CAP-1)+"+"+")"
    }
    freqDiv.title = keywordInfo[freqType]
    // freqDiv.textContent =  "("+keywordInfo[freqType]+")"
    freqDiv.classList.add("list-item-freq")
    // freqDiv.classList.add("list-item-freq")

    //YOU MUST FIRST APPEND (AS SEEN BELOW) TO THE DOCUMENT TREE BEFORE TRYING TO FIND INFO ABOUT SIZE (ALSO IT MUST NOT BE DISPLAY NONE, VISIBILITY: HIDDEN WORKS, HOWEVER) 
    if (freqType in keywordInfo){
        infoDiv.appendChild(listNumDiv)
        infoDiv.appendChild(nameDiv)
        infoDiv.appendChild(freqDiv)

        console.log("-------RENDERED",keywordInfo[freqType] )
    }

    styleOverflowScrollable( nameDiv, "list-item-name-s" )
    // if (nameDiv.scrollHeight != nameDiv.clientHeight){
    //     nameDiv.classList.add("list-item-name-s")
    // }
    console.log("VALS4:", nameDiv.scrollHeight, nameDiv.clientHeight)

    //ORIGINAL RENDER BEFORE TURNING TO DOCUMENT FUNCTIONS
        // if (freqType in keywordInfo){
        //     infoDiv.innerHTML =     "<div class='list-item-name' >"+
        //                                 value+
        //                             "</div>"+
        //                             "<div class='list-item-freq' >"+
        //                                 "("+keywordInfo[freqType]+")"
        //                             "</div>"
        //     console.log("-------RENDERED",keywordInfo[freqType] )
        // }
    //


    var closeButton = document.createElement("SPAN");
    closeButton.title = "Delete \""+value+"\"";
    var closeSpan = document.createElement("SPAN");
    var x_txt = document.createTextNode("\u00D7");
    var plusSpan = document.createElement("SPAN");
    var plus_txt = document.createTextNode("+");
    
    if (closeClassType == "close"){
        closeButton.classList.add(closeClassType);
        closeSpan.appendChild(x_txt);
        closeSpan.classList.add("closeSpan");
        closeButton.appendChild(closeSpan);
        li.appendChild(closeButton);
    }
    
    else if ( closeClassType == "close-freq" ){
        // var addButton = document.createElement("SPAN");
        // addButton.title = "Add to NoNoList"
        // addButton.classList.add("add-freq");
        // addButton.appendChild(plus_txt);
        // li.appendChild(addButton);
        var addButton = document.createElement("SPAN");
        addButton.title = "Add to NoNoList"
        addButton.classList.add("add");
        plusSpan.appendChild(plus_txt);
        plusSpan.classList.add("plusSpan");
        addButton.appendChild(plusSpan);
        li.appendChild(addButton);

        addButton.addEventListener('click', function(event){
            var div = this.parentElement;
            console.log("PARENT DIV: ", div , "CHILD:" ,this)
            //alternatively we can get rid of this removal and just apply a disable on the add button
            var prevKey = this.previousSibling
            // if(prevKey  && prevKey.classList.contains("close-freq") ){
            //     prevKey.classList.remove("close-freq")
            //     prevKey.classList.add("close")
            // }
            this.remove()
            if (div){
                var keyword = div.querySelector(".list-item-name").innerHTML
                // var keyword = div.firstChild.firstChild.innerHTML
                console.log( "PARENT VAL", div.querySelector(".list-item-name").innerHTML )
                var list = document.getElementById("keys-list");
                addKeywords([keyword], list, false)
            }
        },false);
    }
    // var recoverDiv = document.createElement("div");
    // recoverDiv.classList.add("list-item-recover");
    // li.appendChild(recoverDiv);

    console.log("VALS5: " ,nameDiv.scrollHeight, nameDiv.clientHeight)


    nameDiv.addEventListener('click', function(event){
        console.log(nameDiv.scrollHeight, nameDiv.clientHeight)   
    },false);

    nameDiv.click()

    closeButton.addEventListener('click', function(event){
        var div = this.parentElement;
        console.log("PARENT DIV: ", div , "CHILD:" ,this)
        // this.remove()
        if (div){
            console.log( "PARENT VAL", div.querySelector(".list-item-name").innerHTML )
            removeKeyword(div.querySelector(".list-item-name").innerHTML, keywordType)
            // div.remove()
            var recoverDiv = document.createElement("div");
            var undoDiv = document.createElement("div");
            undoDiv.textContent = "undo delete"
            undoDiv.setAttribute("key", div.querySelector(".list-item-name").innerHTML )
            undoDiv.classList.add("list-item-recover-text")
            recoverDiv.appendChild(undoDiv);
            recoverDiv.title = div.querySelector(".list-item-name").innerHTML 
            recoverDiv.classList.add("list-item-recover");
            li.appendChild(recoverDiv);

            undoDiv.addEventListener('click', function(event){
                if (this.getAttribute("key") in  deletedKeywords){
                    // this.remove()
                    var div = this.parentElement;
                    div.remove()
                    restoreKeyword( this.getAttribute("key") , function(){show_list("FrequentWord") } )  
                     
                    // deletedKeywords[this.key][0]                                              /////////////////////

                }
                
               
            },false);
        }
    },false);

    infoDiv.addEventListener('click', function(event){
        console.log("CLICK!!!", document.getElementById("keywordSummaryWrapper"),document.getElementById("keywordSummaryWrapper").style )
        var footerMenu = document.getElementById("keywordSummaryWrapper")
        var footerMenuInfo = document.getElementById("keywordSummary")
        // footerMenuInfo.classList.add("keywordSummary-s")
        console.log(footerMenuInfo)
        var footerMenuSpacer = document.getElementById("blankFooterSpace")

        console.log(event.currentTarget.querySelector(".list-item-name") )
        fillKeywordInfo(event.currentTarget.querySelector(".list-item-name"), keywordType)

        if (footerMenu!= null && (footerMenu.style.visibility == "" || footerMenu.style.visibility == "hidden")){
            footerMenu.style.visibility = "visible"

            //condition such that this listerner only fires this animation one time at the start:
            if (footerMenu!= null && !(footerMenu.classList.contains("animateIn"))){
                // styleOverflowScrollable(footerMenuInfo, "keywordSummary-s")
                footerMenu.classList.add("animateIn") 
                if (!(document.getElementById("cheveron").classList.contains("cheveronFlip"))){
                    document.getElementById("cheveron").classList.add("cheveronFlip")
                    console.log("ADDING CHEVERON FROM VAL")
                }
                // if (footerMenuSpacer!= null && (footerMenuSpacer.style.display == "" || footerMenuSpacer.style.display == "none")){
                if ( footerMenuSpacer!= null && !footerMenuSpacer.classList.contains("blankFooterSpaceExpand")){
                    if (footerMenuSpacer.classList.contains("blankFooterSpaceCollapse")){
                        footerMenuSpacer.classList.remove("blankFooterSpaceCollapse")
                    }
                    footerMenuSpacer.classList.add("blankFooterSpaceExpand") 
                    // footerMenuSpacer.style.display = "block"   
                    // ul.classList.add("expand-list-padding-transition")
                } 
            } 
        }
        else if (footerMenu!= null && (footerMenu.style.visibility == "visible")){
            if (footerMenu!= null && (footerMenu.classList.contains("animateOut"))){
                // styleOverflowScrollable(footerMenuInfo, "keywordSummary-s")
                footerMenu.classList.remove("animateOut") 
                footerMenu.classList.add("animateIn") 
                if (!(document.getElementById("cheveron").classList.contains("cheveronFlip"))){
                    document.getElementById("cheveron").classList.add("cheveronFlip")
                    console.log("ADDING CHEVERON FROM VAL")
                }
                if ( footerMenuSpacer!= null && !footerMenuSpacer.classList.contains("blankFooterSpaceExpand")){
                // if (footerMenuSpacer!= null && (footerMenuSpacer.style.display == "" || footerMenuSpacer.style.display == "none")){
                    // footerMenuSpacer.style.display = "block"  
                    if (footerMenuSpacer.classList.contains("blankFooterSpaceCollapse")){
                        footerMenuSpacer.classList.remove("blankFooterSpaceCollapse")
                    }
                    footerMenuSpacer.classList.add("blankFooterSpaceExpand")  
                } 
            }
        }
    },false);
}

//ADD KEYWORDS TO CHROME STORAGE SYNC
function addKeywords(kwList, list, reloadFreqList = true /*, fromInput = false */ ){

    chrome.storage.local.get(['keywords', 'session_keywords', 'max_wordID' ], function(result) {
        var storageKeys = result.keywords
        var sessionStorageKeys = result.session_keywords
        var new_max_wordID = result.max_wordID
        console.log("kwList:", kwList, storageKeys)
        kwList.forEach(function(term){
            var currDateTime = Date.now()
            if(!(term in storageKeys) && (!(term in deletedKeywords) || document.querySelectorAll('[key="'+term+'"]')[0] == undefined) ){
                
                if(!(term in sessionStorageKeys)){
                    storageKeys[term] ={
                        "first_occur": currDateTime,
                        "latest_occur": null,
                        "session_freq": 1,
                        "total_freq": 1,
                        "wordID": new_max_wordID++
                    }
                    addUI(list, term, storageKeys[term], "NoNoWord")
                }
                else{
                    storageKeys[term] ={
                        "first_occur": sessionStorageKeys[term].first_occur,
                        "latest_occur": sessionStorageKeys[term].latest_occur,
                        "session_freq": sessionStorageKeys[term].session_freq,
                        "total_freq": sessionStorageKeys[term].total_freq,
                        "wordID": sessionStorageKeys[term].wordID
                    }
                    addUI(list, term, storageKeys[term], "NoNoWord")
                }
                if (reloadFreqList){
                    show_list("FrequentWord")
                }
                if ( term in deletedKeywords ){
                    // restoreKeyword(term)
                    delete deletedKeywords[term]
                }
                // if ( !(document.getElementById("added_warning").classList.contains("hide"))){
                //     document.getElementById("added_warning").classList.add("hide")
                // }
                hideObj("added_warning")
            }
            else if (term in deletedKeywords && document.querySelectorAll('[key="'+term+'"]')[0] != undefined){
                var div = document.querySelectorAll('[key="'+term+'"]')[0].parentElement;
                div.remove()
                if (reloadFreqList){
                    restoreKeyword( term , function(){show_list("FrequentWord") } )  
                }
                else{
                    restoreKeyword(term)
                }
                // if ( !(document.getElementById("added_warning").classList.contains("hide"))){
                //     document.getElementById("added_warning").classList.add("hide")
                // }
                hideObj("added_warning")
                // restoreKeyword(term)

                // document.querySelectorAll('[key="'+term+'"]')[0].click()
            }
            else{
                //note: at this moment, it should be impossible to accidentally add a keyword from freq-list that is already in the NoNoList so this should work with no condition on where a keyword add is triggered
                // if (/* fromInput &&  */ document.getElementById("added_warning").classList.contains("hide")){
                //     document.getElementById("added_warning").classList.remove("hide")
                // }
                showObj("added_warning")
            }
        });
        //this one will make the changes instant
        chrome.runtime.sendMessage({"message": "save_keys", "user_changes": { 'keywords': storageKeys, 'max_wordID': new_max_wordID }} , function(){
            // alert("success")
        } )
        //this one will make all changes happen when the page refreshes or reloads
        // chrome.storage.local.set({ 'keywords': storageKeys, 'max_wordID': new_max_wordID }, function() {
        //     document.getElementById("text1").value = ''
        //     console.log("NEW ADDED VAL: " , storageKeys)
        // });
    });
}
function hideObj(id){
    if ( !(document.getElementById(id).classList.contains("hide"))){
        document.getElementById(id).classList.add("hide")
    }
}
function showObj(id){
    if (/* fromInput &&  */ document.getElementById(id).classList.contains("hide")){
        document.getElementById(id).classList.remove("hide")
    }
}

//REMOVE A DELETED KEYWORD FROM CHROME STORAGE SYNC
function removeKeyword(kw, keywordType) {
    chrome.storage.local.get( keyStoreVals, function(val) {
        var storageKeys = val.keywords; 
        var sessionStorageKeys = val.session_keywords;
        var x = val.keywords.length; 
        var new_max_wordID = val.max_wordID
        var block_sites = val.session_block


        if ( keywordType== "NoNoWord" && kw in storageKeys ){
            //Add word info to lastDeletedKeywordObj for possible recovery
            deletedKeywords[kw]=[ storageKeys[kw], keywordType ]
            lastDeletedKeywordObj = {"lastKey":kw, "lastKeyInfo":storageKeys[kw], "lastKeyStorageType": keywordType}
            delete storageKeys[kw]
        }
        else if (keywordType== "FrequentWord" && kw in sessionStorageKeys){
            //Add word info to lastDeletedKeywordObj for possible recovery
            deletedKeywords[kw]=[ sessionStorageKeys[kw], keywordType ]
            lastDeletedKeywordObj = {"lastKey":kw, "lastKeyInfo":sessionStorageKeys[kw], "lastKeyStorageType": keywordType}
            delete sessionStorageKeys[kw]
        }

        //removing the keyword from the list attached to every blocked url it was in
        for (url in block_sites){
            console.log("URL: ", block_sites[url] )
            if (kw in block_sites[url]["keywords"]){
                delete block_sites[url]["keywords"][kw]
                console.log("DELETED KEYWORD: "+ kw+ "    from: "+ url )
            }
            if (Object.keys(block_sites[url]["keywords"])<1){
                delete block_sites[url]
                console.log("DELETED: "+ url)
            }
            console.log("URL: ", block_sites[url] )
        }
        

        chrome.runtime.sendMessage({"message": "save_keys", "user_changes": { 'keywords': storageKeys, 'session_keywords': sessionStorageKeys, 'session_block': block_sites }} , function(){
            if (keywordType== "NoNoWord"){
                show_list("FrequentWord")
            }
            else if (keywordType== "FrequentWord"){
                show_list("NoNoWord")
            }
            
            console.log("VALS LEFT AFTER DELETION: " , storageKeys)
        } ) 
    }); 
}

//RESTORE LAST DELETED KEYWORD TO CHROME STORAGE SYNC
function restoreKeyword( kw , reAddCallback = null ) {
    chrome.storage.local.get( keyStoreVals, function(val) {
        var storageKeys = val.keywords; 
        var sessionStorageKeys = val.session_keywords;
        var x = val.keywords.length; 
        var new_max_wordID = val.max_wordID
        var block_sites = val.session_block

        var listDiv = "keys-list"

        if ( !(kw in storageKeys)  || !(kw in sessionStorageKeys) ){
            if ((kw in deletedKeywords) ){
                if (deletedKeywords[kw][1] == "NoNoWord"){
                    storageKeys[kw] = deletedKeywords[kw][0]
                }
                else if (deletedKeywords[kw][1] == "FrequentWord"){
                    sessionStorageKeys[kw] = deletedKeywords[kw][0]
                }
                chrome.runtime.sendMessage({"message": "save_keys", "user_changes": { 'keywords': storageKeys, 'session_keywords': sessionStorageKeys }} , function(){
                    if (reAddCallback!= null){
                        //refresh the other list to show updates
                        reAddCallback()
                    }
                    delete deletedKeywords[kw]


                    console.log("new array: " , [ document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType  ])
                    // return [document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType  ]
                    // reAddCallback(document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType )
                } ) 
            }
        }
        // if (!(kw in storageKeys) ){

        // }

        // if ( lastDeletedKeywordObj.lastKey != null && lastDeletedKeywordObj.lastKeyInfo != null &&  lastDeletedKeywordObj.lastKeyStorageType != null &&  !(lastDeletedKeywordObj.lastKey in storageKeys) ){
        //     if (lastDeletedKeywordObj.lastKeyStorageType == "NoNoWord"){
        //         storageKeys[lastDeletedKeywordObj.lastKey] = lastDeletedKeywordObj.lastKeyInfo
        //     }
        //     else if (lastDeletedKeywordObj.lastKeyStorageType == "sessionStorageKeys"){
        //         sessionStorageKeys[lastDeletedKeywordObj.lastKey] = lastDeletedKeywordObj.lastKeyInfo
        //         listDiv = "freq-list"
        //     }
            
        //     chrome.runtime.sendMessage({"message": "save_keys", "user_changes": { 'keywords': storageKeys, 'session_keywords': sessionStorageKeys }} , function(){

        //         console.log("new array: " , [ document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType  ])
        //         // return [document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType  ]
        //         reAddCallback(document.getElementById(listDiv), lastDeletedKeywordObj.lastKey , lastDeletedKeywordObj.lastKeyInfo , lastDeletedKeywordObj.lastKeyStorageType )
        //     } ) 
        // }

        // else{
        //     return []
        // }
    }); 
}

//SORTING FUNCTION TO PRODUCE THE ORDER OF THE RENDERED LISTS FORM TOP TO BOTTOM
function sortByNonDecreasingFreq(keysObject, freqType , reverse = false ){
    console.log("in sorting function: " , keysObject)
    var fType = "total_freq" // defaults to total_freq sorting if nothing is given
    if (freqType == "SESSION"){
        fType = "session_freq"
    }
    var keys = keysObject;
    var sortable = [];

    for (var term in keys) {
        if(keys.hasOwnProperty(term)){
            sortable.push([term, keys[term][fType]]);
        } 
    }
    sortable.sort(function(a, b) {
        console.log("SORTING: b=",b, "a=", a)
        // return b[1]-a[1]
        return ( reverse ? parseInt( a[1], 10 )-parseInt( b[1], 10 )  :  parseInt( b[1], 10 )-parseInt( a[1], 10 ) ); //parseInt does not default to base 10/ decimal so we must set the radix
    });
    console.log("New array: ",sortable )

    return sortable
}

//SORTING FUNCTION TO PRODUCE THE ORDER OF MOST RECENT LISTS FROM TOP TO BOTTOM (newest to oldest by default)
// oldestFirst  = oldest to newest (T-B)
// !oldestFirst = newest to oldest (T-B)
function sortByDate(keysObject, dateType , oldestFirst = false ){
    console.log("in sorting function: " , keysObject)
    var dType = "latest_occur" // defaults to total_freq sorting if nothing is given
    if (dateType == "CREATED"){
        dType = "first_occur"
    }
    var keys = keysObject;
    var sortable = [];

    for (var term in keys) {
        if(keys.hasOwnProperty(term)){
            sortable.push([term, keys[term][dType ? dType : "first_occur"]]);
        } 
    }
    sortable.sort(function(a, b) {
        console.log("SORTING: b=",b, "a=", a)
        // return b[1]-a[1]
        return (oldestFirst ? a[1]-b[1] : b[1]-a[1]) //can subtract because they are date objects
    });
    console.log("New array: ",sortable )

    return sortable
}

//PULL INFO ON A KEYWORD FROM CHROME STORAGE SYNC ON CLICK OF A OBJECT AND FILL THE KEYWORD SUMMARY OBJECT
function fillKeywordInfo(clickedKeyword, keywordType ) {

    chrome.storage.local.get( keyStoreVals, function(val) {
        var storageKeys = val.keywords; 
        var sessionStorageKeys = val.session_keywords;
        var x = val.keywords.length; 
        var new_max_wordID = val.max_wordID
        var block_sites = val.session_block

        var keys = null;
        if ( keywordType=="NoNoWord" ){
            keys=storageKeys
        }
        else if ( keywordType=="FrequentWord" ){
            keys=sessionStorageKeys
        }

        var currKeyword = clickedKeyword.innerHTML 
        var currKeywordDate = null;
        if (currKeyword in keys){
            if (keys[currKeyword]["latest_occur"] != null){
                currKeywordDate = keys[currKeyword]["latest_occur"]
            }   
            else{
                currKeywordDate = keys[currKeyword]["first_occur"]
            }
            // const date = new Date('2010-08-05')
            const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }) 
            const [{ value: month },,{ value: day },,{ value: year },,{ value: hour },,{ value: minute },,{ value: second }] = dateTimeFormat.formatToParts(currKeywordDate ) 

            // console.log(`${day}-${month}-${year }`)
            console.log(day+"-"+month+"-"+year)
            // console.log(`${day}👠${month}👢${year}`) // just for fun

            document.getElementById("keywordSummary-keyword").innerHTML= currKeyword
            document.getElementById("keywordSummary-date").innerHTML= day+"-"+month+"-"+year+"-"+hour+":"+minute+":"+second
            document.getElementById("keywordSummary-freq-total-value").innerHTML = keys[currKeyword]["total_freq"]
            document.getElementById("keywordSummary-freq-last-value").innerHTML = keys[currKeyword]["session_freq"] 

            var footerMenuInfo = document.getElementById("keywordSummary")
            //TO ADD A "SCROLLABLE STYLE" TO THE INFO DIV IF A THE CONTENT CLICKED IS THAT LONG (NOTE: NOT ALL KEYWORDS THAT ARE LONG ENOUGH TO BE SCROLLABLE IN THEIR DIV ARE LONG ENOUGH TO MAKE THE INFO DISPLAY DIV SCROLLABLE)
            styleOverflowScrollable( footerMenuInfo, "keywordSummary-s" )
        }
    })
}

//this would be a general function but I don't want to mess with two types (callback true and false) of endless parameters so... not finishing for now
    // function inStorage( kw , storageType, callbackTrue, callbackFalse ){
    //     chrome.storage.local.get( keyStoreVals, function(val) {
    //         var storageKeys = val.keywords
    //         var sessionStorageKeys = val.session_keywords
    //         var keys = null
    //         if (storageType == "NoNoWord"){
    //             keys = storageKeys
    //         }
    //         else if (storageType == "FrequentWord"){
    //             keys = sessionStorageKeys
    //         }
    //         console.log("KEY IN NONO LIST:" , kw, kw in keys)
    //         if (kw in keys){
    //             callbackTrue()
    //         }
    //         else{
    //             callbackFalse()
    //         }
    //     })
    // }
//

//ADD ADDITIONAL STYLING TO DIVS THAT ARE OVERFLOWED AND SCROLLABLE
function styleOverflowScrollable( DOMobject , scrollCSSClass = null ){
    //note: for this to work, the DOM element in question must have been added to the page's DOM structure
    //it can not be a randomly generated DOM element that's just a variable and floating
    console.log("ELEMENT S:", DOMobject.scrollHeight , DOMobject.clientHeight, scrollCSSClass, DOMobject.classList, (DOMobject.classList.contains(scrollCSSClass)))
    if (scrollCSSClass != null && DOMobject.scrollHeight != DOMobject.clientHeight && !(DOMobject.classList.contains(scrollCSSClass))){
        DOMobject.classList.add(scrollCSSClass)
        console.log("SCROLLABLE!!!")
    }
    else if ( scrollCSSClass != null && DOMobject.scrollHeight == DOMobject.clientHeight && (DOMobject.classList.contains(scrollCSSClass)))
        DOMobject.classList.remove(scrollCSSClass)
        console.log("NOT SCROLLABLE....")
}

 

