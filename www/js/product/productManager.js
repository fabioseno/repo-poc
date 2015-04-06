/*global angular*/
angular.module('replenishment').service('productManager', ['authentication', 'settingsManager', 'productData', function (authentication, settingsManager, products) {
	'use strict';

	var self = this;

	function getColor(colors, id) {
		var i, color;

		if (colors) {
			for (i = 0; i < colors.length; i += 1) {
				if (colors[i].id === id) {
					color = {};
					color.id = colors[i].id;

					if (settingsManager.getValue(settingsManager.settings.useEcommerceNames) === true) {
						color.name = colors[i].eCommerceColorName;
					} else {
						color.name = colors[i].RMSColorName;
					}

					break;
				}
			}
		}

		return color;
	}

	function getSize(sizes, id) {
		var i, size;

		if (sizes) {
			for (i = 0; i < sizes.length; i += 1) {
				if (sizes[i] === id) {
					size = sizes[i];
					break;
				}
			}
		}

		return size;
	}

	function getScent(scents, id) {
		var i, scent;

		if (scents) {
			for (i = 0; i < scents.length; i += 1) {
				if (scents[i] === id) {
					scent = scents[i];
					break;
				}
			}
		}

		return scent;
	}

	function getProductName(product) {
		var name = '';

		if (settingsManager.getValue(settingsManager.settings.useEcommerceNames) === true) {
			name = product.eCommerceName;
		} else {
			name = product.RMSName;
		}

		return name;
	}

	function getPicture(product, sku) {
		var url = '',
			color,
			i;

		if (settingsManager.getValue(settingsManager.settings.showPictures) === true) {
			if (product.children[sku]) {
				color = product.children[sku].color;
			}

			if (settingsManager.getValue(settingsManager.settings.onlinePictures) === true) {
				if (color) {
					for (i = 0; i < product.colors.length; i += 1) {
						if (product.colors[i].id === color) {
							url = product.colors[i].picture;
							break;
						}
					}
				}
			} else {
				url = 'assets/img/products/' + product.productCode + '-' + color + '_v_1.jpg';
			}
		} else {
			url = '';
		}

		return url;
	}

	function getSelectedSkuData(product, skuData) {
		return {
			price: skuData.price,
			color: getColor(product.colors, skuData.color),
			size: getSize(product.sizes, skuData.size),
			scent: getScent(product.scents, skuData.scent)
		};
	}
    
    self.status = {
        pending: 'Pendente',
        partial: 'Parcial',
        completed: 'Separado'
    };
    
    self.getStatus = function (product) {
        if (product.quantityFound === undefined) {
            return self.status.pending;
        }
        
        if (product.quantityFound >= product.quantity) {
            return self.status.completed;
        } else {
            return self.status.partial;
        }
    };

	self.findByParentId = function (productCode) {
		var i, j, product;

		for (i = 0; i < products.length; i += 1) {
			if (products[i].productCode === productCode) {
				product = products[i];
				product.name = getProductName(product);
				break;
			}
		}

		return product;
	};

	self.findBySku = function (sku) {
		var i, j, product, newProduct = {};

		for (i = 0; i < products.length; i += 1) {
			if (products[i].children[sku]) {
				product = products[i];

				newProduct = getSelectedSkuData(product, products[i].children[sku]);
				newProduct.sku = sku;
				newProduct.productCode = product.productCode;
				newProduct.structure = product.structure;
				newProduct.name = getProductName(product);
				newProduct.pictureUrl = getPicture(product, sku);
				break;
			}
		}

		return newProduct;
	};

}]);