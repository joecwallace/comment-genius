<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class BuildCommentGeniusJavaScriptCommand extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'cg:build';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'This is the concat + minify for Comment Genius JavaScript.';

	/**
	 * The path to the script source.
	 *
	 * @var string
	 */
	protected $scriptSourcePath = 'public/js/comment-genius.src.js';

	/**
	 * The path to the script destination.
	 *
	 * @var string
	 */
	protected $scriptDestinationPath = 'public/js/comment-genius.js';

	/**
	 * The path to the CSS stylesheet.
	 *
	 * @var string
	 */
	protected $stylePath = 'public/css/default-theme.css';

	/**
	 * The script's dependencies will be concatenated in order listed.
	 *
	 * @var array
	 */
	protected $dependencies = array(

		'public/components/jquery/jquery.js',
		'public/components/jquery.sha256/jquery.sha256.js',
		'public/components/jQuery.popover/jquery.popover-1.1.2.js',

	);

	/**
	 * A placeholder key for managing insertion of CSS into JS
	 *
	 * @var string
	 */
	protected $cssPlaceholder = '(-(-_(-_-)_-)-)'; // Nothing to see here

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return void
	 */
	public function fire()
	{
		$this->concatenate();

		if ($this->input && $this->option('uglify') !== 'false') {
			$this->uglify();
		}
	}

	/**
	 * Concatenate the required files togther.
	 *
	 * @return void
	 */
	protected function concatenate()
	{
		$appendFlag = 0;

		$source = base_path() . '/' . $this->scriptSourcePath;
		$destination = base_path() . '/' . $this->scriptDestinationPath;

		foreach ($this->dependencies as $dep) {
			$depSource = base_path() . '/' . $dep;

			file_put_contents($destination, file_get_contents($depSource), $appendFlag);

			$appendFlag = FILE_APPEND;
		}

		$sourceContents = file_get_contents($source);
		$styleContents = $this->getStylesheet();

		$sourceContents = str_replace($this->cssPlaceholder, $styleContents, $sourceContents);

		file_put_contents($destination, $sourceContents, FILE_APPEND);
	}

	/**
	 * Uglify (compress) the JavaScript.
	 *
	 * @return void
	 */
	public function uglify()
	{
		echo 'Uglify not yet implemented' . PHP_EOL;
	}

	/**
	 * Get and minify the stylesheet.
	 *
	 * @return string
	 */
	function getStylesheet()
	{
		$contents = file_get_contents($this->stylePath);

		return preg_replace('/\s+/ism', ' ', $contents);
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return array(
			//
		);
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return array(
			array('uglify', 'u', InputOption::VALUE_OPTIONAL, 'Uglify the code', true),
		);
	}

}