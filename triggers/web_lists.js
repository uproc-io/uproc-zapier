const API_URL = "https://api.uproc.io/api/v2";
const sample_data_hook = {
  "input": {
    "ip": "140.82.118.3",
    "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36",
    "page": "/",
    "list": "5d5f876c066c042fcfbbff87",
    "is_new": false,
    "site": "localhost"
  },
  "output": {
    "geographical": {
      "country": "United States",
      "city": "San Francisco",
      "county": "California",
      "latitude": 37.7757,
      "longitude": -122.3952,
      "zipcode": "94107"
    },
    "locale": {
      "currency_code": "USD",
      "currency_name": "US DOLLAR",
      "language_code": "chr_US",
      "language_name": "Cherokee (United States)"
    },
    "timezone": {
      "zone": "America/Los_Angeles",
      "datetime": "2019-08-23 00:46:46",
      "date": "2019-08-23",
      "year": "2019",
      "month": "08",
      "day": "23",
      "hour": "00",
      "minute": "46",
      "quarter": "3",
      "weekday": "Friday"
    },
    "network": {
      "hostname": "lb-140-82-118-3-ams.github.com",
      "range": "140.82.112.0-140.82.127.255",
      "provider": "githu",
      "is_static": true
    },
    "reputation": {
      "is_proxy": false,
      "is_tor": false,
      "is_blacklisted": false
    },
    "company": {
      "name": "Github",
      "address": "Colin P Kelly Junior Street, 88",
      "zipcode": "94107",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "email": "",
      "website": "http://github.com",
      "phone": "+1 877-448-4820"
    }
  },
  "stats": {
    "unique": 0,
    "total": 2,
    "last_visit": "2019-08-23T07:57:09.969Z",
    "previous_visit": null
  },
  "date": "2019-08-23T07:46:46.974Z"
};


// triggers on b2b lists with a certain tag
module.exports = {
    key: 'web_lists',
    noun: 'Web Lists',

    display: {
        label: 'New Webtrack Added to List',
        description: 'Triggers when new Webtrack is added to selected UProc\'s Web list.'
    },

    operation: {
        type: 'hook',
        inputFields: [
            (z, bundle) => {
                return z.request(`${API_URL}/zapier/lists/web`)
                    .then(response => {
                        if(response.status === 200) {
                            let output = {
                                key: 'list',
                                required: true,
                                choices: [],
                                altersDynamicFields: true
                            };

                            for(let i in response.json) {
                                output.choices.push({
                                    label: response.json[i].name,
                                    value: response.json[i].id
                                })
                            }

                            return output;
                        }

                        return {}
                    })
            }
        ],
        performSubscribe: (z, bundle) => {
            const data = {
                hook_url: bundle.targetUrl,
                list_id: bundle.inputData.list
            };

            const options = {
                url: `${API_URL}/zapier/trigger/b2b_list/add-webhook`,
                method: 'POST',
                body: data //JSON.stringify(data)
            };

            return z.request(options)
                .then((response) => {
                    //z.console.log(response.content);
                    return response.json;
                });
        },
        performUnsubscribe: (z, bundle) => {
            const options = {
                url: `${API_URL}/zapier/trigger/b2b_list/remove-webhook`,
                method: 'POST',
                body: {
                    hook_id: bundle.subscribeData.hook_id
                }
            };

            // You may return a promise or a normal data structure from any perform method.
            return z.request(options)
                .then((response) => {
                    z.console.log(response.content);
                    return response.json;
                });
        },

        performList: (z, bundle) => {
            return [sample_data_hook];
        },

        perform: (z, bundle) => {
          //Clean phone
          var data = bundle.cleanedRequest.data;
          if (data.output && data.output.company && data.output.company.phone && data.output.company.phone.length > 0) {
            data.output.company.phone = data.output.company.phone.replace("+", "");//avoid problems with phones
          }
          return [data];
        },

        sample: sample_data_hook
    }
};
