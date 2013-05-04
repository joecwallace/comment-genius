<?php

class CommentsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($article)
	{
		return Comment::where('article', $article)->get();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($article)
	{
		return Comment::create(array(
			'article' => Input::get('article'),
			'element_hash' => Input::get('element_hash'),
			'email' => Input::get('email'),
			'text' => Input::get('text'),
		));
	}

}