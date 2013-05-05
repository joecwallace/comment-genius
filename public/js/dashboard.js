$(document).ready(function() {
	$('.script-popover').popover({
		html: true,
		placement: 'left',
		trigger: 'click',
		content: function() {
			var tag = '&lt;script id=&quot;comment-genius&quot; type=&quot;text/javascript&quot; data-site-id=&quot;' + $(this).data('siteId') + '&quot; src=&quot;' + $(this).data('mainUrl') + '&quot;&gt;&lt;/script&gt;';

			var content = $('<input class="input-block-level" type="text" value="' + tag + '" style="margin-bottom:0;">');

			setTimeout(function() {
				content.get(0).select();
			}, 250);

			return content;
		}
	});
});