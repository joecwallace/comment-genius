var commentGenius = (function($) {

	console.log('Welcome to Comment Genius');

	var myScriptTag = $('script').last(),
		baseUrl = getBaseUrl(myScriptTag),
		lastUpdateTime = new Date(0),
		textAreaConfig = {
			'focusHeight': '60px',
			'blurHeight': '20px'
		},
		templates = {
			widget: '{{> public/js/templates/widget.mustache }}',
			popover: '{{> public/js/templates/popover.mustache }}',
			comment: '{{> public/js/templates/comment.mustache }}'
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

		var head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style'),
			// The placeholder below will be replaced automatically
			// by the BuildCommentGeniusJavaScriptCommand.
			css = '(-(-_(-_-)_-)-)';

		style.type = 'text/css';

		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
	}

	function createCommentWidgets() {
		var selector = getSelector();

		$(selector).each(function() {
			var hash = $.sha256($(this).text()),
				widget = $(
					Mustache.render(templates.widget, {})
				),
				popover = null;

			$(this).data('hash', hash);

			var emptyRegex = /^\s*$/;
			if(emptyRegex.test($(this).text())) {
				return;
			}
			widget.popover({
				hideOnHTMLClick: false,
				content: Mustache.render(templates.popover, {
					action: 'http:' + urlTo(getArticleIdentifier() + '/comments'),
					hash: hash,
					siteId: myScriptTag.data('siteId'),
					blurHeight: textAreaConfig.blurHeight,
					home: baseUrl
				}),
				classes: 'comment-genius-popover'
			}).click(function(evt) {
				evt.preventDefault();

				$(this).popover('hideAll');
				$(this).popover('show');
			});

			popover = getPopoverForWidget(widget);

			popover.removeClass('popover');

			popover.find('.close-btn').click(function() {
				var popover = $(this).parents('.comment-genius-popover');

				popover.hide();

				toggleCommentForm(popover.find('.add-comment-form'), false);
			});

			popover.find('.add-comment-text').focus(function() {
				toggleCommentForm($(this).parents('.add-comment-form'), true);
			});

			popover.find('.add-comment-text, .add-comment-name, .add-comment-email').keyup(function(){
				var form = $(this).parents('.add-comment-form');
				var submit = form.find('.submit-neutral');

				(validateCommentFormInput(form)) ?
					submit.removeAttr('disabled') :
					submit.attr('disabled', 'disabled');
			});

			popover.find('.add-comment-form').submit(function(evt) {
				evt.preventDefault();
				var form = $(this);
				var commentData = $(this).serialize()
				var valid = validateCommentFormInput(this);

				if(valid) {
					form.find('input, textarea').val('');
					$.post($(this).attr('action'), commentData, function(comment) {
						lastUpdateTime = new Date(comment.created_at.date);
						insertComment(comment);

						toggleCommentForm(form, false);
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
		return Mustache.render(templates.comment, {
			name: comment.name,
			text: comment.text
		});
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

	function init() {
		injectStyles();
		createCommentWidgets();

		populateComments();
	}

	if (myScriptTag.data('trigger') !== 'manual') {
		$(document).ready(init);
	}

	return {
		init: init
	};

}(jQuery));
