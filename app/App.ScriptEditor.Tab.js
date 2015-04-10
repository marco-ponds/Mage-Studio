Class("ScriptTab", {

	ScriptTab : function(id, name, type) {

		this.text = [];
		this.name = name;
		this.type = type;
		this.errors = [];
		this.tooltips = [];
		this.compiled = "";
		this.keyListener = new keypress.Listener();
		console.log(id);
		//creating code mirror object
		this.codeMirror = CodeMirror(document.getElementById(id), {
			lineNumbers: true,
			mode: type,
			styleActiveLine: true,
			matchBrackets: true,
			theme: "monokai"
		});

		this.setCodeListeners();

	},

	focus : function() {
		this.codeMirror.focus();
	},

	download : function() {
		var filename = $("#tab_" + app.scriptEditor.currentTab + " span").text();
		var text = app.scriptEditor.editors[app.scriptEditor.currentTab].text.join("\n");
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);
		pom.click();
	},

	compile : function() {
		this.saveText();
		$('#coffee_compiler i').removeClass().addClass("fa fa-circle-o-notch fa-spin");
		try {
			var compiled = CoffeeScript.compile(this.text.join("\n")).split("\n");
			this.compiled = compiled.slice(1, compiled.length-2).join("\n");
			app.scriptEditor._eval();
			$('#coffee_compiler i').css("color", "green");
			$('#coffee_compiler i').removeClass().addClass("fa fa-check");
		} catch (e) {
			$('#coffee_compiler i').css("color", "red");
			$('#coffee_compiler i').removeClass().addClass("fa fa-remove");
		}
		setTimeout(function() {
			$('#coffee_compiler i').removeClass().addClass("fa");
			$('#coffee_compiler i').css("color", "white");
		}, 2000);
	},

	saveText : function() {
		var lines = this.codeMirror.display.view;
		this.text = [];
		for (var i in lines) {
			this.text.push(lines[i].line.text);
		}
	},

	_textToString : function() {
		return this.text.join(" ");
	},

	saveError : function(error) {
		this.errors.push(error);
	},

	removeAllErrors : function() {
		for (var i in this.errors) {
			$($('.errorLine')[this.errors[i].index]).html("");
			this.codeMirror.removeLineClass(this.errors[i].line, "background", "errorLine");
		}
		this.errors = [];
	},

	saveTooltip : function(tooltip) {
		this.tooltips.push(tooltip);
	},

	removeAllJBoxes : function() {
		for (var i in this.tooltips) {
			this.tooltips[i].destroy();
		}
		this.tooltips = [];
	},

	setCodeListeners : function() {
		this.codeMirror.on("change", function(istance, changes) {
			try {
				app.scriptEditor._eval();
				app.scriptEditor.editors[app.scriptEditor.currentTab].toggleError(false);
			} catch (e) {
				app.scriptEditor.editors[app.scriptEditor.currentTab].toggleError(true);
				//app.scriptEditor.editors[app.scriptEditor.currentTab].old_log(e);
				//console.log(e.message);
			}
		});

		this.keyListener.simple_combo("ctrl s", function() {
			app.scriptEditor.editors[app.scriptEditor.currentTab].download();
		});

		this.keyListener.simple_combo("command s", function() {
			app.scriptEditor.editors[app.scriptEditor.currentTab].download();
		});
	},

	toggleError : function(flag) {
		if (flag) {
			$("#errorAlert").css("display", "block");
		} else {
			$("#errorAlert").css("display", "none");
		}
	}
});