<!doctype html>
<html>
	<head>
		<title>Comment Genius</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link rel="stylesheet" type="text/css" href="/css/main.css" media="screen">
	</head>
	<body>
		@include('_partials.tracking.ga')
		
		<div class="container container-narrow">
			<div class="masthead">
				<ul class="nav nav-pills pull-right">
					<li>
						<a href="#demo">Demo</a>
					</li>
					<li>
						<a href="#docs">Docs</a>
					</li>
					<li>
						<a href="#signup-modal" data-toggle="modal">Sign up</a>
					</li>
					<li>
						<a href="#login-modal" data-toggle="modal">Log in</a>
					</li>
				</ul>
				<h3 class="muted">Comment Genius</h3>
			</div>
			<hr>
			@yield('content')
		</div>

		@include('_partials.modals.login')
		@include('_partials.modals.signup')

		<div class="footer">
			<p>Comment Genius was conceived and created by <a href="http://twitter.com/joecwallace">@joecwallace</a><br>
				with help from <a href="http://twitter.com/ThePsion5">@ThePsion5</a> and <a href="http://twitter.com/potetm">@potetm</a><br>
				at <a href="http://hacknashville.com/">HackNashville</a>.</p>
			<p class="power">Powered by <a href="http://laravel.com/">Laravel 4</a> and <a href="http://pagodabox.com/">PagodaBox</a>.</p>
		</div>

		@section('scripts')
			<script type="text/javascript" src="/components/jquery/jquery.js"></script>
			<script type="text/javascript" src="/components/bootstrap/js/bootstrap-modal.js"></script>
		@show
	</body>
</html>
