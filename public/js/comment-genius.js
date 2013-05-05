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
require([
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
      var that = $(this),
			  hash = $.sha256(that.text()),
        numberOfComments = 5;

			map[hash] = that;
			that.data('hash', hash);
      that.append(
        $('<span />').addClass('badge').text(numberOfComments).popover({
          hideOnHTMLClick: false,
          title: createPopoverTitle(5),
          content: $('<div />').append(createPopoverContent()).append(createPopoverFooter()).html()
        }).click(function() {
          $(this).popover('hideAll');
          $(this).popover('show');
        })
      );
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

	function injectStyles(styleData) {
		var head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = styleData;
		} else {
			style.appendChild(document.createTextNode(styleData));
		}

		head.appendChild(style);
	}

	function createPopoverTitle(numberOfComments, approvals, disapprovals) {
            numberOfComments = (numberOfComments || 0);
            approvals = (approvals || 0);
            disapprovals = (disapprovals || 0);
		var count = $('<span>').addClass('comment-count').text(numberOfComments + ' Comments ');
		var approval = $('<span>').addClass('approvals').text(approvals + ' Approve ');
                var disapproval = $('<span>').addClass('approvals').text(disapprovals + ' Disaprove');
                var close = $('<span>').addClass('close-btn').html('&times;');
		var title = $('<h1>').addClass('popover-title').append(count)
                .append(approval).append(disapproval).append(close);

		return title;
	}

        function createPopoverContent(comments) {
            var content = $('<ul>').addClass('content-inner');
            if(comments && comments.length > 0) {
                var innerContent;
                for(var i=0; i< comments.length; i++) {
                    innerContent += '<li><strong>' + comments[i].name + '</strong>' + comments[i].text + '</li>';
                }
                content.html(innerContent);
            } else {
                content.html('<li class="no-comments">Be the first to comment.</li>');
            }
            return content;
        }

        function createPopoverFooter() {
            var addCommentName = $('<input>').addClass('add-comment-name').attr('placeholder', 'Your Name');
            var addCommentEmail = $('<input>').addClass('add-comment-email').attr('placeholder', 'Your Email Address')
            var addCommentText = $('<textarea>').addClass('add-comment-text').attr('cols', 1);
            var copyright = $('<a href="http://' + baseUrl + '">').addClass('copyright').html('&copy; Comment Genius 2013')
            var footer = $('<div>').addClass('footer clearfix').append(addCommentEmail)
            .append(addCommentName).append(addCommentText).append(copyright);
            return footer;
        }

	$(document).ready(function() {
		selector = getSelector();
		article = getArticleIdentifier();
		elementMap = getCommentableMap();
		comments = fetchComments();

		if (myScriptTag.data('style') !== 'off') {
                        $.get('//' + getBaseUrl() + '/css/default-theme.css', function(response){
                            injectStyles(response);
                        });
		}
	});

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
