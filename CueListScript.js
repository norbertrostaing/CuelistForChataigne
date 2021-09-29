
/* ********** GENERAL SCRIPTING **********************

		This templates shows what you can do in this is module script
		All the code outside functions will be executed each time this script is loaded, meaning at file load, when hitting the "reload" button or when saving this file
*/


// You can add custom parameters to use in your script here, they will be replaced each time this script is saved
// var myFloatParam = script.addFloatParameter("My Float Param","Description of my float param",.1,0,1); 		//This will add a float number parameter (slider), default value of 0.1, with a range between 0 and 1

function explode(v) {
	script.log(" proprietes : ");
	var content = util.getObjectProperties(v);
	for (var i = 0; i< content.length; i++) {
		script.log("  - "+content[i]);
	}

	script.log(" methodes : ");
	content = util.getObjectMethods(v);
	for (var i = 0; i< content.length; i++) {
		script.log("  - "+content[i]);
	}
}

function getContainerChildren(container) {
	var r = [];

	var content = util.getObjectProperties(container);
	for (var i = 0; i< content.length; i++) {
		script.log(i);
		if (container[content[i]]._type == "Container") {
			r.push(container[content[i]]);
		}
	}

	return r;
}

function cueName() {
	var n = cues.length+1;
	var valid = false;
	while (!valid) {
		if (cuelist.getChild("Cue"+n) == null) {
			valid = true;
		} else {
			n++;
		}
	}
	return("Cue"+n);
}

function addCue() {
	var temp = new cue();
}

function after(target, equals) {
	var next = false;

	var cues = getContainerChildren(cuelist);

	for (var i = 0; i < cues.length; i++) {
		var n = cues[i].getChild("cueNumber").get();
		if ((equals && n >= target) || n > target) {
			if (next) {
				if (next.getChild("cueNumber").get() > n) {
					next = cues[i];
				}
			} else {
				next = cues[i];
			}
		}
	}

	return next	
}

function go() {
	var cues = getContainerChildren(cuelist);
	var nLoad = loadInput.get();
	var next = after(nLoad,true);
	if (next) {
		execCue(next);
		var nextLoad = after(next.getChild("cueNumber").get(),false);
		if (nextLoad) {
			loadInput.set(nextLoad.getChild("cueNumber").get());
		} else {
			// loadInput.set(next.getChild("cueNumber").get()+1);
			loadInput.set(0);
		}
	}
}

function execCue(cue) {
	script.log(" exec "+cue.getChild("cueNumber").get());

	var preset = cue.getChild("linkedPreset").getTarget();
	if (preset) {
		var time = cue.getChild("transitionTime").get();
		if (time >= 0) {
			var saved = preset.defaultLoadTime.get();
			preset.defaultLoadTime.set(time);
			preset.load.trigger();
			preset.defaultLoadTime.set(saved);
		} else {
			preset.load.trigger();
		}
	}

	var sequence = cue.getChild("linkedSequence").getTarget();
	if (sequence) {
		sequence.play.trigger();
	}

	var state = cue.getChild("linkedState").getTarget();
	if (state) {
		state.getChild("active").set(true);
	}
}

var commands;
var goBtn;
var loadInput;
var reorderBtn;

var cuelist;

var cue = function() {
	var name = cueName();

	var cues = getContainerChildren(local.getChild("CueList"));
	var n = 0;
	script.log(cues.length);
	for (var i = 0; i< cues.length; i++) {
		script.log(cues[i].getChild("cueNumber").get());
		n = Math.max(n, cues[i].getChild("cueNumber").get());
		script.log(n);
	}
	n = Math.floor(n);
		script.log(n);

	this.container = local.getChild("CueList").addContainer(name);
	this.number = this.container.addFloatParameter("Cue Number","Number of the cue",n+1,0);

	this.targetPreset = this.container.addTargetParameter("Linked Preset", "Preset called by this cue");
	this.targetPreset.setAttribute("targetType","container");
	this.targetPreset.setAttribute("root",root.customVariables); 
	this.targetPreset.setAttribute("searchLevel",2);

	this.transitionTime = this.container.addFloatParameter("Transition Time", "Load time for preset in seconds (negative value means use default time)", -1, -1);

	this.targetSequence = this.container.addTargetParameter("Linked Sequence", "Sequence called by this cue");
	this.targetSequence.setAttribute("root",root.sequences);
	this.targetSequence.setAttribute("targetType","container");
	this.targetSequence.setAttribute("searchLevel",0);

	this.targetState = this.container.addTargetParameter("Linked State", "State activated by this cue");
	this.targetState.setAttribute("targetType","container");
	this.targetState.setAttribute("root",root.states);
	this.targetState.setAttribute("searchLevel",0);

	this.deleteTrigger = this.container.addTrigger("Delete", "Delete this cue");

	this.delete = function () {
		cues.splice(cues.indexOf(this), 1);
	};
};



