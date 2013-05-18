<?php

$buildCommand = new BuildCommentGeniusJavaScriptCommand;
$buildCommand->fire();

$lessCommand = new BuildStylesCommand;
$lessCommand->fire();
