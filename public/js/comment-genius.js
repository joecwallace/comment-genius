require.config({
	paths: {
		'jquery': '/components/jquery/jquery',
		'jquery-sha256': '/components/jquery.sha256/jquery.sha256',
		'jquery-popover': '/components/jQuery.popover/jquery.popover-1.1.2'
	},
	shim: {
		'jquery-sha256': {
			deps: ['jquery']
		},
		'jquery-popover': {
			deps: ['jquery']
		}
	}
});

require([ 'jquery', 'jquery-sha256', 'jquery-popover' ], function($) {

	console.log('Welcome to Comment Genius');

	var myScriptTag = $('script').last(),
		baseUrl = getBaseUrl(myScriptTag),
		textAreaConfig = {
			'focusHeight': '60px',
			'blurHeight': '20px'
		};

	function getBaseUrl() {
		var anchor = document.createElement('a');

		anchor.href = myScriptTag.attr('src');

		return anchor.host;
	}

	function urlTo(uri) {
		return '//' + baseUrl + '/' + uri;
	}

	function getSelector() {
		return myScriptTag.data('selector') || 'p';
	}

	function getArticleIdentifier() {
		return $.sha256(location.host + location.pathname);
	}

	function getElementFromHash(hash) {
		var elems = $(getSelector()), elem = null;

		for (var i = 0; i < elems.length; i++) {
			elem = $(elems[i]);

			if (elem.data('hash') == hash) {
				return elem;
			}
		}
	}

	function getPopoverForWidget(widget) {
		return widget.popover('getData').popover;
	}

	function injectStyles() {
		if (myScriptTag.data('style') === 'off') {
			return;
		}

		$.get(urlTo('css/default-theme.css'), function(response) {

			var head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');

			style.type = 'text/css';

			if (style.styleSheet) {
				style.styleSheet.cssText = response;
			} else {
				style.appendChild(document.createTextNode(response));
			}

			head.appendChild(style);

		});
	}

	function createCommentWidgets() {
		var selector = getSelector();

		$(selector).each(function() {
			var hash = $.sha256($(this).text()),
				widget = $('<span />').addClass('badge comment-genius-widget').text('0'),
				popover = null;

			$(this).data('hash', hash);

			widget.popover({
				hideOnHTMLClick: false,
				title: createPopoverTitle(),
				content: createPopoverContent(hash)
			}).click(function() {
				$(this).popover('hideAll');
				$(this).popover('show');
			});

			popover = getPopoverForWidget(widget);

			popover.find('.close-btn').click(function() {
				$(this).parents('.popover').hide();
			});

			popover.find('.add-comment-text').focus(function() {
				$(this).animate({ height: textAreaConfig.focusHeight }).parents('.popover')
					.find('.add-comment-email, .add-comment-name, .submit-neutral')
					.slideDown();
			});

			popover.find('.add-comment-form').submit(function(evt) {
				evt.preventDefault();

				$.post($(this).attr('action'), $(this).serialize(), function(comment) {
					insertComment(comment);
				}, 'json');
			});

			$(this).append(widget);
		});
	}

	function insertComment(comment) {
		var widget, popover, count,
			parent = getElementFromHash(comment.element_hash);

		if (parent) {
			widget = parent.find('.comment-genius-widget');
			popover = getPopoverForWidget(widget);

			popover.find('.no-comments').remove();
			popover.find('.content-inner').append(
				createCommentElement(comment)
			);

			count = parseInt(widget.text()) + 1;
			widget.text('' + count);
		}
	}

	function createCommentElement(comment) {
		return $('<li />').addClass('comment').text(comment.text)
			.prepend($('<strong />').text(comment.name + ': '));
	}

	function populateComments() {
		var url = urlTo(getArticleIdentifier() + '/comments');

		$.getJSON(url, function(data) {
			for (var i = 0; i < data.length; i++) {
				insertComment(data[i]);
			}
		});
	}

	function createPopoverTitle() {
		var count = $('<span />').addClass('comment-count').text('0'),
			close = $('<span />').addClass('close-btn').html('&times;'),
			title = $('<h1 />').addClass('popover-title').append(count).append(' Comments').append(close);

		return title;
	}

	function createPopoverContent(hash) {
		var content = $('<div />').append(createPopoverInner()).append(createPopoverFooter(hash));

		return content;
	}

	function createPopoverInner() {
		var emptyMessage = $('<li />').addClass('no-comments').text('Be the first to comment.');

		return $('<ul />').addClass('content-inner').append(emptyMessage);
	}

	function createPopoverFooter(hash) {
		var url = 'http:' + urlTo(getArticleIdentifier() + '/comments'),
			form = $('<form />');

		var commentTextInput = $('<textarea>').attr('name', 'text')
			.addClass('add-comment-text').attr('cols', 1)
			.css({ height: textAreaConfig.blurHeight });

		var commentNameInput = $('<input>').attr('name', 'name')
			.addClass('add-comment-name').attr('placeholder', 'Name')
			.attr('maxlength', 40).hide();

		var commentEmailInput = $('<input>').attr('name', 'email')
			.addClass('add-comment-email').attr('placeholder', 'Email')
			.attr('maxlength', 80).hide();

		var hashInput = $('<input>').attr('type', 'hidden').attr('name', 'element_hash').val(hash);

		var submitButton = $('<button>')
			.addClass('submit-neutral').text('Submit').hide();

		var copyright = $('<a />').attr('href', 'http://' + baseUrl)
			.addClass('copyright').html('&copy; Comment Genius 2013');

		form.attr({
			class: 'add-comment-form',
			action: url,
			method: 'POST'
		}).append(commentTextInput).append(commentNameInput)
		.append(commentEmailInput).append(hashInput)
		.append(submitButton).append(copyright);

		return $('<div />').addClass('footer clearfix').append(form);
	}

	$(document).ready(function() {

		var comments;

		injectStyles();
		createCommentWidgets();

		populateComments();
	});

	return {};

});
