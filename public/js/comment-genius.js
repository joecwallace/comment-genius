;(function($) {
	if ($ === undefined) {
		console.log('Y U NO JQUERY!');
		return;
	}

	console.log('Welcome to Comment Genius');

	$.addComment = function(paragraph, email, text) {
		var url = '//' + baseUrl + '/' + article + '/comments',
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
	};

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

	/******************************************************/
	/***** DO NOT EDIT BELOW THIS POINT               *****/
	/***** https://github.com/alexweber/jquery.sha256 *****/
	/******************************************************/

	var chrsz = 8; // bits per input character. 8 - ASCII; 16 - Unicode

	var safe_add = function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	};

	var S = function(X, n) {
		return ( X >>> n ) | (X << (32 - n));
	};

	var R = function(X, n) {
		return ( X >>> n );
	};

	var Ch = function(x, y, z) {
		return ((x & y) ^ ((~x) & z));
	};

	var Maj = function(x, y, z) {
		return ((x & y) ^ (x & z) ^ (y & z));
	};

	var Sigma0256 = function(x) {
		return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	};

	var Sigma1256 = function(x) {
		return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	};

	var Gamma0256 = function(x) {
		return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	};

	var Gamma1256 = function (x) {
		return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	};

	var core_sha256 = function(m, l) {
		var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
		/* append padding */
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
			for ( var j = 0; j<64; j++) {
				if (j < 16) {
					W[j] = m[j + i];
				}else{
					W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
				}
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
				h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
			}
			HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	};

	var str2binb = function(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz){
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	};
	var hex2binb = function (a) {
		var b = [], length = a.length, i, num;
		for ( i = 0; i < length; i += 2) {
			num = parseInt(a.substr(i, 2), 16);
			if (!isNaN(num)) {
				b[i >> 3] |= num << (24 - (4 * (i % 8)))
			} else {
				return "INVALID HEX STRING"
			}
	}
		return b
	};
	var binb2hex = function(binarray) {
		//var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
		//var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var hex_tab = "0123456789abcdef";
		var str = "";
		for (var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	};
	var binb2b64 = function (a) {
		var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + "0123456789+/", str = "", length = a.length * 4, i, j, triplet;
		var b64pad = "=";
		for ( i = 0; i < length; i += 3) {
			triplet = (((a[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((a[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((a[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
			for ( j = 0; j < 4; j += 1) {
				if (i * 8 + j * 6 <= a.length * 32) {
					str += b.charAt((triplet >> 6 * (3 - j)) & 0x3F)
				} else {
					str += b64pad
				}
			}
	}
		return str
	};
	var core_hmac_sha256 = function(key, data) {
		var bkey = str2binb(key);
		if(bkey.length > 16) {
			bkey = core_sha256(bkey, key.length * chrsz);
		}
		var ipad = Array(16), opad = Array(16);
		for(var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var hash = core_sha256(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
		return core_sha256(opad.concat(hash), 512 + 256);
	};

	var prep = function(string){
		string = typeof string == 'object' ? $(string).val() : string.toString();
		return string;
	};

	// standard sha256 implementation: var x = $.sha256(value);
	// standard sha266hmac implementation: varx = $.sha256hmac(value1, value2);
	$.extend({
		sha256 : function(string){
			string = prep(string);
			return binb2hex(core_sha256(str2binb(string),string.length * chrsz));
		},
		sha256b64 : function (string) {
			string = prep(string);
			return binb2b64(core_sha256(str2binb(string), string.length * chrsz));
		},
		/*
		 *
		 */
		sha256hmachex : function (key, data) {
			key = prep(key);
			data = prep(data);
			return binb2hex(core_hmac_sha256(key, data));
		},
		/*
		 *
		 */
		sha256hmacb64 : function (key, data) {
			key = prep(key);
			data = prep(data);
			return binb2b64(core_hmac_sha256(key, data));
		},
		sha256config : function(bits){
			chrsz = parseInt(bits) || 8;
		}
	});
	// alternative sha256b64 implementation: var x = value.sha256b64();
	$.fn.sha256b64 = function (bits) {
		// change bits
		$.sha256config(bits);
		var val = $.sha256b64($(this).val());
		// reset bits, this was a one-time operation
		$.sha256config(8);
		return val;
	};
	// alternative sha256b64 implementation: var x = value.sha256b64();
	$.fn.sha256hex = function (bits) {
		// change bits
		$.sha256config(bits);
		var val = $.sha256hex($(this).val());
		// reset bits, this was a one-time operation
		$.sha256config(8);
		return val;
	};

	/******************************************************/
	/***** DO NOT EDIT BELOW THIS POINT               *****/
	/***** https://github.com/alexweber/jquery.sha256 *****/
	/******************************************************/

	//define some default plugin options
	var defaults = {
		verticalOffset: 10, //offset the popover by y px vertically (movement depends on position of popover. If position == 'bottom', positive numbers are down)
		horizontalOffset: 10, //offset the popover by x px horizontally (movement depends on position of popover. If position == 'right', positive numbers are right)
		title: false, //heading, false for none
		content: false, //content of the popover
		url: false, //set to an url to load content via ajax
		classes: '', //classes to give the popover, i.e. normal, wider or large
		position: 'auto', //where should the popover be placed? Auto, top, right, bottom, left or absolute (i.e. { top: 4 }, { left: 4 })
		fadeSpeed: 160, //how fast to fade out popovers when destroying or hiding
		trigger: 'click', //how to trigger the popover: click, hover or manual
		preventDefault: true, //preventDefault actions on the element on which the popover is called
		stopChildrenPropagation: true, //prevent propagation on popover children
		hideOnHTMLClick: true, //hides the popover when clicked outside of it
		animateChange: true, //animate a popover reposition
		autoReposition: true, //automatically reposition popover on popover change and window resize
		anchor: false //anchor the popover to a different element
	}
	var popovers = [];
	var _ = {
		calc_position: function(popover, position) {
			var data = popover.popover("getData");
			var options = data.options;
			var $anchor = options.anchor ? $(options.anchor) : popover;
			var el = data.popover;
			
			var coordinates = $anchor.offset();
			var y1, x1;
			
			if (position == 'top') {
				y1 = coordinates.top - el.outerHeight();
				x1 = coordinates.left - el.outerWidth() / 2 + $anchor.outerWidth() / 2;
			} else if (position == 'right') {
				y1 = coordinates.top + $anchor.outerHeight() / 2 - el.outerHeight() / 2;
				x1 = coordinates.left	+ $anchor.outerWidth();
			} else if (position == 'left') {
				y1 = coordinates.top + $anchor.outerHeight() / 2 - el.outerHeight() / 2;
				x1 = coordinates.left	- el.outerWidth();
			} else {
				//bottom
				y1 = coordinates.top + $anchor.outerHeight();
				x1 = coordinates.left - el.outerWidth() / 2 + $anchor.outerWidth() / 2;
			}
			
			x2 = x1 + el.outerWidth();
			y2 = y1 + el.outerHeight();
			ret = {
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2
			};
			
			return ret;
		},
		pop_position_class: function(popover, position) {
			var remove = "popover-top popover-right popover-left";
			var arrow = "top-arrow"
			var arrow_remove = "right-arrow bottom-arrow left-arrow";
			
			if (position == 'top') {
				remove = "popover-right popover-bottom popover-left";
				arrow = 'bottom-arrow';
				arrow_remove = "top-arrow right-arrow left-arrow";
			} else if (position == 'right') {
				remove = "popover-yop popover-bottom popover-left";
				arrow = 'left-arrow';
				arrow_remove = "top-arrow right-arrow bottom-arrow";
			} else if (position == 'left') {
				remove = "popover-top popover-right popover-bottom";
				arrow = 'right-arrow';
				arrow_remove = "top-arrow bottom-arrow left-arrow";
			}
			
			popover
				.removeClass(remove)
				.addClass('popover-' + position)
				.find('.arrow')
					.removeClass(arrow_remove)
					.addClass(arrow);
		}
	};
	var methods = {
		/**
		 * Initialization method
		 * Merges parameters with defaults, makes the popover and saves data
		 * 
		 * @param object
		 * @return jQuery
		 */
		init : function(params) {
			return this.each(function() {
				var options = $.extend({}, defaults, params);
				
				var $this = $(this);
				var data = $this.popover('getData');
				
				if ( ! data) {
					var popover = $('<div class="popover" />')
						.addClass(options.classes)
						.append('<div class="arrow" />')
						.append('<div class="wrap"></div>')
						.appendTo('body')
						.hide();
					
					if (options.stopChildrenPropagation) {
						popover.children().bind('click.popover', function(event) {
							event.stopPropagation();
						});
					}
					
					if (options.anchor) {
						if ( ! options.anchor instanceof jQuery) {
							options.anchor = $(options.anchor);
						}
					}
					
					var data = {
						target: $this,
						popover: popover,
						options: options
					};
					
					if (options.title) {
						$('<div class="title" />')
							.html(options.title instanceof jQuery ? options.title.html() : options.title)
							.appendTo(popover.find('.wrap'));
					}
					if (options.content) {
						$('<div class="content" />')
							.html(options.content instanceof jQuery ? options.content.html() : options.content)
							.appendTo(popover.find('.wrap'));
					}

					$this.data('popover', data);
					popovers.push($this);
					
					if (options.url) {
						$this.popover('ajax', options.url);
					}
					
					$this.popover('reposition');
					$this.popover('setTrigger', options.trigger);
					
					if (options.hideOnHTMLClick) {
						var hideEvent = "click.popover";
						if ("ontouchstart" in document.documentElement)
							hideEvent = 'touchstart.popover';
						$('html').unbind(hideEvent).bind(hideEvent, function(event) {
							$('html').popover('fadeOutAll');
						});
					}
					
					if (options.autoReposition) {
						var repos_function = function(event) {
							$this.popover('reposition');
						};
						$(window)
							.unbind('resize.popover').bind('resize.popover', repos_function)
							.unbind('scroll.popover').bind('scroll.popover', repos_function);
					}
				}
			});
		},
		/**
		 * Reposition the popover
		 * 
		 * @return jQuery
		 */
		reposition: function() {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					var options = data.options;
					var $anchor = options.anchor ? $(options.anchor) : $this;
					var coordinates = $anchor.offset();
					
					var position = options.position;
					if ( ! (position == 'top' || position == 'right' || position == 'left' || position == 'auto')) {
						position = 'bottom';
					}
					var calc;
					
					if (position == 'auto') {
						var positions = ["bottom", "left", "top", "right"];
						var scrollTop = $(window).scrollTop();
						var scrollLeft = $(window).scrollLeft();
						var windowHeight = $(window).outerHeight();
						var windowWidth = $(window).outerWidth();
						
						$.each (positions, function(i, pos) {
							calc = _.calc_position($this, pos);
							
							var x1 = calc.x1 - scrollLeft;
							var x2 = calc.x2 - scrollLeft + options.horizontalOffset;
							var y1 = calc.y1 - scrollTop;
							var y2 = calc.y2 - scrollTop + options.verticalOffset;
							
							if (x1 < 0 || x2 < 0 || y1 < 0 || y2 < 0)
								//popover is left off of the screen or above it
								return true; //continue
							
							if (y2 > windowHeight)
								//popover is under the window viewport
								return true; //continue
							
							if (x2 > windowWidth)
								//popover is right off of the screen
								return true; //continue
							
							position = pos;
							return false;
						});
						
						if (position == 'auto') {
							//position is still auto
							return;
						}
					}
					
					calc = _.calc_position($this, position);
					var top = calc.top;
					var left = calc.left;
					_.pop_position_class(popover, position);
					
					var marginTop = 0;
					var marginLeft = 0;
					if (position == 'bottom') {
						marginTop = options.verticalOffset;
					}
					if (position == 'top') {
						marginTop = -options.verticalOffset;
					}
					if (position == 'right') {
						marginLeft = options.horizontalOffset;
					}
					if (position == 'left') {
						marginLeft = -options.horizontalOffset;
					}
					
					var css = {
						left: calc.x1,
						top: calc.y1,
						marginTop: marginTop,
						marginLeft: marginLeft
					};
					
					if (data.initd && options.animateChange) {
						popover.css(css);
					} else {
						data.initd = true;
						popover.css(css);
					}
					$this.data('popover', data);
				}
			});
		},
		/**
		 * Remove a popover from the DOM and clean up data associated with it.
		 * 
		 * @return jQuery
		 */
		destroy: function() {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				$this.unbind('.popover');
				$(window).unbind('.popover');
				data.popover.remove();
				$this.removeData('popover');
			});
		},
		/**
		 * Show the popover
		 * 
		 * @return jQuery
		 */
		show: function() {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					$this.popover('reposition');
					popover.clearQueue().css({ zIndex: 950 }).show();
				}
			});
		},
		/**
		 * Hide the popover
		 * 
		 * @return jQuery
		 */
		hide: function() {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					data.popover.hide().css({ zIndex: 949 });
				}
			});
		},
		/**
		 * Fade out the popover
		 * 
		 * @return jQuery
		 */
		fadeOut: function(ms) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					var options = data.options;
					popover.delay(100).css({ zIndex: 949 }).fadeOut(ms ? ms : options.fadeSpeed);
				}
			});
		},
		/**
		 * Hide all popovers
		 * 
		 * @return jQuery
		 */
		hideAll: function() {
			return $.each (popovers, function(i, pop) {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					popover.hide();
				}
			});
		},
		/**
		 * Fade out all popovers
		 * 
		 * @param int
		 * @return jQuery
		 */
		fadeOutAll: function(ms) {
			return $.each (popovers, function(i, pop) {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					var options = data.options;
					popover.css({ zIndex: 949 }).fadeOut(ms ? ms : options.fadeSpeed);
				}
			});
		},
		/**
		 * Set the event trigger for the popover. Also cleans the previous binding. 
		 * 
		 * @param string
		 * @return jQuery
		 */
		setTrigger: function(trigger) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var popover = data.popover;
					var options = data.options;
					var $anchor = options.anchor ? $(options.anchor) : $this;
					
					if (trigger === 'click') {
						$anchor.unbind('click.popover').bind('click.popover', function(event) {
							if (options.preventDefault) {
								event.preventDefault();
							}
							event.stopPropagation();
							$this.popover('show');
						});
						popover.unbind('click.popover').bind('click.popover', function(event) {
							event.stopPropagation();
						});
					} else {
						$anchor.unbind('click.popover');
						popover.unbind('click.popover')
					}
					
					if (trigger === 'hover') {
						$anchor.add(popover).bind('mousemove.popover', function(event) {
							$this.popover('show');
						});
						$anchor.add(popover).bind('mouseleave.popover', function(event) {
							$this.popover('fadeOut');
						});
					} else {
						$anchor.add(popover).unbind('mousemove.popover').unbind('mouseleave.popover');
					}
					
					if (trigger === 'focus') {
						$anchor.add(popover).bind('focus.popover', function(event) {
							$this.popover('show');
						});
						$anchor.add(popover).bind('blur.popover', function(event) {
							$this.popover('fadeOut');
						});
						$anchor.bind('click.popover', function(event) {
							event.stopPropagation();
						});
					} else {
						$anchor.add(popover).unbind('focus.popover').unbind('blur.popover').unbind('click.popover');
					}
				}
			});
		},
		/**
		 * Rename the popover's title
		 * 
		 * @param string
		 * @return jQuery
		 */
		title: function(text) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var title = data.popover.find('.title');
					var wrap = data.popover.find('.wrap');
					if (title.length === 0) {
						title = $('<div class="title" />').appendTo(wrap);
					}
					title.html(text);
				}
			});
		},
		/**
		 * Set the popover's content
		 * 
		 * @param html
		 * @return jQuery
		 */
		content: function(html) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var content = data.popover.find('.content');
					var wrap = data.popover.find('.wrap');
					if (content.length === 0) {
						content = $('<div class="content" />').appendTo(wrap);
					}
					content.html(html);
				}
			});
		},
		/**
		 * Read content with AJAX and set popover's content.
		 * 
		 * @param string
		 * @param object
		 * @return jQuery
		 */
		ajax: function(url, ajax_params) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					var ajax_defaults = {
						url: url,
						success: function(ajax_data) {
							var content = data.popover.find('.content');
							var wrap = data.popover.find('.wrap');
							if (content.length === 0) {
								content = $('<div class="content" />').appendTo(wrap);
							}
							content.html(ajax_data);
						}
					}
					var ajax_options = $.extend({}, ajax_defaults, ajax_params);
					$.ajax(ajax_options);
				}
			});
		},
		setOption: function(option, value) {
			return this.each(function() {
				var $this = $(this);
				var data = $this.popover('getData');
				
				if (data) {
					data.options[option] = value;
					$this.data('popover', data);
				}
			});
		},
		getData: function() {
			var ret = [];
			this.each(function() {
				var $this = $(this);
				var data = $this.data('popover');
				
				if (data) ret.push(data);
			});
			
			if (ret.length == 0) {
				return;
			}
			if (ret.length == 1) {
				ret = ret[0];
			}
			return ret;
		}
	};

	$.fn.popover = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.popover');
		}
	}
}(window['jQuery']));