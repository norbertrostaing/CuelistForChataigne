
var goBtn = script.addTrigger("Go","Press me to go to next cue"); 		//This will add a float number parameter (slider), default value of 0.1, with a range between 0 and 1
var nextCue = script.addIntParameter("Next Step", "loaded step", 1, 1);

var targetState = script.addTargetParameter("Target State","State to use as cuelist");
targetState.setAttribute("targetType","container");
targetState.setAttribute("root",root.states);
targetState.setAttribute("searchLevel",0);

function scriptParameterChanged(param) {
	if(param.is(goBtn)) { go(); }
}

function activeStep(number) {
	var actions = getActions(targetState.getTarget());
	var activated = false;
	for (var i = 0; i< actions.length; i++) {
		if (i == number) {
			actions[i].enabled.set(true);
			actions[i].trigger.trigger();
			activated = true;
		} else {
			actions[i].enabled.set(false);
		}
	}
	nextCue.set(activated ? number+2 : 0);
}

function go() {
	activeStep(nextCue.get()-1);
}


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

function getActions(state) {
	var actions = [];
	var items = state.processors.getItems();
	for (var i = 0; i< items.length; i++) {
		if (items[i].trigger) {
			actions.push(items[i]);
		}
	}
	return actions;
}

