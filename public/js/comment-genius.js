define('comment-genius', [
  'jquery',
  'jquery-sha256',
  'jquery-popover'
],
function($) {
	console.log('Welcome to Comment Genius');

	var myScriptTag = $('script').last(),
		baseUrl = getBaseUrl(),
		selector, article, elementMap, comments;

	function getBaseUrl() {
		var anchor = document.createElement('a');
		anchor.href = $(myScriptTag).attr('src');

		return anchor.host;
	}

	function getSelector() {
		return myScriptTag.data('selector') || 'p';
	}

	function getArticleIdentifier() {
		return $.sha256(location.host + location.pathname);
	}

	function getCommentableMap() {
		var map = {};

		$(selector).each(function() {
			var hash = $.sha256($(this).text());

			map[hash] = $(this);
			$(this).data('hash', hash);
		}).popover({
			hideOnHTMLClick: false,
			title: createPopoverTitle(),
			content: 'empty',
		}).click(function() {
			$(this).popover('hideAll');
			$(this).popover('show');
		});

		return map;
	}

	function fetchComments() {
		var url = '//' + baseUrl + '/' + article + '/comments';

		$.getJSON(url, function(data) {
			comments = data;
			insertComments();
		});
	}

	function insertComments() {
		$.each(comments, function(idx, val) {
			var elem = elementMap[val.element_hash];

			if (elem) {
				appendCommentWidget(elem, val);
			}
		});
	}

	function appendCommentWidget(elem, val) {
		elem.append('<span class="comment-genius-widget">Comment: ' + val.text + '</span>');
	}

	function injectStyles() {
		var head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');

		style.type = 'text/css';

		if (style.styleSheet) {
			style.styleSheet.cssText = stylesString;
		} else {
			style.appendChild(document.createTextNode(stylesString));
		}

		head.appendChild(style);
	}

	function createPopoverTitle() {
		var count = $('<span>').addClass('comment-count').text('0');
		var close = $('<span>').addClass('close-btn').html('&times;');
		var title = $('<h1>').addClass('popover-title').append(count).append(close);

		return title;
	}

	$(document).ready(function() {
		selector = getSelector();
		article = getArticleIdentifier();
		elementMap = getCommentableMap();
		comments = fetchComments();

		if (myScriptTag.data('style') !== 'off') {
			injectStyles();
		}
	});

	var stylesString = "\
		.comment-genius-widget {\
			color: #00f;\
		}\
	";

	return {
    addComment: function(paragraphNumber, email, text) {
      var url = '//' + baseUrl + '/' + article + '/comments',
        paragraph = $('p:nth-child(' + paragraphNumber + ')'),
        hash = paragraph.data('hash');

      if (hash) {
        $.post(url, {
          element_hash: paragraph.data('hash'),
          email: email,
          text: text
        }, function(data) {
          appendCommentWidget(paragraph, data);
        }, 'json');
      }
    }
	};
});
