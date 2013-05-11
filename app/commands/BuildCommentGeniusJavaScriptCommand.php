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
	protected $stylePath = 'public/less/cg-default-theme.less';

	/**
	 * The script's dependencies will be concatenated in order listed.
	 *
	 * @var array
	 */
	protected $dependencies = array(

		'public/components/jquery/jquery.js',
		'public/components/jquery.sha256/jquery.sha256.js',
		'public/components/jQuery.popover/jquery.popover-1.1.2.js',
		'public/components/mustache/mustache.js',

	);

	/**
	 * A placeholder key for managing insertion of CSS into JS
	 *
	 * @var string
	 */
	protected $cssPlaceholder = '(-(-_(-_-)_-)-)'; // Nothing to see here

	/**
	* A regex for inserting Mustache templates into JS
	*
	* @var string
	*/
	protected $mustacheRegex = '/\{\{>\s*([A-Za-z0-9\/\.-]+\.mustache)\s*\}\}/';

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
		$sourceContents = $this->insertStylesheet($sourceContents);
		$sourceContents = $this->insertMustacheTemplates($sourceContents);

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
	function insertStylesheet($source)
	{
		$less = new lessc;

		$less->setFormatter('compressed');

		$css = $less->compileFile(base_path() . '/' . $this->stylePath);

		$css = str_replace("'", "\\'", $css);

		return str_replace($this->cssPlaceholder, $css, $source);
	}

	/**
	 * Inserts Mustache templates.
	 *
	 * @return void
	 */
	function insertMustacheTemplates($source)
	{
		$matches = array();

		preg_match_all($this->mustacheRegex, $source, $matches);

		if (count($matches) > 1)
		{
			for ($i = 0; $i < count($matches[0]); $i++)
			{
				$template = file_get_contents(base_path() . '/' . $matches[1][$i]);
				$template = preg_replace('/\s+/ism', ' ', $template);

				$source = str_replace($matches[0][$i], $template, $source);
			}
		}

		return $source;
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