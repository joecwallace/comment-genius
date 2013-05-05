@extends('layouts.main')

@section('scripts')
	@parent
	<script type="text/javascript" src="/components/bootstrap/js/bootstrap-modal.js"></script>
	<script type="text/javascript" src="/components/bootstrap/js/bootstrap-tooltip.js"></script>
	<script type="text/javascript" src="/components/bootstrap/js/bootstrap-popover.js"></script>
	<script type="text/javascript" src="/js/dashboard.js"></script>
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
			<h3 style="border-bottom: 1px solid #ccc;">Sites
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
								<a class="btn btn-primary script-popover" href="#" data-require-url="{{ Request::root() . '/components/require/require.js' }}" data-main-url="{{ Request::root() . '/js/main.js' }}">Get it!</a>
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
			<h3 style="border-bottom: 1px solid #ccc;">Recent Comments</h3>
		</div>
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