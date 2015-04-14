/*global angular*/
angular.module('replenishment').service('requestManager', ['$filter', 'localStorageProxy', 'sessionStorageProxy', 'productManager', 'userManager', 'toaster', 'requestData', function ($filter, localStorageProxy, sessionStorageProxy, productManager, userManager, toaster, requestData) {
    'use strict';

    var self = this;
    
    function getRequests() {
        return localStorageProxy.get('REQUEST_LIST') || [];
    }

    function getRelevantDate(request) {
        switch (request.status.id) {
        case self.status.draft.id:
            return request.creationDate;
        case self.status.pending.id:
        case self.status.inSeparation.id:
            return request.pendingStatusDate;
        case self.status.separated.id:
            return request.separatedStatusDate;
        case self.status.finished.id:
            return '';
        }
    }

    self.status = {
        draft: {
            id: 'draft',
            name: 'Rascunho',
            salesAssistantPriority: 4,
            stockAssistantPriority: 4
        },
        pending: {
            id: 'pending',
            name: 'Pendente',
            salesAssistantPriority: 3,
            stockAssistantPriority: 3
        },
        inSeparation: {
            id: 'inSeparation',
            name: 'Em separação',
            salesAssistantPriority: 2,
            stockAssistantPriority: 2
        },
        separated: {
            id: 'separated',
            name: 'Separado',
            salesAssistantPriority: 1,
            stockAssistantPriority: 4
        },
        finished: {
            id: 'finished',
            name: 'Finalizado',
            salesAssistantPriority: 5,
            stockAssistantPriority: 5
        }
    };

    self.canEdit = function (request) {
        return (userManager.getUserRole().id === userManager.roles.salesAssistant.id
                && (!request || !request.id || (request.id && request.status.id === self.status.draft.id)));
    };

    self.canExecute = function (request) {
        return (userManager.getUserRole().id === userManager.roles.stockAssistant.id
                && (request && request.id && request.status.id === self.status.inSeparation.id));
    };

    self.canDelete = function (request) {
        return (request && request.status.id === self.status.draft.id);
    };

    self.canChangeStatus = function (request) {
        var hasProducts = (request.products.length > 0),
            notFinished = (request.status.id !== self.status.finished.id),
            roleId = userManager.getUserRole().id,
            status = request.status.id,
            salesAssistant = (roleId === userManager.roles.salesAssistant.id
                              && (status === self.status.draft.id || status === self.status.separated.id)),
            stockAssistant = (roleId === userManager.roles.stockAssistant.id
                              && (status === self.status.pending.id || status === self.status.inSeparation.id));

        return (hasProducts && notFinished && (salesAssistant || stockAssistant));
    };

    self.getList = function () {
        var requests,
            request,
            product,
            newProduct,
            i,
            j;
        
        requests = getRequests();

        for (i = 0; i < requests.length; i += 1) {
            request = requests[i];

            for (j = 0; j < request.products.length; j += 1) {
                product = request.products[j];

                newProduct = productManager.findBySku(product.sku);
                newProduct.quantity = product.quantity;
                newProduct.quantityFound = product.quantityFound;
                newProduct.status = product.status;

                request.products[j] = newProduct;
            }

            request.division = $filter('divisionName')(request.products);
            request.group = $filter('groupName')(request.products);
            request.relevantDate = getRelevantDate(request);
        }

        return requests;
    };

    self.get = function (requests, id) {
        if (requests && id) {
            var request,
                i;

            for (i = 0; i < requests.length; i += 1) {
                request = requests[i];

                if (String(request.id) === String(id)) {
                    return request;
                }
            }
        }

        return;
    };

    self.load = function (id) {
        var newProduct,
            product,
            requests,
            request,
            i;
        
        requests = getRequests();

        request = self.get(requests, id);
        
        if (request) {
            for (i = 0; i < request.products.length; i += 1) {
                product = request.products[i];

                newProduct = productManager.findBySku(product.sku);
                newProduct.quantity = product.quantity;
                newProduct.quantityFound = product.quantityFound || 0;
                newProduct.status = product.status;

                request.products[i] = newProduct;
            }

            request.division = $filter('divisionName')(request.products);
            request.group = $filter('groupName')(request.products);
            request.relevantDate = getRelevantDate(request);
        }

        return request;
    };

    self.deleteRequest = function (id) {
        var requests,
            request,
            i,
            j;

        if (id) {
            requests = getRequests();

            for (i = 0; i < requests.length; i += 1) {
                request = requests[i];

                if (String(request.id) === String(id)) {
                    requests.splice(i, 1);

                    localStorageProxy.add('REQUEST_LIST', requests);

                    break;
                }
            }
        }
    };

    self.saveProduct = function (request, product) {
        var productExists = false,
            requests,
            message,
            selectedProduct,
            i;

        if (!product.quantity) {
            message = 'Selecione uma quantidade!';
            return;
        }

        if (product.productCode) {
            requests = getRequests();

            if (request) {
                request = self.get(requests, request.id);
            } else {
                request = {
                    products: []
                };
                request.id = new Date().getMilliseconds();
                request.creationDate = new Date().getTime();
                request.createdBy = userManager.getUserLogin();
                request.status = self.status.draft;

                requests.push(request);
            }

            for (i = 0; i < request.products.length; i += 1) {
                selectedProduct = request.products[i];

                if (selectedProduct.sku === product.sku) {
                    selectedProduct = {
                        sku: product.sku,
                        status: product.status,
                        quantity: product.quantity,
                        quantityFound: product.quantityFound
                    };

                    request.products[i] = selectedProduct;

                    message = 'Produto alterado com sucesso!';

                    productExists = true;
                    break;
                }
            }

            if (!productExists) {
                message = 'Produto adicionado com sucesso!';
                request.products.push({
                    sku: product.sku,
                    quantity: product.quantity,
                    quantityFound: product.quantityFound,
                    status: product.status
                });
            }

            localStorageProxy.add('REQUEST_LIST', requests);
            toaster.show(message);
        }

        return request;
    };

    self.removeProduct = function (request, product) {
        var productExists = false,
            requests,
            message,
            selectedProduct,
            i;

        if (request) {
            requests = getRequests();
            
            request = self.get(requests, request.id);

            for (i = 0; i < request.products.length; i += 1) {
                selectedProduct = request.products[i];

                if (product.sku === selectedProduct.sku) {
                    request.products.splice(i, 1);
                    break;
                }
            }

            localStorageProxy.add('REQUEST_LIST', requests);
        }

        return request;
    };

    self.getProduct = function (request, productId) {
        var productExists = false,
            selectedProduct,
            i;

        if (request) {
            request = self.load(request.id);

            for (i = 0; i < request.products.length; i += 1) {
                selectedProduct = request.products[i];

                if (productId === selectedProduct.sku) {
                    break;
                }
            }
        }

        return selectedProduct;
    };

    self.getNextStatusAction = function (currentStatus) {
        switch (currentStatus.id) {
        case self.status.draft.id:
            return 'Solicitar separação';
        case self.status.pending.id:
            return 'Iniciar separação';
        case self.status.inSeparation.id:
            return 'Finalizar separação';
        case self.status.separated.id:
            return 'Finalizar reposição';
        }
    };

    self.moveToNextStatus = function (request) {
        var permissionDenied = true,
            selectedRequest = {},
            userRoleId = userManager.getUserRole().id,
            requests,
            i;

        if (request) {
            requests = getRequests();

            request = self.get(requests, request.id);

            switch (request.status.id) {
            case self.status.draft.id:
                if (userRoleId === userManager.roles.salesAssistant.id) {
                    request.status = self.status.pending;
                    request.pendingStatusDate = new Date().getTime();
                    permissionDenied = false;
                }

                break;
            case self.status.pending.id:
                //if (userRoleId === userManager.roles.stockAssistant.id) {
                request.status = self.status.inSeparation;
                request.inSeparationStatusDate = new Date().getTime();
                permissionDenied = false;
                //}

                break;
            case self.status.inSeparation.id:
                //if (userRoleId === userManager.roles.stockAssistant.id) {
                request.status = self.status.separated;
                request.separatedStatusDate = new Date().getTime();
                permissionDenied = false;
                //}

                break;
            case self.status.separated.id:
                if (userRoleId === userManager.roles.salesAssistant.id) {
                    request.status = self.status.finished;
                    request.replacedStatusDate = new Date().getTime();
                    permissionDenied = false;
                }

                break;
            }

            if (permissionDenied) {
                toaster.show('Usuário sem permissáo para executar a operação!');
            } else {
                localStorageProxy.add('REQUEST_LIST', requests);
            }
        }
    };

    self.resetRequests = function () {
        localStorageProxy.remove('REQUEST_LIST');
        localStorageProxy.add('REQUEST_LIST', requestData);
    };
    
    self.getStatusList = function () {
        var list = [],
            keys = [];
        
        if (userManager.getUserRole().id === userManager.roles.stockAssistant.id) {
            keys = ['pending', 'inSeparation', 'separated'];
        } else {
            keys = ['draft', 'pending', 'inSeparation', 'separated', 'finished'];
        }
        
        angular.forEach(keys, function (key) {
            list.push({ id: key, name: self.status[key].name });
        });
        
        return list;
    };
    
    self.getFilters = function () {
        var filter = sessionStorageProxy.get('FILTER');
        
        if (!filter) {
            filter = { status: {} };

            filter.status.draft = true;
            filter.status.pending = true;
            filter.status.inSeparation = true;
            filter.status.separated = true;
            filter.status.finished = true;
            
            if (userManager.getUserRole().id === userManager.roles.salesAssistant.id) {
                filter.createdBy = userManager.getUserLogin();
            } else {
                filter.status.draft = false;
                filter.status.finished = false;
            }
        }
        
        return filter;
    };
    
    self.saveFilter = function (filter) {
        sessionStorageProxy.add('FILTER', filter);
    };

}]);