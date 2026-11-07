const API_URL = "https://api.uproc.io/api/v2";

module.exports = {
    key: 'tools',
    noun: 'Tools',

    display: {
        label: 'Select Tool',
        description: 'Select a tool to perform verification or enrichment'
    },

    operation: {
        inputFields: [
            (z, bundle) => {
                return z.request(`${API_URL}/zapier/groups`)
                    .then(response => {
                        if(response.status === 200) {
                            let output = {
                                key: 'group',
                                label: 'Group',
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
            },
            (z, bundle) => {
                return z.request(`${API_URL}/zapier/processors/${bundle.inputData.group}`)
                    .then(response => {
                        if(response.status === 200) {
                            let output = {
                                key: 'processor',
                                label: 'Tool',
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
            },
            (z, bundle) => {
                return z.request(`${API_URL}/zapier/processor/${bundle.inputData.processor}`)
                    .then(response => {
                        if(response.status === 200) {
                            let output = [];
                            for(let i in response.json) {
                                output.push({
                                    key: response.json[i].id,
                                    label: response.json[i].name,
                                    required: true
                                })
                            }

                            return {
                                key: 'params',
                                children: output,
                                required: true
                            };
                        }

                        return []
                    })
            }
        ],
        perform: (z, bundle) => {
            return z.request(`${API_URL}/zapier/processor/${bundle.inputData.processor}`)
                .then(response => {
                    if(response.status === 200) {
                        let params = {};
                        for(let i in response.json) {
                            params[response.json[i].id] = bundle.inputData[response.json[i].id]
                        }
                        return z.request(`${API_URL}/process`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                "processor": bundle.inputData.processor,
                                "params": params
                            })
                        }).then(response => {
                            if(response.status === 200) {
                                return response.json.message;
                            }

                            return {}
                        });
                    }
                })
        }
    }
};
