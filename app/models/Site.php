<?php

class Site extends Eloquent {

	protected $table = 'sites';

	protected $fillable = array('name', 'url');

	public function user()
	{
		return $this->belongsTo('User');
	}

	public function createKey()
	{
		$this->key = md5($this->name . time());
	}

	public function getIncludeTag()
	{
		return e('<script type="text/javascript" src="' . Request::root() . 'js/comment-genius.js" data-site-id="' . $this->key . '"></script>');
	}

}