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

                    color.url = colors[i].eCommerceUrl;

                    break;
                }
            }
        }

        return color;
    }

    function getColors(colors) {
        var i, color, result = [];

        if (colors) {
            for (i = 0; i < colors.length; i += 1) {
                color = {};
                color.id = colors[i].id;

                if (settingsManager.getValue(settingsManager.settings.useEcommerceNames) === true) {
                    color.name = colors[i].eCommerceColorName;
                } else {
                    color.name = colors[i].RMSColorName;
                }
                
                color.url = colors[i].eCommerceUrl;

                result.push(color);
            }
        }

        return result;
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

    function getSizes(sizes, skus, selectedColor) {
        var i, sku, size, result = [], found = false;

        if (sizes) {
            for (i = 0; i < sizes.length; i += 1) {
                size = {};
                size.name = sizes[i];
                
                found = false;
                
                for (sku in skus) {
                    if (selectedColor && skus[sku].size === size.name && skus[sku].color === selectedColor) {
                        found = true;
                        break;
                    }
                }
                
                size.disabled = !found;
            
                result.push(size);
            }
        }

        return result;
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

    function getScents(scents) {
        var i, scent, result = [];

        if (scents) {
            for (i = 0; i < scents.length; i += 1) {
                scent = {};

                scent.name = scents[i];
                
                result.push(scent);
            }
        }

        return result;
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
        if (!product.quantityFound) {
            return self.status.pending;
        }

        if (product.quantityFound >= product.quantity) {
            return self.status.completed;
        } else {
            return self.status.partial;
        }
    };

    self.findByParentId = function (productCode, attributes) {
        var i, j, sku, color, product, newProduct = {};

        for (i = 0; i < products.length; i += 1) {
            if (products[i].productCode === productCode) {
                product = products[i];
                
                for (sku in product.children) {
                    if (product.children[sku].color === attributes.color
                            && product.children[sku].size === attributes.size) {
                        newProduct = getSelectedSkuData(product, product.children[sku]);
                        newProduct.sku = sku;
                        newProduct.pictureUrl = getPicture(product, sku);
                        
                        break;
                    }
                }
                
                newProduct.productCode = product.productCode;
                newProduct.structure = product.structure;
                newProduct.name = getProductName(product);
                newProduct.colors = getColors(product.colors);
                newProduct.sizes = getSizes(product.sizes, product.children, attributes.color);
                newProduct.scents = getScents(product.scents);
                
                break;
            }
        }

        return newProduct;
    };

    self.findBySku = function (sku) {
        var i, product, newProduct = {};

        for (i = 0; i < products.length; i += 1) {
            if (products[i].children[sku]) {
                product = products[i];

                newProduct = getSelectedSkuData(product, products[i].children[sku]);
                newProduct.sku = sku;
                newProduct.productCode = product.productCode;
                newProduct.structure = product.structure;
                newProduct.name = getProductName(product);
                newProduct.pictureUrl = getPicture(product, sku);
                newProduct.colors = getColors(product.colors);
                newProduct.sizes = getSizes(product.sizes, product.children, newProduct.color.id);
                newProduct.scents = getScents(product.scents);

                break;
            }
        }

        return newProduct;
    };

    self.getProducts = function () {
        var i, sku, product, newProduct, result = [];

        for (i = 0; i < products.length; i += 1) {
            product = products[i];

            for (sku in product.children) {
                newProduct = self.findBySku(sku);
                result.push(newProduct);
            }
        }
        
        return result;
    };

}]);