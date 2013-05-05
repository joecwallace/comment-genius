{{ Form::open(array('route' => 'login')) }}
	<div class="control-group{{ $errors->has('authentication') ? ' error' : '' }}">
		{{ Form::label('email', 'Email', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::text('email', null, array('class' => 'input-block-level')) }}
		</div>
		{{ Form::label('password', 'Password', array('class' => 'control-label')) }}
		<div class="controls">
			{{ Form::password('password', array('class' => 'input-block-level')) }}
			@if ($errors->has('authentication'))
				<span class="help-block">{{ $errors->first('authentication') }}</span>
			@endif
		</div>
	</div>
	<div class="controls">
		{{ Form::token() }}
		{{ Form::submit('Go', array('class' => 'btn')) }}
	</div>
{{ Form::close() }}