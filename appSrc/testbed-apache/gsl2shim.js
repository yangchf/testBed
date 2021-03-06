
DEFAULT_SIZZLE_URL = "http://gomeznetworks.com/utajs/sizzle.20090425wrb.js";
DEFAULT_SIZZLE_VERSION = "20090425wrb";

DEFAULT_GOMEZ_GLOBALS_URL = "http://gomeznetworks.com/utajs/GomezGlobalFunctions.ironman009.js";
DEFAULT_GOMEZ_GLOBALS_VERSION = "ironman009";

//DEFAULT_USER_AGENT use the user-agent of an official firefox release , it will make google suggestion,yahoo mail both happy.
DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.0.11) Gecko/2009060215 Firefox/3.0.11";
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

actionMap = {};

gomezDate = {
	init: function() {
		interpretAction(
			{
				"type" : "importJS",
				"name" : "GomezGlobalFunctions",
				"version" : DEFAULT_GOMEZ_GLOBALS_VERSION,
				"url" : DEFAULT_GOMEZ_GLOBALS_URL
			}).execute();
		gomezInit.init();
		gomezDate.selectOption = function(sel, idx) {
			var obj = sel.options[idx];
			if (obj.click) {
				obj.click();
			}
			obj.selected = true;
			sel.selectedIndex = idx;
			fireEvent('change', sel, {});
		}
	}
}

// Functions for encoding Unicode characters in a UTF-8 string into \uXXXX and back again.
// We need this for escaping characters in postscript, which is the base64 encoded.
// The base64 routines in Javascript and SQL (atob/btoa) don't understand anything
// other than ascii, so we have to adjust it for them.

function dec2hex ( textString ) {
  return (textString+0).toString(16).toUpperCase();
}

function  dec2hex4 ( textString ) {
  var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
  return hexequiv[(textString >> 12) & 0xF] + hexequiv[(textString >> 8) & 0xF] + hexequiv[(textString >> 4) & 0xF] + hexequiv[textString & 0xF];
}

function u2a(inputString) {
  var outputString = "";
  for (var i=0; i<inputString.length; i++) {
    var code = inputString.charCodeAt(i);
    if (code < 0x7F) {
      // standard ASCII char
      outputString += String.fromCharCode(code); }
	else if (code > 0xFFFF) {
      // \uXXXX\uXXXX
      // I think this case will never happen, because charCodeAt returns all
      // values < 0xFFFF.
	  code -= 0x10000
      outputString += '\\u'+ dec2hex4(0xD800 | (code >> 10)) +'\\u'+ dec2hex4(0xDC00 | (code & 0x3FF));
    }
	else {
      // \uXXXX
      outputString += '\\u'+dec2hex4(code); 
	}
  }
  return outputString;
}

var hexNum = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 
  A:1, B:1, C:1, D:1, E:1, F:1, 
  a:1, b:1, c:1, d:1, e:1, f:1 };
  
function convertCodePointToChar(codePoint) {
    if (codePoint <= 0xFFFF) {
      return String.fromCharCode(codePoint);
    } else if (codePoint <= 0x10FFFF) {
      codePoint -= 0x10000
      return String.fromCharCode(0xD800 | (codePoint >> 10)) + String.fromCharCode(0xDC00 | (codePoint & 0x3FF));
    } else {
      throw new Exception("Code point out of range: "+dec2hex(codePoint));
    }
}

function a2u(textString) {
  // first convert whole string to characters
  var outputString = "";
  for (var i=0; i<textString.length; i++) {   
	if (i<textString.length-5 && textString.charAt(i) == '\\' 
      && textString.charAt(i+1) == 'u' && textString.charAt(i+2) in hexNum
      && textString.charAt(i+3) in hexNum && textString.charAt(i+4) in hexNum
      && textString.charAt(i+5) in hexNum) {
      // \uXXXX
      var tempString = '';
      i += 2;
      for (var j=0; j<4; j++) {
        tempString += textString.charAt(i+j);
	  }
      i += 3;
      outputString += convertCodePointToChar(parseInt(tempString, 16)); 
	}
	else { 
      outputString += textString.charAt(i);
	}
  }
  return outputString;
}

function superTypeOf(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			if (typeof value.length === 'number' && value.item == "[object]")
				s = 'array';
			else if (typeof value.length === 'number' &&
				!(value.propertyIsEnumerable('length')) &&
				typeof value.splice === 'function') {
				s = 'array';
			}
		} else {
			s = 'null';
		}
	}
	return s;
}

function HookDocComplete(win) {
	
	function injectShowModal(win) {
		var oldShowModalDialog = win.oldShowModalDialog;
		if (oldShowModalDialog != undefined) return;
		win.oldShowModalDialog = win.showModalDialog;
		win.showModalDialog = function(dialog, varArgIn, varOptions) {
			alert("Intercepted show modal: " + dialog + ', ' + varArgIn + ', ' + varOptions);
			win.open(dialog);
		}
	}
	try {
		injectShowModal(win);
	} catch(e) {
		alert("Failed to intercept show modal");
	}
}

