// GomezGlobalFunctions.js  Version 008
// Copyright 2006, Gomez, Inc.

var gomez = {
   debug : false, 
   ordinal : 0, 
   version : 8,
   init : function () {
      if (!gomez.debug) {
         try {
            gomez.debug = Packages.com.porivo.parser.dom.JSNodeHandler.DEBUG || Packages.com.porivo.http.HttpEngine.DEBUG;
         }
         catch (e) {}
      }
      
      try {
         if (gomezNative) {
            if (gomezNative.getNthIndex) {
               this._getNthIndex = this.getNthIndex;
               this.getNthIndex = gomezNative.getNthIndex;
            }
            if (gomezNative.getIndex) {
               this._getIndex = this.getIndex;
               this.getIndex = gomezNative.getIndex;
            }
            if (gomezNative.clickNearest) {
               this._clickNearest = this.clickNearest;
               this.clickNearest = gomezNative.clickNearest;
            }
            if (gomezNative.getItem) {
               this._getItem = this.getItem;
               this.getItem = gomezNative.getItem;
            }
            if (gomezNative.findMatchingChild) {
               this._findMatchingChild = this.findMatchingChild;
               this.findMatchingChild = gomezNative.findMatchingChild;
            }         
            if (gomezNative.scanChildren) {
               this._scanChildren = this.scanChildren;
               this.scanChildren = gomezNative.scanChildren;
            }
         }
      } catch (e) {} // gomezNative not defined  
   },
   getNthIndex : function(coll, val, ord, compfn) {
      var seen = 0;
      for (var i = 0; i < coll.length; i = i + 1) {
         if (compfn(coll[i], val) != -1) {
            seen = seen + 1;
            if (seen == ord) {
               return i;
            }
         }
      }
      if (ord == 1) {
         alert('---PageError---:Unable to find ' + val);
      } else {
         alert('---PageError---:Found ' + seen + ' instance of ' + val + '.  Looking for ' + ord + '.');
      }
      return -1;
   },
   getIndex : function(coll, val, compfn) {
      return gomez.getNthIndex(coll, val, 1, compfn);
   },   
   clickNearest : function(obj) {
      if (!obj) {
         alert('---PageError---:Object passed to gomez.clickNearest not found');
         null.die;
      }
      if (obj.click) {
         obj.click();
      } else {
         if (obj.onclick) {
            var func = Packages.com.porivo.parser.dom.JSUtils.wrapFunction(top, obj.onclick, 'onclick');
            Packages.com.porivo.parser.dom.JSUtils.callFunction(top, func, obj);
         } else if ((obj.getAttribute) && (obj.getAttribute('onclick'))) {
            var func = Packages.com.porivo.parser.dom.JSUtils.wrapFunction(top, obj.getAttribute('onclick'), 'onclick');
            Packages.com.porivo.parser.dom.JSUtils.callFunction(top, func, obj);            
         } else {
            if (obj.parentElement) {
               gomez.clickNearest(obj.parentElement);
            } else {
               alert('---PageError---:Unable to find object to handle click event');
               null.die;
            }
         }
      }
   },
   getItem : function(coll, val, cmpfn) {
      if (!coll) {
         alert('---PageError---:Argument to getItem is null');
      }
      if (coll.length) {
         for (var i = 0; i < coll.length; i = i + 1) {
            if (cmpfn(coll[i], val) != -1) {
               return coll[i];
            }
         }
      } else {
         if (cmpfn(coll, val) != -1) {
             return coll;
         }
      }
      alert('---PageError---:Unable to find item with value matching ' + val + ' in getItem');
      return null;
   },
   findMatchingChild : function(root, tag, matchAlg, matchText, ord) {
       gomez.ordinal = 0;
       if (root) {
           var rv = gomez.scanChildren(root, tag, matchAlg, matchText, ord);
           if (rv) {
               return rv;
           } else {
               alert('---PageError---:Unable to find child with text: ' + matchText);
           }
       } else {
           alert('---PageError---:Unable to locate initial element in findMatchingChild');
       }
       return null;
   },
   scanChildren : function(obj, tag, matchAlg, matchText, ord) {
       if ((obj.tagName == tag) && (matchAlg(obj, matchText) != -1)) {
           gomez.ordinal = gomez.ordinal + 1;
           if (gomez.ordinal == ord) {
               return obj;
           }
       }
       if (obj.children) {
          for (var i = 0; i < obj.children.length; i = i + 1) {
              var rv = gomez.scanChildren(obj.children[i], tag, matchAlg, matchText, ord);
              if (rv) {
                  return rv;
              }
          }
      }
       return null;
   }
};

