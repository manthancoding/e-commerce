# Code Citations

## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
Found it! **The regex pattern in your backend validation schema is broken.** 

On line 6 of [backend/src/validators/schemas.js](backend/src/validators/schemas.js), the password pattern is:

```javascript
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
```

**The problem:** After the loo
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
Found it! **The regex pattern in your backend validation schema is broken.** 

On line 6 of [backend/src/validators/schemas.js](backend/src/validators/schemas.js), the password pattern is:

```javascript
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
```

**The problem:** After the loo
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
Found it! **The regex pattern in your backend validation schema is broken.** 

On line 6 of [backend/src/validators/schemas.js](backend/src/validators/schemas.js), the password pattern is:

```javascript
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
```

**The problem:** After the loo
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
Found it! **The regex pattern in your backend validation schema is broken.** 

On line 6 of [backend/src/validators/schemas.js](backend/src/validators/schemas.js), the password pattern is:

```javascript
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
```

**The problem:** After the loo
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
Found it! **The regex pattern in your backend validation schema is broken.** 

On line 6 of [backend/src/validators/schemas.js](backend/src/validators/schemas.js), the password pattern is:

```javascript
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
```

**The problem:** After the loo
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
```


## License: GPL-2.0
https://github.com/centreon/centreon-archived/blob/f9efb6dc76f20b4477bcc3705775775bf706e75a/www/install/steps/process/process_step5.php

```
**Fixed!** The issue was the regex pattern required `+` (to match one or more characters) and `$` (to anchor to the end). 

Changed from: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/`

To: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
```

