$(document).ready(function() {
	$('.script-popover').popover({
		html: true,
		placement: 'left',
		trigger: 'click',
		content: function() {
			var tag = '&lt;script type=&quot;text/javascript&quot; data-main=&quot;' + 
				$(this).data('requireUrl') +
				'&quot; src=&quot;' +
				$(this).data('mainUrl') +
				'&quot;></script>';

			var content = $('<input class="input-block-level" type="text" value="' + tag + '" style="margin-bottom:0;">');

			setTimeout(function() {
				content.get(0).select();
			}, 250);

			return content;
		}
	});
});