(function(window){
  'use strict';


	// these are labels for the days of the week
	var cal_days_labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var cal_full_days_lables = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

	// these are human-readable month name labels, in order
	var cal_months_labels = ['January', 'February', 'March', 'April',
	                     'May', 'June', 'July', 'August', 'September',
	                     'October', 'November', 'December'];
	var cal_months_labels_short = ['JAN', 'FEB', 'MAR', 'APR',
		                     'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
		                     'OCT', 'NOV', 'DEC'];

	// these are the days of the week for each month, in order
	var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var isDate = function(obj){
		return obj instanceof Date && !isNaN(obj.valueOf());
	}
	var extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    };
    

	var defaults = {
		defaultDate : new Date(),
		bigBanner: true,
		format : "dd/mm/yyyy",
		onSelect : null
		
	}

	
	function WinkelCalendar(options){

		  if (!this.options) {
                	this.options = extend({}, defaults, true);
            	  }

                  this.options = extend(this.options, options, true);

	          var opts = this.options;
		  
		  this.date = new Date(opts.defaultDate);
		  this.el = document.createElement('div');
		  this.createHeaderView();
		  this.createDaysView();
		  this.attachEvents();
		  this.init();
	}
	WinkelCalendar.prototype.init = function(){
		 this.el.inputContainer = document.createElement('INPUT');
		 this.el.inputContainer.setAttribute('type','text');
		 this.el.inputContainer.setAttribute('class','wc-input');
		 this.el.inputContainer.addEventListener('click', this.show.bind(this), false);
		 document.getElementById(this.options.container).appendChild(this.el.inputContainer);
		 this.el.style.display = "none";
		 document.getElementById(this.options.container).appendChild(this.el);
		 
	}
	WinkelCalendar.prototype.show = function(){
		this.el.style.display = "block";
	}
	WinkelCalendar.prototype.hide = function(){
			this.el.style.display = "none";
	}
	WinkelCalendar.prototype.setDateVal = function(){
			this.el.inputContainer.value = this.date;
	}
	WinkelCalendar.prototype.createHeaderView = function(){

		  var self = this;
		  var year = self.date.getFullYear(),
		      month = self.date.getMonth(),
		      current_day = self.date.getDate();
		// get first day of month
		  var firstDay = new Date(year, month, 1);
		  self.el.bigBanner = null;
		  // find number of days in month
		  var monthLength = cal_days_in_month[self.date.getMonth()];
		  
		  // compensate for leap year
		  if (month == 1) { // February only!
		    if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
		      monthLength = 29;
		    }
		  }
		  
		  // do the header
		  var monthName = cal_months_labels[month];
		  self.el.setAttribute('class','winkel-calendar');
		  if(self.options.bigBanner){
			  self.el.bigBanner = document.createElement('div');
			  self.el.bigBanner.setAttribute('class','wc-banner');
			  self.el.bigBanner.dayRow = document.createElement('div');
			  self.el.bigBanner.dayRow.setAttribute('class','wc-day-row');
			  self.el.bigBanner.dayRow.textContent = cal_full_days_lables[self.date.getDay()];
			  self.el.bigBanner.appendChild(self.el.bigBanner.dayRow);


			  self.el.bigBanner.monthAndYear = document.createElement('div');
			  self.el.bigBanner.monthAndYear.setAttribute('class', 'wc-my-sec');
			  
			  self.el.bigBanner.monthRow = document.createElement('div');
			  self.el.bigBanner.monthRow.setAttribute('class','wc-month-row');
			  self.el.bigBanner.monthHeaderName = document.createElement('div');
			  self.el.bigBanner.monthHeaderName.textContent = cal_months_labels_short[self.date.getMonth()];
			  self.el.bigBanner.monthRow.appendChild(self.el.bigBanner.monthHeaderName);
			  
			  self.el.bigBanner.monthControls = document.createElement('div');
			  self.el.bigBanner.monthControls.setAttribute('class', 'wc-month-controls');
			  
			  self.el.bigBanner.prevMonthIcon = document.createElement('i');
			  self.el.bigBanner.prevMonthIcon.setAttribute('class', 'fa fa-angle-left');
			  self.el.bigBanner.prevMonthIcon.addEventListener('click', self.prevMonth.bind(this), false);
			  self.el.bigBanner.monthControls.appendChild(self.el.bigBanner.prevMonthIcon);
			  
			  self.el.bigBanner.nextMonthIcon = document.createElement('i');
			  self.el.bigBanner.nextMonthIcon.setAttribute('class', 'fa fa-angle-right');
			  self.el.bigBanner.nextMonthIcon.addEventListener('click', self.nextMonth.bind(this), false);
			  self.el.bigBanner.monthControls.appendChild(self.el.bigBanner.nextMonthIcon);
			  self.el.bigBanner.monthRow.appendChild(self.el.bigBanner.monthControls);
			  self.el.bigBanner.dateRow = document.createElement('div');
			  self.el.bigBanner.dateRow.setAttribute('class','wc-date-row');
			  if(self.date.getDate() < 10){
				  self.el.bigBanner.dateRow.textContent = "0"+self.date.getDate();
			  }
			  else
			  self.el.bigBanner.dateRow.textContent = self.date.getDate();
			  
			  self.el.bigBanner.yearRow = document.createElement('div');
			  self.el.bigBanner.yearRow.setAttribute('class','wc-year-row');
			  self.el.bigBanner.yearVal = document.createElement('div');
			  self.el.bigBanner.yearVal.textContent = self.date.getFullYear();
			  self.el.bigBanner.yearRow.appendChild(self.el.bigBanner.yearVal);
			  
			  self.el.bigBanner.yearControls = document.createElement('div');
			  self.el.bigBanner.yearControls.setAttribute('class', 'wc-year-controls');
			  
			  self.el.bigBanner.prevYearIcon = document.createElement('i');
			  self.el.bigBanner.prevYearIcon.setAttribute('class', 'fa fa-minus');
			  self.el.bigBanner.prevYearIcon.addEventListener('click', self.prevYear.bind(this), false);
			  self.el.bigBanner.yearControls.appendChild(self.el.bigBanner.prevYearIcon);
			  
			  self.el.bigBanner.nextYearIcon = document.createElement('i');
			  self.el.bigBanner.nextYearIcon.setAttribute('class', 'fa fa-plus');
			  self.el.bigBanner.nextYearIcon.addEventListener('click', self.nextYear.bind(this), false);
			  self.el.bigBanner.yearControls.appendChild(self.el.bigBanner.nextYearIcon);
			  self.el.bigBanner.yearRow.appendChild(self.el.bigBanner.yearControls);
			  
			  
			  self.el.bigBanner.appendChild(self.el.bigBanner.dateRow);
			  
			  self.el.bigBanner.monthAndYear.appendChild(self.el.bigBanner.monthRow);
			  self.el.bigBanner.monthAndYear.appendChild(self.el.bigBanner.yearRow);
			  
			  self.el.bigBanner.appendChild(self.el.bigBanner.monthAndYear);
			  self.el.appendChild(self.el.bigBanner);
			  console.log(self);
		  }
		  self.el.headerDetails = document.createElement('div');
		  self.el.headerDetails.setAttribute('class','wc-details');
		  if(!self.options.bigBanner){
			  
		  self.el.headerDetails.prevMonth = document.createElement('i');
		  self.el.headerDetails.prevMonth.setAttribute('class', 'wc-prev fa fa-angle-left');
		  self.el.headerDetails.prevMonth.addEventListener('click', self.prevMonth.bind(this), false);
		  self.el.headerDetails.appendChild(self.el.headerDetails.prevMonth);
		  
		  self.el.headerDetails.headerDIV = document.createElement('div');
		  self.el.headerDetails.headerDIV.setAttribute('class','month-year');
		  self.el.headerDetails.headerDIV.textContent = monthName + " " + year;
		  self.el.headerDetails.appendChild(self.el.headerDetails.headerDIV);
		  
		  self.el.headerDetails.nextMonth = document.createElement('i');
		  self.el.headerDetails.nextMonth.setAttribute('class', 'wc-next fa fa-angle-right');
		  self.el.headerDetails.nextMonth.addEventListener('click', self.nextMonth.bind(this), false);
		  self.el.headerDetails.appendChild(self.el.headerDetails.nextMonth);
		  
		  self.el.appendChild(self.el.headerDetails);
		  }
		  var html = document.createElement("table"); 
		  html.setAttribute('class','calendar-header');
		 
		  var daysRow = document.createElement('tr');
		  for(var i = 0; i <= 6; i++ ){
			  var daysTd = document.createElement('td');
			  daysTd.setAttribute('class','calendar-header-day');
			  daysTd.textContent = cal_days_labels[i];
			  daysRow.appendChild(daysTd);
		  }
		  html.appendChild(daysRow);
		  self.el.appendChild(html);

	}
	WinkelCalendar.prototype.getMonthLength = function(month, year){
		var monthLength = cal_days_in_month[month];
		  
		  // compensate for leap year
		  if (month == 1) { // February only!
		    if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
		      monthLength = 29;
		    }
		  }
		  return monthLength;
	}
	WinkelCalendar.prototype.createDaysView = function(){

		  var self = this;
		  var year = self.date.getFullYear(),
		      month = self.date.getMonth(),
		      current_day = self.date.getDate(),
		      today = new Date();
		// get first day of month
		  var firstDay = new Date(year, month, 1);
		  var startingDay = firstDay.getDay();
		  
		  // find number of days in month
		  var monthLength = this.getMonthLength(month,year);
		  
		  // do the header

		  var daysTable = document.createElement("table");  	
		  daysTable.setAttribute('class','calendar-days');
		  // fill in the days
		  var day = 1;
		  var dateRow = null;
		  // this loop is for is weeks (rows)
		  for (var i = 0; i < 9; i++) {
		    // this loop is for weekdays (cells)
			  dateRow = document.createElement('tr');
		    for (var j = 0; j <= 6; j++) { 
		    	var dateCell = document.createElement('td');
		    	dateCell.setAttribute('class','calendar-day');
		      if (day <= monthLength && (i > 0 || j >= startingDay)) {
		    	  dateCell.textContent = day;
			  if(day == parseInt(current_day)){
				dateCell.classList.add('selected-day');
			  }
			  if(day == parseInt(today.getDate()) && self.date.getMonth() == today.getMonth() && self.date.getFullYear() == today.getFullYear()){
				  dateCell.classList.add('today');
			  }
			  dateCell.isDate = true;
		        day++;
		      }
		      dateRow.appendChild(dateCell);
		    }
		    // stop making rows if we've run out of days
		    if (day > monthLength) {
		      break;
		    } else {
		    	daysTable.appendChild(dateRow);
		    }
		  }
		  daysTable.appendChild(dateRow);
		  self.el.appendChild(daysTable);
		 
		  
	}
	WinkelCalendar.prototype.getHTML = function() {
		  return this.html;
		}
	WinkelCalendar.prototype.update = function(){
		this.name = "solomon";
		this.renderView();
	}
	WinkelCalendar.prototype.attachEvents = function(){
		var self = this;
		var elem = self.el;
		elem.addEventListener('click', self.onCalendarClick.bind(this), false);

	}

	WinkelCalendar.prototype.onCalendarClick = function(){
		var self = this;
		var elem = self.el;
		if(event.target.hasOwnProperty('isDate') && event.target.innerHTML != ""){

			var date = event.target.innerHTML;
			self.date.setDate(parseInt(date));
			
			elem.getElementsByClassName('selected-day')[0].classList.remove('selected-day');
			event.target.classList.add('selected-day');
			self.updateHeader();
			if(typeof this.options.onSelect === 'function'){
				this.setDateVal();
				this.options.onSelect.call(this, this.date);
			}
		}
	}
	WinkelCalendar.prototype.updateHeader = function(){
		if(this.options.bigBanner){
			console.log();
			this.el.bigBanner.dayRow.textContent = cal_full_days_lables[this.date.getDay()];
			this.el.bigBanner.monthHeaderName.textContent = cal_months_labels_short[this.date.getMonth()];
			this.el.bigBanner.dateRow.textContent = this.date.getDate() < 10 ? ("0"+this.date.getDate()) : this.date.getDate();
			this.el.bigBanner.yearVal.textContent = this.date.getFullYear();
		}
		else{
			//this.el.children[0].children[1].innerHTML = "";
			console.log( );
			this.el.headerDetails.headerDIV.textContent = cal_months_labels[this.date.getMonth()] + " " + this.date.getFullYear();
			//this.el.children[0].children[1].innerHTML = 
		}

		
	}
	WinkelCalendar.prototype.prevMonth = function(){
		var self = this;
		if(self.date.getMonth() == 0){
			self.date.setMonth(11);
			self.date.setFullYear(self.date.getFullYear() - 1);
		}else{
			var prevmonthLength = self.getMonthLength(self.date.getMonth() - 1, self.date.getFullYear());
			var currentDate = self.date.getDate();
			if(currentDate > prevmonthLength ){
				self.date.setDate(prevmonthLength);
			}
			self.date.setMonth(self.date.getMonth() - 1);
		}
		
		console.log(this.date);
		self.updateHeader();
		self.destroyDaysTable();
		self.createDaysView();
	}
	WinkelCalendar.prototype.nextMonth = function(){
		var self = this;
		if(self.date.getMonth() == 11){
			self.date.setMonth(0);
			self.date.setFullYear(self.date.getFullYear() + 1);
		}else{
			var nextmonthLength = self.getMonthLength(self.date.getMonth() + 1, self.date.getFullYear());
			var currentDate = self.date.getDate();
			if(currentDate > nextmonthLength){
				self.date.setDate(nextmonthLength);
			}
			self.date.setMonth(self.date.getMonth() + 1);
			
		}
		
		console.log(this.date);
		self.updateHeader();
		self.destroyDaysTable();
		self.createDaysView();
	}
	WinkelCalendar.prototype.prevYear = function(){
		this.date.setFullYear(this.date.getFullYear() - 1);
		this.updateHeader();
		this.destroyDaysTable();
		this.createDaysView();
	}
	WinkelCalendar.prototype.nextYear = function(){
		this.date.setFullYear(this.date.getFullYear() + 1);
		this.updateHeader();
		this.destroyDaysTable();
		this.createDaysView();
	}
	WinkelCalendar.prototype.destroyDaysTable = function(){
		this.el.removeChild(this.el.children[2]);
	}
	window.WinkelCalendar = WinkelCalendar || {};
	
})(window);