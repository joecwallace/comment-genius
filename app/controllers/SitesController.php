<?php

class SitesController extends BaseController {
	
	public function store()
	{
		$input = Input::all();
		$redirect = Redirect::back();

		$validation = Validator::make($input, array(
			'name' => 'required',
		));

		if ($validation->passes())
		{
			$site = new Site($input);

			$site->createKey();

			Auth::user()->sites()->save($site);
		}
		else
		{
			$redirect->withInput()->withErrors($validation);
		}

		return $redirect;
	}

}