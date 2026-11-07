const API_URL = "https://api.uproc.io/api/v2";
const sample_data_hook = {
  "person": {
    "name": "Sample",
    "surname": "User",
    "gender": "male",
    "email": "test@uproc.io",
    "email_confidence": "verified",
    "email_score": 95,
    "profile": "https://www.linkedin.com/in/sample-user",
    "area": "ceo",
    "seniority": "executive",
    "role": "Founder @ Uproc"
  },
  "company_general": {
    "name": "Sample Company",
    "description": ""
  },
  "company_contact": {
    "phone": "+34 600 000 000",
    "email": "hello@uproc.io",
    "website": "https://uproc.io",
    "address": "",
    "zipcode": "",
    "city": "",
    "state": "",
    "county": "",
    "country": ""
  },
  "company_financial": {
    "industry": "",
    "revenue": "",
    "size": ""
  },
  "company_social": {
    "instagram": "",
    "linkedin": "",
    "facebook": "https://facebook.com/uprocdataquality",
    "google": "",
    "twitter": "https://twitter.com/uproc_io",
    "klout": "",
    "foursquare": "",
    "pinterest": "",
    "slideshare": "",
    "github": "",
    "youtube": "https://www.youtube.com/channel/UCOUlLZwMY-J0s_HfyPxrI5A",
    "flickr": "",
    "aboutme": "",
    "angellist": ""
  },
  "company_technologies": {
    "result": "addtoany,cloudflare,facebook,font awesome,google analytics,google font api,jquery,php,twitter emoji (twemoji),wordpress,yoast seo"
  }
};


// triggers on b2b lists with a certain tag
module.exports = {
    key: 'b_2_b_lists',
    noun: 'B2B Lists',

    display: {
        label: 'New Profile Added to List',
        description: 'Triggers when new B2B profile is added to selected UProc\'s list.'
    },

    operation: {
        type: 'hook',
        inputFields: [
            (z, bundle) => {
                return z.request(`${API_URL}/zapier/lists/people`)
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
          var data = bundle.cleanedRequest.data;
          if (data.company_contact && data.company_contact.phone && data.company_contact.phone.length > 0) {
            data.company_contact.phone = data.company_contact.phone.replace("+", "");//avoid problems with phones
          }
          return [data];
        },

        sample: sample_data_hook
    }
};
