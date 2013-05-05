<!doctype html>
<html>
	<head>
		<title>Comment Genius</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link rel="stylesheet/less" type="text/css" rel="stylesheet" href="/less/main.less" media="screen">

		<script type="text/javascript" src="/components/less.js/dist/less-1.3.3.js"></script>
	</head>
	<body>
		<div class="container-fluid">
			@yield('content')
		</div>
		
		@section('scripts')
			<script type="text/javascript" src="/components/jquery/jquery.js"></script>
			<script type="text/javascript" src="/components/bootstrap/js/bootstrap-modal.js"></script>
			<script type="text/javascript" src="/components/bootstrap/js/bootstrap-tooltip.js"></script>
			<script type="text/javascript" src="/components/bootstrap/js/bootstrap-popover.js"></script>
			<script type="text/javascript" src="/js/dashboard.js"></script>
		@show
	</body>
</html>
