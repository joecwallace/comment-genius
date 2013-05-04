<?php

class UsersController extends BaseController {

	public function store()
	{
		$user = new User;

		if ($user->signUp(Input::all()))
		{
			Auth::login($user);

			return Redirect::to('/');
		}

		return Redirect::back()->withInput()->withErrors($user->getErrors());
	}

	public function login()
	{
		if (Auth::attempt(array('email' => Input::get('email'), 'password' => Input::get('password'))))
		{
			return Redirect::to('/');
		}

		return Redirect::back()->withErrors(array(
			'authentication' => 'Authentication failed.',
		));
	}

	public function logout()
	{
		Auth::logout();

		return Redirect::to('/');
	}

}