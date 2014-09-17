
// Declare some global variables.
// If you want to get very good at software engineering, global variables
// aren't the nicest tools for this, but they're fine for a site which only has
// one or a few authors of code. You can look into other options of
// "JavaScript [module] encapsulation", at least one place being the
// forthcoming eBook.
//
// Perhaps oddly enough, since everything that uses this data is a subsidiary
// of the inititialization function, you could just move these declarations
// inside that function and it will work (becomes a "closure"; sometimes has
// complex consequences; look it up; see Intro to Programming document).
//
// These variable names are a little more verbose than usual
// ("currentlyChosen" -> "current"), but they're still within reason; clarity
// and correctness are arguably of utmost importance.
var currentlyChosenDepartureFlightIndex = null;
var currentlyChosenReturnFlightIndex = null;
var currentlyChosenDepartureFlightTimestamp = null;
var currentlyChosenReturnFlightTimestamp = null;
var totalPrice = 0;

// Takes an object representing a flight and produces a timestamp in the format
// of "YYYYMMDD H:i:s".
//
// The flight record should be like this:
//   {year:2012,month:11,day:13,hour:17,minute:37,price:137.38}
function FlightRecordToTimestamp(FlightRecord)
{
	// Start with the (presumably four-digit) year.
	var timestamp = '';
	timestamp += FlightRecord.year;

	// Add the month, optionally with leading zero.
	if (FlightRecord.month < 10)
	{
		timestamp += '0';
	}
	timestamp += FlightRecord.month;

	// Add the day, optionally with leading zero.
	if (FlightRecord.day < 10)
	{
		timestamp += '0';
	}
	timestamp += FlightRecord.day;

	// Add the space.
	timestamp += ' ';

	// Add the day, optionally with leading zero.
	if (FlightRecord.day < 10)
	{
		timestamp += '0';
	}
	timestamp += FlightRecord.day;

	// Add the hour, optionally with leading zero.
	if (FlightRecord.hour < 10)
	{
		timestamp += '0';
	}
	timestamp += FlightRecord.hour;

	// Add 00 for seconds.
	timestamp += '00';

	// Return the timestamp.
	return timestamp;
}

// Takes an object representing a flight and produces a nice-looking
// representation of the date & time.
//
// The flight record should be like this:
//   {year:2012,month:11,day:13,hour:17,minute:37,price:137.38}
function FlightRecordToDateTime(FlightRecord)
{
	// Determine the month abbreviation and start with that.
	var	possibleMonths = [
		null,
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	 ];
	var dateTime = possibleMonths[FlightRecord.month];

	// Add the space and day.
	dateTime += ' ' + FlightRecord.day;

	// Add a comma and the year.
	dateTime += ', ' + FlightRecord.year;

	// Decide if the hour is AM or PM; convert the hour to be in [1,12].
	var hourAMOrPM = (FlightRecord.hour > 11)?('PM'):('AM');
	var hour = FlightRecord.hour % 12;
	if (hour == 0)
	{
		hour = 12;
	}

	// Add the space, hour, minute, and AM/PM.
	dateTime += ' ' + hour + ':' + FlightRecord.minute + ' ' + hourAMOrPM;

	// Return the date/time.
	return dateTime;
}

// Takes an object representing a flight and produces a nice-looking
// representation of all the flight details.
//
// The flight record should be like this:
//   {year:2012,month:11,day:13,hour:17,minute:37,price:137.38}
function FlightRecordToHumanReadableText(FlightRecord)
{
	// Start with the date & time; leverage the other function.
	var representation = FlightRecordToDateTime(FlightRecord);

	// Add the price; round it in case something went weird with
	// floating-point numbers.
	representation += ' [' + FlightRecord.price.toFixed(2) + ']';

	// Return the representation.
	return representation;
}

