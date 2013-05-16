var commentGenius = (function($) {

	console.log('Welcome to Comment Genius');

	var myScriptTag = $('script').last(),
		baseUrl = getBaseUrl(myScriptTag),
		commentMap = {},
		lastUpdateTime = new Date(0),
		templates = {
			// Placeholders
			widget: '{{> public/js/templates/widget.mustache }}',
			popover: '{{> public/js/templates/popover.mustache }}'
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
		return md5(location.host + location.pathname);
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

	function toggleCommentForm(form, show) {
		var inputs = form.find('.add-comment-name, .add-comment-email, .submit-btn');

		form.toggleClass('active', show);
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
			var elem = $(this),
				hash = md5($(this).text()),
				widget = $(
					Mustache.render(templates.widget, {})
				),
				popover = null;

			$(this).addClass('comment-genius-popover-element').data('hash', hash);

			if(/^\s*$/.test(elem.text())) {
				return;
			}

			widget.click(function(evt) {
				evt.preventDefault();
				$(this).popover('show');
			}).popover({
				content: function() {
					return Mustache.render(templates.popover, {
						action: 'http:' + urlTo(getArticleIdentifier() + '/comments'),
						hash: hash,
						siteId: myScriptTag.data('siteId'),
						home: baseUrl,
						comments: commentMap[hash]
					});
				},
				placement: function() {
					var parentWidth = $(document).width(),
						widgetPosition = widget.position().left,
						positionPercentage = 100 * widgetPosition / parentWidth,
						placement = 'bottom';

					if (positionPercentage <= 25) {
						placement = 'right';
					}
					else if (positionPercentage >= 75) {
						placement = 'left';
					}

					return placement;
				}
			});

			elem.append(widget);
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
			count = parseInt(widget.text()) + 1;
			widget.text('' + count);

			comment.email_hash = md5(comment.email);

			if (commentMap[comment.element_hash]) {
				commentMap[comment.element_hash].push(comment);
			}
			else {
				commentMap[comment.element_hash] = [comment];
			}

			if (parent.find('.popover').is(':visible')) {
				widget.popover('show');
			}
		}
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

	function setPopoverEvents() {
		$(document).on('click', '.close-btn', function(evt) {
			$(this).closest('.popover').prev().popover('hide');
			evt.preventDefault();
		});

		$(document).on('focus', '.add-comment-text', function() {
			toggleCommentForm($(this).closest('.add-comment-form'), true);
		});

		$(document).on('keyup', '.add-comment-text, .add-comment-name, .add-comment-email', function() {
			var form = $(this).parents('.add-comment-form');
			var submit = form.find('.submit-btn');

			(validateCommentFormInput(form)) ?
				submit.removeAttr('disabled') :
				submit.attr('disabled', 'disabled');
		});

		$(document).on('submit', '.add-comment-form', function(evt) {
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

			evt.preventDefault();
		});
	}

	function init() {
		setPopoverEvents();

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
