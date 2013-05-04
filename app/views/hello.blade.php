@extends('layouts.main')

@section('content')
	<div class="row-fluid">
		<div class="span6">
			<h3>Sign up</h3>
			@include('_partials.users.signup')
		</div>
		<div class="span6">
			<h3>Log in</h3>
			@include('_partials.users.login')
		</div>
	</div>
@stop