function Locator(targetParams) {
	this.params = targetParams;
}
Locator.prototype.findFrame = function(targetWin, currentWin) {
	if (targetWin == "") return currentWin;
	
	if (currentWin == undefined) currentWin = external.getMainWindow();
	var chunks = targetWin.split(".");
	var currentChunk = chunks.length == 0 ? targetWin : chunks[0];
	
	var remainingChunk = "";
	for (var i=1; i<chunks.length; ++i) {
		remainingChunk += chunks[i];
		if (i < chunks.length-1) remainingChunk += ".";
	}
	
	if (currentChunk == "top") {
		return this.findFrame(remainingChunk, external.getMainWindow());
	} else if (currentChunk.indexOf("gomez_top") == 0) {
		var re = new RegExp("gomez_top\\[([0-9]*)\\]");
		var winIdx = re.exec(currentChunk)[1];
		if (winIdx == 0) return this.findFrame(remainingChunk, external.getMainWindow());
		else {
			winIdx = winIdx-1;
			var popups = external.getPopups();
			if (winIdx >= popups.count()) throw (new Error("Window " + (winIdx + 1) + " not found"));
			return this.findFrame(remainingChunk, popups.get(winIdx));
		}
	} else if (currentChunk.indexOf("frames[") == 0) {
		var safeFramesArray = external.getFrames(currentWin);
		alert("The current win has " + safeFramesArray.count() + " frames");
		var re = new RegExp("frames\\[([0-9]*)\\]");
		var idx = re.exec(currentChunk)[1];
		currentWin = safeFramesArray.get(idx);
		return this.findFrame(remainingChunk, currentWin);
	} else {
		alert("Unknown chunk: " + currentChunk);
	}
	return currentWin;
}
Locator.prototype.injectSizzle = function(win) {
	var body = fetchUrlString("sizzle", DEFAULT_SIZZLE_VERSION, DEFAULT_SIZZLE_URL, true, true);
	alert("injecting sizzle");
	var oldGet = win.document.getElementsByClassName;
	if (oldGet) win.document.getElementsByClassName = undefined;
	win.execScript(body);
	if (oldGet) win.document.getElementsByClassName = oldGet;
}
Locator.prototype.execute = function() {
	var win = external.getMainWindow();
	if (this.params.targetWindow != undefined) {
		win = this.findFrame(this.params.targetWindow);
	}
	var el = null;
	for (var i=0; i<this.params.locators.length; ++i) {
		if (this.params.locators[i][0] == "css") {			
			var cssSelector = this.params.locators[i][1];
			
			if (win.wrappedJSObject.Gomez_Sizzle == undefined) {
				try {
					this.injectSizzle(win);
					//make sure sizzle is ready
					if(!win.wrappedJSObject.Gomez_Sizzle){
						alert("Gomez_Sizzle isn't ready right now, wait for it.");
						//wait for window.Gomez_Sizzle.
						while(!win.wrappedJSObject.Gomez_Sizzle){
							external.waitFor(25);
						}
					}
				} catch(e) {
					alert("Failed to inject sizzle");
					continue;
				}
			}
			
			var els = win.wrappedJSObject.Gomez_Sizzle(cssSelector);
			//var els = window.Gomez_Sizzle(cssSelector, win.document);
            if (els.length == 0) continue;
			el = els[0];
			break;
		} else if (this.params.locators[i][0] == "dom") {
			try {
				//el = win.eval(this.params.locators[i][1]);
			    el = eval("win.wrappedJSObject." + this.params.locators[i][1]);
            } catch(e) {alert(e); continue;}
			if (el == null || superTypeOf(el) == "array") continue;
			break;
		}
	}
	if (el == null) throw (new Error("Failed to locate object: " + this.toString()));
    alert("Got " + el);
	//return el;
	return el.wrappedJSObject || el;
}
Locator.prototype.toString = function() {
	if (this.params.locators == undefined || this.params.locators.length == 0) return "(no locator)"; 
	var windowName = this.params.targetWindow != undefined ? this.params.targetWindow : "top";
	if (this.params.locators[0][0] == "css")
		return "CSS selector " + this.params.locators[0][1] + " in window " + windowName;
	if (this.params.locators[0][0] == "dom")
		return "DOM selector " + this.params.locators[0][1] + " in window " + windowName;
	return "(unknown locator syntax)";
}

function Action() {}
Action.prototype = {
	execute: function() {
		alert("Execute action");
	}
}

function Command() {}
Command.prototype = new Action();
Command.prototype.toJS = function() {}