var gomezCmp = {
   init : function() {
     try {
         if (gomezNative) {
            if (gomezNative.isTrue) {
               this._isTrue = this.isTrue;
               this.isTrue = gomezNative.isTrue;
            }
            if (gomezNative.innerText) {
               this._innerText = this.innerText;
               this.innerText = gomezNative.innerText;
            }
            if (gomezNative.href) {
               this._href = this.href;
               this.href = gomezNative.href;
            }      
            if (gomezNative.id) {
               this._id = this.id;
               this.id = gomezNative.id;
            }      
            if (gomezNative.src) {
               this._src = this.src;
               this.src = gomezNative.src;
            }      
            if (gomezNative.title) {
               this._title = this.title;
               this.title = gomezNative.title;
            }      
            if (gomezNative.value) {
               this._value = this.value;
               this.value = gomezNative.value;
            }
            if (gomezNative.innerHtml) {
               this._innerHtml = this.innerHtml;
               this.innerHtml = gomezNative.innerHtml;
            }            
            if (gomezNative.outerHtml) {
               this._outerHtml = this.outerHtml;
               this.outerHtml = gomezNative.outerHtml;
            }
            if (gomezNative.text) {
               this._text = this.text;
               this.text = gomezNative.text;
            }
            if (gomezNative.name) {
               this._name = this.name;
               this.name = gomezNative.name;
            }
            if (gomezNative.exactText) {  
               this._exactText = this.exactText;
               this.exactText = gomezNative.exactText;
            }
         } 
      } catch(e) {} // gomezNative not defined
   },

   isTrue : function (obj, val) {
      return 1;
   }, 
   innerText : function (obj, val) {
      if (obj.innerText) {
         if (gomez.debug) {
            alert('---PageError---:cmpInnerText: ' + obj.innerText);
         }
         return obj.innerText.indexOf(val);
      }
      return -1;
   }, 
   href : function (obj, val) {
      if (obj.href) {
         if (gomez.debug) {
            alert('---PageError---:cmpHref: ' + obj.href);
         }
         return obj.href.indexOf(val);
      }
      return -1;
   }, 
   
   value : function (obj, val) {
      if (obj.value) {
         if (gomez.debug) {
            alert('---PageError---:cmpValue: ' + obj.value);
         }
         return obj.value.indexOf(val);
      }
      return -1;
   }, 
   
   outerHtml : function (obj, val) {
      if (obj.outerHTML) {
         if (gomez.debug) {
            alert('---PageError---:cmpOuterHtml: ' + obj.outerHTML);
         }
         return obj.outerHTML.indexOf(val);
      }
      return -1;
   }, 

   innerHtml : function (obj, val) {
      if (obj.innerHTML) {
         if (gomez.debug) {
            alert('---PageError---:cmpInnerHtml: ' + obj.innerHTML);
         }
         return obj.innerHTML.indexOf(val);
      }
      return -1;
   }, 
   
   text : function (obj, val) {
      if (obj.text) {
         if (gomez.debug) {
            alert('---PageError---:cmpText: ' + obj.text);
         }
         return obj.text.indexOf(val);
      }
      return -1;
   }, 

   id : function (obj, val) {
      if (obj.id) {
         if (gomez.debug) {
            alert('---PageError---:cmpId: (' + obj.id + ')');
         }
         return (obj.id == val) ? 1 : -1;
      }
      return -1;
   },

   title : function (obj, val) {
      if (obj.title) {
         if (gomez.debug) {
            alert('---PageError---:cmpTitle: (' + obj.title + ')');
         }
         return (obj.title == val) ? 1 : -1;
      }
      return -1;
   },

   src : function (obj, val) {
      if (obj.src) {
         if (gomez.debug) {
            alert('---PageError---:cmpSrc: (' + obj.src + ')');
         }
         return (obj.src == val) ? 1 : -1;
      }
      return -1;
   },
   
   name : function (obj, val) {
      if (obj.name) {
         if (gomez.debug) {
            alert('---PageError---:cmpName: (' + obj.name + ')');
         }
         return (obj.name == val) ? 1 : -1;
      }
      return -1;
   },
   
   exactText : function (obj, val) {
      if (obj.text) {
         if (gomez.debug) {
            alert('---PageError---:cmpExactText: ' + obj.text);
         }
         return (obj.text == val) ? 1 : -1;
      }
      return -1;
   }
};

