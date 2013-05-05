@extends('layouts.main')

@section('content')
	<div class="row-fluid">
		<div class="span12 jumbotron">
			<h1>Start Internet arguments at the top of your pages!</h1>
			<p class="lead">Your readers will <strong>love</strong> it.<br>Just include this JavaScript to get started.</p>
			<pre>&lt;script id=&quot;comment-genius&quot; type=&quot;text/javascript&quot; src=&quot;{{ $rootUrl . '/js/cg.js' }}&quot;&gt;&lt;/script&gt;</pre>
		</div>
	</div>
@stop