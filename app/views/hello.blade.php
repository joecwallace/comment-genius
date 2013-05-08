@extends('layouts.main')

@section('scripts')
	@parent
	<script type="text/javascript" data-selector="#demo p" src="//{{ preg_replace('/^https?:/', '', Request::root()) }}/js/comment-genius.js"></script>
@stop

@section('content')

	@include('_partials.home.jumbotron')

	<hr>

	@include('_partials.home.demo')

	<hr>

	@include('_partials.home.docs')

@stop