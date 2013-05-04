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
                        <script type="text/javascript" src="/components/jQuery.popover/jquery.popover-1.1.2.js"></script>
		@show
	</body>
</html>