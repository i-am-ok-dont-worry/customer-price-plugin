/**
 * This plugin allows to fetch individual customer price from Magento
 * @param config
 * @param db
 * @param router
 * @param cache
 * @param apiStatus
 * @param apiError
 * @param getRestApiClient
 * @returns {{router: *, route: string, pluginName: string, domainName: string}}
 */
module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('customerPrice', (restClient) => {
            const module = {};
            module.get = (customerId, token) => {
                const url = `/kmk-customerprice/customerprice/search?searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bfield%5D=customer_id&searchCriteria%5BfilterGroups%5D%5B0%5D%5Bfilters%5D%5B0%5D%5Bvalue%5D=${encodeURI(customerId)}`;
                return restClient.get(url, token);
            };

            return module;
        });

        return client;
    };

    router.get('/:customerId', async (req, res) => {
        try {
            const {customerId} = req.params;
            const {token} = req.query;
            if (!customerId) { throw new Error(`Customer id is required`); }

            const client = createMage2RestClient();
            cache.get(req, [`customer-price-${customerId}`], client.customerPrice.get, customerId, token)
                .then(async response => {
                    try {
                        const {items} = response;
                        apiStatus(res, items, 200);
                    } catch (e) {
                        apiStatus(res, response, 200);
                    }
                })
                .catch(err => {
                    apiError(res, err.message || err || `Customer price not found`);
                })
        } catch (err) {
            apiError(res, { code: 401, errorMessage: err.message || err || 'Customer price error' });
        }
    });

    router.post('/:customerId', async (req, res) => {
        try {
            const {customerId} = req.params;
            await cache.getCacheInstance().invalidate(`customer-price-${customerId}`);
            apiStatus(res, null, 200);
        } catch (e) {
            apiError(res, e.message || e || 'Error while invalidating');
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'customer-price',
        route: '/customer-price',
        router
    };
};