function Wait(params) {
	this.params = params;
}
Wait.prototype = new Action();
Wait.prototype.execute = function() {
	alert("Waiting");
	if (this.params.criteria == "time" ) {
		var time = parseInt(this.params.absoluteMS);
		alert("Waiting for " + time + "ms");
		var completed = external.waitFor(time);
		if (!completed) {
			alert("Got internal error during wait for time");
			throw (new Error("INTERNAL_ERROR"));
		}
	} else if (this.params.criteria == "page_complete" ) {
		alert("Waiting for page load to complete");
		external.waitForNetRequestsComplete(1000, 250);
		var maximumWait = this.params.timeout ? parseInt(this.params.timeout) : 60*1000;
		var rvalue = external.waitForPageComplete(maximumWait);
		//
		// TODO: When the GPN can plumb detailed error messages through to the UI, reinstate the user script error
		// mechanism for reporting timeouts and stop reported them as timeoutstatus = 1 
		//
		if (rvalue == 1) {
			external.setDetailedErrorMessage("Wait for page complete timeout exceeded");
			throw (new Error("TIMEOUT_EXCEEDED"));
		} else if (rvalue == 2) {
			alert("Got internal error during wait for page complete");
			throw (new Error("INTERNAL_ERROR"));
		}
		external.waitForNetRequestsComplete(2000, 250);
	} else if (this.params.criteria == "network" ) {
		var maximumWait = this.params.timeout ? parseInt(this.params.timeout) : 60*1000;
		alert("Waiting for network operations to complete for a maximum of " + maximumWait + "ms");
		var rvalue = external.waitForNetRequestsComplete(maximumWait, 200);
		alert("Got return value of " + rvalue + " from native wait for net call");
		//
		// TODO: When the GPN can plumb detailed error messages through to the UI, reinstate the user script error
		// mechanism for reporting timeouts and stop reported them as timeoutstatus = 1
		//
		if (rvalue == 1) {
			external.setDetailedErrorMessage("Wait for network timeout exceeded");
			throw (new Error("TIMEOUT_EXCEEDED"));
		} else if (rvalue == 2) {
			alert("Got internal error during wait for net");
			throw (new Error("INTERNAL_ERROR"));
		}		
	} else if (this.params.criteria == "validation" ) {
		alert("Waiting for validation:\n" + this.params.validation);
		var timeout = this.params.timeout ? parseInt(this.params.timeout) : 30*1000;
		var endTime = new Date().getTime() + timeout;
		alert('Wait for validation will timeout at ' + endTime);
		this.params.validation.criteria = "element_match";
		this.params.validation.calledFromWait = true;
		while(true) {
			var val = new Validate(this.params.validation);
			try {
				val.execute();
				return;
			} catch(e) {
				alert("Saw that validation failed, but not giving up yet.")
			}
						
			//			
			// TODO: When the GPN can plumb detailed error messages through to the UI, reinstate the user script error
			// mechanism for reporting timeouts and stop reported them as timeoutstatus = 1
			//
			if (new Date().getTime() > endTime) {
				external.setDetailedErrorMessage("Wait for validation timeout exceeded");
				throw (new Error("TIMEOUT_EXCEEDED"));
			}
			
			external.waitFor(25);
		}
	}
}
actionMap["wait"] = Wait;

function Validate(params) {
	this.params = params;
	this.isRegex = params.isRegex != undefined && params.isRegex;
	this.failureIfFound = params.failureIfFound != undefined && params.failureIfFound;
	this.asciiMatch = u2a(this.params.match);
}
Validate.prototype = new Action();
Validate.prototype.isSuccessful = function(foundMatch, failureIfMatch) {
	return ((foundMatch && !failureIfMatch) || (!foundMatch && failureIfMatch));
}
Validate.prototype.doMatch = function(str) {
	if (this.isRegex) {
		return str.match(this.params.match) != null;
	} else return str.indexOf(this.params.match) != -1;
}
Validate.prototype.performElementMatch = function(el, matchStr) {
	//firefox's textContent equals IE's innerText 
	//TODO: adding value is enough ? Or need to simulate IE's outerHTML ?
	var foundOuterHTMLMatch = this.doMatch(el.textContent + ' ' + el.value);
	var foundInnerTextMatch = this.doMatch(el.textContent);
	alert("Found match? " + foundOuterHTMLMatch + ", " + foundInnerTextMatch);

	alert("Failure if found? " + this.failureIfFound);
	if (!this.isSuccessful(foundOuterHTMLMatch, this.failureIfFound) && !this.isSuccessful(foundInnerTextMatch, this.failureIfFound)) {
		alert("Validation failed for " + this.params.match);
		if (this.params.calledFromWait == undefined || this.params.calledFromWait == false)
			external.setContentMatchStatus(1, this.asciiMatch + " in element " + this.locator.toString());
		throw (new Error("VALIDATION_FAILED"));
	} else alert("Validation succeeded");
}
Validate.prototype.execute = function() {
	alert("Validating " + this.params.criteria);
	if (this.params.criteria == "element_match") {
		this.locator = new Locator(this.params.target);
		var el = null;
		try {
			el = this.locator.execute();
		} catch(e) {
			// swallow any element location exceptions
		}
		if (el == null) {
			if (this.failureIfFound) {
				external.setContentMatchStatus(0, "element " + this.locator.toString() + " not found");
				return;
			} else {
				// If this is not failure if found, effectively re-throw the element location error.
				throw(new Error("Element to validate not found."));
			}
		}
		if (typeof(this.params.match) == 'string') {
			this.performElementMatch(el, this.params.match);
		}
		external.setContentMatchStatus(0, this.asciiMatch + " in element " + this.locator.toString());
	} else if (this.params.criteria == "step_match") {
		alert("Calling full step content match on " + this.asciiMatch);
		var success = external.checkStepContent(this.params.match, this.isRegex ? 1 : 0, this.failureIfFound ? 1 : 0);
		if (!success) {
			external.setContentMatchStatus(1, this.asciiMatch);
			throw (new Error("VALIDATION_FAILED"));
		}
		external.setContentMatchStatus(0, this.asciiMatch);
	}
}
actionMap["validate"] = Validate;