//Here are all the type of parameters you can create
/*
var myTrigger = script.addTrigger("My Trigger", "Trigger description"); 									//This will add a trigger (button)
var myBoolParam = script.addBoolParameter("My Bool Param","Description of my bool param",false); 			//This will add a boolean parameter (toggle), defaut unchecked
var myFloatParam = script.addFloatParameter("My Float Param","Description of my float param",.1,0,1); 		//This will add a float number parameter (slider), default value of 0.1, with a range between 0 and 1
var myIntParam = script.addIntParameter("My Int Param","Description of my int param",2,0,10); 				//This will add an integer number parameter (stepper), default value of 2, with a range between 0 and 10
var myStringParam = script.addStringParameter("My String Param","Description of my string param", "cool");	//This will add a string parameter (text field), default value is "cool"
var myColorParam = script.addColorParameter("My Color Param","Description of my color param",0xff0000ff); 	//This will add a color parameter (color picker), default value of opaque blue (ARGB)
var myP2DParam = script.addPoint2DParameter("My P2D Param","Description of my p2d param"); 					//This will add a point 2d parameter
var myP3DParam = script.addPoint3DParameter("My P3D Param","Description of my p3d param"); 					//This will add a point 3d parameter
var myEnumParam = script.addEnumParameter("My Enum Param","Description of my enum param",					//This will add a enum parameter (dropdown with options)
											"Option 1", 1,													//Each pair of values after the first 2 arguments define an option and its linked data
											"Option 2", 5,												    //First argument of an option is the label (string)
											"Option 3", "banana"											//Second argument is the value, it can be whatever you want
											); 	
*/


//you can also declare custom internal variable
//var myValue = 5;

/*
 The init() function will allow you to init everything you want after the script has been checked and loaded
 WARNING it also means that if you change values of your parameters by hand and set their values inside the init() function, they will be reset to this value each time the script is reloaded !
*/
function init() {
	commands = local.addContainer("Commands");
	goBtn = commands.addTrigger("GO", "go to next cue");
	loadInput = commands.addFloatParameter("NextCue", "Target Cue for next Go", 1, 0);
	reorderBtn = commands.addTrigger("Reorder", "Update list order");
	cuelist = local.addContainer("CueList");
}

/*
 This function will be called each time a parameter of your script has changed
*/
function scriptParameterChanged(param)
{
	//You can use the script.log() function to show an information inside the logger panel. To be able to actuallt see it in the logger panel, you will have to turn on "Log" on this script.
	script.log("Parameter changed : "+param.name); //All parameters have "name" property
	if(param.is(myTrigger)) script.log("Trigger !"); //You can check if two variables are the reference to the same parameter or object with the method .is()
	else if(param.is(myEnumParam)) script.log("Key = "+param.getKey()+", data = "+param.get()); //The enum parameter has a special function getKey() to get the key associated to the option. .get() will give you the data associated
	else script.log("Value is "+param.get()); //All parameters have a get() method that will return their value
}

/*
 This function, if you declare it, will launch a timer at 50hz, calling this method on each tick
*/
/*
function update(deltaTime)
{
	script.log("Update : "+util.getTime()+", delta = "+deltaTime); //deltaTime is the time between now and last update() call, util.getTime() will give you a timestamp relative to either the launch time of the software, or the start of the computer.
}
*/



/* ********** MODULE SPECIFIC SCRIPTING **********************

	The "local" variable refers to the object containing the scripts. In this case, the local variable refers to the module.
	It means that you can access any control inside  this module by accessing it through its address.
	For instance, if the module has a float value named "Density", you can access it via local.values.density
	Then you can retrieve its value using local.values.density.get() and change its value using local.values.density.set()
*/

/*
 This function will be called each time a parameter of this module has changed, meaning a parameter or trigger inside the "Parameters" panel of this module
 This function only exists because the script is in a module
*/
function moduleParameterChanged(param)
{
	if(param.isParameter())
	{
		script.log("Module parameter changed : "+param.name+" > "+param.get());
	}else 
	{
		script.log("Module parameter triggered : "+param.name);	
	}
}

/*
 This function will be called each time a value of this module has changed, meaning a parameter or trigger inside the "Values" panel of this module
 This function only exists because the script is in a module
*/
function moduleValueChanged(value)
{
	if(value.isParameter())
	{
		script.log("Module value changed : "+value.name+" > "+value.get());	
	}else 
	{
		script.log("Module value triggered : "+value.name);	
	}
}
