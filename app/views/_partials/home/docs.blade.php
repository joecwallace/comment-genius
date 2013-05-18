<div id="docs">
	<h2>Documentation</h2>

	<p>You can start using Comment Genius on your site right now - without signing up or anything. <b>Seriously.</b> Just use that script tag at the top of this page. Embed it at the end of your document's <code>&lt;body&gt;</code></p>

	<p>The rest of this page is for people who are looking for a little something more.</p>

	<h3>Customization</h3>

	<p>Comment Genius comes with a few ways to customize your installation. Um... here they come. Feel free to mix and match.</p>

	<h4>The <code>data-selector</code> attribute</h4>
	<h6>This is how you decide what gets comment bubbles!</h6>
	<p>By default, Comment Genius selects all of the <code>&lt;p&gt;</code> elements on your page, but maybe you want something different. You can do that easily with the <code>data-selector</code> attribute. It takes any valid jQuery selector. Like this:</p>
	<pre>&lt;script <b>data-selector=&quot;#wrapper .content p.commentable&quot;</b>
	type=&quot;text/javascript&quot; src=&quot;{{ $rootUrl . '/js/comment-genius.js' }}&quot;&gt;
	&lt;/script&gt;</pre>

	<h4>The <code>data-style</code> attribute</h4>
	<h6>This is how you style it yourself.</h6>
	<p>Comment Genius will inject styles into your document's <code>&lt;head /&gt;</code> to make itself look good. To stop that - maybe because you want to style it yourself - use the <code>data-style</code> attribute. It takes <code>"false"</code>; anything else will evaluate to <code>"true"</code>. So, to turn off the default styles, do this:</p>
	<pre>&lt;script <b>data-style=&quot;false&quot;</b>
	type=&quot;text/javascript&quot; src=&quot;{{ $rootUrl . '/js/comment-genius.js' }}&quot;&gt;
	&lt;/script&gt;</pre>

	<h4>The <code>data-site-id</code> attribute</h4>
	<h6>This is how you manage comments on your site(s).</h6>
	<p>You can manage comments by adding the <code>data-site-id</code> attribute to Comment Genius. To get your Site ID, you have to <a href="#signup-modal" data-toggle="modal">sign up</a>. After that, do something like this:</p>
	<pre>&lt;script <b>data-site-id=&quot;MY-COMMENT-GENIUS-SITE-ID&quot;</b>
	type=&quot;text/javascript&quot; src=&quot;{{ $rootUrl . '/js/comment-genius.js' }}&quot;&gt;
	&lt;/script&gt;</pre>

	<h4>The <code>data-trigger</code> attribute</h4>
	<h6>This is how you delay execution.</h6>
	<p>If you don't want to crank up Comment Genius as soon as the page loads, you can stall, or if you want to start Comment Genius before your page is done loading (why?), that could be a thing, too. [By default, Comment Genius will start when the DOM is ready.]</p>
	<p>First, tell the script not to initialize automatically:</p>
	<pre>&lt;script <b>data-trigger=&quot;manual&quot;</b>
	type=&quot;text/javascript&quot; src=&quot;{{ $rootUrl . '/js/comment-genius.js' }}&quot;&gt;
	&lt;/script&gt;</pre>
	<p>And then start it up when you're good and damn ready:</p>
	<pre>commentGenius.init();</pre>
	<p>Yeah, Comment Genius pollutes your global scope with a variable called <code>commentGenius</code>. But you weren't using that name anyway.</p>
</div>