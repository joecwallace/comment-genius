<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class BuildStylesCommand extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'cg:less';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'This is the LESS compile for the site files.';

	/**
	 * The path to the LESS source.
	 *
	 * @var string
	 */
	protected $lessSourcePath = 'public/less/main.less';

	/**
	 * The path to the CSS destination.
	 *
	 * @var string
	 */
	protected $cssDestinationPath = 'public/css/main.css';

	/**
	 * Paths of any images that should be placed in the image directory.
	 *
	 * @var array
	 */
	protected $imgSourcePaths = array(
		'public/components/bootstrap/img/glyphicons-halflings.png',
		'public/components/bootstrap/img/glyphicons-halflings-white.png',
	);

	/**
	 * Path to the image directory.
	 *
	 * @var string
	 */
	protected $imgDestinationPath = 'public/img';

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
		$this->copyImages();
		$this->compile();
	}

	/**
	 * Copies image resources
	 *
	 * @return void
	 */
	protected function copyImages()
	{
		foreach ($this->imgSourcePaths as $image)
		{
			File::copy($image, $this->imgDestinationPath . '/' . basename($image));
		}
	}

	/**
	 * Compiles the LESS
	 *
	 * @return void
	 */
	protected function compile()
	{
		$less = new lessc;
		$less->compileFile($this->lessSourcePath, $this->cssDestinationPath);
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
			//
		);
	}

}