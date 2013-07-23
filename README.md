tiny-franky
===========

Franky's little world, far from the crowd.

php-utils

Many kinds of little tools written in php, that will help me doing frontend developing.
1, list.php: Read the data-list.php from local storage and response to the browser, so that I could show the data in jqGrid in browser.
If the keys in request parameters is different from server, for example, I use xx.com?id=23, but on the server side, data is stored as
workerId, then we could just define this in list-data.json with 'map' part.
This little tool support condition search from the browser.