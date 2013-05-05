<?php

class CommentsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($article)
	{
		return Response::make(
			Comment::where('article', $article)->get()
		)->header('Access-Control-Allow-Origin', '*');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($article)
	{
		return Response::make(Comment::create(array(
			'article' => $article,
			'element_hash' => Input::get('element_hash'),
			'email' => Input::get('email'),
			'name' => Input::get('name'),
			'text' => Input::get('text'),
		)))->header('Access-Control-Allow-Origin', '*');
	}

}