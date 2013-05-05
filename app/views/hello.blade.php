@extends('layouts.main')

@section('content')
	<div class="row-fluid">
		<div class="span12 jumbotron">
			<h1>Start your Internet arguments at the top of your pages!</h1>
			<p class="lead">Your readers will <strong>love</strong> it.<br>Just include this JavaScript to get started.</p>
			<pre>&lt;script type=&quot;text/javascript&quot;
    data-main=&quot;{{ Request::root() . '/js/comment-genius.js' }}&quot;
    src=&quot;{{ Request::root() . '/components/require/require.js' }}&quot;&gt;
&lt;/script&gt;</pre>
		</div>
	</div>
@stop