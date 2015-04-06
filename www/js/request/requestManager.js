/*global angular*/
angular.module('replenishment').service('requestManager', ['$filter', 'localStorageProxy', 'productManager', 'userManager', 'toaster', function ($filter, localStorageProxy, productManager, userManager, toaster) {
	'use strict';

	var self = this,
		requests;

    self.status = {
		draft: 'Rascunho',
		pending: 'Pendente',
		inSeparation: 'Em separação',
		separated: 'Separado',
		finished: 'Finalizado'
	};

	function getRelevantDate(request) {
        switch (request.status) {
        case self.status.draft:
            return request.creationDate;
        case self.status.pending:
        case self.status.inSeparation:
            return request.pendingStatusDate;
        case self.status.separated:
            return request.separatedStatusDate;
        case self.status.finished:
            return '';
        }
    }

	self.canEdit = function (request) {
		return (userManager.getUserRole().id === userManager.roles.salesAssistant.id
				&& (!request || !request.id || (request.id && request.status === self.status.draft)));
	};

	self.canExecute = function (request) {
		return (userManager.getUserRole().id === userManager.roles.stockAssistant.id
				&& (request && request.id && request.status === self.status.inSeparation));
	};

	self.canDelete = function (request) {
		return (request && request.status === self.status.draft);
	};

	self.canChangeStatus = function (request) {
        var hasProducts = (request.products.length > 0),
            notFinished = (request.status !== self.status.finished),
            roleId = userManager.getUserRole().id,
            status = request.status,
            salesAssistant = (roleId === userManager.roles.salesAssistant.id
                              && (status === self.status.draft || status === self.status.separated)),
            stockAssistant = (roleId === userManager.roles.stockAssistant.id
                              && (status === self.status.pending || status === self.status.inSeparation));

        return (hasProducts && notFinished && (salesAssistant || stockAssistant));
    };

	self.getList = function () {
		var request,
			product,
			newProduct,
			i,
			j;

		requests = localStorageProxy.get('REQUEST_LIST') || [];

		for (i = requests.length - 1; i >= 0; i -= 1) {
			request = requests[i];

			if (userManager.getUserRole().id === userManager.roles.stockAssistant.id && (request.status === self.status.draft  || requests[i].status === self.status.finished)) {
				requests.splice(i, 1);
			}
		}

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

	self.load = function (id) {
		var selectedRequest,
			newProduct,
			product,
			request,
			i,
			j;

		if (id) {
			requests = localStorageProxy.get('REQUEST_LIST') || [];

			for (i = 0; i < requests.length; i += 1) {
				request = requests[i];

				if (String(request.id) === String(id)) {
					selectedRequest = request;

					for (j = 0; j < selectedRequest.products.length; j += 1) {
						product = selectedRequest.products[j];

						newProduct = productManager.findBySku(product.sku);
						newProduct.quantity = product.quantity;
						newProduct.quantityFound = product.quantityFound;
						newProduct.status = product.status;

						selectedRequest.products[j] = newProduct;
					}

					selectedRequest.division = $filter('divisionName')(selectedRequest.products);
					selectedRequest.group = $filter('groupName')(selectedRequest.products);
                    selectedRequest.relevantDate = getRelevantDate(selectedRequest);
                    
					break;
				}
			}
		}

		return selectedRequest;
	};

	self.deleteRequest = function (id) {
		var request,
			i,
			j;

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

		if (product.productCode) {
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
					request.pendingStatusDate = new Date().getTime();
					permissionDenied = false;
				}

				break;
			case self.status.pending:
				//if (userRoleId === userManager.roles.stockAssistant.id) {
				request.status = self.status.inSeparation;
				request.inSeparationStatusDate = new Date().getTime();
				permissionDenied = false;
				//}

				break;
			case self.status.inSeparation:
				//if (userRoleId === userManager.roles.stockAssistant.id) {
				request.status = self.status.separated;
				request.separatedStatusDate = new Date().getTime();
				permissionDenied = false;
				//}

				break;
			case self.status.separated:
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
}]);