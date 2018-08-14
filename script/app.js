const appMod = (function() {
	const ids = {
		preview: "#preview",
		editor: "#editor"
	};

	const myMarked = require("marked");
	let newRenderer = new myMarked.Renderer();
	newRenderer.link = function(href, title, text) {
		return `<a title=${title} href="${href}" target="_blank">${text}</a>`;
	};

	const myMarkedSettings = {
		gfm: true,
		breaks: true,
		renderer: newRenderer
	};

	const autosize = require("autosize");

	return {
		convertText: function() {
			$(ids.preview).html(myMarked($(ids.editor).val(), myMarkedSettings));
		},
		attachEventHandlers: function() {
			$(ids.editor).on("input", this.convertText);
			$(ids.preview).on("click", () => {
				$(ids.preview).toggleClass("down");
			});
		},
		enableAutosize: function() {
			autosize($(ids.editor));
		}
	};
})();

$(document).ready(() => {
	appMod.enableAutosize();
	appMod.convertText();
	appMod.attachEventHandlers();
});
