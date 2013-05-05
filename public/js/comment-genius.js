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
					content: $('<div />').append(createPopoverContent(comments)).append(createPopoverFooter(baseUrl, that.data('hash'))).html()
				}).click(function() {
					$(this).popover('hideAll');
					$(this).popover('show');
				})
			);
		});

		$('.close-btn').click(function() {
			var popover = $(this).parents('.popover');

			popover.hide();
			popover.find('.add-comment-email, .add-comment-name, .submit-neutral').hide();
			popover.find('.add-comment-text').css({ height: '20px' });
		});
	}

	function populateComments(baseUrl, articleId, selector) {
		var url = '//' + baseUrl + '/' + articleId + '/comments';

		$.getJSON(url, function(data) {
			var commentMap = createCommentMap(data);

			insertComments(baseUrl, selector, commentMap);
			$('.submit-neutral').click(function() {
				var hash = $(this).attr('data-hash');
				var name = $(this).parents('.popover').find('.add-comment-name').val();
				var email = $(this).parents('.popover').find('.add-comment-email').val();
				var text = $(this).parents('.popover').find('.add-comment-text').val();
				submitNewComment(baseUrl, hash, name, email, text);
			});

			$('.add-comment-text').focus(function() {
				$(this).animate({ height: '60px' }).parents('.popover')
					.find('.add-comment-email, .add-comment-name, .submit-neutral')
					.slideDown();
			});
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
				addCommentToSection(comment, content);
			});
		} else {
			content.html('<li class="no-comments">Be the first to comment.</li>');
		}

		return content;
	}

	function createPopoverFooter(baseUrl, parentHash) {
		var addCommentName = $('<input>').addClass('add-comment-name')
			.attr('placeholder', 'Name').attr('maxlength', 20).hide();
		var addCommentEmail = $('<input>').addClass('add-comment-email')
			.attr('placeholder', 'Email').attr('maxlength', 80).hide();
		var addCommentText = $('<textarea>').addClass('add-comment-text').attr('cols', 1).css({ height: '20px' });
		var copyright = $('<a href="http://' + baseUrl + '">').addClass('copyright').html('&copy; Comment Genius 2013');
		var submitButton = $('<button>').addClass('submit-neutral').attr('data-hash', parentHash).attr('data-score', '0').text('Submit').hide();
		var footer = $('<div>').addClass('footer clearfix').append(addCommentText)
			.append(addCommentEmail).append(addCommentName).append(submitButton).append(copyright)
		return footer;
	}

	function submitNewComment(baseUrl, hash, name, email, text) {
		var article = getArticleIdentifier();
		var url = '//' + baseUrl + '/' + article + '/comments';

		if (hash && email && name && text) {
			$.post(url, {
				element_hash: hash,
				email: email,
				name: name,
				text: text
			}, function(data) {
				addCommentToSection(data);
			}, 'json');
		} else {
			//TODO: Ask the user to fill out the required fields
		}
	}

	function addCommentToSection(comment, section) {
		var commentList;

		if(section) {
			if($(section).parent().find('.content-inner').size()>0) {
				commentList = $(section).parent().find('.content-inner');
			} else {
				commentList = $(section);
			}
		} else {
			$('.submit-neutral').each(function() {
				if($(this).attr('data-hash') == comment.element_hash) {
					commentList = $(this).parents('.popover').find('.content-inner');
					return;
				}
			});

			commentList.animate({scrollTop: commentList[0].scrollHeight}, 500);
		}

		$('<li></li>').addClass('comment').text(comment.text).prepend($('<strong />')
			.text(comment.name + ': ')).appendTo(commentList);

		return commentList;
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

	return {};
	
});
