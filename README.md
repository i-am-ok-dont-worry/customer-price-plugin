# Customer price plugin
This plugin allows to fetch individual customer price.
Price list is defined per customer and is used to decorate product
data to calculate final product price.

## Entry point
Entry point for plugin is a /src/index.js file. It contains a template function
for api plugin.

## Write a plugin
Plugin receives various props including:
* config - api configuration
* db - elasticsearch client
* router - express router
* cache - cache manager instance
* apiStatus - rest api response helper func
* apiError - rest api error response helper func
* getRestApiClient - method which returns Magento Rest Client

# IMPORTANT!
- `package.json` must contain `pluginname` entry which describes plugin name
- `package.json` must contain valid company info e.g.:
```
"companyname": "grupakmk"
```

