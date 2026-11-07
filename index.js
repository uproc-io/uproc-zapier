const DataprocessedtriggerTrigger = require('./triggers/data_processed_trigger');
const B2blistsTrigger = require('./triggers/b_2_b_lists');
const WeblistsTrigger = require('./triggers/web_lists');
const Tools = require('./creates/tools')

const authentication = {
    type: 'custom',
    test: {
        url:
            'https://api.uproc.io/api/v2/zapier/processors/person'
    },
    fields: [
        {
            key: 'username',
            type: 'string',
            required: true,
            label: 'Email'
        },
        {
            key: 'api_key',
            type: 'string',
            required: true,
            label: 'Api Real Key',
            helpText: 'Found on your settings page under [integrations](https://app.uproc.io/app/integration).'
        }
    ],
    connectionLabel: '{{bundle.authData.username}}'
};

const addApiKeyToHeader = (request, z, bundle) => {
    const basicHash = Buffer(`${bundle.authData.username}:${bundle.authData.api_key}`).toString('base64');
    //z.console.log(basicHash);
    request.headers.Authorization = `Basic ${basicHash}`;
    return request;
};



const App = {
    // This is just shorthand to reference the installed dependencies you have. Zapier will
    // need to know these before we can upload
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: authentication,

    // beforeRequest & afterResponse are optional hooks into the provided HTTP client
    beforeRequest: [addApiKeyToHeader],

    afterResponse: [],

    // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
    resources: {},

    // If you want your trigger to show up, you better include it here!
    triggers: {
        //[DataprocessedtriggerTrigger.key]: DataprocessedtriggerTrigger,
        [B2blistsTrigger.key]: B2blistsTrigger,
        [WeblistsTrigger.key]: WeblistsTrigger
    },

    // If you want your searches to show up, you better include it here!
    searches: {},

    // If you want your creates to show up, you better include it here!
    creates: {
        [Tools.key]: Tools
    }
};

// Finally, export the app.
module.exports = App;
