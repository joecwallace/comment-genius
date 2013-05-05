@extends('layouts.dashboard')

@section('scripts')
	@parent
@stop

@section('content')

	<div class="row-fluid">
		<div class="span12">
			<p class="pull-right">Welcome, {{ $user->name }} ({{ Html::linkRoute('logout', 'logout') }})</p>
		</div>
	</div>
	@if ($errors->any())
		<div class="row-fluid">
			<div class="alert alert-error span12">
				<ul style="margin-bottom:0;">
					@foreach ($errors->all() as $error)
						<li>{{ $error }}</li>
					@endforeach
				</ul>
			</div>
		</div>
	@endif
	<div class="row-fluid">
		<div class="span12">
			<h3 class="underline">Sites
				<a class="btn btn-mini btn-info" href="#new-site-modal" data-toggle="modal">
					<i class="icon icon-white icon-plus"></i>
				</a>
			</h3>
		</div>
	</div>
	<div class="row-fluid">
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Key</th>
					<th>Script</th>
				</tr>
			</thead>
			<tbody>
				@if (count($user->sites))
					@foreach($user->sites as $site)
						<tr>
							<td>{{ $site->name }}</td>
							<td>{{ $site->key }}</td>
							<td>
								<a class="btn btn-info script-popover" href="#" data-site-id="{{ $site->key }}" data-main-url="{{ Request::root() . '/js/cg.js' }}">Get it!</a>
							</td>
						</tr>
					@endforeach
				@else
					<tr>
						<td colspan="3"><em>You haven't created any sites yet.</em></td>
					</tr>
				@endif
			</tbody>
		</table>
	</div>
	<div class="row-fluid">
		<div class="span12">
			<h3 class="underline">Recent Comments</h3>
		</div>
	</div>
	<div class="row-fluid">
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Comment</th>
				</tr>
			</thead>
			<tbody>
				@if (count($user->recentComments))
					@foreach($user->recentComments as $comment)
						<tr>
							<td>{{ $comment->name }}</td>
							<td>{{ $comment->email }}</td>
							<td>{{ $comment->text }}</td>
						</tr>
					@endforeach
				@else
					<tr>
						<td colspan="3"><em>Your sites don't have any comments yet.</em></td>
					</tr>
				@endif
			</tbody>
		</table>
	</div>

	{{ Form::open(array('action' => 'SitesController@store', 'class' => 'form-horizontal')) }}
		<div id="new-site-modal" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h3>Add a site</h3>
			</div>
			<div class="modal-body">
				{{ Form::label('name', 'Site name') }}
				{{ Form::text('name') }}
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal">Close</a>
				{{ Form::submit('Create', array('class' => 'btn btn-primary')) }}
			</div>
		</div>
	{{ Form::close() }}

@stop