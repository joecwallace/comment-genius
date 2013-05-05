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

	function getBaseUrl(myScriptTag) {
		var anchor = document.createElement('a');
		anchor.href = $(myScriptTag).attr('src');

		return anchor.host;
	}

	function getSelector(myScriptTag) {
		return myScriptTag.data('selector') || 'p';
	}

	function getArticleIdentifier() {
		return $.sha256(location.host + location.pathname);
	}

	function insertComments(baseUrl, selector, commentMap) {
		$(selector).each(function() {
      var that = $(this),
			  hash = $.sha256(that.text()),
        comments, count;

			that.data('hash', hash);

      if (commentMap) {
        comments = commentMap[hash];
      }

      count = comments ? comments.length : 0;
      that.append(
        $('<span />').addClass('badge').text(count).popover({
          hideOnHTMLClick: false,
          title: createPopoverTitle(count),
          content: $('<div />').append(createPopoverContent(comments)).append(createPopoverFooter(baseUrl)).html()
        }).click(function() {
          $(this).popover('hideAll');
          $(this).popover('show');
        })
      );
    });

		$('.close-btn').click(function(){
			$(this).parents('.popover').hide();
		});
	}

	function populateComments(baseUrl, articleId, selector) {
		var url = '//' + baseUrl + '/' + articleId + '/comments',
      comments;

		$.getJSON(url, function(data) {
      var commentMap = createCommentMap(data);

      insertComments(baseUrl, selector, commentMap);
		});
	}

  function createCommentMap(comments) {
    var map = {};

    if (comments) {
      $.each(comments, function(index, comment) {
        var array = map[comment.element_hash] || [];
        
        array.push(comment);

        map[comment.element_hash] = array;
      });
    }

    return map;
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
    var disapproval = $('<span>').addClass('approvals').text(disapprovals + ' Disapprove');
    var close = $('<span>').addClass('close-btn').html('&times;');
		var title = $('<h1>').addClass('popover-title').append(count)
                /*.append(approval).append(disapproval)*/.append(close);

		return title;
	}

  function createPopoverContent(comments) {
    var content = $('<ul />').addClass('content-inner');
    
    if (comments && comments.length != 0) {
      $.each(comments, function(index, comment) {
        $('<li></li>').addClass('comment').text(comment.text).prepend($('<strong />').text(comment.name + ':')).appendTo(content);
      });
    } else {
      content.html('<li class="no-comments">Be the first to comment.</li>');
    }

    return content;
  }

  function createPopoverFooter(baseUrl) {
      var addCommentName = $('<input>').addClass('add-comment-name').attr('placeholder', 'Name');
      var addCommentEmail = $('<input>').addClass('add-comment-email').attr('placeholder', 'Email')
      var addCommentText = $('<textarea>').addClass('add-comment-text').attr('cols', 1);
      var copyright = $('<a href="http://' + baseUrl + '">').addClass('copyright').html('&copy; Comment Genius 2013')
	  var submitButton = $('<button>').addClass('submit-neutral').attr('data-score', '0').text('Submit');
      var footer = $('<div>').addClass('footer clearfix').append(addCommentEmail)
      .append(addCommentName).append(addCommentText).append(submitButton).append(copyright)
      return footer;
  }

	$(document).ready(function() {
    var myScriptTag = $('script').last(),
    baseUrl = getBaseUrl(myScriptTag),
		selector = getSelector(myScriptTag),
		articleId = getArticleIdentifier();

    populateComments(baseUrl, articleId, selector);

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
