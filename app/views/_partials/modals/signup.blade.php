{{ Form::open(array('route' => 'signup')) }}
	<div id="signup-modal" class="modal hide fade">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h3>Sign up</h3>
		</div>
		<div class="modal-body">
			<div class="control-group{{ $errors->has('name') ? ' error' : '' }}">
				{{ Form::label('name', 'Full name', array('class' => 'control-label')) }}
				<div class="controls">
					{{ Form::text('name', null, array('class' => 'input-block-level')) }}
					@if ($errors->has('name'))
						<span class="help-block">{{ $errors->first('name') }}</span>
					@endif
				</div>
			</div>
			<div class="control-group{{ $errors->has('email') ? ' error' : '' }}">
				{{ Form::label('email', 'Email', array('class' => 'control-label')) }}
				<div class="controls">
					{{ Form::text('email', null, array('class' => 'input-block-level')) }}
					@if ($errors->has('email'))
						<span class="help-block">{{ $errors->first('email') }}</span>
					@endif
				</div>
			</div>
			<div class="control-group{{ $errors->has('password') ? ' error' : '' }}">
				{{ Form::label('password', 'Password', array('class' => 'control-label')) }}
				<div class="controls">
					{{ Form::password('password', array('class' => 'input-block-level')) }}
				</div>
				{{ Form::label('password_confirmation', 'Password, again', array('class' => 'control-label')) }}
				<div class="controls">
					{{ Form::password('password_confirmation', array('class' => 'input-block-level')) }}
					@if ($errors->has('password'))
						<span class="help-block">{{ $errors->first('password') }}</span>
					@endif
				</div>
			</div>
		</div>
		<div class="modal-footer">
			{{ Form::token() }}
			<a href="#" class="btn" data-dismiss="modal">Cancel</a>
			{{ Form::submit('Sign up', array('class' => 'btn btn-primary')) }}
		</div>
	</div>
{{ Form::close() }}