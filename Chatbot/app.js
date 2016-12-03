var request = require('request');
var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
	
	//appId: 814cf5f0-6364-4a4a-9d45-7effc15de6c0,
	//appPassword: vx4knKg5A3b1PffKXQgaNmj
	
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/aa4c0fad-99b9-4905-8485-b59f996f4b1a?subscription-key=7747bd41545e45f4983a86aee3436728&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//=========================================================
// Bots Dialogs
//=========================================================

intents.matches('SayHi', [
	function(session)
	{
		session.send('Hi! How can I help you?');
	}
]);


intents.matches('ShowBusStops', [
	function(session)
	{
		var fs = require('fs');
 
		var contents = fs.readFileSync('903stops.txt', 'utf8');
		console.log(contents);
		
		session.send('You can catch the 903 hopper bus from any of these stops: %s', contents);
	
	}
]);

intents.matches('ShowTime', [
	function(session)
	{		
		session.send('The time is: %s', getTime());
	
	}
]);

intents.matches('ShowDate', [
	function(session)
	{		
		session.send('The date is: %s', getDate());
	
	}
]);

function getTime() {
	
	var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return   hour + ":" + min;
}

function getDate() {

    var date = new Date();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return   day + "/" + month;
}


//=========================================================
// default answer
//=========================================================
intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't understand. A small team of monkeys has been tasked with dealing with this issue."));


//=========================================================
// library open time and location
//=========================================================
// !!! library open time without cosidering holiday
intents.matches('ShowLibrary', [
	function(session)
	{		
		builder.Prompts.text(session, 
			'Which library do you want to know?\n 1. Business Library\n 2. Denis Arnold Music Library\n 3. Djanogly Learning Resource Centre\n 4. George Green Library\n 5. Greenfield Medical Library\n 6. Hallward Library\n 7. James Cameron-Gifford Library\n 8. Manuscripts and Special Collections');
	},
	function(session, results) {
        session.send('%s', getLibraryInformation(results.response));
    }

]);

function getLibraryInformation(libraryNameOrIndex) {
	libraryNameOrIndex = libraryNameOrIndex.toLowerCase();
	var openTime = getLibraryOpenTime(libraryNameOrIndex);
	var location = getLibraryLocation(libraryNameOrIndex);
	if(openTime == "wrong") {
		return "Sorry. Please check the library name or index.";
	}
	else {
		return "OPEN TIME: " + openTime + "LOCATION: " + location;
	}
}

function getLibraryOpenTime(libraryNameOrIndex) {
	var openTime;
	if(libraryNameOrIndex == "1" || libraryNameOrIndex == "Business Library" || libraryNameOrIndex == "Business") {
		openTime = "Monday - Friday: 8am - 9.45pm\nSaturday: 9am - 4.45pm\nSunday: 9.30am - 4.45pm.\n\n";
	}
	else if(libraryNameOrIndex == "2" || libraryNameOrIndex == "Denis Arnold Music Library" || libraryNameOrIndex == "Denis Arnold Music") {
		openTime = "Monday - Friday: 9.30am - 7pm\nSat: 1pm - 5pm\nSun: Closed.\n\n";
	}
	else if(libraryNameOrIndex == "3" || libraryNameOrIndex == "Djanogly Learning Resource Centre") {
		openTime = "Monday - Friday: 8am - 9.45pm\nSaturday: 9am - 4.45pm\nSunday: 9.30am - 4.45pm.\n\n";
	}
	else if(libraryNameOrIndex == "4" || libraryNameOrIndex == "George Green Library" || libraryNameOrIndex == "George Green") {
		openTime = "Monday - Friday: 8am - 9.45pm\nSaturday: 9am - 4.45pm\nSunday: 9.30am - 4.45pm.\n\n";
	}
	else if(libraryNameOrIndex == "5" || libraryNameOrIndex == "Greenfield Medical Library" || libraryNameOrIndex == "Greenfield Medical") {
		openTime = "24 hours / 7 days\n\n\n";
	}
	else if(libraryNameOrIndex == "6" || libraryNameOrIndex == "Hallward Library" || libraryNameOrIndex == "Hallward") {
		openTime = "24 hours / 7 days\n\n\n";
	}
	else if(libraryNameOrIndex == "7" || libraryNameOrIndex == "James Cameron-Gifford Library" || libraryNameOrIndex == "James Cameron-Gifford") {
		openTime = "Monday - Friday: 8am - 9.45pm\nSaturday: 9am - 4.45pm\nSunday: 9.30am - 4.45pm.\n\n";
	}
	else if(libraryNameOrIndex == "8" || libraryNameOrIndex == "Manuscripts and Special Collections") {
		openTime = "Monday - Thursday: 9am - 6pm\nFri: 9am - 5pm\nWeekend: Closed.\n\n";
	}
	else {
		openTime = "wrong";
	}
	return openTime;
}

