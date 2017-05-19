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
	function WinkelCalendar(options){
		 this.defaults = {
				defaultDate : new Date(),
				bigBanner: true,
				format : "DD/MM/YYYY",
				onSelect : null
			}
		  if (!this.options) {
                	this.options = extend({}, this.defaults, true);
            	  }

                  this.options = extend(this.options, options, true);

	          var opts = this.options;
		  
		  this.date = new Date(opts.defaultDate);
		  this.selectedDate = new Date(opts.defaultDate);
		  this.el = document.createElement('div');
		  this.containerElement = document.getElementById(this.options.container);
		  document.addEventListener('click', this.bodyClick.bind(this), true);
		  this.init();

	}
	WinkelCalendar.prototype.init = function(){
		 this.el.inputContainer = document.createElement('INPUT');
		 this.el.dateContainer = document.createElement('DIV');
		 this.el.dateContainer.textContainer = document.createElement('span');
		 this.el.dateContainer.appendChild(this.el.dateContainer.textContainer);
		 this.el.dateContainer.calIcon = document.createElement('i');
		 this.el.dateContainer.calIcon.setAttribute('class','fa fa-calendar');
		 this.el.dateContainer.appendChild(this.el.dateContainer.calIcon);
		 this.el.inputContainer.setAttribute('type','hidden');
		 this.el.inputContainer.setAttribute('class','wc-input');
		 this.el.dateContainer.setAttribute('class','wc-date-container');
		 this.el.dateContainer.addEventListener('click', this.toggle.bind(this), true);
		 
		 this.el.calendarPopup = document.createElement('DIV');
		 this.el.calendarPopup.setAttribute('class','wc-date-popover');

		 this.el.appendChild(this.el.inputContainer);
		 this.el.appendChild(this.el.dateContainer);
		 this.el.appendChild(this.el.calendarPopup);
		 this.el.calendarPopup.style.display = "none";
		 this.createHeaderView();
		 this.createDaysView();
		 this.createMonthView();
		 this.createYearView();
		 this.containerElement.appendChild(this.el);
		 this.setDateVal();
		 
	}
	WinkelCalendar.prototype.show = function(){
		this.date = new Date(this.selectedDate);
		this.updateView();
		this.el.calendarPopup.style.display = "block";
	}
	WinkelCalendar.prototype.hide = function(){
			this.el.calendarPopup.style.display = "none";
	}
	WinkelCalendar.prototype.toggle = function(){
		    if(this.el.calendarPopup.style.display == "none"){
				this.show();
			}
			else
				this.hide();
	}
	WinkelCalendar.prototype.today = function(){
		    this.date = new Date();
		    this.selectedDate = new Date();
			this.setDateVal();
			this.updateView();
	}
	WinkelCalendar.prototype.setDateVal = function(){
		    this.selectedDate = new Date(this.date);
			this.el.dateContainer.textContainer.textContent = moment(this.selectedDate).format(this.options.format);
			this.el.inputContainer.value = moment(this.selectedDate).format(this.options.format);
	}
	WinkelCalendar.prototype.setDate = function(val){
		    this.date = new Date(val);
			this.selectedDate = new Date(val);
			this.setDateVal();
			this.updateView();
	}
	WinkelCalendar.prototype.updateView = function(){
			this.updateHeader();
		    this.destroyDaysTable();
		    this.createDaysView();		
	}
	WinkelCalendar.prototype.toggleMonthView = function(e){
		e.stopPropagation();
		this.updateMonthView();
		if(this.el.calendarPopup.monthsView.style.display == "none"){
			this.el.calendarPopup.monthsView.style.display = "block";
		}
		else
		this.el.calendarPopup.monthsView.style.display = "none";
		this.el.calendarPopup.yearsView.style.display = "none";
	}
	WinkelCalendar.prototype.toggleYearView = function(e){
		e.stopPropagation();
		this.updateYearView();
		if(this.el.calendarPopup.yearsView.style.display == "none"){
			this.el.calendarPopup.yearsView.style.display = "block";
		}
		else
		this.el.calendarPopup.yearsView.style.display = "none";
		this.el.calendarPopup.monthsView.style.display = "none";
	}
	WinkelCalendar.prototype.createMonthView = function(){
			this.el.calendarPopup.monthsView = document.createElement('DIV');
			this.el.calendarPopup.monthsView.setAttribute('class','months-view');
			this.el.calendarPopup.monthsView.style.display = "none";
			this.el.calendarPopup.monthsView.addEventListener('click', this.onMonthSelect.bind(this), true);
			for(var k=0;k<cal_months_labels.length;k++){
				var tempElem = document.createElement('SPAN');
					tempElem.textContent = cal_months_labels_short[k];
					tempElem.setAttribute('value',cal_months_labels_short[k]);
					this.el.calendarPopup.monthsView.appendChild(tempElem);
			}
			this.el.calendarPopup.appendChild(this.el.calendarPopup.monthsView);
	}
	WinkelCalendar.prototype.createYearView = function(direction){			
		    this.el.calendarPopup.yearsView = document.createElement('DIV');
			this.el.calendarPopup.yearsView.setAttribute('class','years-view');
			this.el.calendarPopup.yearsView.style.display = "none";
			this.el.calendarPopup.yearsView.yearListView = document.createElement('DIV');
			this.el.calendarPopup.yearsView.prevYearList = document.createElement('DIV');
			this.el.calendarPopup.yearsView.prevYearList.setAttribute('class','prev');
			this.el.calendarPopup.yearsView.prevYearList.setAttribute('class','fa');
			this.el.calendarPopup.yearsView.prevYearList.classList.add('fa-angle-left');
			this.el.calendarPopup.yearsView.prevYearList.classList.add('prev');
			//this.el.calendarPopup.yearsView.prevYearList.textContent = "Prev";
			this.el.calendarPopup.yearsView.nextYearList = document.createElement('DIV');
			this.el.calendarPopup.yearsView.nextYearList.setAttribute('class','fa');
			this.el.calendarPopup.yearsView.nextYearList.classList.add('fa-angle-right');
			this.el.calendarPopup.yearsView.nextYearList.classList.add('next');
			//this.el.calendarPopup.yearsView.nextYearList.textContent = "Next";
			this.el.calendarPopup.yearsView.prevYearList.addEventListener('click', this.setPrevYearList.bind(this), true);
			this.el.calendarPopup.yearsView.nextYearList.addEventListener('click', this.setNextYearList.bind(this), true);

			this.el.calendarPopup.yearsView.yearListView.setAttribute('class','years-list-view');
			this.el.calendarPopup.yearsView.yearListView.addEventListener('click', this.onYearSelect.bind(this), true);
			var currentYear = this.date.getFullYear();
			var startYear = currentYear - 4;
			this.el.calendarPopup.yearsView.yearsList = [];
			for(var k=0; k< 9; k++){
				var tempElem = document.createElement('SPAN');
					tempElem.textContent = startYear + k;
					tempElem.setAttribute('value',startYear + k);
					this.el.calendarPopup.yearsView.yearsList.push(tempElem);
					this.el.calendarPopup.yearsView.yearListView.appendChild(this.el.calendarPopup.yearsView.yearsList[k]);
			}
			this.el.calendarPopup.yearsView.appendChild(this.el.calendarPopup.yearsView.prevYearList);
			this.el.calendarPopup.yearsView.appendChild(this.el.calendarPopup.yearsView.nextYearList);
			this.el.calendarPopup.yearsView.appendChild(this.el.calendarPopup.yearsView.yearListView);
			this.el.calendarPopup.appendChild(this.el.calendarPopup.yearsView);
	}
	WinkelCalendar.prototype.onMonthSelect = function(e){
			e.stopPropagation();
			var month = cal_months_labels_short.indexOf(e.target.getAttribute('value'));
			this.date.setMonth(month);
			this.updateMonthView();
			this.updateView();
			this.el.calendarPopup.monthsView.style.display = "none";
	}
	WinkelCalendar.prototype.onYearSelect = function(e){
			e.stopPropagation();
			if(e.target.getAttribute('value')){
				var year = e.target.getAttribute('value');
				this.date.setFullYear(parseInt(year));
				this.updateView();
				this.el.calendarPopup.yearsView.style.display = "none";
			}
	}
	WinkelCalendar.prototype.setPrevYearList = function(){
		var startYear = parseInt(this.el.calendarPopup.yearsView.yearsList[0].textContent - 9);
		var currentYear = this.date.getFullYear();
		for(var k=0; k< 9; k++){
			if((startYear + k) === currentYear ){
					this.el.calendarPopup.yearsView.yearsList[k].setAttribute('class','current-year');
				}
				else{
					this.el.calendarPopup.yearsView.yearsList[k].classList.remove('current-year');
				}
			this.el.calendarPopup.yearsView.yearsList[k].setAttribute('value',startYear + k);
			this.el.calendarPopup.yearsView.yearsList[k].textContent = startYear + k;	
		}
	}
	WinkelCalendar.prototype.setNextYearList = function(){
		var startYear = parseInt(this.el.calendarPopup.yearsView.yearsList[8].textContent) + 1;
		var currentYear = this.date.getFullYear();
		for(var k=0; k< 9; k++){
			if((startYear + k) === currentYear ){
					this.el.calendarPopup.yearsView.yearsList[k].setAttribute('class','current-year');
				}
				else{
					this.el.calendarPopup.yearsView.yearsList[k].classList.remove('current-year');
				}
			this.el.calendarPopup.yearsView.yearsList[k].setAttribute('value',startYear + k);
			this.el.calendarPopup.yearsView.yearsList[k].textContent = startYear + k;	
		}
	}
	WinkelCalendar.prototype.updateMonthView = function(){
		var months = this.el.calendarPopup.monthsView.children;
		for(var t=0;t< months.length;t++){
			if(months[t].textContent === cal_months_labels_short[this.date.getMonth()]){
				months[t].setAttribute('class','current-month');
			}
			else
			months[t].classList.remove('current-month');
		}
	}
	WinkelCalendar.prototype.updateYearView = function(){
		var currentYear = this.date.getFullYear();
			var startYear = currentYear - 4;
			for(var k=0; k< 9; k++){
				if((startYear + k) === currentYear ){
					this.el.calendarPopup.yearsView.yearsList[k].setAttribute('class','current-year');
				}
				else{
					this.el.calendarPopup.yearsView.yearsList[k].classList.remove('current-year');
				}
				this.el.calendarPopup.yearsView.yearsList[k].setAttribute('value',startYear + k);
				this.el.calendarPopup.yearsView.yearsList[k].textContent = startYear + k;	
			}
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
			  this.el.calendarPopup.classList.add('banner-true');
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
			  self.el.bigBanner.monthHeaderName.addEventListener('click', this.toggleMonthView.bind(this), true);
			  self.el.bigBanner.monthRow.appendChild(self.el.bigBanner.monthHeaderName);
			  
			  self.el.bigBanner.monthControls = document.createElement('div');
			  self.el.bigBanner.monthControls.setAttribute('class', 'wc-month-controls');
			  
			  self.el.bigBanner.prevMonthIcon = document.createElement('i');
			  self.el.bigBanner.prevMonthIcon.setAttribute('class', 'fa fa-angle-left');
			  self.el.bigBanner.prevMonthIcon.addEventListener('click', self.prevMonth.bind(this), true);
			  //self.el.bigBanner.monthControls.appendChild(self.el.bigBanner.prevMonthIcon);
			  
			  self.el.bigBanner.nextMonthIcon = document.createElement('i');
			  self.el.bigBanner.nextMonthIcon.setAttribute('class', 'fa fa-angle-right');
			  self.el.bigBanner.nextMonthIcon.addEventListener('click', self.nextMonth.bind(this), true);
			 // self.el.bigBanner.monthControls.appendChild(self.el.bigBanner.nextMonthIcon);
			 // self.el.bigBanner.monthRow.appendChild(self.el.bigBanner.monthControls);
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
			  self.el.bigBanner.yearVal.addEventListener('click', this.toggleYearView.bind(this), true);
			  self.el.bigBanner.yearRow.appendChild(self.el.bigBanner.yearVal);
			  
			  self.el.bigBanner.yearControls = document.createElement('div');
			  self.el.bigBanner.yearControls.setAttribute('class', 'wc-year-controls');
			  
			  self.el.bigBanner.prevYearIcon = document.createElement('i');
			  self.el.bigBanner.prevYearIcon.setAttribute('class', 'fa fa-angle-left');
			  self.el.bigBanner.prevYearIcon.addEventListener('click', self.prevYear.bind(this), true);
			  //self.el.bigBanner.yearControls.appendChild(self.el.bigBanner.prevYearIcon);
			  
			  self.el.bigBanner.nextYearIcon = document.createElement('i');
			  self.el.bigBanner.nextYearIcon.setAttribute('class', 'fa fa-angle-right');
			  self.el.bigBanner.nextYearIcon.addEventListener('click', self.nextYear.bind(this), true);
			  //self.el.bigBanner.yearControls.appendChild(self.el.bigBanner.nextYearIcon);
			  //self.el.bigBanner.yearRow.appendChild(self.el.bigBanner.yearControls);
			  
			  
			  self.el.bigBanner.appendChild(self.el.bigBanner.dateRow);
			  
			  self.el.bigBanner.monthAndYear.appendChild(self.el.bigBanner.monthRow);
			  self.el.bigBanner.monthAndYear.appendChild(self.el.bigBanner.yearRow);
			  
			  self.el.bigBanner.appendChild(self.el.bigBanner.monthAndYear);
			  self.el.calendarPopup.appendChild(self.el.bigBanner);
			  console.log(self);
		  }
		  self.el.headerDetails = document.createElement('div');
		  self.el.headerDetails.setAttribute('class','wc-details');
		 // if(self.options.bigBanner){
			  
		  self.el.headerDetails.prevMonth = document.createElement('i');
		  self.el.headerDetails.prevMonth.setAttribute('class', 'wc-prev fa fa-angle-left');
		  self.el.headerDetails.prevMonth.addEventListener('click', self.prevMonth.bind(this), true);
		  self.el.headerDetails.appendChild(self.el.headerDetails.prevMonth);
		  
		  self.el.headerDetails.headerDIV = document.createElement('div');
		  self.el.headerDetails.headerDIV.setAttribute('class','month-year');
		  self.el.headerDetails.headerDIV.textContent = monthName + " " + year;
		  self.el.headerDetails.appendChild(self.el.headerDetails.headerDIV);
		  
		  self.el.headerDetails.nextMonth = document.createElement('i');
		  self.el.headerDetails.nextMonth.setAttribute('class', 'wc-next fa fa-angle-right');
		  self.el.headerDetails.nextMonth.addEventListener('click', self.nextMonth.bind(this), true);
		  self.el.headerDetails.appendChild(self.el.headerDetails.nextMonth);
		  
		  self.el.calendarPopup.appendChild(self.el.headerDetails);
		//  }
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
		  self.el.calendarPopup.appendChild(html);

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
				var span = document.createElement('span');
		    	dateCell.setAttribute('class','calendar-day');
		      if (day <= monthLength && (i > 0 || j >= startingDay)) {
		    	  span.textContent = day;
				  dateCell.appendChild(span);
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
		  self.el.calendarPopup.daysTable = daysTable
		  self.el.calendarPopup.daysTable .appendChild(dateRow);
		  self.el.calendarPopup.daysTable.addEventListener('click', self.onCalendarClick.bind(this), true);
		  self.el.calendarPopup.appendChild(self.el.calendarPopup.daysTable);
		  
		  
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
		var elem = self.el.calendarPopup.daysTable;
		elem.addEventListener('click', self.onCalendarClick.bind(this), true);

	}

	WinkelCalendar.prototype.onCalendarClick = function(event){
		event.stopPropagation();
		var self = this;
		var elem = self.el;
		if(event.target.parentElement.hasOwnProperty('isDate') && event.target.innerHTML != ""){

			var date = event.target.innerHTML;
			self.date.setDate(parseInt(date));
			
			elem.getElementsByClassName('selected-day')[0].classList.remove('selected-day');
			event.target.classList.add('selected-day');
			self.updateHeader();
			this.setDateVal();
			if(typeof this.options.onSelect === 'function'){
				this.options.onSelect.call(this, this.date);	
			}
			this.hide();
		}
	}
	WinkelCalendar.prototype.updateHeader = function(){
		if(this.options.bigBanner){
			this.el.bigBanner.dayRow.textContent = cal_full_days_lables[this.date.getDay()];
			this.el.bigBanner.monthHeaderName.textContent = cal_months_labels_short[this.date.getMonth()];
			this.el.bigBanner.dateRow.textContent = this.date.getDate() < 10 ? ("0"+this.date.getDate()) : this.date.getDate();
			this.el.bigBanner.yearVal.textContent = this.date.getFullYear();
			this.el.headerDetails.headerDIV.textContent = cal_months_labels[this.date.getMonth()] + " " + this.date.getFullYear();
		}
		else{
			this.el.headerDetails.headerDIV.textContent = cal_months_labels[this.date.getMonth()] + " " + this.date.getFullYear();
		}

		
	}
	WinkelCalendar.prototype.prevMonth = function(e){
		e.stopPropagation();
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
	WinkelCalendar.prototype.nextMonth = function(e){
		e.stopPropagation();
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
		
		self.updateHeader();
		self.destroyDaysTable();
		self.createDaysView();
	}
	WinkelCalendar.prototype.prevYear = function(e){
		e.stopPropagation();
		this.date.setFullYear(this.date.getFullYear() - 1);
		this.updateHeader();
		this.destroyDaysTable();
		this.createDaysView();
	}
	WinkelCalendar.prototype.nextYear = function(e){
		e.stopPropagation();
		this.date.setFullYear(this.date.getFullYear() + 1);
		this.updateHeader();
		this.destroyDaysTable();
		this.createDaysView();
	}
	WinkelCalendar.prototype.destroyDaysTable = function(){
		this.el.calendarPopup.removeChild(this.el.calendarPopup.daysTable);
	}

	WinkelCalendar.prototype.bodyClick = function(e){
		if(this.containerElement.contains(e.target)){
			//this.hide();
		}
		else{
			this.hide();
		}
		//alert();
		//this.hide();
	}
	window.WinkelCalendar = WinkelCalendar || {};
	
})(window);