var gomezDate = {
   init : function() {
      try {
         if (gomezNative) {
            if (gomezNative.today) {
               this._today = this.today;
               this.today = gomezNative.today;
            }
            if (gomezNative.addDays) {
               this._addDays = this.addDays;
               this.addDays = gomezNative.addDays;
            }
            if (gomezNative.addWeeks) {
               this._addWeeks = this.addWeeks;
               this.addWeeks = gomezNative.addWeeks;
            }
            if (gomezNative.addMonths) {
               this._addMonths = this.addMonths;
               this.addMonths = gomezNative.addMonths;
            }
            if (gomezNative.getNextWeekday) {
               this._getNextWeekday = this.getNextWeekday;
               this.getNextWeekday = gomezNative.getNextWeekday;
            }
            if (gomezNative.printDate) {
               this._printDate = this.printDate;
               this.printDate = gomezNative.printDate;
            }
            if (gomezNative.setDate) {
               this._setDate = this.setDate;
               this.setDate = gomezNative.setDate;
            }
            if (gomezNative.MONTHS) {
               this._MONTHS = this.MONTHS;
               this.MONTHS = gomezNative.MONTHS;
            }
            if (gomezNative.validateSelect) {
               this._validateSelect = this.validateSelect;
               this.validateSelect = gomezNative.validateSelect;
            }
            if (gomezNative.selectMonth) {
               this._selectMonth = this.selectMonth;
               this.selectMonth = gomezNative.selectMonth;
            }
            if (gomezNative.selectMonthByIndex) {
               this._selectMonthByIndex = this.selectMonthByIndex;
               this.selectMonthByIndex = gomezNative.selectMonthByIndex;
            }
            if (gomezNative.startsWithLCText) {
               this._startsWithLCText = this.startsWithLCText;
               this.startsWithLCText = gomezNative.startsWithLCText;
            }
            if (gomezNative.selectOption) {
               this._selectOption = this.selectOption;
               this.selectOption = gomezNative.selectOption;
            }
            if (gomezNative.selectByText) {
               this._selectByText = this.selectByText;
               this.selectByText = gomezNative.selectByText;
            }   
            if (gomezNative.selectDate) {
               this._selectDate = this.selectDate;
               this.selectDate = gomezNative.selectDate;
            }
            if (gomezNative.selectYear) {
               this._selectYear = this.selectYear;
               this.selectYear = gomezNative.selectYear;
            }
         }
      } catch (e) {} // gomezNative not defined
   },

   today : function() {
      return new Date();
   },

   addDays : function (date, numDays) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + numDays);
   },

   // Helper function; really just a variant on addDays
   addWeeks : function(date, numWeeks) {
      return gomezDate.addDays(date, numWeeks * 7);
   },

   // Note: this simply increments the months counter.  Unless the new date is illegal
   //       for the new month, in which case, any extra days from the last month only extend
   //       into the new month (behavior will match whatever rhino does with this case; this
   //       description matches Rhino and Firefox 1.5.0.4).  ex: 12/31/2001 + 2 months = 3/3/2002
   //       while 12/31/1999 + 2 months (leap year case) = 3/2/2002
   addMonths : function(date, numMonths) {
       return new Date(date.getFullYear(), date.getMonth() + numMonths, date.getDate());
   },

   SUNDAY    : 0,
   MONDAY    : 1,
   TUESDAY   : 2,
   WEDNESDAY : 3,
   THURSDAY  : 4,
   FRIDAY    : 5,
   SATURDAY  : 6,

   // Given a date, find the next instance of the given weekday after this one.  So
   // if you want a trip that starts 2 weeks from now on Wednesday and comes back the
   // following Sunday, you can write:
   //
   // var start = gomezDate.getNextWeekday(gomezDate.addWeeks(new Date(), 2), gomezDate.WEDNESDAY);
   // var end = gomezDate.getNextWeekday(start, gomezDate.SUNDAY);
   getNextWeekday: function(date, targetWeekday) {
      var startWeekday = date.getDay();
      return (startWeekday == targetWeekday) ? gomezDate.addDays(date, 7) : gomezDate.addDays(date, (7 + (targetWeekday - startWeekday)) % 7);
   },

   // Generate a string based on a date.  By default, this will be
   // in the form 12/05/06  (2 digit month, 2 digit date, 2 digit year, '/' separator).
   //
   // @args
   // date - the date to print
   // separator - the separator to use between date components
   // format - one of the following format types (ex: based on Jan 5, 2006)
   //   US date formats
   //      MDYYYY   - month, date, 4-digit year (ex: 1/5/2006)
   //      MDYY     - month, date, 2-digit year (ex: 1/5/06)
   //      MMDDYY   - 2-digit month, 2-digit date, 2-digit year (ex: 01/05/06)
   //      MMDDYYYY - 2-digit month, 2-digit date, 4-digit year (ex: 01/05/2006)
   //   European date formats
   //      DMYYYY   - date, month, 4-digit year (ex: 1/5/2006)
   //      DMYY     - date, month, 2-digit year (ex: 1/5/06)
   //      DDMMYY   - 2-digit date, 2-digit month, 2-digit year (ex: 01/05/06)
   //      DDMMYYYY - 2-digit date, 2-digit month, 4-digit year (ex: 01/05/2006)
   //   Custom formats (to create Japanese format, for example)
   //      CUSTOM   - you must provide an array of strings which contain the parts
   //                 of the date to show as the custom argument
   // custom - an array of strings made of the following components
   //    M - month
   //    MM - 2-digit month
   //    D - date
   //    DD - 2-digit date
   //    YY - 2-digit year
   //    YYYY - 4-digit year
   //    S - separator string (as specified in 'separator' argument)
   //    <any other string> - just added into the output
   //    example: (ex: based on Jan 5, 2006)
   //          ['YYYY', 'S', 'MM', 'S', 'DD'] -> 2006/01/05
   //          ['This is the year ', 'YYYY']  -> This is the year 2006
   printDate : function(date, separator, format, custom) {
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date value passed to gomezDate.printDate');
         return ('invalid date in printDate');
      }
      if (!separator) {
         separator = '/';
      }
      if (!format) {
         format = 'MMDDYY';
      }
      if (!format.toUpperCase) {
         alert('---PageError---:Invalid date format passed to gomezDate.printDate');
         return ('invalid date format in printDate');
      }
      var month = date.getMonth() + 1;
      var twoDigitMonth = (month < 10) ? ('0' + month) : month;
      var twoDigitDate = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate();
      format = format.toUpperCase();
      switch (format) {
         case 'MDYYYY':
            return (month + separator + date.getDate() + separator + date.getFullYear());
         case 'MDYY':
            return (month + separator + date.getDate() + separator + String(date.getFullYear()).substr(2));
         case 'MMDDYY':
            return (twoDigitMonth + separator + twoDigitDate + separator + String(date.getFullYear()).substr(2));
         case 'MMDDYYYY':
            return (twoDigitMonth + separator + twoDigitDate + separator + date.getFullYear());
         case 'DMYYYY':
            return (date.getDate() + separator + month + separator + date.getFullYear());
         case 'DMYY':
            return (date.getDate() + separator + month + separator + String(date.getFullYear()).substr(2));
         case 'DDMMYY':
            return (twoDigitDate + separator + twoDigitMonth + separator + String(date.getFullYear()).substr(2));
         case 'DDMMYYYY':
            return (twoDigitDate + separator + twoDigitMonth + separator + date.getFullYear());
         case 'CUSTOM':
            if ((!custom) || (!custom.length)) {
               alert('---PageError---:Invalid custom format passed to gomezDate.printDate');         
               return 'invalid custom format in printDate';
            }
            var rv = '';
            for (var i = 0; i < custom.length; i = i + 1) {
               if (!custom[i]) {
                  continue;
               }
               var specifier = (custom[i].toUpperCase) ? custom[i].toUpperCase() : custom[i];
               switch (specifier) {
                  case 'M':
                     rv += month;
                     break;
                  case 'MM':
                     rv += twoDigitMonth;
                     break;
                  case 'D':
                     rv += date.getDate();
                     break;
                  case 'DD':
                     rv += twoDigitDate;
                     break;
                  case 'YY':
                     rv += String(date.getFullYear()).substr(2);
                     break;
                  case 'YYYY':
                     rv += date.getFullYear();
                     break;
                  case 'S':
                     rv += separator;
                     break;
                  default:
                     rv += custom[i];
                     break;
               }
            }
            return rv;
         default:
            alert('---PageError---:Invalid date format passed to gomezDate.printDate');               
            return 'invalid date format in printDate';
      }
   },
   /* -----------------------------------------------------------------
    * Select date from combobox
    * ----------------------------------------------------------------- */
   setDate : function(date, monthCombo, dateCombo, yearCombo) {
      if (!gomezDate.validateSelect(monthCombo, 'month.setDate')) {
         null.die;
      }
      if (!gomezDate.validateSelect(dateCombo, 'date.setDate')) {
         null.die;
      }
      if (!gomezDate.validateSelect(yearCombo, 'year.setDate')) {
         null.die;
      }
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date in setDate');
         null.die;
      }
      var notfound = gomezDate.selectMonth(date, monthCombo);
      if (notfound == 'month not found') {
         gomezDate.selectMonthByIndex(date, monthCombo, 0);
      }
      gomezDate.selectDate(date, dateCombo);
      gomezDate.selectYear(date, yearCombo);
   },
   // French months need 4 characters to differentiate between June and July
   // For now, I'm going with this so that one list can handle, for english,
   // both the basic and abbreviated months
   MONTHS : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
   validateSelect : function(combo, functionName) {
      if (!combo) {
         alert('---PageError---:Null select object in ' + functionName);
         return false;
      }
      if (!combo.options) {
         alert('---PageError---:Non-select object in ' + functionName);
         return false;
      }
      return true;
   },
   // Selects month from a combo first by looking for the month number in the
   // combo options.  If not, it tries to match by english text (Jan, Feb, Mar, etc)
   // If not, it selects the option with the index of the month (with an optional offset).
   selectMonth : function(date, combo) {
      if (!gomezDate.validateSelect(combo, 'selectMonth')) {
         null.die;
      }
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date in selectMonth');
         null.die;
      }
      var targetMonthNum = date.getMonth() + 1;
      if (gomezDate.selectByText(combo, targetMonthNum, gomezCmp.exactText)) {
         return;
      }
      var targetMonthText = gomezDate.MONTHS[date.getMonth()];
      if (gomezDate.selectByText(combo, targetMonthText, gomezDate.startsWithLCText)) {
         return;
      }
      alert('---PageError---:Unable to find month in selectMonth');
      null.die;
   },
   // Offset is used in case there's an initial value (empty string, '--select a month--',
   // etc already in place)
   selectMonthByIndex : function(date, combo, offset) {
      if (!gomezDate.validateSelect(combo, 'selectMonthByIndex')) {
         null.die;
      }
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date in selectMonthByIndex');
         null.die;
      }
      if (!offset) {
         offset = 0;
      }
      var targetIndex = date.getMonth() + offset;
      if (combo.options.length < targetIndex) {
         alert('---PageError---:Not enough options in select in selectMonthByIndex');
         null.die;
      }
      gomezDate.selectOption(combo.options[targetIndex]);
   },
   startsWithLCText : function(obj, val) {
      if (obj.text) {
         var objText = (obj.text.toLowerCase()).substring(0, 3);
         return (objText == val) ? 1 : -1;
      }
      return -1;
   },
   selectOption : function(obj) {
      if (window.gomez_window_source) {
         obj.click();
      } else {
         obj.selected = true;
      }
   },
   selectByText : function(combo, text, cmpfn) {
      for (var i = 0; i < combo.options.length; i = i + 1) {
         if (cmpfn(combo.options[i], text) != -1) {
            gomezDate.selectOption(combo.options[i]);
            return true;
         }
      }
      return false;
   },
   selectDate : function(date, combo) {
      if (!gomezDate.validateSelect(combo, 'selectDate')) {
         null.die;
      }
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date in selectDate');
         null.die;
      }
      var target = date.getDate();
      if (!gomezDate.selectByText(combo, target, gomezCmp.exactText)) {
         alert('---PageError---:Unable to find date ' + target + ' in selectDate');
         null.die;
      }
   },
   selectYear : function(date, combo) {
      if (!gomezDate.validateSelect(combo, 'selectYear')) {
         null.die;
      }
      if ((!date) || (isNaN(date.getDate()))) {
         alert('---PageError---:Invalid date in selectYear');
         null.die;
      }
      var target = date.getFullYear();
      if (!gomezDate.selectByText(combo, target, gomezCmp.exactText)) {
         target = String(date.getFullYear()).substr(2);
         if (!gomezDate.selectByText(combo, target, gomezCmp.exactText)) {
            alert('---PageError---:Unable to find year ' + target + ' or ' + date.getFullYear() + ' in selectYear');
            null.die;
         }
      }
   }
};

var gomezInit = {
   init : function() {
       try { gomez.init(); } catch(e) {alert('---PageError---:gomez.init() ' + e); }
       try { gomezCmp.init(); } catch(e) {alert('---PageError---:gomezCmp.init() ' + e); }
       try { gomezDate.init(); } catch(e) {alert('---PageError---:gomezDate.init() ' + e); }
   }
};