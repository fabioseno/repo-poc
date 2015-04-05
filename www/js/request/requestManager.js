/*global angular*/
angular.module('replenishment').service('requestManager', ['localStorageProxy', 'userManager', 'toaster', function (localStorageProxy, userManager, toaster) {
    'use strict';

    var self = this,
        requests;

    self.status = {
        draft: 'Rascunho',
        pending: 'Pendente',
        inSeparation: 'Em separação',
        separated: 'Separado',
        inStockRepleshment: 'Em reposição',
        finished: 'Finalizado'
    };

    self.canEdit = function (request) {
        return (userManager.getUserRole().id === userManager.roles.salesAssistant.id
                && (!request || !request.id || (request.id && request.status === self.status.draft)));
    };

    self.canExecute = function (request) {
        return (userManager.getUserRole().id === userManager.roles.stockAssistant.id
                && (!request || !request.id || (request.id && (request.status === self.status.pending || request.status === self.status.separated))));
    };

    self.canDelete = function (request) {
        return (request && request.status === self.status.draft);
    };

    self.getList = function () {
        var request,
            i;

        requests = localStorageProxy.get('REQUEST_LIST') || [];

        for (i = requests.length - 1; i >= 0; i -= 1) {
            request = requests[i];

            if (userManager.getUserRole().id === userManager.roles.stockAssistant.id && (request.status === self.status.draft || request.status === self.status.inStockRepleshment || requests[i].status === self.status.finished)) {
                requests.splice(i, 1);
            }
        }

        return requests;
    };

    self.load = function (id) {
        var selectedRequest,
            request,
            i;

        if (id) {
            requests = localStorageProxy.get('REQUEST_LIST') || [];

            for (i = 0; i < requests.length; i += 1) {
                request = requests[i];

                if (String(request.id) === String(id)) {
                    selectedRequest = request;
                    selectedRequest.products = selectedRequest.products || [];

                    break;
                }
            }
        }

        return selectedRequest;
    };

    self.deleteRequest = function (id) {
        var request,
            i;

        if (id) {
            requests = localStorageProxy.get('REQUEST_LIST') || [];

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
            message,
            selectedProduct,
            i;

        if (!product.quantity) {
            message = 'Selecione uma quantidade!';
            return;
        }

        if (product.parentId) {
            if (request) {
                request = self.load(request.id);
            } else {
                request = {
                    products: []
                };
                request.id = new Date().getMilliseconds();
                request.creationDate = new Date().getTime();
                request.createdBy = localStorageProxy.get('USER_LOGIN');
                request.status = self.status.draft;

                requests.push(request);
            }

            for (i = 0; i < request.products.length; i += 1) {
                selectedProduct = request.products[i];

                if (product.sku === selectedProduct.sku) {
                    selectedProduct.status = product.status;
                    selectedProduct.division = product.division;
                    selectedProduct.group = product.group;
                    selectedProduct.price = product.price;
                    selectedProduct.quantity = product.quantity;

                    message = 'Produto alterado com sucesso!';

                    productExists = true;
                    break;
                }
            }

            if (!productExists) {
                message = 'Produto adicionado com sucesso!';
                request.products.push(product);
            }

            localStorageProxy.add('REQUEST_LIST', requests);
            toaster.show(message);
        }

        return request;
    };

    self.removeProduct = function (request, product) {
        var productExists = false,
            message,
            selectedProduct,
            i;

        if (request) {
            request = self.load(request.id);

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
        switch (currentStatus) {
        case self.status.draft:
            return 'Solicitar separação';
        case self.status.pending:
            return 'Iniciar separação';
        case self.status.inSeparation:
            return 'Finalizar separação';
        case self.status.separated:
            return 'Iniciar reposição';
        case self.status.inStockRepleshment:
            return 'Finalizar reposição';
        }
    };

    self.moveToNextStatus = function (request) {
        var permissionDenied = true,
            selectedRequest = {},
            userRoleId = userManager.getUserRole().id,
            i;

        if (request) {
            request = self.load(request.id);

            switch (request.status) {
            case self.status.draft:
                if (userRoleId === userManager.roles.salesAssistant.id) {
                    request.status = self.status.pending;
                    request.pendingStatusDate = new Date();
                    permissionDenied = false;
                }

                break;
            case self.status.pending:
                //if (userRoleId === userManager.roles.stockAssistant.id) {
                request.status = self.status.inSeparation;
                request.inSeparationStatusDate = new Date();
                permissionDenied = false;
                //}

                break;
            case self.status.inSeparation:
                //if (userRoleId === userManager.roles.stockAssistant.id) {
                request.status = self.status.separated;
                request.separatedStatusDate = new Date();
                permissionDenied = false;
                //}

                break;
            case self.status.separated:
                if (userRoleId === userManager.roles.salesAssistant.id) {
                    request.status = self.status.inStockRepleshment;
                    request.replacingStatusDate = new Date();
                    permissionDenied = false;
                }

                break;
            case self.status.inStockRepleshment:
                if (userRoleId === userManager.roles.salesAssistant.id) {
                    request.status = self.status.finished;
                    request.replacedStatusDate = new Date();
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
}]);

// -- alterar responsavel pela ultima alteracao na solicitacao
// incluir nome no grid
// avisar se um usuario quisre continuar a tarefa de outro usuario. confirm dialog 