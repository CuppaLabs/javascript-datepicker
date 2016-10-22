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
	}
	WinkelCalendar.prototype.createHeaderView = function(){

		  var self = this;
		  var year = self.date.getFullYear(),
		      month = self.date.getMonth(),
		      current_day = self.date.getDate();
		// get first day of month
		  var firstDay = new Date(year, month, 1);
		  var bigBanner = null;
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
			  bigBanner = document.createElement('div');
			  bigBanner.setAttribute('class','wc-banner');
			  var dayRow = document.createElement('div');
			  dayRow.setAttribute('class','wc-day-row');
			  dayRow.textContent = cal_full_days_lables[self.date.getDay()];
			  
			  var monthAndYear = document.createElement('div');
			  monthAndYear.setAttribute('class', 'wc-my-sec');
			  
			  var monthRow = document.createElement('div');
			  monthRow.setAttribute('class','wc-month-row');
			  var monthHeaderName = document.createElement('div');
			  monthHeaderName.textContent = cal_months_labels_short[self.date.getMonth()];
			  monthRow.appendChild(monthHeaderName);
			  
			  var monthControls = document.createElement('div');
			  monthControls.setAttribute('class', 'wc-month-controls');
			  
			  var prevMonthIcon = document.createElement('i');
			  prevMonthIcon.setAttribute('class', 'fa fa-angle-left');
			  prevMonthIcon.addEventListener('click', self.prevMonth.bind(this), false);
			  monthControls.appendChild(prevMonthIcon);
			  
			  var nextMonthIcon = document.createElement('i');
			  nextMonthIcon.setAttribute('class', 'fa fa-angle-right');
			  nextMonthIcon.addEventListener('click', self.nextMonth.bind(this), false);
			  monthControls.appendChild(nextMonthIcon);
			  monthRow.appendChild(monthControls);
			  var dateRow = document.createElement('div');
			  dateRow.setAttribute('class','wc-date-row');
			  if(self.date.getDate() < 10){
				  dateRow.textContent = "0"+self.date.getDate();
			  }
			  else
			  dateRow.textContent = self.date.getDate();
			  
			  var yearRow = document.createElement('div');
			  yearRow.setAttribute('class','wc-year-row');
			  var yearVal = document.createElement('div');
			  yearVal.textContent = self.date.getFullYear();
			  yearRow.appendChild(yearVal);
			  
			  var yearControls = document.createElement('div');
			  yearControls.setAttribute('class', 'wc-year-controls');
			  
			  var prevYearIcon = document.createElement('i');
			  prevYearIcon.setAttribute('class', 'fa fa-minus');
			  prevYearIcon.addEventListener('click', self.prevYear.bind(this), false);
			  yearControls.appendChild(prevYearIcon);
			  
			  var nextYearIcon = document.createElement('i');
			  nextYearIcon.setAttribute('class', 'fa fa-plus');
			  nextYearIcon.addEventListener('click', self.nextYear.bind(this), false);
			  yearControls.appendChild(nextYearIcon);
			  yearRow.appendChild(yearControls);
			  
			  bigBanner.appendChild(dayRow);
			  bigBanner.appendChild(dateRow);
			  
			  monthAndYear.appendChild(monthRow);
			  monthAndYear.appendChild(yearRow);
			  
			  bigBanner.appendChild(monthAndYear);
			  self.el.appendChild(bigBanner);
		  }
		  var headerDetails = document.createElement('div');
		  headerDetails.setAttribute('class','wc-details');
		  if(!self.options.bigBanner){
			  
		  var prevMonth = document.createElement('i');
		  prevMonth.setAttribute('class', 'wc-prev fa fa-angle-left');
		  prevMonth.addEventListener('click', self.prevMonth.bind(this), false);
		  headerDetails.appendChild(prevMonth);
		  
		  var headerDIV = document.createElement('div');
		  headerDIV.setAttribute('class','month-year');
		  headerDIV.textContent = monthName + " " + year;
		  headerDetails.appendChild(headerDIV);
		  
		  var nextMonth = document.createElement('i');
		  nextMonth.setAttribute('class', 'wc-next fa fa-angle-right');
		  nextMonth.addEventListener('click', self.nextMonth.bind(this), false);
		  headerDetails.appendChild(nextMonth);
		  
		  self.el.appendChild(headerDetails);
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
		  document.getElementById(this.options.container).appendChild(self.el);
		  
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
				this.options.onSelect.call(this, this.date);
			}
		}
	}
	WinkelCalendar.prototype.updateHeader = function(){
		if(this.options.bigBanner){
			this.el.children[0].children[0].innerHTML = "";
			this.el.children[0].children[1].innerHTML = "";
			this.el.children[0].children[2].children[0].children[0].innerHTML = "";
			this.el.children[0].children[2].children[1].innerHTML = "";
			this.el.children[0].children[0].innerHTML = cal_full_days_lables[this.date.getDay()];
			this.el.children[0].children[1].innerHTML = this.date.getDate() < 10 ? ("0"+this.date.getDate()) : this.date.getDate();
			this.el.children[0].children[2].children[0].children[0].innerHTML = cal_months_labels_short[this.date.getMonth()];
			this.el.children[0].children[2].children[1].innerHTML = this.date.getFullYear();
		}
		else{
			this.el.children[0].children[1].innerHTML = "";
			this.el.children[0].children[1].innerHTML = cal_months_labels[this.date.getMonth()] + " " + this.date.getFullYear();
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