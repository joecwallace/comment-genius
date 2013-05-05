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
		lastUpdateTime = new Date(0),
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

	function padNumString(value) {
		return value < 10 ? '0' + value : '' + value;
	}

	function formatDate(date) {
		var year = date.getFullYear(),
			month = padNumString(date.getMonth() + 1),
			day = padNumString(date.getDate()),
			hours = padNumString(date.getHours()),
			minutes = padNumString(date.getMinutes()),
			seconds = padNumString(date.getSeconds());

		return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
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

	function toggleCommentForm(form, show) {
		form.find('.add-comment-text').animate({
			height: show ? textAreaConfig.focusHeight : textAreaConfig.blurHeight
		});

		var inputs = form.find('.add-comment-name, .add-comment-email, .submit-neutral');

		if (show) inputs.slideDown();
		else inputs.slideUp();
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
				var popover = $(this).parents('.popover');

				popover.hide();

				toggleCommentForm(popover.find('.add-comment-form'), false);
			});

			popover.find('.add-comment-text').focus(function() {
				toggleCommentForm($(this).parents('.add-comment-form'), true);
			});

			popover.find('.add-comment-text, .add-comment-name, .add-comment-email').change(function(){
				var form = $(this).parents('form:first');
				var submit = form.find('button');
				(validateCommentFormInput(form)) ? submit.removeAttr('disabled') : submit.attr('disabled', 'disabled');
			});

			popover.find('.add-comment-form').submit(function(evt) {
				evt.preventDefault();
				var commentData = $(this).serialize()
				var valid = validateCommentFormInput(this);
				if(valid) {
					$.post($(this).attr('action'), commentData, function(comment) {
						lastUpdateTime = new Date(comment.created_at.date);
						insertComment(comment);

						toggleCommentForm($(this), false);
					}, 'json');
				}
			});

			$(this).append(widget);
		});
	}

	function validateCommentFormInput(form) {
		var $form = $(form);
		var emailRegex = /\S+@\S+\.\S+/;
		var nameField = $form.find('.add-comment-name'),
			emailField = $form.find('.add-comment-email'),
			textField = $form.find('.add-comment-text');
		var validEmail = (emailRegex.test(emailField.val()));
		var validName = (nameField.val().length > 1);
		var validText = (textField.val().length > 2);
		(!validName) ? nameField.addClass('error') : nameField.removeClass('error');
		(!validEmail) ? emailField.addClass('error') : emailField.removeClass('error');
		(!validText) ? textField.addClass('error') : textField.removeClass('error');
		return (validName && validEmail && validText);
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
			if(count == 1) {
				popover.find('.comment-count').text(count+' Comment');
			} else {
				popover.find('.comment-count').text(count+' Comments');
			}
			widget.text('' + count);
		}
	}

	function createCommentElement(comment) {
		return $('<li />').addClass('comment').text(comment.text)
			.prepend($('<strong />').text(comment.name + ': '));
	}

	function populateComments(since) {
		var url = urlTo(getArticleIdentifier() + '/comments'),
			data = {};

		if (since !== undefined) {
			data.since = formatDate(since);
		}

		$.getJSON(url, data, function(data) {
			for (var i = 0; i < data.length; i++) {
				var created = new Date(data[i].created_at);

				insertComment(data[i]);

				if (created > lastUpdateTime) {
					lastUpdateTime = created;
				}
			}

			setTimeout(function() {
				populateComments(lastUpdateTime);
			}, 10000);
		});
	}

	function createPopoverTitle() {
		var count = $('<span />').addClass('comment-count').text('0 Comments'),
			close = $('<span />').addClass('close-btn').html('&times;'),
			title = $('<h1 />').addClass('popover-title').append(count).append(close);

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
			.addClass('submit-neutral').attr('disabled', 'disabled').text('Submit').hide();

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
