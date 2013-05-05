{{ Form::open(array('route' => 'login')) }}
	<div id="login-modal" class="modal hide fade">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h3>Log in</h3>
		</div>
		<div class="modal-body">
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
		</div>
		<div class="modal-footer">
			{{ Form::token() }}
			<a href="#" class="btn" data-dismiss="modal">Cancel</a>
			{{ Form::submit('Log in', array('class' => 'btn btn-primary')) }}
		</div>
	</div>
{{ Form::close() }}