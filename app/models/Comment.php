<?php

class Comment extends Eloquent {

	protected $table = 'comments';

	protected $guarded = array('id', 'created_at', 'updated_at');

}