function getLibraryLocation(libraryNameOrIndex) {
	var location;
	if(libraryNameOrIndex == "1" || libraryNameOrIndex == "Business Library" || libraryNameOrIndex == "Business") {
		location = "Top Floor, Business School South\nJubilee Campus, Wollaton Road\nNottingham, NG8 1BB.";
	}
	else if(libraryNameOrIndex == "2" || libraryNameOrIndex == "Denis Arnold Music Library" || libraryNameOrIndex == "Denis Arnold Music") {
		location = "Denis Arnold Music Library\nArts Centre\nUniversity Park\nNottingham, NG7 2RD."
	}
	else if(libraryNameOrIndex == "3" || libraryNameOrIndex == "Djanogly Learning Resource Centre") {
		location = "Djanogly Learning Resource Centre\nJubilee Campus, Wollaton Road\nNottingham, NG8 1BB.";
	}
	else if(libraryNameOrIndex == "4" || libraryNameOrIndex == "George Green Library" || libraryNameOrIndex == "George Green") {
		location = "George Green Library\nUniversity Park\nNottingham, NG7 2RD.";
	}
	else if(libraryNameOrIndex == "5" || libraryNameOrIndex == "Greenfield Medical Library" || libraryNameOrIndex == "Greenfield Medical") {
		location = "Greenfield Medical Library\nA Floor,  Medical School\nQueen's Medical Centre\nNottingham, NG7 2UH.";
	}
	else if(libraryNameOrIndex == "6" || libraryNameOrIndex == "Hallward Library" || libraryNameOrIndex == "Hallward") {
		location = "Hallward Library\n\nUniversity Park\n\nNottingham, NG7 2RD.";
	}
	else if(libraryNameOrIndex == "7" || libraryNameOrIndex == "James Cameron-Gifford Library" || libraryNameOrIndex == "James Cameron-Gifford") {
		location = "James Cameron-Gifford Library\nSutton Bonington Campus\nLoughborough\nLeicestershire, LE12 5RD.";
	}
	else if(libraryNameOrIndex == "8" || libraryNameOrIndex == "Manuscripts and Special Collections") {
		location = "Manuscripts and Special Collections\nThe University of Nottingham\nKing's Meadow Campus\nLenton Lane\nNottingham, NG7 2NR.";
	}
	else {
		location = "wrong";
	}	
	return location;
}


//
intents.matches('ShowLateCoursework', [
	function(session)
	{		 
		session.send("The University of Nottingham has a webpage containing information about late submissions for work - https://www.nottingham.ac.uk/academicservices/qualitymanual/assessmentandawards/penalties-for-late-submission-of-assessed-coursework.aspx You can download an extenuating circumstances form from here - https://www.nottingham.ac.uk/academicservices/documents/qmdocuments/extenuatingcircumstancesform092013.docx");
    }
])

intents.matches('ShowLateCourseworkPenalty', [
	function(session){
		session.send("The standard University penalty for late submission should be 5% absolute standard University scale per normal working day, until the mark reaches zero. For example, an original mark of 67% would be successively reduced to 62%, 57%, 52%, 47% etc.  Normal working days include vacation periods, but not weekends or public holidays. It is understood that, exceptionally, there may be academic grounds for different penalties to apply, with the approval of the Head of School, for example, when solutions are to be discussed on a particular date, so that work submitted after this date is essentially worthless.");
	}
])

intents.matches('ShowTermTimetable', [
	function(session)
	{
		var fs = require('fs');
 
		var contents = fs.readFileSync('term.txt', 'utf8');
	
		console.log(contents);
		
		session.send('\n\n %s', contents);
	
	}
]);
intents.matches('ShowLateCourseworkDeadline', [
	function(session){
		session.send("A student who is likely to miss a deadline should discuss the situation as early as possible with his or her personal tutor and with the member of staff responsible for the coursework. Extensions to deadlines should not be allowed lightly in fairness to those students who do manage to complete their assignments in good time; but it is inevitable that students taking particular combinations of modules will sometimes find themselves seriously disadvantaged in comparison with others on the same course because of an unfortunate conjunction of deadlines, and the staff responsible should use their best endeavours to ensure that such cases are resolved.")
		}
])

intents.matches('ShowCardQuery', [
	function(session){
		session.send("If your card has been lost, stolen, damaged, is faulty or has incorrect data on it then you may request a replacement (£15.00 fee). You need to contact the University card office on 0115-9515759 or by emailing universitycard@nottingham.ac.uk immediately. The following form will have to be delivered to the Security office, rear of the Hallward Library, University Park, Nottingham, NG7 2RD https://www.nottingham.ac.uk/estates/documents/security/university-card-replacement-form.doc")
		}
])


intents.matches('ShowCardCollect', [
	function(session){
		session.send("Once you have applied for your first card online it will be produced within 3-5 days. If you are a current student then your card will be available for collection from your school office. If you are a new student and have uploaded your photo prior to registration then your card will be available for collection at registration. If you are a member of staff then University card support will be in contact with you to arrange the collection of your card.")
		}
])

intents.matches('ShowCardFunctions', [
	function(session){
		session.send("The University card has many functions! It is a means of identification, a library card, a building access card, a bus card (on NCT services) and a Sports Centre card (subject to joining). It can also be used for online library borrowing and photocopying authorisation.")
		}
])

intents.matches('ShowMealCard', [
	function(session){
		session.send("Meal Card FAQ: https://www.nottingham.ac.uk/hospitality/documents/mealcards/mealcardfaq-sep15v12.pdf")
		}
])

intents.matches('ShowWeather', [
	function(session)
	{	
		var postcode = "ng71hb"
		var app_id = "47093cbf"
		var app_key = "146c861c4bb2dddb97cc061dbbf33d68"
		var url = "http://api.weatherunlocked.com/api/current/uk."+postcode
		url += "?app_id="+app_id+"&app_key="+app_key

		var options ={
			url: url,
			method: "GET",
			json:true,
		}
		request(options, function(error, response, body) {
		console.log(body);
		var message = "Current weather in Nottingham:\n";
		message += body.wx_desc+"\r\n"
		message += "Temperture: "+body.temp_c+" C\n"
		session.send("%s", message);			
		})
		
	}
]);

intents.matches('ShowPrintDetails', [
	function(session)
	{
		var fs = require('fs');
 
		var contents = fs.readFileSync('printDetails.txt', 'utf8');
	
		console.log(contents);
		
		session.send('\n\n %s', contents);
	
	}
]);

