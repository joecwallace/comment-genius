<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::resource('{article}/comments', 'CommentsController', array(
	'only' => array('index', 'store'),
));

Route::post('signup', array(
	'as' => 'signup',
	'before' => 'guest',
	'uses' => 'UsersController@store',
));

Route::post('login', array(
	'as' => 'login',
	'before' => 'guest',
	'uses' => 'UsersController@login',
));

Route::any('logout', array(
	'as' => 'logout',
	'uses' => 'UsersController@logout',
));

Route::get('demo', function() {
	return View::make('demo');
});

Route::get('/', function() {
	return View::make('hello');
});