<?php

class CommentsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($article)
	{
		$query = Comment::where('article', $article)
			->where('site_key', Input::get('site_id', null));

		if (Input::has('since'))
		{
			$query->where('created_at', '>', Input::get('since'));
		}

		return Response::make(
			$query->get()
		)->header('Access-Control-Allow-Origin', '*');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($article)
	{
		$input = Input::all();
		$rules = array(
			'element_hash' => 'required',
			'email' => 'required|email',
			'name' => 'required',
			'text' => 'required',
		);

		$validation = Validator::make($input, $rules);

		if ($validation->passes())
		{
			return Response::make(Comment::create(array(
				'article' => $article,
				'element_hash' => Input::get('element_hash'),
				'email' => Input::get('email'),
				'name' => Input::get('name'),
				'text' => Input::get('text'),
				'site_key' => Input::get('site_id', null),
			)))->header('Access-Control-Allow-Origin', '*');
		}

		return Response::make($validation->errors(), 400);
	}

}