function NavigateCommand(params) {
	this.params = params;
}
NavigateCommand.prototype = new Command();
NavigateCommand.prototype.execute = function() {
	alert("Navigating window");
	
	var win = external.getMainWindow();
	if (this.params.sendReferrer) {
		if (this.params.targetWindow != undefined) {
			var loc = new Locator();
			win = loc.findFrame(this.params.targetWindow, win);
		}
		var doc = win.document;
		var newLink = doc.createElement("a");
		newLink.href = this.params.url;
		doc.body.appendChild(newLink);
		//newLink.click();
        fireEvent('click', newLink, {"clientX": 0, "clientY": 0});
		return;
	}
	if (this.params.targetWindow != undefined) {
		var loc = new Locator();
		win = loc.findFrame(this.params.targetWindow, win);
		external.navigateFrame(win, this.params.url);
		return;
	}
	win.location = this.params.url;
}
actionMap["navigate"] = NavigateCommand;

function SetCookieCommand(params) {
	this.params = params;
}
SetCookieCommand.prototype = new Command();
SetCookieCommand.prototype.execute = function() {
	alert("Setting cookie " + this.params.name + ", " + this.params.value + " for url " + this.params.url);	
	external.setCookie(this.params.url, this.params.name, this.params.value);
}
actionMap["setCookie"] = SetCookieCommand;

function ExecuteJSCommand(params) {
	this.params = params;
}
ExecuteJSCommand.prototype = new Command();
ExecuteJSCommand.prototype.execute = function() {
	var win = external.getMainWindow();
	if (this.params.targetWindow != undefined) {
		if (this.params.targetWindow != "control") {
			var loc = new Locator();
			win = loc.findFrame(this.params.targetWindow, win);
		} else {
			win = toString();  // Just stick string "[Control]" into win
		}
	}
	var jsCode = this.params.jsCode;
	
	alert("Executing on window " + win + " JS code:\n" + jsCode);
    
    if (this.params.targetWindow == "control") {
        execScript(jsCode);
    } else {
        win.execScript(jsCode);
    }
}
actionMap["executeJS"] = ExecuteJSCommand;

function ImportJSCommand(params) {
	this.params = params;
}
ImportJSCommand.prototype = new Command();
ImportJSCommand.prototype.execute = function() {
	alert(this.params.name + "." + this.params.version + ", " + this.params.url);
	loadHelper(this.params.name, this.params.version, this.params.url);
}
actionMap["importJS"] = ImportJSCommand;

function findPos(obj) {
	var rect = obj.getBoundingClientRect();
	return [rect.left, rect.top];
}

// Extend the target with the properties in the provided object
function extend(target, obj) {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, options;

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy )
					continue;

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;

			}
		}
	}

	// Return the modified object
	return target;
}

function fireEvent(type, srcEl, options, preventDefault) {
	//alert("fireEvent:" + type);
	var mouse =  (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type));
	var keyboard = !mouse && (/^key(up|down|press)$/.test(type));

	var evt;
	if (mouse) {
		// Mouse event
		var e = extend({
			bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
			screenX: 0, screenY: 0, clientX: 0, clientY: 0,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			button: 0, relatedTarget: undefined
		}, options);

        if (type.indexOf("click") >= 0 && (srcEl.localName == "A" || 										   
										   srcEl.parentNode && srcEl.parentNode.localName=='A' ||//clicking on span in a , e.g. <a><b>xxxx</b></a>
                                           srcEl.localName == "IMG" || 
                                           srcEl.localName == "AREA")) {
            alert("Create XPCNativeWrapper for " + srcEl);
            // the following line is necessary to let firefox follow link
            srcEl = new XPCNativeWrapper(srcEl);
        }
		//evt = srcEl.document.createEventObject();
		//extend(evt, e);
		//evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
        evt = srcEl.ownerDocument.createEvent("MouseEvents");
        evt.initMouseEvent(type, true, e.cancelable, srcEl.ownerDocument.defaultView, 
            e.detail, e.screenX, e.screenY, e.clientX, e.clientY, 
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 
            e.button, e.relatedTarget);
	} else if (keyboard) {
		// Keyboard event
		var e = extend({ bubbles: true, cancelable: true, view: window,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			keyCode: 0, charCode: 0
		}, options);
		
		//evt = srcEl.document.createEventObject();
		//extend(evt, e);
		//evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
		//evt.charCode = undefined;
		evt = srcEl.ownerDocument.createEvent("KeyEvents");
        evt.initKeyEvent (type, e.bubbles, e.cancelable, srcEl.ownerDocument.defaultView, 
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 
            (e.charCode > 0) ? e.charCode : e.keyCode, undefined);

		if (preventDefault) evt.preventDefault();
        
	} else {
		//evt = srcEl.document.createEventObject();
		//extend(evt, options);
        evt = srcEl.ownerDocument.createEvent("UIEvents");
        evt.initUIEvent(type, true, true, srcEl.ownerDocument.defaultView, 0);
	}
	
	try {
		//srcEl.fireEvent("on" + type, evt);
        srcEl.dispatchEvent(evt);
	} catch(e) {
		alert("Trapped failure running event handler: " + e.message);
	}
	//return top;
}

