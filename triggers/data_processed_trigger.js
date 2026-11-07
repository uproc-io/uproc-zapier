const API_URL = "https://api.uproc.io/api/v2";

// triggers on data processed trigger with a certain tag
module.exports = {
  key: 'data_processed_trigger',
  noun: 'Data processed trigger',

  display: {
    label: 'Forward Received Request',
    description: 'Triggers when a new request is done to forward API response.'
  },

  operation: {
      type: 'hook',
      performSubscribe: (z, bundle) => {
          const data = {
              leadURL: bundle.targetUrl
          };

          const options = {
              url: `${API_URL}/zapier/trigger/data_processed_trigger/add-webhook`,
              method: 'POST',
              body: data //JSON.stringify(data)
          };

          return z.request(options)
              .then((response) => {
                  z.console.log(response.content);
              });
      },
      performUnsubscribe: (z, bundle) => {
          const options = {
              url: `${API_URL}/zapier/trigger/data_processed_trigger/remove-webhook`,
              method: 'POST',
              body: {
                  id: bundle.subscribeData.id
              }
          };

          // You may return a promise or a normal data structure from any perform method.
          return z.request(options)
              .then((response) => {
                  z.console.log(response.content);
              });
      },
      performList: (z, bundle) => {
          return z.request(`${API_URL}/list`)
              .then(response => {
                  return response;
              })
      },
      perform: (z, bundle) => {
            return z.request(`${API_URL}/list`)
                .then(response => {
                    return response;
                })
      }
  }
};
