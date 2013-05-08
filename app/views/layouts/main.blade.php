<!doctype html>
<html>
	<head>
		<title>Comment Genius</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link rel="stylesheet/less" type="text/css" rel="stylesheet" href="/less/main.less" media="screen">

		<script type="text/javascript" src="/components/less.js/dist/less-1.3.3.js"></script>
	</head>
	<body>
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

		@section('scripts')
			<script type="text/javascript" src="/components/jquery/jquery.js"></script>
			<script type="text/javascript" src="/components/bootstrap/js/bootstrap-modal.js"></script>
		@show
	</body>
</html>
