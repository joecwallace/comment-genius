{{ Form::open(array('route' => 'signup')) }}
	<div class="control-group{{ $errors->has('name') ? ' error' : '' }}">
		{{ Form::label('name', 'Full name', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::text('name') }}
			@if ($errors->has('name'))
				<span class="help-block">{{ $errors->first('name') }}</span>
			@endif
		</div>
	</div>
	<div class="control-group{{ $errors->has('email') ? ' error' : '' }}">
		{{ Form::label('email', 'Email', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::text('email') }}
			@if ($errors->has('email'))
				<span class="help-block">{{ $errors->first('email') }}</span>
			@endif
		</div>
	</div>
	<div class="control-group{{ $errors->has('password') ? ' error' : '' }}">
		{{ Form::label('password', 'Password', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::password('password') }}
		</div>
		{{ Form::label('password_confirmation', 'Password, again', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::password('password_confirmation') }}
			@if ($errors->has('password'))
				<span class="help-block">{{ $errors->first('password') }}</span>
			@endif
		</div>
	</div>
	<div class="controls">
		{{ Form::token() }}
		{{ Form::submit('Go', array('class' => 'btn')) }}
	</div>
{{ Form::close() }}