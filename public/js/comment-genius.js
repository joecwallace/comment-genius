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
			content: $('<div />').append(createPopoverContent()).append(createPopoverFooter()).html()
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

	function createPopoverTitle(numberOfComments) {
            numberOfComments = (numberOfComments || 0);
		var count = $('<span>').addClass('comment-count').text(numberOfComments + ' Comments');
		var close = $('<span>').addClass('close-btn').html('&times;');
		var title = $('<h1>').addClass('popover-title').append(count).append(close);

		return title;
	}

  function createPopoverContent(comments) {
      return $('<div />').addClass('content-inner').text('empty content');
  }

  function createPopoverFooter(approval, disapproval) {
      approval = (approval || 0);
      disapproval = (disapproval || 0);
      var addCommentName = $('<input />').addClass('add-comment-name').attr('placeholder', 'Your Name');
      var addCommentEmail = $('<input />').addClass('add-comment-email').attr('placeholder', 'Your Email Address')
      var addCommentText = $('<textarea />').addClass('add-comment-text').attr('cols', 1);
      var approvals = $('<span />').addClass('approval').text(approval);
      var disapprovals = $('<span />').addClass('dissaproval').text(disapproval)
      var copyright = $('<span />').addClass('copyright').html('&copy; Comment Genius 2013')
      var footer = $('<div />').addClass('footer').append(addCommentName).append(addCommentEmail)
      .append(addCommentText).append(approvals).append(disapprovals).append(copyright);
      return footer;
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
