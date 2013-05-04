require.config({
  paths: {
    'jquery': '/components/jquery/jquery',
    'jquery-sha256': '/components/jquery.sha256/jquery.sha256',
    'jquery-popover': '/components/jQuery.popover/jquery.popover-1.1.2'
  },
  shim: {
    'jquery-sha256': {
      deps: ['jquery']
    },
    'jquery-popover': {
      deps: ['jquery']
    }
  }
});
require(['comment-genius'], function(commentGenius) {
  $(document).ready(function() {
    commentGenius.addComment(3, 'tpote', 'I love making comments.');
  });
});
