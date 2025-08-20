<!DOCTYPE html>
<html>
<head>
    <title>Debugbar Test</title>
</head>
<body>
    <h1>Debugbar Test Page</h1>
    <p>If debugbar is working, you should see it at the bottom of this page.</p>
    
    <?php
    \Debugbar::info('Test info message');
    \Debugbar::warning('Test warning message');
    \Debugbar::error('Test error message');
    ?>
</body>
</html>