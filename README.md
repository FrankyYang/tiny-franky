API Simulator
=========

API simulator will help the front end developer finish his job more quickly if this job depends on some server APIs that are not avaliable during the developing process. As you can use it to create a fake api that will response the data you registered in the server side.

After this tool is installed and started correctly, you may visite it and then login and register the information in the browser.
  - Input the server side api link that you want to simulate, like 'login.action' or 'userInfo.action'. Currently this tool is not able to parse the params of the api.
  - Input the data that you like to response when someone visite this api. There is no format checking for the response data.
  - Then click the "save" button, the link is saved in the server side. You could visit the api from browser like this: yourwebsite.com/yourAPI, then you will get the response data that you registered.
  - You could manage your data from the table down there, when click the "delete" button, data will be deleted on server side.

Version
-

0.0.1

Installation
-

    npm install
    node app


License
-

Apache 2.0