function SelectOptionCommand(params) {
	this.locator = new Locator(params.target);
	this.params = params;
}
SelectOptionCommand.prototype = new Command();
SelectOptionCommand.prototype.findOptionIndex = function(sel, optionTxt) {
	for (var i=0; i<sel.options.length; ++i) {
		if (sel.options[i].textContent.indexOf(optionTxt) != -1) {
			alert("Found index " + i + " for option with text " + optionTxt);
			return i;
		}
	}
	return -1;
}
SelectOptionCommand.prototype.execute = function() {
	if (this.params.optionIndex != undefined && this.params.optionIndexes == undefined) {
		this.params.optionIndexes = [];
		this.params.optionIndexes[0] = this.params.optionIndex;
	}
	if (this.params.textValue != undefined && this.params.textValues == undefined) {
		this.params.textValues = [];
		this.params.textValues[0] = this.params.textValue;
	}
	
	var sel = this.locator.execute();
	sel.selectedIndex = -1;
	
	for (var i=0; i<this.params.optionIndexes.length; ++i) {
		var idx = -1;
		if (this.params.textValues.length >= i) {
			idx = this.findOptionIndex(sel, this.params.textValues[i]);
		}
		if (idx == -1) idx = this.params.optionIndexes[i];
		alert("Selecting form option " + idx + " from select " + this.locator);
		if (sel.selectedIndex == -1 || idx < sel.selectedIndex)
			sel.selectedIndex = idx;		
		var opt = sel.options[idx];
		//opt.click();
		fireEvent('click', opt, {"clientX": 0, "clientY": 0});
		
		opt.selected = true;	
		if (!this.params.suppressEvents) {
			fireEvent('change', sel, {});			
		}
	}
}
actionMap["selectOption"] = SelectOptionCommand;

function SetInputValueCommand(params) {
	this.locator = new Locator(params.target);
	this.value = params.value;
}
SetInputValueCommand.prototype = new Command();
SetInputValueCommand.prototype.execute = function() {
	var el = this.locator.execute();
	el.value = this.value;
}
actionMap["setInputValue"] = SetInputValueCommand;

function SubmitFormCommand(params) {
	this.locator = new Locator(params.target);
	this.params = params;
}
SubmitFormCommand.prototype = new Command();
SubmitFormCommand.prototype.findFormIdx = function(frm) {
	//var frms = frm.document.forms;
    var frms = frm.ownerDocument.forms;
	for (var i=0; i<frms.length; ++i) {
		if (frms[i] == frm) return i;
	}
	return -1;
}
SubmitFormCommand.prototype.execute = function() {
	alert("Submitting form  " + this.locator);
	var frm = this.locator.execute();
    
	if (frm.onsubmit != "" && frm.onsubmit != null && frm.onsubmit != undefined) {
		var frmIdx = this.findFormIdx(frm);
		if (frmIdx != -1) {
			try {
				//var rvalue = frm.document.parentWindow.eval("document.forms[" + frmIdx + "].onsubmit();");
				var rvalue = frm.onsubmit(); /*does this right?*/
                alert("Got onsubmit return value: " + rvalue);
				if (rvalue != undefined && rvalue == false) return;
			} catch(e) {
				alert("Attempt to call DOM0 onsubmit for form failed");
                alert(e);
			}
		} else {
			alert("Unable to find form in parent document");
		}
		frm.onsubmit = "";
	}
	
	fireEvent('submit', frm, {});
	frm.submit();
}
actionMap["submitForm"] = SubmitFormCommand;

function ClickCommand(params) {
	this.locator = new Locator(params.target);
	this.params = params;
}
ClickCommand.prototype = new Command();
ClickCommand.prototype.execute = function() {
	alert("Click");
	var el = this.locator.execute();
	var elPos = findPos(el);
	var cx = this.params.x == undefined ? elPos[0] + el.clientWidth / 2 : elPos[0] + parseInt(this.params.x);
	var cy = this.params.y == undefined ? elPos[1] + el.clientHeight / 2 : elPos[1] + parseInt(this.params.y);
	var coords = { "clientX" : cx, "clientY" : cy };
	alert('clicking at ' + cx + ', ' + cy);
    
	//fireEvent('mousemove', el, coords).fireEvent('mouseover', el, coords).fireEvent('mousedown', el, coords).fireEvent('focus', el, coords).fireEvent('mouseup', el, coords);
	fireEvent('mousemove', el, coords);
    fireEvent('mouseover', el, coords);
    fireEvent('mousedown', el, coords);
    fireEvent('focus', el, coords);
    fireEvent('mouseup', el, coords);
    if (this.params.propertyIsEnumerable("doubleclick") && this.params.doubleclick) {
		fireEvent('dblclick', el, coords);
	} else {
		//el.click();
        fireEvent('click', el, coords);
	}
	fireEvent('mouseout', el, coords);
}
actionMap["click"] = ClickCommand;

function FireEventCommand(params) {
	this.locator = new Locator(params.target);
	this.params = params;
}
FireEventCommand.prototype = new Command();
FireEventCommand.prototype.execute = function() {
	alert("FireEvent " + this.params.eventName);
	var el = this.locator.execute();
	var opts = this.params.options ? this.params.options : {};
	
	fireEvent(this.params.eventName, el, opts);
}
actionMap["fireEvent"] = FireEventCommand;

function KeystrokesCommand(params) {
	this.locator = new Locator(params.target);
	this.params = params;
}
KeystrokesCommand.prototype = new Command();