// Create a function which initializes everything.
// This is a function for the benefit of "encapsulation", so we can call it on
// document ready, as you will see at the bottom of this file.
function InitializeTheAirlineThing()
{
	// First, disable the submit button, because it should only be enabled
	// under certain circumstances.
	$('#SubmitButton').attr('disabled', 'disabled');


	// Populate drop-downs
	// -------------------

	// Populate the departure-flights drop-down with the data in the provided
	// variable.
	for (var i = 0; i < possibleDepartureFlights.length; i++)
	{
		// Retrieve the current record; e.g. this would be an object that looks
		// like this:
		//   {year:2012,month:11,day:13,hour:17,minute:37,price:137.38}
		var currentFlight = possibleDepartureFlights[i];

		// Produce a timestamp from the record.
		var currentTimestamp = FlightRecordToTimestamp(currentFlight);

		// Produce a human-readable representation of the flight.
		var currentHumanReadableText
			= FlightRecordToHumanReadableText(currentFlight);

		// Produce a new <option> using jQuery and populate it with the
		// timestamp and human-readable text.
		var $newOption = $('<option></option>')
		                     .attr('value', currentTimestamp)
		                     .text(currentHumanReadableText);
		// Produces something like
		//   <option value="20121113 173700">Nov 13, 2012, 5:37 PM [$137.38]</option>

		// Attach the new <option> to the appropriate <select>
		$('#departureFlightsControl').append($newOption);
	}

	// Populate the return-flights drop-down with the data in the provided
	// variable.
	for (var i = 0; i < possibleReturnFlights.length; i++)
	{
		// Retrieve the current record; e.g. this would be an object that looks
		// like this:
		//   {year:2012,month:11,day:13,hour:17,minute:37,price:137.38}
		var currentFlight = possibleReturnFlights[i];

		// Produce a timestamp from the record.
		var currentTimestamp = FlightRecordToTimestamp(currentFlight);

		// Produce a human-readable representation of the flight.
		var currentHumanReadableText
			= FlightRecordToHumanReadableText(currentFlight);

		// Produce a new <option> using jQuery and populate it with the
		// timestamp and human-readable text.
		var $newOption = $('<option></option>')
		                     .attr('value', currentTimestamp)
		                     .text(currentHumanReadableText);
		// Produces something like
		//   <option value="20121113173700">Nov 13, 2012, 5:37 PM [$137.38]</option>

		// Attach the new <option> to the appropriate <select>
		$('#returnFlightsControl').append($newOption);
	}


	// Drop-down event handlers
	// ------------------------

	// Make an event handler for when the user chooses a departure flight.
	$('#departureFlightsControl').change(function() {

		// Pick the <option> which was chosen.
		// Remember that 'this' within an event-handler function refers to the
		// element with which the event happened - i.e. the <select> here.
		var $chosenOption = $(this).find('option:selected');

		// Count how many <option> siblings are before this; this will give the
		// ordinal number, or index, of the selected one. Adjust for the first
		// entry in the drop-down, which is blank.
		var numberOfPriorOptions = $chosenOption.prevAll().size();
		var selectedFlightIndex = numberOfPriorOptions - 1;

		// If the user chose the blank one, nullify the record of the
		// currently-selected flight and exit early.
		if (numberOfPriorOptions == 0)
		{
			currentlyChosenDepartureFlightIndex = null;
			return;
		}

		// Record the index of the currently-selected flight.
		currentlyChosenDepartureFlightIndex = selectedFlightIndex;

		// Retrieve the whole record of the flight.
		var flightRecord = possibleDepartureFlights[selectedFlightIndex];

		// Produce & record a timestamp for this flight.
		currentlyChosenDepartureFlightTimestamp
			= FlightRecordToTimestamp(flightRecord);

		// Retrieve just the nice-looking date/time for this entry.
		var niceDateTime = FlightRecordToDateTime(flightRecord);

		// Populate the summary area with the flight details.
		$('.FlightSummary.DepartureSummary .DateTime').text(niceDateTime);
		$('.FlightSummary.DepartureSummary .Price')
			.text('$' + flightRecord.price.toFixed(2));

		// Add a class which effectively makes this summary area visible.
		$('.FlightSummary.DepartureSummary').addClass('flightChosen');

		// Hide this <option> in the drop-down.
		$chosenOption.hide();

		// Just to look nice, make the first drop-down option to be the one
		// selected.
		$(this).children().first().attr('selected', 'selected');

		// Disable the drop-down so nothing else may be chosen.
		$(this).attr('disabled', 'disabled');

		// Update the total price - just the data first.
		totalPrice += flightRecord.price;

		// Update the display of the total price.
		$('.TotalPriceArea .Price').text('$' + totalPrice.toFixed(2));

		// Add a class which effectively shows the total-price area.
		$('.CumulativeSummary').addClass('totalAvailable');

		// If the currently chosen departure & return flights are a valid
		// combination, enable the submit button.
		if ((currentlyChosenDepartureFlightTimestamp != null)
		        && (currentlyChosenReturnFlightTimestamp != null)
		        && (currentlyChosenDepartureFlightTimestamp
		                < currentlyChosenReturnFlightTimestamp))
		{
			$('#SubmitButton').removeAttr('disabled');
		}
	 });

	// Make an event handler for when the user chooses a return flight.
	$('#returnFlightsControl').change(function() {

		// Pick the <option> which was chosen.
		// Remember that 'this' within an event-handler function refers to the
		// element with which the event happened - i.e. the <select> here.
		var $chosenOption = $(this).find('option:selected');

		// Count how many <option> siblings are before this; this will give the
		// ordinal number, or index, of the selected one. Adjust for the first
		// entry in the drop-down, which is blank.
		var numberOfPriorOptions = $chosenOption.prevAll().size();
		var selectedFlightIndex = numberOfPriorOptions - 1;

		// If the user chose the blank one, nullify the record of the
		// currently-selected flight & timestamp and exit early.
		if (numberOfPriorOptions == 0)
		{
			currentlyChosenReturnFlightIndex = null;
			currentlyChosenReturnFlightTimestamp = null;
			return;
		}

		// Record the index of the currently-selected flight.
		currentlyChosenReturnFlightIndex = selectedFlightIndex;

		// Retrieve the whole record of the flight.
		var flightRecord = possibleReturnFlights[selectedFlightIndex];

		// Produce & record a timestamp for this flight.
		currentlyChosenReturnFlightTimestamp
			= FlightRecordToTimestamp(flightRecord);

		// Retrieve just the nice-looking date/time for this entry.
		var niceDateTime = FlightRecordToDateTime(flightRecord);

		// Populate the summary area with the flight details.
		$('.FlightSummary.ReturnSummary .DateTime').text(niceDateTime);
		$('.FlightSummary.ReturnSummary .Price')
			.text('$' + flightRecord.price.toFixed(2));

		// Add a class which effectively makes this summary area visible.
		$('.FlightSummary.ReturnSummary').addClass('flightChosen');

		// Hide this <option> in the drop-down.
		$chosenOption.hide();

		// Just to look nice, make the first drop-down option to be the one
		// selected.
		$(this).children().first().attr('selected', 'selected');

		// Disable the drop-down so nothing else may be chosen.
		$(this).attr('disabled', 'disabled');

		// Update the total price - just the data first.
		totalPrice += flightRecord.price;

		// Update the display of the total price.
		$('.TotalPriceArea .Price').text('$' + totalPrice.toFixed(2));

		// Add a class which effectively shows the total-price area.
		$('.CumulativeSummary').addClass('totalAvailable');

		// If the currently chosen departure & return flights are a valid
		// combination, enable the submit button.
		if ((currentlyChosenDepartureFlightTimestamp != null)
		        && (currentlyChosenReturnFlightTimestamp != null)
		        && (currentlyChosenDepartureFlightTimestamp
		                < currentlyChosenReturnFlightTimestamp))
		{
			$('#SubmitButton').removeAttr('disabled');
		}
	 });

	
	// Cancel-button event handlers
	// ------------------------

	// Make an event handler for when the user cancels the departure flight.
	$('.FlightSummary.DepartureSummary .CancelButton').click(function() {

		// If, for some reason, there is no currently-chosen departure flight,
		// exit early. This basically can't happen in this program but it's a
		// good policy in general.
		if (currentlyChosenDepartureFlightIndex == null)
		{
			return;
		}

		// Retrieve the record of this flight.
		var flightRecord
			= possibleDepartureFlights[currentlyChosenDepartureFlightIndex];

		// Nullify the records of any currently-chosen departure flight.
		currentlyChosenDepartureFlightIndex = null;
		currentlyChosenDepartureFlightTimestamp = null;

		// Make the drop-down menu enabled and all of its options visible.
		$('#departureFlightsControl').removeAttr('disabled');
		$('#departureFlightsControl option').show();

		// Remove a class, which effectively hides this summary area.
		$('.FlightSummary.DepartureSummary').removeClass('flightChosen');

		// Update the total price - just the data first.
		totalPrice -= flightRecord.price;

		// Update the display of the total price.
		$('.TotalPriceArea .Price').text('$' + totalPrice.toFixed(2));

		// If no flights are chosen, hide the total-price area.
		if ((currentlyChosenDepartureFlightIndex == null)
		        && (currentlyChosenReturnFlightIndex == null))
		{
			$('.CumulativeSummary').removeClass('totalAvailable');
		}

		// Disable the submit button.
		$('#SubmitButton').attr('disabled', 'disabled');
	 });

	// Make an event handler for when the user cancels the return flight.
	$('.FlightSummary.ReturnSummary .CancelButton').click(function() {

		// If, for some reason, there is no currently-chosen return flight,
		// exit early. This basically can't happen in this program but it's a
		// good policy in general.
		if (currentlyChosenReturnFlightIndex == null)
		{
			return;
		}

		// Retrieve the record of this flight.
		var flightRecord
			= possibleReturnFlights[currentlyChosenReturnFlightIndex];

		// Nullify the records of any currently-chosen return flight.
		currentlyChosenReturnFlightIndex = null;
		currentlyChosenReturnFlightTimestamp = null;

		// Make the drop-down menu enabled and all of its options visible.
		$('#returnFlightsControl').removeAttr('disabled');
		$('#returnFlightsControl option').show();

		// Remove a class, which effectively hides this summary area.
		$('.FlightSummary.ReturnSummary').removeClass('flightChosen');

		// Update the total price - just the data first.
		totalPrice -= flightRecord.price;

		// Update the display of the total price.
		$('.TotalPriceArea .Price').text('$' + totalPrice.toFixed(2));


		// If no flights are chosen, hide the total-price area.
		if ((currentlyChosenDepartureFlightIndex == null)
		        && (currentlyChosenReturnFlightIndex == null))
		{
			$('.CumulativeSummary').removeClass('totalAvailable');
		}

		// Disable the submit button.
		$('#SubmitButton').attr('disabled', 'disabled');
	 });
}

// On document ready, initialize the system.
$(function() {
	InitializeTheAirlineThing();
 });