KeystrokesCommand.prototype.typeString = function(currentString, idx, endIdx, newPart) {
	if (idx == endIdx && idx >= currentString.length-1) return currentString + newPart;
	return currentString.slice(0, idx) + newPart + currentString.slice(endIdx, currentString.length);
}
KeystrokesCommand.prototype.deleteCharAt = function(currentString, idx) {
	if (idx <= 0) return;
	return currentString.slice(0, idx-1) + currentString.slice(idx, currentString.length);
}
KeystrokesCommand.prototype.detectMismatch = function(i, el) {
	if (i == this.params.charCodes.length-1 &&
		this.params.textValue != undefined && el.value != undefined && el.value != this.params.textValue) {
		alert("Mismatch between the current value of the text field: '" + el.value + "' and the recorded value: '" + u2a(this.params.textValue) + "'");
		el.value = this.params.textValue;
	}
}
KeystrokesCommand.prototype.execute = function() {
	alert("Simulating keystrokes");
	var el = this.locator.execute();
	
	var isTextEl = (el.tagName == "INPUT" && (el.type == 'text') || (el.type == 'password')) || el.tagName == "TEXTAREA";
	
	var isMeta = false, isCtrl = false, isShift = false, isAlt = false;
	for (var m=0; this.params.modifiers && m<this.params.modifiers.length; ++m) {
		var mod = this.params.modifiers[m];
		if (mod == "META") isMeta = true;
		else if (mod == "SHIFT") isShift = true;
		else if (mod == "ALT") isAlt = true;
		else if (mod == "CTRL") isCtrl = true;
	}
	
	var idx = 0;
	for (var i=0; i<this.params.charCodes.length; ++i) {
		var preventDefault = false;
		var evtArgs = { charCode : this.params.charCodes[i], keyCode : this.params.keyCodes[i],
			ctrlKey:isCtrl, altKey:isAlt, shiftKey:isShift, metaKey:isMeta };
		if (this.params.keyCodes[i] == 13 && isTextEl && el.tagName != 'TEXTAREA') {
			this.detectMismatch(i, el);
			preventDefault = true;
		}	
		fireEvent('keydown', el, evtArgs, preventDefault);
		if (isTextEl && !isMeta && !isAlt && !isCtrl && (this.params.keyCodes[i] == 32 || this.params.keyCodes[i] > 46)) {
			el.value = this.typeString(el.value, this.params.selectionStart[i], this.params.selectionEnd[i],
				String.fromCharCode((this.params.charCodes[i] != 0 ? this.params.charCodes[i] : this.params.keyCodes[i])));
		} else if (isTextEl && this.params.keyCodes[i] == 8) {
			el.value = this.deleteCharAt(el.value, this.params.selectionStart[i]);
		} else if (isTextEl && this.params.keyCodes[i] == 46) {
            el.value = this.typeString(el.value, this.params.selectionStart[i], this.params.selectionEnd[i], '');
        } else if (this.params.keyCodes[i] == 13) {
			if (el.tagName == 'TEXTAREA') {
				el.value = el.value + "\r\n";
				idx += 2;
			}
		}
		
		//fireEvent('keyup', el, evtArgs).fireEvent('keypress', el, evtArgs)
		fireEvent('keyup', el, evtArgs, preventDefault);
		fireEvent('keypress', el, evtArgs, preventDefault);
		//window.external.waitFor(50);
		
		if (isTextEl) {
			this.detectMismatch(i, el);
		}
	}
	
	if (isTextEl) {
		fireEvent('change', el, {});
	}	
	//Do not send a blur event by default after sending keystrokes
	//fireEvent('blur', el, {});
}
actionMap["keystrokes"] = KeystrokesCommand;

function DebugCommand(params) {}
DebugCommand.prototype = new Command();
DebugCommand.prototype.execute = function() {
	debugger;
}
actionMap["debug"] = DebugCommand;

exclusionRules = {};
function AddObjectExclusionRuleCommand(params) {
	this.params = params;
}
AddObjectExclusionRuleCommand.prototype = new Command();
AddObjectExclusionRuleCommand.prototype.execute = function() {
	var ruleId = -1;
	var excludeOthers = this.params.excludeOthers == true || this.params.excludeOthers == "true";
	alert("Adding exclusion rule named: " + this.params.name);
	for (var i=0; i<this.params.filterTargets.length; ++i) {
		var target = this.params.filterTargets[i];
		var matchCriteria = target.matchCriteria == undefined ? 3 :
			(target.matchCriteria == "startsWith" ? 1 :
				(target.matchCriteria == "endsWith" ? 2 : 3));
		alert("fragment: " + target.urlFragment + ", criteria: " + matchCriteria + ", excludeOthers: " + excludeOthers);
		ruleId = external.addObjectRequestFilter(ruleId, target.urlFragment, matchCriteria, (excludeOthers ? 1 : 0));
	}
	exclusionRules[this.params.name] = ruleId;
}
actionMap["addObjectExclusionRule"] = AddObjectExclusionRuleCommand;

function RemoveObjectExclusionRuleCommand(params) {
	this.name = params.name;
}
RemoveObjectExclusionRuleCommand.prototype = new Command();
RemoveObjectExclusionRuleCommand.prototype.execute = function() {
	var removeId = exclusionRules[this.name];
	alert("Removing filter rule " + this.name + ":" + removeId);
	external.removeObjectRequestFilter(removeId);
}
actionMap["removeObjectExclusionRule"] = RemoveObjectExclusionRuleCommand;

function HttpEventSink() {
	this.listeners = [];
	this.hasReq = false;
}
HttpEventSink.prototype.checkEventListeners = function() {
	var localReq = false;
	
	for(var i=0; i<this.listeners.length; ++i) {
		for (var prop in this.listeners[i]) {
			alert(prop);
			if (!localReq && prop == "sendingRequest") localReq = true;
		}
		if (localReq) break;
	}
	
	if (this.hasReq != localReq) {
		alert("Setting haveRequestHandler == " + localReq);
		external.setHaveRequestHandler(localReq ? 1 : 0);
		this.hasReq = localReq;
	}
}		
HttpEventSink.prototype.addListener = function(listener) {
	alert('Add listener ' + listener.name);
	if (this.listeners.length == 0) external.registerListener(this, "http");
	this.listeners[this.listeners.length] = listener;
	this.checkEventListeners();
}
HttpEventSink.prototype.removeHook = function(hookName) {
	for (var i=0; i<this.listeners.length; ++i) {
		if (this.listeners[i].name == hookName) {
			this.listeners.remove(i);
			this.checkEventListeners();
			return;
		}
	}
}
HttpEventSink.prototype.sendingRequest = function(request) {
	alert("Got sending request");
	for (var i=0; i<this.listeners.length; ++i) {
		if(this.listeners[i]["sendingRequest"] != undefined) {
			try {
				this.listeners[i]["sendingRequest"](request);
			} catch(e) {
				alert("Caught exception in event handler, " + e);
			}
		}
	}
}
httpEventSink = new HttpEventSink();

function AddEventHookCommand(params) {
	this.params = params;
}
AddEventHookCommand.prototype = new Command();
AddEventHookCommand.prototype.execute = function() {
	if (this.params.eventType == "sendingRequest") {
		external.setHaveRequestHandler(1);
		
		var handlerWrapper = {
			name: this.params.name,
			handlerFn: undefined,
			sendingRequest: function(request) {
				alert("Called sendingRequest wrapper");
				this.handlerFn(Gomez_Request_create(request));
			}
		};
		var tof = typeof(this.params.handler);
		if (tof == 'string') {
			handlerWrapper.handlerFn = new Function("request", this.params.handler);
			alert(handlerWrapper.handlerFn);
		} else if (tof == 'function') {
			handlerWrapper.handlerFn = this.params.handler;
		} else throw new Error("Unknown handler function format.");
		
		httpEventSink.addListener(handlerWrapper);
	}
}
actionMap["addEventHook"] = AddEventHookCommand;

function RemoveEventHookCommand(params) {
	this.params = params;
}
RemoveEventHookCommand.prototype = new Command();
RemoveEventHookCommand.prototype.execute = function() {
	alert("Removing event hook " + this.params.name);
	httpEventSink.removeHook(this.params.name);
}
actionMap["removeEventHook"] = RemoveEventHookCommand;

//
// Begin event interception stubs
//

function trimString(str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

function Gomez_EventParameterObject() {
	this.paramHandlers = {};
	
	this.handleModified = function(propName) {
		this.paramHandlers[propName].apply(this);
	}
}

function Gomez_Header(name, value, owner) {
	this.name = trimString(name);
	this.owner = owner;
	if (value == null) this.value = null;
	else this.value = trimString(value);
}
Gomez_Header.prototype = {
	getName: function() { return this.name; },
	getValue: function() { return this.value; },
	setValue: function(val) { this.value = val; this.owner.handleModified("internalHeaders"); },
	toString: function() { return this.value == null ? this.name : this.name + ": " + this.value; }
}

function Gomez_Headers() {
	this.internalHeaders = new Array();
	this.paramHandlers["internalHeaders"] = function() {
		if (this.init) return;
		var count = this.originalObj.count();
		for (var i = 0; i < count; ++i) {
			this.originalObj.remove(0);
		}
		for (i = 0; i < this.internalHeaders.length; ++i) {
			this.originalObj.add(this.internalHeaders[i].toString());
		}
		for (var i = 0; i < this.originalObj.count(); ++i) {
			alert(this.originalObj.get(i));
		}
	};
}
Gomez_Headers_create = function(obj) {
	var headers = new Gomez_Headers();
	headers.init = true;
	headers.originalObj = obj;
	var headerList = obj;
	for (var i=0; i<headerList.count(); ++i) {
		var headerStr = headerList.get(i);
		alert(headerStr);
		var colonIdx = headerStr.indexOf(':');
		if (colonIdx == -1)
			headers.add(headerStr, null);
		else
			headers.add(headerStr.substring(0, colonIdx), headerStr.substring(colonIdx+1));
	}
	headers.init = false;
	return headers;
}

Gomez_Headers.prototype = new Gomez_EventParameterObject();
var headersProps = {
	add: function(headerOrName, val) {
		if (arguments.length == 2)
			headerOrName = new Gomez_Header(headerOrName, val, this);
		this.internalHeaders.push(headerOrName);
		this.handleModified("internalHeaders");
	},
	remove: function(name) {
		var removedHeaders = [];
		for (var i = 0; i < this.internalHeaders.length; ++i) {
			if (this.internalHeaders[i].name == name) {
				removedHeaders.push(this.internalHeaders[i]);
				this.internalHeaders[i].value = "__GOMEZ_REMOVE_HEADER";
			}
		}
		if (removedHeaders.length > 0) this.handleModified("internalHeaders");
		return removedHeaders;
	},
	replace: function(name, value) {
		for (var i = 0; i < this.internalHeaders.length; ++i) {
			if (this.internalHeaders[i].name == name) {
				this.internalHeaders[i].value = value;
			}
		}
		this.handleModified("internalHeaders");
	},	
	getFirstValue: function(name) {
		for (var i=0; i<this.internalHeaders.length; ++i) {
			if (this.internalHeaders[i].name == name)
				return this.internalHeaders[i].value;
		}
		return null;
	},
	getOrderedHeaders: function() {
		return this.internalHeaders;
	}
}
for (var propName in headersProps) {
	Gomez_Headers.prototype[propName] = headersProps[propName];
}

function Gomez_Request(url) {
	this.url = url;
	this.paramHandlers["objectId"] = function() { this.originalObj.setObjectID(this.objectId); };
	this.paramHandlers["url"] = function() { this.originalObj.setUrl(this.url); }
}
Gomez_Request.prototype = new Gomez_EventParameterObject();
function Gomez_Request_create(obj) {
	var req = new Gomez_Request(obj.getUrl());
	req.originalObj = obj;
	req.objectId = obj.getObjectID();
	req.headers = Gomez_Headers_create(obj.getHeaders());
	return req;
}

var reqProps = {
	getHeaders: function() { return this.headers; },
	getUrl: function() { return this.url; },
	setUrl: function(url) { this.url = url; this.handleModified("url"); },
	getURL: function() { return this.url; },
	setURL: function(urlObj) { this.setUrl(urlObj.toString()); },
	getObjectID: function() { return this.objectId; },
	setObjectID: function(id) { this.objectId = id; this.handleModified("objectId"); },
	getElement: function() { },
	setElement: function(el) { },
	getPageRequest: function() { return this.pageRequest; }
}
for (var propName in reqProps) {
	Gomez_Request.prototype[propName] = reqProps[propName];
}

//
// End event interception stubs
//

function interpretAction(actionObj) {
	if (actionMap[actionObj.type] == undefined) {
		alert("Unknown action: " + actionObj.type);
		return new Action(actionObj);
	} else {
		return new actionMap[actionObj.type](actionObj);
	}
}


function fetchUrlString(name, version, url, useCache, isOOB) {
	var request = external.newRequest( 'GET', name, version, url, useCache ? 1 : 0, isOOB ? 1 : 0);
	alert('Sending request for ' + url);
	alert('request.getUrl()==' + request.getUrl());
	var reply = request.sendRequest();
	request.waitFor();
	return reply.getBodyString();
}

function loadHelper(name, version, url) {	
	// cache = true, oob = true
	var body = fetchUrlString(name, version, url, true, true);
	//alert(body);
	
	execScript(body);
}

function handleImports() {
	
	// Look for sizzle
	var foundSizzle = false;
	var imports = new Array();
	
	for (var i=0; i<script.steps.length; ++i) {
		var currentStep = script.steps[i];
		for (var j=0; j<currentStep.actions.length; ++j) {
			if (currentStep.actions[j].type == 'importJS') {
				var actionObj = interpretAction(currentStep.actions[j]);
				imports.push(actionObj);
				if (actionObj.params.name == "sizzle") foundSizzle = true;
				currentStep.actions.remove(j);
			}
		}
	}
	/* Do not import Sizzle into Control Scope
	if (!foundSizzle) {
		imports.splice(0, 0, interpretAction(
			{
				"type" : "importJS",
				"name" : "sizzle",
				"version" : DEFAULT_SIZZLE_VERSION,
				"url" : DEFAULT_SIZZLE_URL
			}
		));
	}
	*/
	for (var i=0; i<imports.length; ++i) {
		try {
			imports[i].execute();
		} catch(e) {	
			alert("Caught exception running import: " + imports[i].name);
			alert(e.message);
		}
	}
	
}

function gomez_userscript_error(msg, url, linenumber) {
	alert("Saw script error: " + msg + ", " + url + ", " + linenumber);
	alert(started);
	if (started == undefined || !started) {
		external.startTransaction();
		external.startStep();
	}
	external.addUserScriptFailure(msg);
	external.endStep();
	external.endTransaction();
	
	return true;
}
onerror=gomez_userscript_error; 

function parseUnicode(jsonObj) {
	// Recurse into element and replace any ascii-encoded unicode chars as unicode
	for (var name in jsonObj) {
		var val = jsonObj[name];
		var tof = typeof(val);
		
		if (tof == "string") {
			jsonObj[name] = a2u(val);
		} else if (tof == "object") {
			parseUnicode(jsonObj[name]);
		}
	}
}

function makeSubstitutions(jsonObj, token, replacement) {
	// Recurse into element and replace any ascii-encoded unicode chars as unicode
	for (var name in jsonObj) {
		var val = jsonObj[name];
		var tof = typeof(val);
		
		if (tof == "string") {
			var idx = val.indexOf(token);
			if (idx != -1) {
				var toks = val.split(token);
				var newString = toks[0];
				for (var i=1; i<toks.length; ++i) {
					newString += replacement;
					newString += toks[i];
				}
				jsonObj[name] = newString;
				alert("Replaced value of " + name + " with " + newString);
			}
		} else if (tof == "object") {
			makeSubstitutions(jsonObj[name], token, replacement);
		}
	}
}

function applyPatch(action) {
	var tof = typeof(action.patch);
	if (tof == 'string') {
		action.patch = new Function("action", action.patch);
		alert(action.patch.toString());
	}
	
	if (action.patch && typeof(action.patch) == 'function') {
		try {
			action.patch.apply(this, [action]);
		} catch(pex) {
			alert(pex.message);
			alert(pex.toString());
			throw (new Error("Failed to apply patch for action " + action.toString()));
		}
	}	
}

